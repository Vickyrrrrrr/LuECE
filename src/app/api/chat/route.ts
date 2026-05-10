import { NextRequest } from "next/server";
import { ECE_DATA } from "@/lib/data";

const SYSTEM_PROMPT = `You are LuECE Advisor, an AI assistant for first-year ECE students at Lucknow University.

You have data about the ECE department. Answer questions using ONLY this context. If the answer isn't in the context, say you don't know. Be friendly, concise, and warm.

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

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message) {
    return new Response("Message is required", { status: 400 });
  }

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
      temperature: 1,
      top_p: 0.95,
      max_tokens: 8192,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return new Response(`API error: ${error}`, { status: response.status });
  }

  return new Response(response.body, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
