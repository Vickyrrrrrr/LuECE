export interface LUSource {
  url: string;
  keywords: string[];
  label: string;
}

export const LU_SOURCES: LUSource[] = [
  {
    url: "https://www.lkouniv.ac.in/course/btech-electronics-and-communication-engineering",
    keywords: ["b.tech", "btech", "ece", "course", "curriculum", "syllabus", "semester", "subject"],
    label: "B.Tech ECE Course",
  },
  {
    url: "https://www.lkouniv.ac.in/course/mtech-part-time-electronics-and-communication-engineering",
    keywords: ["m.tech", "mtech", "part time", "post graduate", "masters"],
    label: "M.Tech ECE",
  },
  {
    url: "https://www.lkouniv.ac.in/department/faculty-of-engineering-technology",
    keywords: ["faculty", "department", "foet", "teacher", "professor", "hod"],
    label: "FOET Department",
  },
  {
    url: "https://www.lkouniv.ac.in/admission",
    keywords: ["admission", "apply", "eligibility", "fee", "uptac", "counselling", "seat"],
    label: "Admissions",
  },
  {
    url: "https://www.lkouniv.ac.in/contact",
    keywords: ["contact", "phone", "email", "address", "location", "reach"],
    label: "Contact",
  },
  {
    url: "https://www.lkouniv.ac.in/",
    keywords: ["about", "university", "lucknow", "campus", "history"],
    label: "LU Home",
  },
];

export function findBestSource(query: string): LUSource | null {
  const q = query.toLowerCase();
  let best: LUSource | null = null;
  let bestScore = 0;
  for (const src of LU_SOURCES) {
    let score = 0;
    for (const kw of src.keywords) {
      if (q.includes(kw)) score += 2;
      if (new RegExp(`\\b${kw}\\b`).test(q)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = src;
    }
  }
  return bestScore >= 2 ? best : null;
}

export async function fetchAndExtractText(url: string, maxLen = 8000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const html = await res.text();
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#\d+;/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return text.slice(0, maxLen);
  } catch {
    return null;
  }
}

const urlCache = new Map<string, { text: string; ts: number }>();

export async function fetchCached(url: string, ttlMs = 600000): Promise<string | null> {
  const cached = urlCache.get(url);
  if (cached && Date.now() - cached.ts < ttlMs) return cached.text;
  const text = await fetchAndExtractText(url);
  if (text) urlCache.set(url, { text, ts: Date.now() });
  return text;
}
