import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getLocaleBundle, normalizeLocale, SupportedLocale, DocArticle } from "@/lib/kb";

export const maxDuration = 60;

// 1. Stateless HMAC-SHA256 Assistant Turn Verification
function historySigningKey(): string {
  return (
    process.env.CHAT_HISTORY_SECRET ||
    `bm-kb-history-v1:${process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "bandmath-local-dev"}`
  );
}

function signAssistantReply(content: string): string {
  return createHmac("sha256", historySigningKey()).update(content).digest("hex");
}

function isValidAssistantSignature(content: string, sig: unknown): boolean {
  if (typeof sig !== "string" || sig.length !== 64) return false;
  const expected = Buffer.from(signAssistantReply(content), "hex");
  const given = Buffer.from(sig, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

// 2. Strict Origin & Referer Allowlist
function isAllowedHost(urlLike: string, host: string): boolean {
  try {
    const hostname = new URL(urlLike).hostname;
    const allowed = new Set(
      [
        "localhost",
        "127.0.0.1",
        "learn.itsbandmath.com",
        "docs.itsbandmath.com",
        "itsbandmath.com",
        host.split(":")[0],
        process.env.VERCEL_URL,
        process.env.VERCEL_BRANCH_URL,
        process.env.VERCEL_PROJECT_PRODUCTION_URL,
      ].filter(Boolean) as string[]
    );
    return allowed.has(hostname);
  } catch {
    return false;
  }
}

// 3. In-Memory Sliding-Window IP Rate Limiter (15 req / 15 min) + 250/day Global Circuit Breaker
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 15;

let globalDailyWindowStart = Date.now();
let globalDailyCallCount = 0;
const GLOBAL_DAILY_MAX_CALLS = 250;

function checkGlobalDailyCircuitBreaker(): boolean {
  const now = Date.now();
  if (now - globalDailyWindowStart > 24 * 60 * 60 * 1000) {
    globalDailyWindowStart = now;
    globalDailyCallCount = 0;
  }
  if (globalDailyCallCount >= GLOBAL_DAILY_MAX_CALLS) {
    return false;
  }
  globalDailyCallCount += 1;
  return true;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  record.count += 1;
  return true;
}

// 4. Prompt-Injection & Abuse Pre-Filter
function normalizeForFilter(text: string): string {
  const base = text
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
    .toLowerCase();
  const despaced = base.replace(/\b(\w)\s(?=\w\b)/g, "$1");
  return `${base}\n${despaced}`;
}

function isPromptInjectionAttempt(text: string): boolean {
  const lower = normalizeForFilter(text);
  const injectionPatterns = [
    /\b(ignore|disregard|forget|override|bypass)\b\s+(?:\w+\s+){0,3}(instructions?|prompts?|rules|guardrails|directives|guidelines)/i,
    /system\s*prompt/i,
    /\byou are now\b/i,
    /\bforget (everything|all|your)\b/i,
    /\b(repeat|print|reveal|show|output)\b\s+(?:\w+\s+){0,3}(system|initial|hidden|above|previous)\s+(prompt|instructions|text|message)/i,
    /jailbreak/i,
    /developer mode/i,
    /\b(ignore[zr]?|oublie[zr]?)\b\s+(?:\w+\s+){0,3}(instructions?|consignes|r[eè]gles)/i,
  ];
  return injectionPatterns.some((pattern) => pattern.test(lower));
}

function isAbusiveInput(text: string): boolean {
  const lower = normalizeForFilter(text);
  const abusivePatterns = [
    /\b(fuck(ing)?|bitch|asshole|cunt|stfu|retard|nigger|faggot)\b/i,
    /\b(connard|salope|encul[eé]|pute|fdp|nique ta|ferme ta gueule)\b/i,
  ];
  return abusivePatterns.some((pattern) => pattern.test(lower));
}

// 5. Relevant Article Retrieval (Top-K Keyword & Title Scoring across Locale KB)
function retrieveRelevantArticles(
  locale: SupportedLocale,
  query: string,
  topK = 5
): DocArticle[] {
  const bundle = getLocaleBundle(locale);
  const tokens = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2);

  const scored = bundle.articles.map((article) => {
    let score = 0;
    const titleLower = article.title.toLowerCase();
    const catLower = article.categoryLabel.toLowerCase();
    const slugLower = article.slug.toLowerCase();
    const bodyLower = article.plainText.toLowerCase();

    for (const token of tokens) {
      if (titleLower.includes(token)) score += 12;
      if (slugLower.includes(token)) score += 10;
      if (catLower.includes(token)) score += 5;
      const occurrences = bodyLower.split(token).length - 1;
      if (occurrences > 0) {
        score += Math.min(occurrences * 2, 14);
      }
    }

    // Domain boost rules
    const qLower = query.toLowerCase();
    if (
      (qLower.includes("closing") ||
        qLower.includes("clôture") ||
        qLower.includes("settle") ||
        qLower.includes("deal") ||
        qLower.includes("split") ||
        qLower.includes("door")) &&
      article.categoryId === "Events_and_Closing_Room"
    ) {
      score += 15;
    }
    if (
      (qLower.includes("qr") ||
        qLower.includes("terminal") ||
        qLower.includes("cash drop") ||
        qLower.includes("bouncer") ||
        qLower.includes("scan")) &&
      article.slug.includes("Door_Tickets_and_Bouncer_Mode")
    ) {
      score += 20;
    }
    if (
      (qLower.includes("ledger") ||
        qLower.includes("debt") ||
        qLower.includes("dette") ||
        qLower.includes("standing")) &&
      article.slug.includes("The_Ledger")
    ) {
      score += 20;
    }
    if (
      (qLower.includes("currency") ||
        qLower.includes("foreign") ||
        qLower.includes("float") ||
        qLower.includes("devise")) &&
      article.slug.includes("Multi_Currency_Touring")
    ) {
      score += 20;
    }
    if (
      (qLower.includes("tap to pay") ||
        qLower.includes("stripe") ||
        qLower.includes("fee") ||
        qLower.includes("card")) &&
      article.categoryId === "Accept_Payments"
    ) {
      score += 15;
    }
    if (
      (qLower.includes("bootstrapper") ||
        qLower.includes("upgrade") ||
        qLower.includes("price") ||
        qLower.includes("pricing") ||
        qLower.includes("pro") ||
        qLower.includes("€100") ||
        qLower.includes("€20")) &&
      article.categoryId === "Billing_and_Account"
    ) {
      score += 18;
    }

    return { article, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score > 0).slice(0, topK).map((s) => s.article);

  if (top.length === 0) {
    return bundle.articles.slice(0, 4);
  }
  return top;
}

// 6. Deterministic Offline Synthesis Fallback
function synthesizeOfflineKbAnswer(
  locale: SupportedLocale,
  query: string,
  topArticles: DocArticle[]
): { reply: string; citations: Array<{ title: string; url: string; category: string }> } {
  const q = query.toLowerCase();

  // Cross-domain founder / engineering story check
  if (
    q.includes("tom mares") ||
    q.includes("founder") ||
    q.includes("who built") ||
    q.includes("architecture") ||
    q.includes("chronicle") ||
    q.includes("cv") ||
    q.includes("resume") ||
    q.includes("hire")
  ) {
    const reply =
      locale === "fr"
        ? `BandMath a été conçu et développé par **Tom Mares**. Pour découvrir les coulisses de la construction du studio, nos journaux d'ingénierie et l'architecture du projet, consultez le **[Blog & Chronique du Fondateur](https://blog.itsbandmath.com)** ou le portfolio professionnel de Tom sur **[tommares.com](https://tommares.com)**.\n\nPour commencer à utiliser l'application avec votre groupe ou votre salle, consultez **[Premiers Pas](/${locale}/docs/Getting_Started/The_First_Tour)**.`
        : `BandMath was architected and built by **Tom Mares**. To explore the behind-the-scenes engineering story, studio build logs, and architectural deep dives, visit the **[Founder's Blog & Studio Chronicle](https://blog.itsbandmath.com)** or Tom's product & engineering portfolio at **[tommares.com](https://tommares.com)**.\n\nIf you are looking for product walkthroughs, start with **[The First Tour](/docs/Getting_Started/The_First_Tour)**.`;
    return {
      reply,
      citations: topArticles.slice(0, 3).map((a) => ({
        title: a.title,
        url: a.url,
        category: a.categoryLabel,
      })),
    };
  }

  const primary = topArticles[0];
  const secondary = topArticles.slice(1, 4);

  // Extract concise bullet summary from primary article sections
  const sectionBullets = primary.sections
    .slice(0, 4)
    .map((sec) => {
      const cleanSnippet = sec.content
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/<[^>]+>/g, "")
        .replace(/:::(note|tip|info|warning|danger|caution)/g, "")
        .replace(/:::/g, "")
        .trim()
        .split(/\r?\n/)
        .filter((l) => l.trim().length > 15)
        .slice(0, 2)
        .join(" ");
      return `* **${sec.heading}:** ${cleanSnippet}`;
    })
    .join("\n");

  const relatedLinks = secondary
    .map((art) => `* **[${art.title}](${art.url})** *(${art.categoryLabel})*`)
    .join("\n");

  const reply = [
    `Based on the official **[${primary.title}](${primary.url})** guide in **${primary.categoryLabel}**:`,
    "",
    sectionBullets || primary.plainText.slice(0, 450) + "...",
    "",
    `Read the full step-by-step walkthrough with interactive screenshots in **[${primary.title}](${primary.url})**.`,
    relatedLinks ? `\n**Related Guides:**\n${relatedLinks}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    reply,
    citations: topArticles.slice(0, 4).map((a) => ({
      title: a.title,
      url: a.url,
      category: a.categoryLabel,
    })),
  };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce Origin / Referer allowlist
    const host = req.headers.get("host") || "localhost:3002";
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");

    if (origin && !isAllowedHost(origin, host)) {
      return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
    }
    if (!origin && referer && !isAllowedHost(referer, host)) {
      return NextResponse.json({ error: "Forbidden referer" }, { status: 403 });
    }

    // 2. Enforce IP Rate Limit
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "Rate limit reached (15 requests per 15 minutes). Please browse the Knowledge Base categories directly or try again shortly.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const rawMessage = typeof body.message === "string" ? body.message : "";
    const locale = normalizeLocale(body.locale);
    const rawHistory = Array.isArray(body.history) ? body.history : [];

    // 3. Input sanitization & 600-character limit
    const cleanMessage = rawMessage
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .trim()
      .slice(0, 600);

    if (!cleanMessage) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    // 4. Prompt-injection & abuse pre-filter
    if (isPromptInjectionAttempt(cleanMessage) || isAbusiveInput(cleanMessage)) {
      const safeReply =
        "I am the **BandMath Knowledge Base Assistant**. I can only answer questions about BandMath features, touring workflows, the Multi-Band Closing Room, Stripe Tap to Pay, and account setup. Try asking about **[The First Tour](/docs/Getting_Started/The_First_Tour)** or **[The Closing Room](/docs/Events_and_Closing_Room/Multi_Band_Closing_Room)**.";
      return NextResponse.json({
        reply: safeReply,
        sig: signAssistantReply(safeReply),
        citations: [
          {
            title: "The First Tour: A Quick Walkthrough",
            url: "/docs/Getting_Started/The_First_Tour",
            category: "Getting Started",
          },
        ],
      });
    }

    // 5. Verify signed assistant turns in conversation history
    const verifiedHistory: Array<{ role: "user" | "model"; text: string }> = [];
    for (const turn of rawHistory.slice(-6)) {
      if (!turn || typeof turn.content !== "string") continue;
      const text = turn.content.slice(0, 800);
      if (turn.role === "user") {
        if (!isPromptInjectionAttempt(text) && !isAbusiveInput(text)) {
          verifiedHistory.push({ role: "user", text });
        }
      } else if (turn.role === "assistant") {
        if (isValidAssistantSignature(turn.content, turn.sig)) {
          verifiedHistory.push({ role: "model", text });
        }
      }
    }

    // 6. Retrieve top relevant KB articles for RAG grounding
    const topArticles = retrieveRelevantArticles(locale, cleanMessage, 5);
    const citations = topArticles.slice(0, 4).map((a) => ({
      title: a.title,
      url: a.url,
      category: a.categoryLabel,
    }));

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

    if (!apiKey || !checkGlobalDailyCircuitBreaker()) {
      const offline = synthesizeOfflineKbAnswer(locale, cleanMessage, topArticles);
      return NextResponse.json({
        reply: offline.reply,
        sig: signAssistantReply(offline.reply),
        citations: offline.citations,
      });
    }

    // 7. Build grounded RAG prompt for Gemini 2.5 Flash-Lite
    const ragContext = topArticles
      .map(
        (art, i) =>
          `--- ARTICLE ${i + 1}: "${art.title}" (Category: ${art.categoryLabel}, Canonical Link: ${art.url}) ---\n${art.plainText.slice(0, 2200)}`
      )
      .join("\n\n");

    const systemInstruction = `You are the official "Ask BandMath" Knowledge Base AI Assistant on learn.itsbandmath.com.
Your job is to help working musicians, bands, independent venues, and tour managers understand and use BandMath with zero corporate jargon and 100% mathematical precision.

STRICT RULES:
1. Ground your answers EXCLUSIVELY in the official BandMath Knowledge Base context provided below. Never invent features, fees, or workflows.
2. ALWAYS include clickable Markdown links to the relevant Knowledge Base guides using their exact Canonical Link from the context, e.g. [The Multi-Band Closing Room](/docs/Events_and_Closing_Room/Multi_Band_Closing_Room).
3. Use canonical BandMath terminology: "Merch Stand", "The Ledger", "Band Bank", "VAT Bank", "Shadow Profiles", "The Closing Room", "The Sales Analyzer", "The Penny Catcher Algorithm", and "Merch Float".
4. Keep your response concise (120 to 250 words), well-structured with bullet points or numbered steps.
5. CROSS-DOMAIN ROUTING:
   - If the user asks about the founder's story, how BandMath was built, AI engineering architecture, or studio build logs, direct them to the Founder's Blog at https://blog.itsbandmath.com.
   - If the user asks about Tom Mares's career, CV, or hiring him, direct them to https://tommares.com.
   - If the user asks where to sign up or join the €100 lifetime Bootstrapper's Club, link to https://account.itsbandmath.com/joinbootstrappers and https://itsbandmath.com.
6. Respond in the language matching locale "${locale}" (or the language the user wrote in).

OFFICIAL KNOWLEDGE BASE CONTEXT:
${ragContext}`;

    const contents = [
      ...verifiedHistory.map((h) => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
      {
        role: "user",
        parts: [{ text: cleanMessage }],
      },
    ];

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.25,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const offline = synthesizeOfflineKbAnswer(locale, cleanMessage, topArticles);
      return NextResponse.json({
        reply: offline.reply,
        sig: signAssistantReply(offline.reply),
        citations: offline.citations,
      });
    }

    const data = await geminiRes.json();
    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!candidateText) {
      const offline = synthesizeOfflineKbAnswer(locale, cleanMessage, topArticles);
      return NextResponse.json({
        reply: offline.reply,
        sig: signAssistantReply(offline.reply),
        citations: offline.citations,
      });
    }

    return NextResponse.json({
      reply: candidateText,
      sig: signAssistantReply(candidateText),
      citations,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process Knowledge Base query right now." },
      { status: 500 }
    );
  }
}
