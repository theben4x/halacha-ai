"use server";

import { tavily } from "@tavily/core";
import OpenAI from "openai";

/* Academic/classic: Gemara, Rishonim. Practical: modern Psak. Sephardic: Yalkut Yosef / Maran. */
const HALACHIC_DOMAINS = [
  "sefaria.org",
  "sefaria.org.il",
  "hebrewbooks.org",
  "toratemetfreeware.com",
  "yeshiva.org.il",
  "din.org.il",
  "moreshet-maran.com",
  "www.sefaria.org",
  "www.sefaria.org.il",
  "www.hebrewbooks.org",
  "www.toratemetfreeware.com",
  "www.yeshiva.org.il",
  "www.din.org.il",
  "www.moreshet-maran.com",
];

export type HalachaSource = { title: string; url: string; siteName: string };

export type HalachaResult =
  | { ok: true; answer: string; sources: HalachaSource[] }
  | { ok: false; error: string };

export async function getHalachicAnswer(question: string): Promise<HalachaResult> {
  const trimmed = question.trim();
  if (trimmed.length < 2) {
    return { ok: false, error: "השאלה קצרה מדי. נא להזין לפחות 2 תווים." };
  }

  const tavilyKey = process.env.TAVILY_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!tavilyKey || !openaiKey) {
    return { ok: false, error: "Missing TAVILY_API_KEY or OPENAI_API_KEY in environment." };
  }

  try {
    const client = tavily({ apiKey: tavilyKey });
    const searchResponse = await client.search(trimmed, {
      includeDomains: HALACHIC_DOMAINS,
      maxResults: 12,
      searchDepth: "advanced",
    });

    function getSourceLabel(url: string): string {
      if (url.includes("sefaria.org")) return "Sefaria";
      if (url.includes("hebrewbooks.org")) return "HebrewBooks";
      if (url.includes("toratemetfreeware.com")) return "Torat Emet";
      if (url.includes("yeshiva.org.il")) return "אתר ישיבה";
      if (url.includes("din.org.il")) return "אתר דין";
      if (url.includes("moreshet-maran.com")) return "Moreshet Maran";
      return "Source";
    }
    const results = searchResponse.results ?? [];
    const sources: HalachaSource[] = results.map((r) => ({
      title: r.title || r.url,
      url: r.url,
      siteName: getSourceLabel(r.url),
    }));
    const context = results
      .map((r) => `[${getSourceLabel(r.url)}] ${r.title}\n${r.url}\n${r.content}`)
      .join("\n\n---\n\n");

    const openai = new OpenAI({ apiKey: openaiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a clear, precise Halachic advisor. Your answers are based ONLY on the provided search results from these six allowed sources:

Classic / Academic (Gemara, Rishonim, primary texts): Sefaria (sefaria.org.il), HebrewBooks (hebrewbooks.org), Torat Emet (toratemetfreeware.com).
Practical Halacha (modern Psak): אתר ישיבה (yeshiva.org.il), אתר דין (din.org.il).
Sephardic tradition (Yalkut Yosef, Maran Harav Ovadia Yosef): Moreshet Maran (moreshet-maran.com).

Rules:
1. Use the classic sources (Sefaria, HebrewBooks, Torat Emet) for Gemara, Rishonim, and primary text citations.
2. Use the practical sites (אתר ישיבה, אתר דין) for modern-day Psak and practical Halachic guidance.
3. When using results from moreshet-maran.com, prioritize content from Yalkut Yosef (ילקוט יוסף) or Maran Harav Ovadia Yosef (מרן הרב עובדיה יוסף) for Sephardic tradition. Clearly cite "Moreshet Maran" and the work when relevant.
4. Always list the specific website name when citing a source (e.g. "מקור: Sefaria", "מקור: Moreshet Maran", "מקור: אתר ישיבה").
5. At the start of your answer, clearly state which source(s) you are relying on.
6. Answer in Hebrew, based strictly on the given excerpts. Be concise and cite which website and source each point comes from.
7. End every answer with a short, clear conclusion under the heading "מסקנה להלכה:" (Halachic conclusion). One or two sentences only.
8. If the provided sources do not contain enough information to answer, say so and do not invent content. Use only the six sites above.`,
        },
        {
          role: "user",
          content: `Question: ${trimmed}\n\nSources:\n${context || "(No sources found)"}`,
        },
      ],
      temperature: 0.3,
    });

    const answer = completion.choices[0]?.message?.content?.trim();
    if (!answer) {
      return { ok: false, error: "No response from the model." };
    }

    return { ok: true, answer, sources };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search or API failed.";
    const hebrewError =
      message.includes("Query is too short") || message.includes("Min query length")
        ? "השאלה קצרה מדי. נא להזין לפחות 2 תווים."
        : message;
    return { ok: false, error: hebrewError };
  }
}
