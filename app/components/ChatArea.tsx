"use client";

import { Copy, ExternalLink, Loader2, Mic, MicOff, Send, Share2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getHalachicAnswer, type HalachaSource } from "../actions/halacha";

const HISTORY_KEY = "halacha-ai-search-history";

const PLACEHOLDER_SHORT = "שאל שאלה...";
const PLACEHOLDER_FULL = "שאל שאלה על ההלכה או כל דבר הקשור ליהדות...";

type Message =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; sources?: HalachaSource[] }
  | { role: "assistant"; error: string };

function loadHistory(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Message[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  if (typeof window === "undefined") return;
  try {
    if (messages.length === 0) {
      localStorage.removeItem(HISTORY_KEY);
    } else {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    }
  } catch {
    // ignore
  }
}

type Props = {
  onHasContentChange?: (hasContent: boolean) => void;
  resetViewTrigger?: number;
};

export default function ChatArea({ onHasContentChange, resetViewTrigger = 0 }: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const skipSaveRef = useRef(false);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDER_SHORT);
  const [isListening, setIsListening] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<number | null>(null);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const API =
        (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
      setHasSpeechRecognition(!!API);
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setPlaceholder(mq.matches ? PLACEHOLDER_FULL : PLACEHOLDER_SHORT);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setMessages(loadHistory());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (resetViewTrigger > 0) {
      skipSaveRef.current = true;
      setMessages([]);
    }
  }, [resetViewTrigger]);

  useEffect(() => {
    if (!hydrated) return;
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    saveHistory(messages);
  }, [messages, hydrated]);

  const hasContent = messages.length > 0 || loading;

  useEffect(() => {
    onHasContentChange?.(hasContent);
  }, [hasContent, onHasContentChange]);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || loading) return;

      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      setLoading(true);

      const result = await getHalachicAnswer(trimmed);

      if (result.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.answer, sources: result.sources },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", error: result.error }]);
      }
      setLoading(false);
    },
    [input, loading]
  );

  const handleClearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setMessages([]);
    onHasContentChange?.(false);
  }, [onHasContentChange]);

  const toggleMic = useCallback(() => {
    if (typeof window === "undefined") return;
    const win = window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "he-IL";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      if (!event.results?.length) return;
      const lastResult = event.results[event.results.length - 1];
      const transcript = (lastResult[0]?.transcript ?? "").trim();
      if (!transcript) return;
      setInput((prev) => (prev ? `${prev.trimEnd()} ${transcript}` : transcript));
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  const handleCopy = useCallback((text: string, messageIndex: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(messageIndex);
      setTimeout(() => setCopyFeedback((prev) => (prev === messageIndex ? null : prev)), 2000);
    });
  }, []);

  return (
    <main className="flex w-full max-w-4xl flex-1 min-h-0 flex-col bg-transparent transition-[flex] duration-300 ease-out">
      {hasContent && (
        <>
          <div className="shrink-0 flex justify-center px-4 pt-2 pb-1">
            <button
              type="button"
              onClick={handleClearHistory}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="Clear history"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              <span dir="rtl" lang="he">
                נקה היסטוריה
              </span>
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2 pb-4">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex w-full ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl text-[15px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--halacha-gold)]/15 px-4 py-3 text-[var(--foreground)] dark:bg-[var(--halacha-gold)]/20 dark:text-white"
                        : "border border-[#FFD700]/25 bg-[#FFFFFF] p-5 text-gray-900 shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:border-gray-600 dark:bg-[#1e293b] dark:text-gray-100 dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
                    }`}
                    dir={msg.role === "user" ? "rtl" : "auto"}
                  >
                    {"error" in msg ? (
                      <p className="text-red-600 dark:text-red-400">{msg.error}</p>
                    ) : (
                      <>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                          <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-3">
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              מקורות
                            </p>
                            <ul className="flex flex-wrap gap-2">
                              {msg.sources.map((s, j) => (
                                <li key={j}>
                                  <a
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-md bg-[var(--halacha-gold)]/20 px-2 py-1 text-sm text-[var(--halacha-gold-muted)] hover:bg-[var(--halacha-gold)]/30 dark:bg-[var(--halacha-gold)]/25 dark:text-[var(--halacha-gold-light)] dark:hover:bg-[var(--halacha-gold)]/35"
                                  >
                                    <span className="font-medium">{s.siteName ?? "Source"}:</span>
                                    <span className="truncate max-w-[160px]" title={s.title}>
                                      {s.title}
                                    </span>
                                    <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {msg.role === "assistant" && "content" in msg && (
                          <div className="mt-3 flex items-center gap-1.5 border-t border-[#FFD700]/20 pt-2.5">
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => handleCopy(msg.content, i)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#FFD700]/50 text-[#FFD700]/90 transition-colors hover:bg-[#FFD700]/15 hover:border-[#FFD700]/70"
                                aria-label="Copy"
                              >
                                <Copy className="h-3.5 w-3.5" aria-hidden />
                              </button>
                              {copyFeedback === i && (
                                <span
                                  className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-white shadow dark:bg-gray-700"
                                  role="status"
                                >
                                  Copied!
                                </span>
                              )}
                            </div>
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(msg.content)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#FFD700]/50 text-[#FFD700]/90 transition-colors hover:bg-[#FFD700]/15 hover:border-[#FFD700]/70"
                              aria-label="Share to WhatsApp"
                            >
                              <Share2 className="h-3.5 w-3.5" aria-hidden />
                            </a>
                          </div>
                        )}
                      </>
                    )}
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
        </>
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
            placeholder={placeholder}
            dir="rtl"
            disabled={loading}
            className="min-h-[44px] min-w-0 flex-1 rounded-full border-0 bg-transparent px-5 py-2.5 text-[var(--foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-0 disabled:opacity-70 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
            style={{ fontSize: "16px" }}
            aria-label="Question input"
          />
          {hasSpeechRecognition && (
            <button
              type="button"
              onClick={toggleMic}
              disabled={loading}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--halacha-gold)] focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:opacity-50 ${
                isListening
                  ? "bg-red-500/20 text-red-600 dark:text-red-400"
                  : "text-gray-500 hover:bg-gray-100 hover:text-[var(--halacha-gold)] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-[var(--halacha-gold)]"
              }`}
              aria-label={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? (
                <MicOff className="h-5 w-5" aria-hidden />
              ) : (
                <Mic className="h-5 w-5" aria-hidden />
              )}
            </button>
          )}
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
