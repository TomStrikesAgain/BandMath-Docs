"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Maximize2,
  X,
  BookOpen,
  Layers,
} from "lucide-react";
import {
  DocArticle,
  DocArticleSummary,
  DocCategory,
  DocScreenshot,
  SupportedLocale,
  UI_STRINGS,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
} from "@/lib/kb";
import { KbShell } from "./KbShell";
import { MarkdownBlocks } from "./MarkdownRenderer";

interface DocArticleClientProps {
  locale: SupportedLocale;
  article: DocArticle;
  categories: DocCategory[];
  rootArticles: DocArticleSummary[];
  prevArticle: DocArticleSummary | null;
  nextArticle: DocArticleSummary | null;
}

export function DocArticleClient({
  locale,
  article,
  categories,
  rootArticles,
  prevArticle,
  nextArticle,
}: DocArticleClientProps) {
  const ui = UI_STRINGS[locale] || UI_STRINGS.en;

  const [activeSectionId, setActiveSectionId] = useState<string>(
    article.sections[0]?.id || "overview"
  );
  const [activeScreenshot, setActiveScreenshot] = useState<DocScreenshot | null>(
    article.screenshots[0] || null
  );
  const [lightboxScreen, setLightboxScreen] = useState<DocScreenshot | null>(null);
  const [mobilePeekScreen, setMobilePeekScreen] = useState<DocScreenshot | null>(
    null
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Reset active section and screenshot when article changes
  useEffect(() => {
    setActiveSectionId(article.sections[0]?.id || "overview");
    setActiveScreenshot(article.screenshots[0] || null);
    setMobileSidebarOpen(false);
    setMobilePeekScreen(null);
  }, [article.id, article.sections, article.screenshots]);

  // IntersectionObserver to sync active step & right-rail phone screen on scroll
  useEffect(() => {
    if (typeof window === "undefined" || article.sections.length === 0) return;

    const sectionElements = article.sections
      .map((s) => document.getElementById(`doc-sec-${s.id}`))
      .filter(Boolean) as HTMLElement[];

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - 120) -
              Math.abs(b.boundingClientRect.top - 120)
          );

        if (visible.length > 0) {
          const secId = visible[0].target.getAttribute("data-section-id");
          if (secId) {
            setActiveSectionId(secId);
            const matchedSec = article.sections.find((s) => s.id === secId);
            if (matchedSec && matchedSec.screenshots.length > 0) {
              setActiveScreenshot(matchedSec.screenshots[0]);
            }
          }
        }
      },
      {
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0, 0.2, 0.5],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [article.id, article.sections]);

  const SidebarContent = (
    <div className="space-y-6">
      {categories.map((cat) => (
        <div key={cat.id}>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              {cat.label}
            </span>
            <span className="font-mono text-[10px] text-zinc-500">
              {cat.articles.length}
            </span>
          </div>
          <ul className="space-y-0.5 border-l border-white/12 ml-2">
            {cat.articles.map((item) => {
              const isActive = item.id === article.id;
              return (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    className={`flex items-center justify-between pl-3 pr-2.5 py-2 text-xs transition-colors rounded-none -ml-px border-l-2 ${
                      isActive
                        ? "border-l-[#E5FE00] bg-[#141414] text-[#E5FE00] font-semibold"
                        : "border-l-transparent text-zinc-300 hover:text-white hover:bg-[#141414]/60"
                    }`}
                  >
                    <span className="truncate">{item.sidebarLabel}</span>
                    {item.screenshotCount > 0 && (
                      <span
                        className={`ml-2 shrink-0 px-1.5 py-0.5 text-[10px] font-mono rounded-none ${
                          isActive
                            ? "bg-[#E5FE00] text-black font-bold"
                            : "bg-[#1C1C1C] text-zinc-400"
                        }`}
                      >
                        {item.screenshotCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {rootArticles.length > 0 && (
        <div>
          <div className="px-2 mb-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Resources & Legal
            </span>
          </div>
          <ul className="space-y-0.5 border-l border-white/12 ml-2">
            {rootArticles.map((item) => {
              const isActive = item.id === article.id;
              return (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    className={`flex items-center justify-between pl-3 pr-2.5 py-2 text-xs transition-colors rounded-none -ml-px border-l-2 ${
                      isActive
                        ? "border-l-[#E5FE00] bg-[#141414] text-[#E5FE00] font-semibold"
                        : "border-l-transparent text-zinc-300 hover:text-white hover:bg-[#141414]/60"
                    }`}
                  >
                    <span className="truncate">{item.sidebarLabel}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <KbShell
      locale={locale}
      showMobileSidebarTrigger
      onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
    >
      {/* Mobile Sidebar Drawer (<1024px) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-80 max-w-[85vw] bg-[#0A0A0A] border-r border-white/15 h-full overflow-y-auto p-4">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15">
              <span className="font-display font-bold text-sm text-[#E5FE00]">
                KNOWLEDGE BASE GUIDES
              </span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white border border-white/15 rounded-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Mobile Locale Switcher */}
            <div className="flex items-center gap-1 mb-5 p-1 bg-[#141414] border border-white/15">
              {SUPPORTED_LOCALES.map((loc) => (
                <Link
                  key={loc}
                  href={loc === "en" ? `/docs/${article.routeSegments.join("/")}` : `/${loc}/docs/${article.routeSegments.join("/")}`}
                  className={`flex-1 text-center py-1 text-xs font-mono font-bold ${
                    loc === locale
                      ? "bg-[#E5FE00] text-black"
                      : "text-zinc-400"
                  }`}
                >
                  {LOCALE_LABELS[loc]}
                </Link>
              ))}
            </div>
            {SidebarContent}
          </div>
        </div>
      )}

      {/* 3-Column Desktop Grid (>=1024px) */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Category Navigation Sidebar (3 cols on lg) */}
          <aside className="hidden lg:block lg:col-span-3 py-8 pr-4 border-r border-white/12">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              {SidebarContent}
            </div>
          </aside>

          {/* CENTER COLUMN: Step-by-Step Guide Prose (5 cols on lg) */}
          <article className="lg:col-span-5 py-8 min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-3">
              <Link
                href={locale === "en" ? "/" : `/${locale}`}
                className="hover:text-[#E5FE00]"
              >
                KB Hub
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-[#E5FE00]">{article.categoryLabel}</span>
            </div>

            {/* Article Title */}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6 pb-5 border-b border-white/15">
              {article.title}
            </h1>

            {/* Render Sections with IntersectionObserver anchors */}
            <div className="space-y-8">
              {article.sections.map((sec, idx) => {
                const isActiveSec = sec.id === activeSectionId;
                return (
                  <section
                    key={`${sec.id}-${idx}`}
                    id={`doc-sec-${sec.id}`}
                    data-section-id={sec.id}
                    onMouseEnter={() => {
                      setActiveSectionId(sec.id);
                      if (sec.screenshots.length > 0) {
                        setActiveScreenshot(sec.screenshots[0]);
                      }
                    }}
                    className={`scroll-mt-24 transition-colors p-4 -mx-4 border-l-2 ${
                      isActiveSec
                        ? "border-l-[#E5FE00] bg-[#141414]/40"
                        : "border-l-transparent hover:border-l-white/20"
                    }`}
                  >
                    {sec.id !== "overview" && (
                      <h2
                        id={sec.id}
                        className="font-display text-xl font-bold text-white mb-3 flex items-center justify-between gap-2"
                      >
                        <span>{sec.heading}</span>
                        {sec.screenshots.length > 0 && (
                          <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-[#141414] border border-white/15 text-[#E5FE00] rounded-none shrink-0">
                            <Smartphone className="w-3 h-3" />
                            <span>
                              {sec.screenshots.length}{" "}
                              {sec.screenshots.length === 1 ? "SCREEN" : "SCREENS"}
                            </span>
                          </span>
                        )}
                      </h2>
                    )}

                    <MarkdownBlocks
                      content={sec.content}
                      sectionScreenshots={sec.screenshots}
                      mobileButtonLabel={ui.viewScreenMobile}
                      onSelectScreenshot={(scr) => {
                        setActiveSectionId(sec.id);
                        setActiveScreenshot(scr);
                      }}
                      onOpenMobilePeek={(scr) => setMobilePeekScreen(scr)}
                    />
                  </section>
                );
              })}
            </div>

            {/* Prev / Next Article Navigation Cards */}
            <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <Link
                  href={prevArticle.url}
                  className="p-4 bg-[#141414] hover:bg-[#1C1C1C] border border-white/15 hover:border-[#E5FE00] transition-colors flex flex-col justify-between rounded-none group"
                >
                  <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                    <ChevronLeft className="w-3.5 h-3.5 text-[#E5FE00]" />
                    PREVIOUS GUIDE
                  </span>
                  <span className="font-display font-bold text-sm text-white group-hover:text-[#E5FE00] mt-1">
                    {prevArticle.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextArticle ? (
                <Link
                  href={nextArticle.url}
                  className="p-4 bg-[#141414] hover:bg-[#1C1C1C] border border-white/15 hover:border-[#E5FE00] transition-colors flex flex-col justify-between text-right rounded-none group"
                >
                  <span className="text-[11px] font-mono text-zinc-400 flex items-center justify-end gap-1">
                    NEXT GUIDE
                    <ChevronRight className="w-3.5 h-3.5 text-[#E5FE00]" />
                  </span>
                  <span className="font-display font-bold text-sm text-white group-hover:text-[#E5FE00] mt-1">
                    {nextArticle.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </article>

          {/* RIGHT COLUMN: Sticky Portrait Phone Viewer (4 cols on lg) */}
          <aside className="hidden lg:block lg:col-span-4 py-8 pl-2">
            <div className="sticky top-20 h-[calc(100vh-6rem)] flex flex-col bg-[#141414] border border-white/15 p-4 rounded-none">
              {/* Viewer Top Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/12">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#E5FE00]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    {ui.interactivePhoneTitle}
                  </span>
                </div>
                {activeScreenshot && (
                  <button
                    type="button"
                    onClick={() => setLightboxScreen(activeScreenshot)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#0A0A0A] hover:bg-[#1C1C1C] border border-white/15 hover:border-[#E5FE00] text-[11px] font-mono text-zinc-300 hover:text-[#E5FE00] cursor-pointer rounded-none"
                    title="Expand full-resolution screenshot"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>ZOOM</span>
                  </button>
                )}
              </div>

              {/* Center Phone Mockup Frame (Device frame exception allowed per blueprint) */}
              <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative py-2">
                {activeScreenshot ? (
                  <div className="relative h-full max-h-[540px] aspect-[9/19.2] bg-[#050505] rounded-[34px] border-[6px] border-zinc-800 shadow-[0_0_40px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col">
                    {/* Subtle Dynamic Island / Speaker Notch */}
                    <div className="h-5 bg-black flex items-center justify-center shrink-0">
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full" />
                    </div>
                    {/* Active Screenshot Viewport */}
                    <div
                      onClick={() => setLightboxScreen(activeScreenshot)}
                      className="flex-1 bg-[#0A0A0A] flex items-center justify-center overflow-hidden cursor-zoom-in relative"
                    >
                      <img
                        key={activeScreenshot.src}
                        src={activeScreenshot.src}
                        alt={activeScreenshot.alt || activeScreenshot.sectionTitle}
                        className="w-full h-full object-contain transition-opacity duration-300"
                      />
                    </div>
                    {/* Bottom Home Bar */}
                    <div className="h-4 bg-black flex items-center justify-center shrink-0">
                      <div className="w-24 h-1 bg-zinc-700 rounded-full" />
                    </div>
                  </div>
                ) : (
                  /* Conceptual / Legal Article Fallback Outline Viewer */
                  <div className="w-full h-full flex flex-col justify-between p-5 bg-[#0A0A0A] border border-white/12 rounded-none">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#E5FE00] mb-2">
                        <Layers className="w-4 h-4" />
                        <span>GUIDE SECTION OUTLINE</span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-4">
                        {ui.noScreensNote}
                      </p>
                      <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                        {article.sections.map((sec, idx) => (
                          <a
                            key={`${sec.id}-${idx}`}
                            href={`#doc-sec-${sec.id}`}
                            onClick={() => setActiveSectionId(sec.id)}
                            className={`block px-3 py-2 text-xs border-l-2 transition-colors ${
                              sec.id === activeSectionId
                                ? "border-l-[#E5FE00] bg-[#141414] text-[#E5FE00] font-semibold"
                                : "border-l-white/15 text-zinc-300 hover:text-white"
                            }`}
                          >
                            {sec.heading}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-zinc-500">
                      BANDMATH INTERACTIVE READER
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Step & Screen Switcher Pills */}
              {article.screenshots.length > 0 && (
                <div className="pt-3 mt-2 border-t border-white/12">
                  <div className="text-[11px] font-mono text-zinc-300 truncate mb-2">
                    <span className="text-[#E5FE00] font-bold mr-1.5">
                      ACTIVE:
                    </span>
                    {activeScreenshot?.alt || activeScreenshot?.sectionTitle}
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {article.screenshots.map((scr, idx) => {
                      const isSelected = activeScreenshot?.id === scr.id;
                      return (
                        <button
                          key={scr.id}
                          type="button"
                          onClick={() => {
                            setActiveScreenshot(scr);
                            setActiveSectionId(scr.sectionId);
                            const el = document.getElementById(
                              `doc-sec-${scr.sectionId}`
                            );
                            el?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }}
                          className={`px-2.5 py-1 text-[11px] font-mono shrink-0 border transition-colors cursor-pointer rounded-none ${
                            isSelected
                              ? "bg-[#E5FE00] text-black border-[#E5FE00] font-bold"
                              : "bg-[#0A0A0A] text-zinc-400 border-white/15 hover:text-white"
                          }`}
                        >
                          #{idx + 1} {scr.alt.slice(0, 18)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Full-Resolution Lightbox Modal (Desktop Zoom) */}
      {lightboxScreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxScreen(null)}
        >
          <div
            className="max-w-4xl w-full max-h-[90vh] bg-[#141414] border border-white/20 p-4 flex flex-col rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/15">
              <div>
                <span className="text-xs font-mono text-[#E5FE00] uppercase">
                  {lightboxScreen.sectionTitle}
                </span>
                <h3 className="font-display font-bold text-sm text-white">
                  {lightboxScreen.alt}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxScreen(null)}
                className="p-1.5 text-zinc-400 hover:text-white border border-white/15 cursor-pointer rounded-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-[#0A0A0A] p-2">
              <img
                src={lightboxScreen.src}
                alt={lightboxScreen.alt}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Peek Drawer (<1024px) */}
      {mobilePeekScreen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/85 flex items-end justify-center"
          onClick={() => setMobilePeekScreen(null)}
        >
          <div
            className="w-full max-h-[85vh] bg-[#141414] border-t-2 border-t-[#E5FE00] p-4 flex flex-col rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#E5FE00]" />
                <span className="font-display font-bold text-sm text-white">
                  {mobilePeekScreen.alt || mobilePeekScreen.sectionTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobilePeekScreen(null)}
                className="p-1.5 text-zinc-300 border border-white/15 rounded-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-[#0A0A0A] p-3">
              <img
                src={mobilePeekScreen.src}
                alt={mobilePeekScreen.alt}
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </KbShell>
  );
}
