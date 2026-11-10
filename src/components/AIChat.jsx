import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { apiFetch } from "../utils/api";

const PRESET_PROMPTS = [
  "How to structure behavioral interview answers?",
  "Explain two-pointer vs sliding window",
  "How to explain microservices vs monolith?",
];

function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  async function handleSend(textToSend) {
    const trimmed = (textToSend || message).trim();
    if (!trimmed || loading) return;

    const userMessage = {
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const conversation = [...messages, userMessage];

      const res = await apiFetch("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: trimmed,
          history: conversation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to get an AI response");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error.message || "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleSend();
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[60] flex w-[min(420px,calc(100vw-2rem))] h-[520px] flex-col overflow-hidden rounded-2xl border border-accent/30 bg-surface/95 backdrop-blur-xl shadow-2xl md:bottom-6 md:right-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 bg-surface-subtle/50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-accent to-emerald-400 text-bg shadow-sm shadow-accent/20">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-text-primary flex items-center gap-1.5">
                  CareerOS Copilot
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                </p>
                <p className="text-[11px] text-text-muted">
                  Placement & technical mentor
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="space-y-4 py-4 text-center">
                <div className="p-3 w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    How can I help your career prep?
                  </p>
                  <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
                    Ask about algorithm explanations, mock interview feedback, or system design insights.
                  </p>
                </div>

                <div className="pt-2 space-y-1.5 text-left">
                  <p className="text-[10px] font-mono uppercase text-text-muted px-1">
                    Suggested prompts
                  </p>
                  {PRESET_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-surface-subtle border border-border hover:border-accent/40 text-xs text-text-secondary hover:text-text-primary text-left transition-colors"
                    >
                      <span className="truncate">{prompt}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((item, index) => (
                <div
                  key={index}
                  className={`flex gap-2.5 ${
                    item.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {item.role === "assistant" && (
                    <div className="w-6 h-6 rounded-md bg-accent/20 border border-accent/30 text-accent flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                      item.role === "user"
                        ? "bg-accent text-bg font-medium rounded-tr-sm shadow-sm"
                        : "bg-surface-subtle border border-border/80 text-text-primary rounded-tl-sm shadow-sm"
                    }`}
                  >
                    {item.content}
                  </div>

                  {item.role === "user" && (
                    <div className="w-6 h-6 rounded-md bg-white/10 border border-border text-text-muted flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-2.5 items-center text-xs text-text-muted pl-1">
                <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
                <span>CareerOS Copilot is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border/70 p-3 bg-surface-subtle/50"
          >
            <div className="relative flex items-center">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about DSA, projects, interviews..."
                className="w-full bg-surface border border-border rounded-xl pl-3 pr-10 py-2.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="absolute right-1.5 p-1.5 rounded-lg bg-accent text-bg disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-16 right-4 z-[59] flex items-center gap-2 rounded-full border border-accent/40 bg-surface/90 backdrop-blur-md px-4 py-2.5 text-xs font-mono font-semibold text-text-primary shadow-xl shadow-accent/10 hover:border-accent hover:shadow-accent/20 transition-all md:bottom-6 md:right-6 group"
      >
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </div>
        <Sparkles className="w-3.5 h-3.5 text-accent group-hover:rotate-12 transition-transform" />
        <span>{isOpen ? "Close Copilot" : "CareerOS AI"}</span>
      </button>
    </>
  );
}

export default AIChat;
