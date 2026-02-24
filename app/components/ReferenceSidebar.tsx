"use client";

import { BookMarked, ChevronRight } from "lucide-react";

const MOCK_SOURCES = [
  {
    id: "1",
    title: "Shulchan Aruch, Orach Chaim",
    ref: "Siman 271",
    snippet: "חייב אדם לברך על הנר בערב שבת...",
    translation: "One is obligated to recite the blessing over the candle on Friday evening...",
  },
  {
    id: "2",
    title: "Mishnah Berurah",
    ref: "271:2",
    snippet: "וצריך להדליק קודם שתשקע החמה",
    translation: "And one must kindle before sunset.",
  },
  {
    id: "3",
    title: "Rambam, Hilchos Shabbos",
    ref: "Ch. 5",
    snippet: "הדלקת נר בשבת מצוה מדברי סופרים",
    translation: "Kindling a candle on Shabbos is a rabbinic ordinance.",
  },
];

export default function ReferenceSidebar() {
  return (
    <aside className="flex h-full min-h-[280px] w-full flex-col border-t border-[var(--halacha-navy-muted)] bg-[var(--halacha-navy)] lg:min-h-0 lg:border-t-0 lg:border-l lg:w-80 xl:w-96">
      <div className="flex shrink-0 items-center gap-2 border-b border-[var(--halacha-navy-muted)] px-4 py-3">
        <BookMarked className="h-5 w-5 text-[var(--halacha-gold)]" aria-hidden />
        <h2 className="font-semibold text-[var(--halacha-cream)]">
          Reference Sources
        </h2>
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto p-3">
        <p className="mb-3 text-xs text-[var(--halacha-cream-muted)]/70">
          Snippets from cited Halachic works appear here.
        </p>
        <ul className="space-y-3">
          {MOCK_SOURCES.map((source) => (
            <li
              key={source.id}
              className="rounded-lg border border-[var(--halacha-navy-muted)] bg-[var(--halacha-navy-light)]/60 p-3 transition-colors hover:border-[var(--halacha-gold-muted)]/40"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-[var(--halacha-gold-light)]">
                  {source.title}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--halacha-gold-muted)]" aria-hidden />
              </div>
              <p className="mb-1 text-xs text-[var(--halacha-cream-muted)]">
                {source.ref}
              </p>
              <p className="mb-2 font-serif text-sm leading-relaxed text-[var(--halacha-cream)]" dir="rtl">
                {source.snippet}
              </p>
              <p className="text-xs italic text-[var(--halacha-cream-muted)]">
                {source.translation}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
