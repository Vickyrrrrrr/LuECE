import { NextRequest } from "next/server";
import { ECE_DATA } from "@/lib/data";
import { CUTOFF_DATA } from "@/lib/cutoff";
import { rag } from "@/lib/rag";

const cutoffSection = CUTOFF_DATA.length > 0
  ? `\n=== CUTOFF RANKS ===\n${CUTOFF_DATA.map(
      (c) => `${c.year} - ${c.category} - Round ${c.round}: ${c.rank}`
    ).join("\n")}`
  : "\n=== CUTOFF RANKS ===\nNo cutoff data available yet.";

const SYSTEM_PROMPT = `You are LuECE Advisor, an AI assistant for first-year ECE students at Lucknow University.

You have data about the ECE department. Answer using ONLY this context. If the answer is not in the context, say so and offer to connect them with the department.

FORMATTING RULES:
- Start directly with the answer - no introductions or filler phrases
- Use short paragraphs separated by blank lines
- Use **bold** for key terms, numbers, names, and important points
- Use bullet points with • for any list of items
- Keep responses concise and scannable
- Professional, warm, minimal tone - like a premium app
- No emojis
- End with a brief relevant follow-up question only if natural

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
${ECE_DATA.faq.map((f, i) => `Q${i + 1}: ${f.question}\nA: ${f.answer}`).join("\n")}
${cutoffSection}`;

function sseEvent(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

function buildSSEStream(content: string): ReadableStream {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(sseEvent({ choices: [{ delta: { content } }] })));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

export async function POST(req: NextRequest) {
  const { message, history } = await req.json();

  if (!message) {
    return new Response("Message is required", { status: 400 });
  }

  // Fast path: local RAG only for first-ever interaction (no history yet)
  if (!history || history.length <= 1) {
    const local = rag.query(message);
    if (local.answer) {
      return new Response(buildSSEStream(local.answer), {
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      });
    }
  }

  // Send to LLM with full conversation context
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return new Response("API key not configured", { status: 500 });
  }

  const llmMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(history || []).map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: message },
  ];

  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "minimaxai/minimax-m2.7",
      messages: llmMessages,
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 1024,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return new Response(`API error: ${error}`, { status: response.status });
  }

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
