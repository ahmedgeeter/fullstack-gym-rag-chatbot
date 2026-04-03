"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, Loader2 } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export const ChatWidget = () => {
  const responseDelayMs = 2000;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am Coremont Intelligence. Ask me anything about our premium equipment, recommendations, or studio setups.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const canSend = input.trim().length > 0 && !loading;

  const handleSend = async () => {
    if (!canSend) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: input.trim() }];
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

      const payload = (await response.json()) as { data?: { reply?: string } };
      const reply = payload.data?.reply ?? "I’ll confirm and follow up shortly.";
      
      const elapsed = Date.now() - startedAt;
      if (elapsed < responseDelayMs) {
        await new Promise((resolve) => setTimeout(resolve, responseDelayMs - elapsed));
      }
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "I couldn't process that. Could you rephrase?" }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading, open]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-5 group">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob-jelly {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        .jelly-blob-btn {
          animation: blob-jelly 8s ease-in-out infinite;
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        .jelly-blob-internal {
          border-radius: inherit;
        }
      `}} />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, rotateX: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.25, ease: "easeInOut" } }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.7 }}
            className="relative flex h-[540px] w-[350px] flex-col overflow-hidden rounded-[28px] border border-white/20 bg-surface/50 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.3)] origin-bottom-right"
          >
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-surface/90 pointer-events-none -z-10" />

            {/* Header */}
            <motion.div className="relative flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-5 z-10">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-orange-400 shadow-lg shadow-accent/30"
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-[15px] font-extrabold tracking-wide text-foreground">Coremont Core</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">AI Intelligence</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-muted-foreground backdrop-blur-md transition-colors hover:bg-white/20 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </motion.div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
              <div className="flex flex-col gap-6">
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.9, x: message.role === "user" ? 20 : -20 }}
                      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                      transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
                      layout
                      className={cn(
                        "flex gap-3",
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-md",
                        message.role === "user" ? "bg-accent text-white" : "bg-white/10 text-foreground"
                      )}>
                        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-3xl px-4 py-3 text-[13px] leading-relaxed shadow-sm whitespace-pre-wrap",
                          message.role === "user"
                            ? "bg-gradient-to-br from-accent to-[#e67e22] text-white rounded-tr-sm shadow-accent/20"
                            : "bg-surface/80 border border-white/5 text-foreground rounded-tl-sm backdrop-blur-md"
                        )}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex gap-3"
                    >
                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 shadow-md">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                      </div>
                      <div className="flex h-[42px] w-14 items-center justify-center rounded-3xl rounded-tl-sm bg-surface/80 border border-white/5 backdrop-blur-md">
                        <motion.div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                              className="h-1.5 w-1.5 rounded-full bg-accent"
                            />
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 bg-surface/80 p-4 backdrop-blur-3xl z-10">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Message Intelligence..."
                  className="h-12 w-full rounded-full border border-white/10 bg-black/5 pl-5 pr-12 text-[13px] text-foreground shadow-inner focus:border-accent/50 focus:bg-white/5 focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/60 caret-accent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!canSend}
                  className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-accent to-[#d35400] text-white shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 ml-0.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="relative flex h-[64px] w-[64px] items-center justify-center overflow-hidden bg-gradient-to-br from-accent via-[#e67e22] to-[#d35400] shadow-[0_15px_40px_rgba(230,126,34,0.4)] z-[9999] jelly-blob-btn"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.4)_360deg)] jelly-blob-internal"
        />
        <div className="absolute inset-[2px] bg-gradient-to-br from-accent via-[#e67e22] to-[#d35400] jelly-blob-internal" />
        
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 text-white"
            >
              <X className="h-7 w-7 drop-shadow-md" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: -90, scale: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 text-white"
            >
              <Sparkles className="h-7 w-7 drop-shadow-md" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
