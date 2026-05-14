import { NextRequest } from "next/server";
import { ECE_DATA } from "@/lib/data";
import { CUTOFF_DATA } from "@/lib/cutoff";
import { rag } from "@/lib/rag";

const cutoffSection = CUTOFF_DATA.length > 0
  ? `\n=== CUTOFF RANKS ===\n${CUTOFF_DATA.map(
      (c) => `${c.year} - ${c.category} - Round ${c.round}: ${c.rank}`
    ).join("\n")}`
  : "\n=== CUTOFF RANKS ===\nNo cutoff data available yet.";

const SYSTEM_PROMPT = `You are LuECE Advisor, a thoughtful and highly capable AI assistant for students at Lucknow University's ECE department.

Your writing style should be professional yet warm, clear, and direct—modeled after Claude.

GUIDELINES:
- **BE EXTREMELY CONCISE**. Never use three sentences when one will do.
- **Zero-Filler Policy**: Do not provide generic advice (e.g., "I recommend visiting the office") unless it's the only possible answer.
- If the context doesn't contain the answer, state that clearly and briefly (e.g., "I don't have that specific data. Please contact the department office.").
- Avoid introductory phrases like "Based on the provided context" or "Unfortunately...".
- **BOLD all names, technical terms, and important entities** for high contrast.
- **Use Markdown features** (tables/lists) only when they make info *shorter* to read.
- Maintain a calm, minimalist, professional tone.
- No emojis, no fluff.

Answer based ONLY on the provided context. If asked about something outside the ECE department, politely redirect to department-specific topics.`;

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
  let body;
  try {
    body = await req.json();
  } catch (err) {
    console.error("Error parsing request JSON:", err);
    return new Response("Invalid JSON body", { status: 400 });
  }
  const { message, history } = body;

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
  const apiKey = process.env.API_KEY || process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return new Response("API key not configured", { status: 500 });
  }

  const context = rag.getRelevantContext(message);
  console.log(`Query: "${message}" | Context Size: ${context.length} chars`);
  
  const llmMessages = [
    { role: "system", content: `${SYSTEM_PROMPT}\n\nCONTEXT:\n${context || "No specific local data found. Answer generally based on department standards if possible, or ask for clarification."}` },
    ...(history || []).map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: message },
  ];

  console.log("Sending request to NVIDIA API...");
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-8b-instruct",
          messages: llmMessages,
          temperature: 0.2,
          top_p: 0.7,
          max_tokens: 1024,
          stream: true,
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    console.log(`NVIDIA API response received in ${Date.now() - startTime}ms | Status: ${response.status}`);

    if (!response.ok) {
      const error = await response.text();
      return new Response(`API error: ${error}`, { status: response.status });
    }

    const reader = response.body?.getReader();
    if (!reader) {
      return new Response("No response body", { status: 500 });
    }

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let fullResponse = "";
    let streamBuffer = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });
            controller.enqueue(encoder.encode(text));

            const lines = (streamBuffer + text).split("\n");
            streamBuffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const data = JSON.parse(line.slice(6));
                  fullResponse += data.choices?.[0]?.delta?.content || "";
                } catch (e) {
                  // Ignore incomplete JSON in a single line
                }
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
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.error("NVIDIA API request timed out after 15s");
      return new Response("API request timed out. Please try again.", { status: 504 });
    }
    console.error("NVIDIA API fetch error:", err);
    return new Response(`Fetch error: ${err.message}`, { status: 500 });
  }
}
