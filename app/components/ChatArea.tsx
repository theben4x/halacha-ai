"use client";

import { Loader2, Send } from "lucide-react";
import { useCallback, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const MOCK_ANSWER = `על פי שולחן ערוך (אורח חיים, סימן רע"א), יש לברך על הנר לפני השקיעה. המשנה ברורה מוסיף שיש להדליק בזמן שיכול להנות מהאור.

In short: One should recite the blessing over the candles before sunset, and kindle at a time when one can benefit from the light.`;

export default function ChatArea() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || loading) return;

      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      setLoading(true);

      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: MOCK_ANSWER }]);
        setLoading(false);
      }, 2000);
    },
    [input, loading]
  );

  const hasContent = messages.length > 0 || loading;

  return (
    <main className="flex w-full max-w-4xl flex-1 flex-col bg-transparent">
      {hasContent && (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex w-full ${msg.role === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[var(--halacha-gold)]/15 text-[var(--foreground)] dark:bg-[var(--halacha-gold)]/20 dark:text-white"
                      : "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-gray-100"
                  }`}
                  dir={msg.role === "user" ? "rtl" : "auto"}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex w-full justify-end">
                <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 dark:bg-slate-800">
                  <Loader2 className="h-4 w-4 animate-spin text-[var(--halacha-gold)]" aria-hidden />
                  <span className="text-sm text-gray-600 dark:text-gray-300">מחפש במקורות...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="shrink-0 flex w-full justify-center px-4 pb-8 pt-2">
        <form
          dir="rtl"
          onSubmit={handleSearch}
          className="flex w-full max-w-2xl items-center gap-2 rounded-full border border-[var(--halacha-gold)]/20 bg-[var(--background)] py-1 pr-1.5 pl-2 shadow-sm transition-all duration-200 focus-within:border-[var(--halacha-gold)]/40 focus-within:ring-1 focus-within:ring-[var(--halacha-gold)]/30 dark:border-[var(--halacha-gold)]/15 dark:bg-slate-900 dark:focus-within:border-[var(--halacha-gold)]/35 dark:focus-within:ring-[var(--halacha-gold)]/25"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="שאל שאלה על ההלכה או כל דבר הקשור ליהדות..."
            dir="rtl"
            disabled={loading}
            className="min-h-[44px] min-w-0 flex-1 rounded-full border-0 bg-transparent px-5 py-2.5 text-[15px] text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-0 disabled:opacity-70 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
            aria-label="Question input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--halacha-gold)] text-[var(--halacha-navy)] transition-colors hover:bg-[var(--halacha-gold-light)] focus:outline-none focus:ring-2 focus:ring-[var(--halacha-gold)] focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:opacity-60 dark:focus:ring-offset-slate-900"
            aria-label="Send"
          >
            <Send className="h-4 w-4" aria-hidden />
          </button>
        </form>
      </div>
    </main>
  );
}
