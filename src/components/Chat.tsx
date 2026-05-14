"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Sparkles, Loader2 } from "lucide-react";

function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "What is the placement scenario?",
  "What will I study in first year?",
  "Is attendance mandatory?",
  "Tell me about labs and infrastructure",
  "What about the faculty?",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your LuECE guide. Ask me anything about Lucknow University's ECE department, placements, or curriculum." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const autoResize = () => {
    const el = inputRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);
    if (inputRef.current) inputRef.current.style.height = "auto";

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.slice(0, -1),
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(await response.text());

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let streamBuffer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      // Small delay so the loading dots are visible before stream starts
      await new Promise((r) => setTimeout(r, 200));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = (streamBuffer + chunk).split("\n");
        streamBuffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.choices?.[0]?.delta?.content || "";
              if (text) {
                assistantContent += text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                  return updated;
                });
              }
            } catch (e) {
              console.error("Error parsing stream chunk:", e);
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const showSuggestions = messages.length === 1 && !isTyping;

  return (
    <div className="flex flex-col h-[70vh] sm:h-[600px] w-full max-w-2xl mx-auto card-premium overflow-hidden">
      <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-cream-border">
        <div className="p-1.5 sm:p-2 bg-charcoal text-white rounded-full">
          <Sparkles size={16} className="sm:hidden" />
          <Sparkles size={18} className="hidden sm:block" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-charcoal">ECE Advisor</h3>
          <p className="text-[10px] sm:text-xs text-charcoal-muted">Always active for LU students</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scroll-smooth">
        {showSuggestions && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 justify-center pb-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="px-3 py-1.5 text-xs border border-cream-border rounded-pill bg-cream text-charcoal hover:bg-cream-border transition-colors"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`mt-1 p-1 sm:p-1.5 rounded-full flex-shrink-0 ${m.role === "user" ? "bg-charcoal text-white" : "bg-cream-border text-charcoal"}`}>
                  {m.role === "user" ? <User size={12} className="sm:hidden" /> : <Bot size={12} className="sm:hidden" />}
                  {m.role === "user" ? <User size={14} className="hidden sm:block" /> : <Bot size={14} className="hidden sm:block" />}
                </div>
                <div className={`p-2.5 sm:p-3 rounded-card text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user" ? "bg-charcoal text-charcoal-offwhite" : "bg-cream border border-cream-border text-charcoal"
                }`}>
                  {renderBold(m.content)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex justify-start"
          >
            <div className="bg-cream border border-cream-border px-4 py-2.5 rounded-card flex items-center gap-2">
              <motion.span
                className="text-xs text-charcoal-muted font-normal"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                Thinking
              </motion.span>
              <span className="flex gap-0.5">
                <motion.span
                  className="w-1 h-1 bg-charcoal-muted rounded-full"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span
                  className="w-1 h-1 bg-charcoal-muted rounded-full"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
                />
                <motion.span
                  className="w-1 h-1 bg-charcoal-muted rounded-full"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 sm:p-4 border-t border-cream-border">
        <div className="relative flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about placement, curriculum, faculty..."
            rows={1}
            disabled={isTyping}
            className="flex-1 bg-cream p-3 sm:p-4 rounded-container border border-cream-border focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm transition-all resize-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="p-2.5 sm:p-3 bg-charcoal text-white rounded-pill hover:opacity-80 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isTyping ? <Loader2 size={16} className="animate-spin sm:hidden" /> : <Send size={16} className="sm:hidden" />}
            {isTyping ? <Loader2 size={18} className="animate-spin hidden sm:block" /> : <Send size={18} className="hidden sm:block" />}
          </button>
        </div>
      </div>
    </div>
  );
}
