import kbIndexData from "@/data/kb_search_index.json";

export type SupportedLocale = "en" | "fr" | "de" | "es" | "pl";

export const SUPPORTED_LOCALES: SupportedLocale[] = ["en", "fr", "de", "es", "pl"];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
  es: "ES",
  pl: "PL",
};

export interface DocScreenshot {
  id: string;
  sectionId: string;
  sectionTitle: string;
  alt: string;
  src: string;
}

export interface DocSection {
  id: string;
  heading: string;
  content: string;
  screenshots: DocScreenshot[];
}

export interface DocArticleSummary {
  id: string;
  slug: string;
  rawFileSlug: string;
  url: string;
  title: string;
  sidebarLabel: string;
  position: number;
  screenshotCount: number;
}

export interface DocCategory {
  id: string;
  label: string;
  position: number;
  articles: DocArticleSummary[];
}

export interface DocArticle {
  id: string;
  locale: SupportedLocale;
  categoryId: string | null;
  categoryLabel: string;
  categoryPosition: number;
  slug: string;
  rawFileSlug: string;
  routeSegments: string[];
  url: string;
  title: string;
  sidebarLabel: string;
  position: number;
  body: string;
  plainText: string;
  sections: DocSection[];
  screenshots: DocScreenshot[];
}

export interface LocaleBundle {
  categories: DocCategory[];
  rootArticles: DocArticleSummary[];
  articles: DocArticle[];
}

const rawIndex = kbIndexData as unknown as {
  generatedAt: string;
  locales: Record<SupportedLocale, LocaleBundle>;
};

export function normalizeLocale(input?: string): SupportedLocale {
  const lower = (input || "en").toLowerCase() as SupportedLocale;
  return SUPPORTED_LOCALES.includes(lower) ? lower : "en";
}

export function getLocaleBundle(locale: SupportedLocale): LocaleBundle {
  return rawIndex.locales[locale] || rawIndex.locales.en;
}

function cleanSlugSegment(segment: string): string {
  return decodeURIComponent(segment)
    .replace(/\.mdx?$/i, "")
    .replace(/^\d+_/, "");
}

export function findDocBySlug(
  localeInput: string | undefined,
  slugSegments: string[]
): DocArticle | null {
  const locale = normalizeLocale(localeInput);
  const bundle = getLocaleBundle(locale);
  if (!slugSegments || slugSegments.length === 0) {
    return bundle.articles[0] || null;
  }

  const normalizedSegments = slugSegments.map(cleanSlugSegment);

  // 1. Exact or numeric-stripped match on routeSegments
  for (const article of bundle.articles) {
    if (article.routeSegments.length === normalizedSegments.length) {
      const matchesAll = article.routeSegments.every(
        (seg, idx) => seg.toLowerCase() === normalizedSegments[idx].toLowerCase()
      );
      if (matchesAll) return article;
    }
  }

  // 2. Fallback: match by categoryId alone (redirect to first article in category)
  if (normalizedSegments.length === 1) {
    const cat = bundle.categories.find(
      (c) => c.id.toLowerCase() === normalizedSegments[0].toLowerCase()
    );
    if (cat && cat.articles.length > 0) {
      const firstId = cat.articles[0].id;
      return bundle.articles.find((a) => a.id === firstId) || null;
    }
  }

  // 3. Fallback: match by slug name anywhere in the locale
  const targetLeaf = normalizedSegments[normalizedSegments.length - 1].toLowerCase();
  const byLeaf = bundle.articles.find(
    (a) =>
      a.slug.toLowerCase() === targetLeaf ||
      a.rawFileSlug.toLowerCase() === targetLeaf
  );
  if (byLeaf) return byLeaf;

  return null;
}

export function getPrevNextArticles(
  localeInput: string | undefined,
  currentArticleId: string
): { prev: DocArticleSummary | null; next: DocArticleSummary | null } {
  const locale = normalizeLocale(localeInput);
  const bundle = getLocaleBundle(locale);
  const ordered: DocArticleSummary[] = [];

  for (const cat of bundle.categories) {
    for (const art of cat.articles) {
      ordered.push(art);
    }
  }
  for (const rootArt of bundle.rootArticles) {
    ordered.push(rootArt);
  }

  const idx = ordered.findIndex((a) => a.id === currentArticleId);
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? ordered[idx - 1] : null,
    next: idx < ordered.length - 1 ? ordered[idx + 1] : null,
  };
}

export interface UILocaleStrings {
  hubBadge: string;
  hubTitle: string;
  hubSubtitle: string;
  askPlaceholder: string;
  askButton: string;
  browseArchiveCta: string;
  starterPills: string[];
  categoriesHeading: string;
  articlesCountLabel: string;
  screensCountLabel: string;
  searchAskButton: string;
  interactivePhoneTitle: string;
  interactivePhoneSubtitle: string;
  noScreensNote: string;
  viewScreenMobile: string;
  MarketingSiteLink: string;
  FounderBlogLink: string;
  BootstrappersLink: string;
}

export const UI_STRINGS: Record<SupportedLocale, UILocaleStrings> = {
  en: {
    hubBadge: "BANDMATH KNOWLEDGE BASE & AI SUPPORT HUB",
    hubTitle: "Ask BandMath Anything.",
    hubSubtitle:
      "Instant answers grounded in our official touring guides, Closing Room deal sheets, Stripe Tap to Pay setup, and multi-member ledger math.",
    askPlaceholder:
      "Ask how to settle a multi-band show, pair a QR door terminal, or split tour gas...",
    askButton: "ASK BANDMATH",
    browseArchiveCta: "Browse the Knowledge Base Archive →",
    starterPills: [
      "How does the Multi-Band Closing Room settle door tickets & shared expenses?",
      "How do I pair a QR Door Terminal and log a Shift Cash Drop?",
      "How does Automated Debt Settlement minimize band transfers?",
      "How do Venues, Tour Managers, and Bands claim online ticketing?",
    ],
    categoriesHeading: "BROWSE BY WORKFLOW CATEGORY",
    articlesCountLabel: "guides",
    screensCountLabel: "interactive screens",
    searchAskButton: "Search / ✨ Ask AI",
    interactivePhoneTitle: "LIVE STEP VIEWER",
    interactivePhoneSubtitle: "Scroll the guide or click a step below to inspect the app screen.",
    noScreensNote: "Conceptual & policy guide — select any workflow step on the left to jump sections.",
    viewScreenMobile: "📱 View Screen",
    MarketingSiteLink: "itsbandmath.com",
    FounderBlogLink: "Founder's Blog",
    BootstrappersLink: "Bootstrapper's Club",
  },
  fr: {
    hubBadge: "BASE DE CONNAISSANCES & SUPPORT IA BANDMATH",
    hubTitle: "Posez votre question à BandMath.",
    hubSubtitle:
      "Réponses instantanées basées sur nos guides officiels : Clôture multi-groupes, terminaux QR, Tap to Pay et grand livre.",
    askPlaceholder:
      "Demandez comment clôturer un concert multi-groupes, jumeler un terminal QR ou partager des frais...",
    askButton: "DEMANDER À BANDMATH",
    browseArchiveCta: "Parcourir les guides complets →",
    starterPills: [
      "Comment fonctionne la Salle de Clôture multi-groupes ?",
      "Comment jumeler un terminal de billetterie QR et enregistrer un dépôt d'espèces ?",
      "Comment le règlement automatisé des dettes réduit-il les virements ?",
      "Comment réclamer la billetterie en ligne d'un concert ?",
    ],
    categoriesHeading: "PARCOURIR PAR CATÉGORIE",
    articlesCountLabel: "guides",
    screensCountLabel: "écrans interactifs",
    searchAskButton: "Rechercher / ✨ IA",
    interactivePhoneTitle: "APERÇU INTERACTIF",
    interactivePhoneSubtitle: "Faites défiler le guide ou cliquez sur une étape pour inspecter l'écran.",
    noScreensNote: "Guide conceptuel — cliquez sur une section pour naviguer.",
    viewScreenMobile: "📱 Voir l'écran",
    MarketingSiteLink: "itsbandmath.com",
    FounderBlogLink: "Blog du Fondateur",
    BootstrappersLink: "Bootstrapper's Club",
  },
  de: {
    hubBadge: "BANDMATH WISSENSDATENBANK & KI-SUPPORT",
    hubTitle: "Frag BandMath alles.",
    hubSubtitle:
      "Sofortige Antworten aus unseren offiziellen Tour-Guides: Closing Room, QR-Terminals, Tap to Pay und Band-Buchhaltung.",
    askPlaceholder:
      "Frag nach Multi-Band-Abrechnungen, QR-Terminals, Bouncer-Modus oder Tankkosten-Splits...",
    askButton: "BANDMATH FRAGEN",
    browseArchiveCta: "Zum kompletten Handbuch-Archiv →",
    starterPills: [
      "Wie rechnet der Multi-Band Closing Room Abendkasse und Gagen ab?",
      "Wie kopple ich ein QR-Kassenterminal und buche einen Cash Drop?",
      "Wie minimiert der automatische Schuldenausgleich Überweisungen?",
      "Wie beanspruchen Bands oder Venues das Online-Ticketing?",
    ],
    categoriesHeading: "NACH KATEGORIE DURCHSUCHEN",
    articlesCountLabel: "Guides",
    screensCountLabel: "Screens",
    searchAskButton: "Suche / ✨ KI fragen",
    interactivePhoneTitle: "INTERAKTIVER SCREEN-VIEWER",
    interactivePhoneSubtitle: "Scrolle durch den Guide oder wähle einen Schritt aus.",
    noScreensNote: "Konzept- & Richtlinien-Guide.",
    viewScreenMobile: "📱 Screen ansehen",
    MarketingSiteLink: "itsbandmath.com",
    FounderBlogLink: "Gründer-Blog",
    BootstrappersLink: "Bootstrapper's Club",
  },
  es: {
    hubBadge: "BASE DE CONOCIMIENTOS Y SOPORTE IA DE BANDMATH",
    hubTitle: "Pregúntale lo que quieras a BandMath.",
    hubSubtitle:
      "Respuestas instantáneas basadas en nuestras guías oficiales: Sala de Cierre, terminales QR, Tap to Pay y contabilidad de gira.",
    askPlaceholder:
      "Pregunta cómo liquidar un concierto multibanda, vincular un terminal QR o dividir gastos...",
    askButton: "PREGUNTAR A BANDMATH",
    browseArchiveCta: "Explorar el archivo de guías →",
    starterPills: [
      "¿Cómo liquida entradas y gastos la Sala de Cierre multibanda?",
      "¿Cómo vinculo un terminal QR de taquilla y registro un retiro de efectivo?",
      "¿Cómo funciona la liquidación automática de deudas?",
      "¿Cómo reclaman las bandas o salas la venta de entradas online?",
    ],
    categoriesHeading: "EXPLORAR POR CATEGORÍA",
    articlesCountLabel: "guías",
    screensCountLabel: "pantallas",
    searchAskButton: "Buscar / ✨ IA",
    interactivePhoneTitle: "VISOR DE PANTALLA EN VIVO",
    interactivePhoneSubtitle: "Desplázate por la guía o haz clic en un paso para ver la pantalla.",
    noScreensNote: "Guía conceptual — selecciona cualquier paso para saltar de sección.",
    viewScreenMobile: "📱 Ver pantalla",
    MarketingSiteLink: "itsbandmath.com",
    FounderBlogLink: "Blog del Fundador",
    BootstrappersLink: "Bootstrapper's Club",
  },
  pl: {
    hubBadge: "BAZA WIEDZY I WSPARCIE AI BANDMATH",
    hubTitle: "Zapytaj BandMath o cokolwiek.",
    hubSubtitle:
      "Natychmiastowe odpowiedzi na podstawie oficjalnych przewodników: Pokój Rozliczeń, terminale QR, Tap to Pay i księgowość w trasie.",
    askPlaceholder:
      "Zapytaj jak rozliczyć koncert wielu zespołów, sparować terminal QR lub podzielić koszty paliwa...",
    askButton: "ZAPYTAJ BANDMATH",
    browseArchiveCta: "Przeglądaj archiwum poradników →",
    starterPills: [
      "Jak Pokój Rozliczeń rozlicza bilety na bramce i wspólne koszty?",
      "Jak sparować terminal QR na bramce i zarejestrować zrzut gotówki?",
      "Jak automatyczne rozliczanie długów minimalizuje przelewy?",
      "Jak zespoły i kluby przejmują sprzedaż biletów online?",
    ],
    categoriesHeading: "PRZEGLĄDAJ WEDŁUG KATEGORII",
    articlesCountLabel: "poradników",
    screensCountLabel: "ekranów",
    searchAskButton: "Szukaj / ✨ Zapytaj AI",
    interactivePhoneTitle: "PODGLĄD EKRANU NA ŻYWO",
    interactivePhoneSubtitle: "Przewijaj poradnik lub kliknij krok poniżej, aby zobaczyć ekran aplikacji.",
    noScreensNote: "Przewodnik koncepcyjny.",
    viewScreenMobile: "📱 Zobacz ekran",
    MarketingSiteLink: "itsbandmath.com",
    FounderBlogLink: "Blog Założyciela",
    BootstrappersLink: "Bootstrapper's Club",
  },
};
