import { NextRequest } from "next/server";
import { ECE_DATA } from "@/lib/data";
import { rag } from "@/lib/rag";

const SYSTEM_PROMPT = `You are LuECE Advisor, an AI assistant for first-year ECE students at Lucknow University.

Answer questions using ONLY the context below. If the answer isn't in the context, say you don't know.

RESPONSE STYLE:
- Start with the answer directly — no introductions or pleasantries
- Use clean bullet points (•) for lists
- **Bold** key terms, numbers, and names
- Short paragraphs — one idea per paragraph
- Professional, warm, and minimal — like a well-designed premium app
- No emojis
- No "I'd be happy to help" or "Great question" filler
- If listing faculty, format as: **Name** — Role\n
- End with a brief relevant follow-up question if useful, else stop

CONTEXT:
=== CURRICULUM ===
${ECE_DATA.curriculum.content}

=== INFRASTRUCTURE ===
${ECE_DATA.infrastructure.content}

=== FACULTY ===
${ECE_DATA.faculty.content}

=== PLACEMENTS ===
${ECE_DATA.placements.content}

=== FAQS ===
${ECE_DATA.faq.map((f, i) => `Q${i + 1}: ${f.question}\nA: ${f.answer}`).join("\n")}`;

function sseEvent(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message) {
    return new Response("Message is required", { status: 400 });
  }

  // Fast path: local RAG match (returns instantly, no API call)
  const local = rag.query(message);
  if (local.answer) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(sseEvent({ choices: [{ delta: { content: local.answer } }] })));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  }

  // Slow path: call NVIDIA LLM
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return new Response("API key not configured", { status: 500 });
  }

  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "minimaxai/minimax-m2.7",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 512,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return new Response(`API error: ${error}`, { status: response.status });
  }

  // Buffer the full response to cache it
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          controller.enqueue(encoder.encode(text));

          for (const line of text.split("\n")) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.slice(6));
                fullResponse += data.choices?.[0]?.delta?.content || "";
              } catch { }
            }
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();

        // Cache the response for future identical queries
        rag.cacheResponse(message, fullResponse);
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
