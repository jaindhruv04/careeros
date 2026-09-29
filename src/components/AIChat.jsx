import { useState } from "react";
import { apiFetch } from "../utils/api";

function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await apiFetch("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to get an AI response");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
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

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[60] flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-2xl md:bottom-6 md:right-6">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="font-mono text-sm tracking-wide text-text-primary">CareerOS AI</p>
              <p className="text-xs text-text-muted">Placement-prep assistant</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted transition-colors hover:text-text-primary"
              aria-label="Close AI assistant"
            >
              ×
            </button>
          </div>

          <div className="flex h-80 flex-col gap-3 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="text-sm leading-6 text-text-muted">
                Ask about DSA, interviews, projects, resumes, or placement preparation.
              </p>
            ) : (
              messages.map((item, index) => (
                <div
                  key={index}
                  className={
                    item.role === "user"
                      ? "self-end max-w-[85%] rounded-lg bg-accent/10 px-3 py-2 text-sm text-text-primary"
                      : "max-w-[90%] rounded-lg border border-border bg-bg px-3 py-2 text-sm leading-6 text-text-primary"
                  }
                >
                  {item.content}
                </div>
              ))
            )}

            {loading && (
              <div className="max-w-[90%] rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-muted">
                Thinking…
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-border p-3">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask CareerOS AI..."
                className="min-w-0 flex-1 rounded border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="shrink-0 rounded border border-border px-3 py-2 text-sm font-mono text-text-primary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                Ask
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-16 right-4 z-[59] rounded-full border border-border bg-surface px-4 py-3 text-sm font-mono text-text-primary shadow-lg transition-colors hover:border-accent hover:text-accent md:bottom-6 md:right-6"
      >
        {isOpen ? "Close AI" : "CareerOS AI"}
      </button>
    </>
  );
}

export default AIChat;
