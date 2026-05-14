import { NextRequest } from "next/server";
import { rag } from "@/lib/rag";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are LuECE Advisor, a thoughtful and highly capable AI assistant for students at Lucknow University's ECE department.

Your writing style should be professional yet warm, clear, and direct—modeled after Claude.

GUIDELINES:
- **BE EXTREMELY CONCISE**. Never use three sentences when one will do.
- **Zero-Filler Policy**: Do not provide generic advice unless it's the only possible answer.
- **BOLD all names, technical terms, and important entities** for high contrast.
- Maintain a calm, minimalist, professional tone. No emojis.

KNOWLEDGE SOURCES:
1. **Primary**: Use the provided CONTEXT for all official Lucknow University ECE data.
2. **Secondary**: If the context doesn't contain the answer, use your general knowledge to provide a helpful, accurate response. 
3. **Disclosure**: If using general knowledge for university-specific queries, briefly mention that it's based on general standards rather than official department records.
4. **Scope**: For topics entirely unrelated to engineering, education, or Lucknow University, politely guide the user back to relevant topics.`;

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
    console.error("Chat API Error: NVIDIA_API_KEY is missing from environment variables.");
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
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout for Edge

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
      const errorText = await response.text();
      console.error(`NVIDIA API Error (${response.status}):`, errorText);
      return new Response(`API error: ${errorText}`, { status: response.status });
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
                  // Ignore incomplete JSON
                }
              }
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          rag.cacheResponse(message, fullResponse);
        } catch (err) {
          console.error("Streaming error:", err);
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
      console.error("NVIDIA API request timed out after 25s");
      return new Response("API request timed out. Please try again.", { status: 504 });
    }
    console.error("NVIDIA API fetch error:", err);
    return new Response(`Fetch error: ${err.message}`, { status: 500 });
  }
}

