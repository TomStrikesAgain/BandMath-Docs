import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import {
  getLocaleBundle,
  normalizeLocale,
  SupportedLocale,
  DocArticle,
  FaqPair,
} from "@/lib/kb";
import botConfig from "@/data/bandmath_bot_config.json";

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

// 4B. 0-Token Inline PII Scrubber & Flight Recorder Telemetry
function scrubPii(text: string): string {
  if (!text) return "";
  return text
    .replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      "[EMAIL_REDACTED]"
    )
    .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, (match) => {
      const digitCount = match.replace(/\D/g, "").length;
      return digitCount >= 8 ? "[PHONE_REDACTED]" : match;
    });
}

function detectAutoFlag(
  reply: string,
  citationsCount: number
): "none" | "knowledge_gap" | "voice_drift" {
  if (
    citationsCount === 0 ||
    /\b(not documented|don't have information|cannot find|not covered in the current|contact support)\b/i.test(
      reply
    )
  ) {
    return "knowledge_gap";
  }
  return "none";
}

interface FlightRecorderTurnPayload {
  sessionId: string;
  userMessage: string;
  assistantMessage: string;
  locale: SupportedLocale;
  pagePath: string;
  modelName: string;
  latencyMs: number;
  citationsCount: number;
}

async function logAiBotTurn(payload: FlightRecorderTurnPayload): Promise<void> {
  try {
    const isProd =
      process.env.VERCEL_ENV === "production" ||
      process.env.BM_ENV === "production";

    const supabaseUrl = isProd
      ? process.env.NEXT_PUBLIC_SUPABASE_URL ||
        "https://gktdqqfghkmdsgtyzfmt.supabase.co"
      : process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";

    const supabaseKey = isProd
      ? process.env.SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        "sb_publishable_jJ8t_kEHM_kk8n2oETDzNw_owlsZqxR"
      : process.env.SUPABASE_ANON_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

    const rpcBody = {
      p_session_id: payload.sessionId.slice(0, 128),
      p_bot_id: "ask_bandmath",
      p_user_message: scrubPii(payload.userMessage).slice(0, 2000),
      p_assistant_message: scrubPii(payload.assistantMessage).slice(0, 6000),
      p_environment: isProd ? "production" : "sandbox",
      p_persona_or_mode: "kb_support",
      p_locale: payload.locale,
      p_page_path: payload.pagePath.slice(0, 256),
      p_model_name: payload.modelName,
      p_latency_ms: Math.max(0, Math.round(payload.latencyMs)),
      p_auto_flag: detectAutoFlag(
        payload.assistantMessage,
        payload.citationsCount
      ),
    };

    await fetch(`${supabaseUrl}/rest/v1/rpc/log_ai_bot_turn`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rpcBody),
      signal: AbortSignal.timeout(1500),
    });
  } catch {
    // Non-blocking flight recorder: silently ignore network or RPC failures
  }
}

// 5. BM25 + FAQ Rosetta Stone + Musician Synonym Expansion Retrieval Engine
const STOPWORDS = new Set([
  "how",
  "what",
  "where",
  "when",
  "why",
  "who",
  "which",
  "much",
  "many",
  "does",
  "do",
  "did",
  "is",
  "are",
  "was",
  "were",
  "can",
  "could",
  "would",
  "should",
  "will",
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "our",
  "your",
  "my",
  "we",
  "you",
  "they",
  "in",
  "on",
  "at",
  "to",
  "of",
  "by",
  "as",
  "an",
  "be",
  "or",
  "it",
  "if",
  "bandmath",
  "app",
  "use",
  "using",
  "work",
  "works",
  "get",
  "make",
  "comment",
  "quel",
  "quelle",
  "quels",
  "quelles",
  "est",
  "sont",
  "dans",
  "pour",
  "avec",
  "les",
  "des",
  "une",
  "sur",
  "par",
  "plus",
  "wie",
  "was",
  "wo",
  "wann",
  "ist",
  "sind",
  "für",
  "mit",
  "und",
  "der",
  "die",
  "das",
  "ein",
  "eine",
  "como",
  "cómo",
  "que",
  "qué",
  "cuanto",
  "cuánto",
  "para",
  "con",
  "los",
  "las",
  "una",
  "por",
  "jak",
  "ile",
  "czy",
  "dla",
  "jest",
]);

// Musician & Touring Synonym Expansion Dictionary
const TOURING_SYNONYM_GROUPS: Array<{ pattern: RegExp; expansion: string[] }> = [
  {
    pattern:
      /\b(how much|cost|costs|price|pricing|subscription|subscriptions|subscribe|plan|plans|tier|tiers|upgrade|downgrade|billing|monthly|lifetime|bootstrapper|bootstrappers|free|pro|€20|€100|abonnement|tarif|prix|kosten|preis|abo|suscripci[oó]n|precio|subskrypcj[ai]|cena)\b/i,
    expansion: [
      "upgrading",
      "downgrading",
      "subscription",
      "tiers",
      "billing",
      "bootstrapper",
      "€20",
      "€100",
    ],
  },
  {
    pattern:
      /\b(door person|door guy|door staff|security|ticket scanner|scan tickets|will call|check in|guest list|hand my phone|bouncer|passcode|face id)\b/i,
    expansion: ["bouncer", "scanner", "safety", "lock", "guest", "door"],
  },
  {
    pattern:
      /\b(hall fee|merch cut|venue cut|venue split|promoter split|guarantee|door deal|settlement|settle the show|closing room|deal sheet|shared pot|payout envelope)\b/i,
    expansion: ["closing", "settlement", "deal", "shared", "envelope", "venue"],
  },
  {
    pattern:
      /\b(change|petty cash|till|drawer|cash box|cashbox|merch float|starting cash|shift drop|cash drop|reconcile|count till)\b/i,
    expansion: ["cash", "float", "drop", "box", "reconciliation", "reconcile", "till"],
  },
  {
    pattern:
      /\b(card reader|contactless|apple pay|google pay|tap to pay|processing fee|stripe fee|commission|1\.4%|€0\.10)\b/i,
    expansion: ["tap", "stripe", "processing", "fees", "terminal"],
  },
  {
    pattern:
      /\b(foreign currency|abroad|international tour|uk|switzerland|poland|pounds|francs|zloty|pln|gbp|chf|exchange rate|multi-currency|home currency|base currency|change currency|currency locked)\b/i,
    expansion: ["currency", "foreign", "float", "stripe", "qr", "reconcile", "till", "unlinked", "locked"],
  },
  {
    pattern:
      /\b(who owes who|pay back|settle debts|split gas|reimburse|balances|standings|ledger)\b/i,
    expansion: ["ledger", "automated", "debt", "settlement", "standings"],
  },
  {
    pattern:
      /\b(no app|doesn't have the app|won't download|session player|hire gun|shadow profile|ghost)\b/i,
    expansion: ["shadow", "profiles", "admin", "member"],
  },
  {
    pattern:
      /\b(sales tax|vat|tax liability|government tax|retroactive tax)\b/i,
    expansion: ["vat", "bank", "retroactive", "tax"],
  },
  {
    pattern:
      /\b(band checking|communal money|band account|business bank|band bank)\b/i,
    expansion: ["band", "bank", "communal", "entity"],
  },
  {
    pattern:
      /\b(show code|6-character|join show|add band to bill|opener|support band|headliner)\b/i,
    expansion: ["creating", "joining", "shows", "code", "lineup"],
  },
  {
    pattern:
      /\b(presale|pre-sale|online tickets|promoter link|referral link|attribution|first-sale lock)\b/i,
    expansion: ["online", "ticketing", "promoter", "claim", "lock"],
  },
  {
    pattern:
      /\b(privacy|personal data|sell my data|sell data|selling data|sold|data broker|advertisers|third parties|third-party|gdpr|ccpa|cookies|tracking|camera|encryption|rls|mailing list|opt-in|delete my account|delete account|erase|anonymize|confidential|datos|privacidad|donn[eé]es|vie priv[eé]e|rgpd|datenschutz|prywatno[sś][cć])\b/i,
    expansion: [
      "privacy",
      "policy",
      "personal",
      "advertisers",
      "gdpr",
      "cookies",
      "deleted",
      "anonymizes",
      "processor",
      "controller",
    ],
  },
  {
    pattern:
      /\b(terms|conditions|legal|liability|merchant of record|chargeback|dispute|escrow|siret|warranty|arbitration)\b/i,
    expansion: [
      "terms",
      "conditions",
      "liability",
      "merchant",
      "record",
      "disclaimer",
    ],
  },
  {
    pattern:
      /\b(charter|agreement|spreadsheet|excel|google sheets|consumables|strings|drumsticks|band fund|band pot|pool money|why bandmath|when to settle|autonomy)\b/i,
    expansion: [
      "charter",
      "agreement",
      "trust",
      "consumables",
      "spreadsheet",
      "threshold",
      "settle",
    ],
  },
];

function tokenizeForBm25(text: string): string[] {
  return (text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s€$£%-]/gu, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[-]+|[-]+$/g, ""))
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
}

function expandQueryTokens(query: string): {
  rawTokens: string[];
  expandedTokens: Array<{ term: string; weight: number }>;
} {
  const rawTokens = tokenizeForBm25(query);
  const weightMap = new Map<string, number>();

  for (const tok of rawTokens) {
    weightMap.set(tok, 1.0);
  }

  for (const group of TOURING_SYNONYM_GROUPS) {
    if (group.pattern.test(query)) {
      for (const syn of group.expansion) {
        if (!weightMap.has(syn)) {
          weightMap.set(syn, 0.65);
        } else {
          weightMap.set(syn, Math.max(weightMap.get(syn) || 1.0, 1.25));
        }
      }
    }
  }

  const expandedTokens = Array.from(weightMap.entries()).map(
    ([term, weight]) => ({ term, weight })
  );

  return { rawTokens, expandedTokens };
}

function scoreTextBm25(
  docText: string,
  expandedTokens: Array<{ term: string; weight: number }>,
  idfMap: Record<string, number>,
  avgDocLength: number,
  k1 = 1.5,
  b = 0.75
): number {
  const docTokens = tokenizeForBm25(docText);
  if (docTokens.length === 0) return 0;

  const tfMap = new Map<string, number>();
  for (const dt of docTokens) {
    tfMap.set(dt, (tfMap.get(dt) || 0) + 1);
  }

  let score = 0;
  const docLen = docTokens.length;

  for (const { term, weight } of expandedTokens) {
    // Exact token match + stem prefix match (for plurals/conjugations >= 4 chars)
    let tf = tfMap.get(term) || 0;
    if (tf === 0 && term.length >= 4) {
      for (const [dt, count] of tfMap.entries()) {
        if (dt.startsWith(term) || term.startsWith(dt)) {
          tf += count * 0.8;
        }
      }
    }
    if (tf === 0) continue;

    // Look up precomputed corpus IDF (default to high rarity 2.2 if unseen)
    const idf = idfMap[term] !== undefined ? idfMap[term] : 2.0;
    const numerator = tf * (k1 + 1);
    const denominator = tf + k1 * (1 - b + b * (docLen / (avgDocLength || 250)));
    score += idf * (numerator / denominator) * weight;
  }

  return score;
}

function retrieveRelevantArticlesAndFaqs(
  locale: SupportedLocale,
  query: string,
  topK = 5
): {
  topArticles: DocArticle[];
  matchedFaqs: Array<{ faq: FaqPair; score: number }>;
} {
  const bundle = getLocaleBundle(locale);
  const idfMap = bundle.bm25?.idf || {};
  const avgDocLength = bundle.bm25?.avgDocLength || 250;
  const { expandedTokens } = expandQueryTokens(query);

  // 1. Score all FAQ Q&A pairs (Rosetta Stone Cross-Reference)
  const faqPairs = bundle.faqPairs || [];
  const scoredFaqs = faqPairs
    .map((faq) => {
      const qScore = scoreTextBm25(
        faq.question,
        expandedTokens,
        idfMap,
        12,
        1.5,
        0.5
      );
      const aScore = scoreTextBm25(
        faq.plainText,
        expandedTokens,
        idfMap,
        60,
        1.5,
        0.6
      );
      return {
        faq,
        score: qScore * 2.2 + aScore,
      };
    })
    .filter((f) => f.score >= 2.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Map canonical URLs boosted by top matching FAQ entries
  const faqLinkedUrlBoost = new Map<string, number>();
  scoredFaqs.forEach((sf, rankIdx) => {
    const boostWeight = rankIdx === 0 ? 14 : rankIdx === 1 ? 8 : 5;
    for (const url of sf.faq.linkedUrls) {
      faqLinkedUrlBoost.set(
        url.toLowerCase(),
        (faqLinkedUrlBoost.get(url.toLowerCase()) || 0) + boostWeight
      );
    }
  });

  // 2. Score all KB Articles using Field-Weighted BM25 + Section-Peak BM25 + FAQ Cross-Ref Boost
  const scoredArticles = bundle.articles.map((article) => {
    const titleScore = scoreTextBm25(
      `${article.title} ${article.slug.replace(/_/g, " ")}`,
      expandedTokens,
      idfMap,
      8,
      1.5,
      0.4
    );
    const catScore = scoreTextBm25(
      article.categoryLabel,
      expandedTokens,
      idfMap,
      4,
      1.5,
      0.4
    );
    const bodyScore = scoreTextBm25(
      article.plainText,
      expandedTokens,
      idfMap,
      avgDocLength,
      1.5,
      0.75
    );

    // Best individual section score so focused sections inside long guides aren't diluted
    let maxSectionScore = 0;
    for (const sec of article.sections) {
      const sScore = scoreTextBm25(
        `${sec.heading} ${sec.content}`,
        expandedTokens,
        idfMap,
        75,
        1.5,
        0.6
      );
      if (sScore > maxSectionScore) maxSectionScore = sScore;
    }

    const crossRefBoost =
      faqLinkedUrlBoost.get(article.url.toLowerCase()) || 0;

    const totalScore =
      titleScore * 2.5 +
      catScore * 0.8 +
      bodyScore * 1.0 +
      maxSectionScore * 1.4 +
      crossRefBoost;

    return { article, score: totalScore };
  });

  scoredArticles.sort((a, b) => b.score - a.score);
  const topArticles = scoredArticles
    .filter((s) => s.score > 0)
    .slice(0, topK)
    .map((s) => s.article);

  return {
    topArticles:
      topArticles.length > 0 ? topArticles : bundle.articles.slice(0, 4),
    matchedFaqs: scoredFaqs,
  };
}

function buildFocusedArticleContext(
  article: DocArticle,
  expandedTokens: Array<{ term: string; weight: number }>,
  idfMap: Record<string, number>,
  maxChars = 2800
): string {
  if (article.plainText.length <= maxChars || article.sections.length <= 1) {
    return article.plainText.slice(0, maxChars);
  }

  const scoredSections = article.sections.map((sec, idx) => {
    const hScore =
      scoreTextBm25(sec.heading, expandedTokens, idfMap, 6, 1.5, 0.4) * 2.5;
    const cScore = scoreTextBm25(
      sec.content,
      expandedTokens,
      idfMap,
      70,
      1.5,
      0.6
    );
    return { sec, idx, score: hScore + cScore };
  });

  // Always include the first overview section + top 4 highest-scoring sections in reading order
  const topScored = [...scoredSections]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const selectedIndices = new Set<number>([0]);
  for (const item of topScored) {
    selectedIndices.add(item.idx);
  }

  const orderedSections = Array.from(selectedIndices)
    .sort((a, b) => a - b)
    .map((idx) => {
      const s = article.sections[idx];
      return `### ${s.heading}\n${s.content.trim()}`;
    });

  return orderedSections.join("\n\n").slice(0, maxChars);
}

// 6. Deterministic Offline Synthesis Fallback (BM25 + FAQ Rosetta Stone Grounded)
function synthesizeOfflineKbAnswer(
  locale: SupportedLocale,
  query: string,
  topArticles: DocArticle[],
  matchedFaqs: Array<{ faq: FaqPair; score: number }>
): { reply: string; citations: Array<{ title: string; url: string; category: string }> } {
  const q = query.toLowerCase();
  const bundle = getLocaleBundle(locale);
  const idfMap = bundle.bm25?.idf || {};
  const { rawTokens, expandedTokens } = expandQueryTokens(query);

  // Direct Privacy / Data Selling / GDPR / Account Deletion Answer
  if (
    /\b(sell my data|sell data|selling data|sell your data|privacy|personal data|advertisers|third parties|third-party|gdpr|ccpa|cookies|tracking|delete my account|delete account|anonymize|donn[eé]es personnelles|vie priv[eé]e|rgpd|datenschutz|privacidad)\b/i.test(
      q
    ) ||
    (q.includes("sell") && q.includes("data"))
  ) {
    const privacyUrl =
      locale === "en" ? "/docs/Privacy_Policy" : `/${locale}/docs/Privacy_Policy`;
    const deletedUsersUrl =
      locale === "en"
        ? "/docs/Team_Management/Deleted_Users"
        : `/${locale}/docs/Team_Management/Deleted_Users`;
    const exportUrl =
      locale === "en"
        ? "/docs/Features/Data_Exports"
        : `/${locale}/docs/Features/Data_Exports`;

    const reply = [
      `**No — BandMath will never sell your personal data or your fans' data to advertisers or third parties.**`,
      "",
      `From our official **[Privacy Policy](${privacyUrl})**:`,
      "",
      `* **Zero Data Selling or Ad Mining:** BandMath only collects the information strictly required to run your ledger, process Stripe subscriptions, deliver fan QR tickets and receipts, and generate accurate show settlements.`,
      `* **Strict Transactional vs. Marketing Separation (GDPR):** BandMath acts as a **Data Processor** on behalf of each Event Organizer (the **Data Controller**). Fan emails collected for QR tickets or POS receipts are never automatically added to marketing lists—fan mailing lists are populated strictly via explicit opt-in consent and isolated by database Row-Level Security (RLS).`,
      `* **Stripe KYC & Card Isolation:** Credit card numbers, bank routing details, and identity verification (KYC) are handled directly by Stripe. BandMath never stores full credit card numbers or government IDs.`,
      `* **GDPR Right to Erasure & Ledger Anonymization:** You can export your data at any time via **[Data Exports](${exportUrl})** or delete your account inside User Settings. Under GDPR/CCPA, deleting your account wipes your personal data while anonymizing your historical slot as \`"Deleted User"\` so your bandmates' ledger math stays balanced (see **[Deleted Users](${deletedUsersUrl})**).`,
    ].join("\n");

    return {
      reply,
      citations: [
        {
          title: "Privacy Policy",
          url: privacyUrl,
          category: "Resources & Legal",
        },
        {
          title: "Deleted Users",
          url: deletedUsersUrl,
          category: "Team Management",
        },
        {
          title: "Data Exports",
          url: exportUrl,
          category: "Features",
        },
      ],
    };
  }

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

  // Direct Subscription / Pricing / Cost Answer
  if (
    /\b(subscription|subscriptions|subscribe|cost|costs|price|pricing|plan|plans|tier|tiers|upgrade|downgrade|billing|monthly|lifetime|bootstrapper|bootstrappers|abonnement|tarif|prix|kosten|preis|abo|suscripci[oó]n|precio|subskrypcj[ai]|cena)\b/i.test(
      q
    ) ||
    (q.includes("how much") && !q.includes("fee") && !q.includes("tap to pay"))
  ) {
    const upgradeUrl =
      locale === "en"
        ? "/docs/Billing_and_Account/Upgrading_and_Downgrading"
        : `/${locale}/docs/Billing_and_Account/Upgrading_and_Downgrading`;
    const cancelUrl =
      locale === "en"
        ? "/docs/Billing_and_Account/Cancellations_and_Data_Export"
        : `/${locale}/docs/Billing_and_Account/Cancellations_and_Data_Export`;

    const reply = [
      botConfig.offlinePricingIntro,
      "",
      `* **Free Tier (\`€0\` — Core Ledger & Events):** 100% free forever for unlimited expense & income splits, **Automated Debt Settlement**, **Band Calendar**, **Setlist Organizer**, creating or joining multi-band shows via 6-Character Show Code, and participating in nightly **Closing Room** settlements.`,
      `* **Pro Merchant Plan (\`€20 / month\`):** Unlocks commercial **Merch Stand** Point-of-Sale (POS), **Tap to Pay** on iPhone & Android, **Stripe QR Codes**, **Online Event Ticketing**, the **Sales Analyzer**, and the **Inventory Analyzer**. *(Only one subscription is required per band workspace—covering every member in the band).*`,
      `* **The Bootstrapper's Club (\`€100\` One-Time Lifetime Pass):** Strictly capped at **100 public founding spots**, unlocking lifetime Pro access for a single one-time payment with zero recurring monthly fees at **[account.itsbandmath.com/joinbootstrappers](https://account.itsbandmath.com/joinbootstrappers)**.`,
      "",
      `For step-by-step instructions on upgrading, switching personas, or pausing between tours, see **[Upgrading and Downgrading](${upgradeUrl})** and **[Cancellations and Data Export](${cancelUrl})**.`,
    ].join("\n");

    return {
      reply,
      citations: topArticles.slice(0, 4).map((a) => ({
        title: a.title,
        url: a.url,
        category: a.categoryLabel,
      })),
    };
  }

  const primary = topArticles[0];
  const secondary = topArticles.slice(1, 4);

  // Score individual sections of the primary article using BM25 IDF weights
  const rankedSections = [...primary.sections].sort((a, b) => {
    const scoreA =
      scoreTextBm25(a.heading, expandedTokens, idfMap, 6, 1.5, 0.4) * 2.5 +
      scoreTextBm25(a.content, expandedTokens, idfMap, 70, 1.5, 0.6);
    const scoreB =
      scoreTextBm25(b.heading, expandedTokens, idfMap, 6, 1.5, 0.4) * 2.5 +
      scoreTextBm25(b.content, expandedTokens, idfMap, 70, 1.5, 0.6);
    return scoreB - scoreA;
  });

  // Extract clean, well-formatted bullets from top matching sections
  const sectionBullets = rankedSections
    .filter((sec) => sec.heading.toLowerCase() !== primary.title.toLowerCase())
    .slice(0, 3)
    .map((sec) => {
      const cleanSnippet = sec.content
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/<[^>]+>/g, "")
        .replace(/:::(note|tip|info|warning|danger|caution).*$/gm, "")
        .replace(/^:::$/gm, "")
        .replace(/^---$/gm, "")
        .trim()
        .split(/\r?\n/)
        .map((l) => l.trim().replace(/^[-*]\s+/, ""))
        .filter((l) => l.length > 15 && !l.startsWith("|"))
        .slice(0, 2)
        .join(" ");
      return `* **${sec.heading}:** ${cleanSnippet}`;
    })
    .filter((b) => b.length > 20)
    .join("\n");

  const topFaq = matchedFaqs[0];
  const relatedLinks = secondary
    .map((art) => `* **[${art.title}](${art.url})** *(${art.categoryLabel})*`)
    .join("\n");

  const replyParts: string[] = [];

  // Require at least 2 distinct raw query token matches (or 100% of a 1-token query with score >= 9.0)
  // in the FAQ question itself before prepending a verbatim FAQ answer.
  let faqQuestionTokenMatches = 0;
  if (topFaq) {
    const faqQTokens = new Set(tokenizeForBm25(topFaq.faq.question));
    for (const rt of rawTokens) {
      if (faqQTokens.has(rt)) {
        faqQuestionTokenMatches += 1;
      }
    }
  }

  if (
    topFaq &&
    topFaq.score >= 7.5 &&
    (faqQuestionTokenMatches >= 2 ||
      (rawTokens.length === 1 && faqQuestionTokenMatches === 1 && topFaq.score >= 9.5))
  ) {
    replyParts.push(topFaq.faq.answerMarkdown);
    replyParts.push("");
  }

  replyParts.push(
    `From **[${primary.title}](${primary.url})** *(${primary.categoryLabel})*:`
  );
  replyParts.push("");
  replyParts.push(sectionBullets || primary.plainText.slice(0, 450) + "...");

  if (relatedLinks) {
    replyParts.push("");
    replyParts.push(`**Related Guides:**\n${relatedLinks}`);
  }

  return {
    reply: replyParts.join("\n"),
    citations: topArticles.slice(0, 4).map((a) => ({
      title: a.title,
      url: a.url,
      category: a.categoryLabel,
    })),
  };
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
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
    const sessionId =
      typeof body.sessionId === "string" && body.sessionId.trim()
        ? body.sessionId.trim().slice(0, 128)
        : `anon-${Date.now().toString(36)}`;
    const pagePath =
      typeof body.pagePath === "string" && body.pagePath.trim()
        ? body.pagePath.trim().slice(0, 256)
        : "/";

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

    // 6. Retrieve top relevant KB articles & FAQ Rosetta Stone matches for RAG grounding
    const { topArticles, matchedFaqs } = retrieveRelevantArticlesAndFaqs(
      locale,
      cleanMessage,
      5
    );
    const citations = topArticles.slice(0, 4).map((a) => ({
      title: a.title,
      url: a.url,
      category: a.categoryLabel,
    }));

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

    if (!apiKey || !checkGlobalDailyCircuitBreaker()) {
      const offline = synthesizeOfflineKbAnswer(
        locale,
        cleanMessage,
        topArticles,
        matchedFaqs
      );
      void logAiBotTurn({
        sessionId,
        userMessage: cleanMessage,
        assistantMessage: offline.reply,
        locale,
        pagePath,
        modelName: "bm25-offline-synth",
        latencyMs: Date.now() - startedAt,
        citationsCount: offline.citations.length,
      });
      return NextResponse.json({
        reply: offline.reply,
        sig: signAssistantReply(offline.reply),
        citations: offline.citations,
      });
    }

    // 7. Build grounded RAG prompt for Gemini (including Core Truths + Matched FAQ Q&As + Focused Article Sections)
    const bundle = getLocaleBundle(locale);
    const idfMap = bundle.bm25?.idf || {};
    const { expandedTokens } = expandQueryTokens(cleanMessage);

    const faqContext =
      matchedFaqs.length > 0
        ? `--- MATCHED FAQ Q&A PAIRS ---\n` +
          matchedFaqs
            .map(
              (mf, idx) =>
                `FAQ ${idx + 1}: Q: "${mf.faq.question}"\nA: ${mf.faq.answerMarkdown}`
            )
            .join("\n\n") +
          `\n\n`
        : "";

    const ragContext =
      faqContext +
      topArticles
        .map(
          (art, i) =>
            `--- ARTICLE ${i + 1}: "${art.title}" (Category: ${art.categoryLabel}, Canonical Link: ${art.url}) ---\n${buildFocusedArticleContext(art, expandedTokens, idfMap, 2800)}`
        )
        .join("\n\n");

    const localePrefix = locale === "en" ? "" : `/${locale}`;
    const docsSurface = botConfig.surfaceGuardrails.docs;
    const renderedCoreTruths = botConfig.coreTruths
      .map((t) =>
        t.replace(/\$\{localePrefix\}/g, localePrefix).replace(/\$\{locale\}/g, locale)
      )
      .join("\n");
    const renderedRules = botConfig.strictResponseRules
      .map((r) =>
        r.replace(/\$\{localePrefix\}/g, localePrefix).replace(/\$\{locale\}/g, locale)
      )
      .join("\n");

    const systemInstruction = `You are the official "Ask BandMath" ${docsSurface.persona}.
Your job is to help working musicians, bands, independent venues, promoters, and tour managers understand and use BandMath with zero corporate jargon and 100% mathematical precision (${docsSurface.tone}).

=== CORE BANDMATH TRUTHS (NON-NEGOTIABLE BASELINE) ===
${renderedCoreTruths}

STRICT RESPONSE RULES:
${renderedRules}

OFFICIAL KNOWLEDGE BASE CONTEXT:
${ragContext}`;

    // Build strictly alternating user -> model contents for Gemini v1beta API
    const formattedContents: Array<{
      role: "user" | "model";
      parts: Array<{ text: string }>;
    }> = [];

    for (const h of verifiedHistory) {
      if (formattedContents.length === 0 && h.role === "model") {
        continue;
      }
      const prev = formattedContents[formattedContents.length - 1];
      if (prev && prev.role === h.role) {
        prev.parts[0].text += `\n\n${h.text}`;
      } else {
        formattedContents.push({
          role: h.role,
          parts: [{ text: h.text }],
        });
      }
    }

    const wrappedUserMessage = `<user_input>\n${cleanMessage}\n</user_input>`;
    if (
      formattedContents.length > 0 &&
      formattedContents[formattedContents.length - 1].role === "user"
    ) {
      formattedContents[formattedContents.length - 1].parts[0].text += `\n\n${wrappedUserMessage}`;
    } else {
      formattedContents.push({
        role: "user",
        parts: [{ text: wrappedUserMessage }],
      });
    }

    // Cascade across active 2026 Gemini models (matching tommares-portfolio)
    const candidateModels = [
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash-lite",
      "gemini-3.8-flash",
      "gemini-2.5-flash-lite",
    ];

    let candidateText = "";
    let usedModel = "";

    const reqBody = JSON.stringify({
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 550,
      },
    });

    for (let i = 0; i < candidateModels.length; i++) {
      const model = candidateModels[i];
      if (i > 0 && !checkGlobalDailyCircuitBreaker()) break;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 14000);

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          signal: controller.signal,
          body: reqBody,
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          const extracted = (data?.candidates?.[0]?.content?.parts || [])
            .map((p: { text?: string }) => p?.text || "")
            .join("")
            .trim();
          if (extracted) {
            candidateText = extracted;
            usedModel = model;
            break;
          }
        } else {
          const errText = await res.text().catch(() => "");
          console.warn(
            `[API/KB-CHAT] Model ${model} returned ${res.status}: ${errText.slice(0, 200)}`
          );
        }
      } catch (err) {
        clearTimeout(timeout);
        console.warn(
          `[API/KB-CHAT] Model ${model} request failed:`,
          (err as Error)?.name || "error"
        );
      }
    }

    if (!candidateText) {
      const offline = synthesizeOfflineKbAnswer(
        locale,
        cleanMessage,
        topArticles,
        matchedFaqs
      );
      void logAiBotTurn({
        sessionId,
        userMessage: cleanMessage,
        assistantMessage: offline.reply,
        locale,
        pagePath,
        modelName: "bm25-offline-synth",
        latencyMs: Date.now() - startedAt,
        citationsCount: offline.citations.length,
      });
      return NextResponse.json({
        reply: offline.reply,
        sig: signAssistantReply(offline.reply),
        citations: offline.citations,
      });
    }

    void logAiBotTurn({
      sessionId,
      userMessage: cleanMessage,
      assistantMessage: candidateText,
      locale,
      pagePath,
      modelName: usedModel || "gemini-3.1-flash-lite",
      latencyMs: Date.now() - startedAt,
      citationsCount: citations.length,
    });

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
