"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { buttonClasses } from "@/components/ui/button";

type Message = { role: "user" | "assistant"; content: string };


export const ChatWidget = () => {
  const responseDelayMs = 2000;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello, I’m Coremont Assist. Ask about equipment, shipping, or studio orders.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const canSend = input.trim().length > 0 && !loading;

  const handleSend = async () => {
    if (!canSend) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: input.trim() },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    const startedAt = Date.now();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const payload = (await response.json()) as {
        data?: { reply?: string };
      };

      const reply = payload.data?.reply ?? "I’ll confirm and follow up shortly.";
      const elapsed = Date.now() - startedAt;
      if (elapsed < responseDelayMs) {
        await new Promise((resolve) => setTimeout(resolve, responseDelayMs - elapsed));
      }
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      const elapsed = Date.now() - startedAt;
      if (elapsed < responseDelayMs) {
        await new Promise((resolve) => setTimeout(resolve, responseDelayMs - elapsed));
      }
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "I couldn’t reach the assistant. Please retry." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div className="flex h-[520px] w-[340px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border/40 bg-surface/85 backdrop-blur-xl shadow-[0_30px_60px_rgba(18,16,14,0.2)] ring-1 ring-white/20">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Coremont Assist</p>
              <p className="text-xs text-muted">Support & product guidance</p>
            </div>
            <button
              type="button"
              className={cn("text-xs text-muted hover:text-foreground")}
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "max-w-[85%] rounded-[var(--radius-md)] px-3 py-2 leading-relaxed shadow-sm",
                  message.role === "user"
                    ? "ml-auto bg-accent text-white"
                    : "bg-surface-muted/80 text-foreground"
                )}
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="max-w-[85%] rounded-[var(--radius-md)] bg-surface-muted/80 px-3 py-2 text-foreground shadow-sm">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: "240ms" }} />
                  </span>
                  <span>Preparing response…</span>
                </div>
              </div>
            ) : null}
          </div>
          <div className="border-t border-border/60 p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about delivery, equipment, or bundles"
                className="h-11 flex-1 rounded-[var(--radius-sm)] border border-border/60 bg-surface px-3 text-sm focus:border-accent/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                className={buttonClasses("primary", "sm")}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-accent text-white shadow-xl hover:bg-accent/90 transition-all duration-200 flex items-center justify-center hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </div>
  );
};
