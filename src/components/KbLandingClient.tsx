"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Smartphone,
} from "lucide-react";
import {
  SupportedLocale,
  UI_STRINGS,
  getLocaleBundle,
} from "@/lib/kb";
import { KbShell } from "./KbShell";

interface KbLandingClientProps {
  locale: SupportedLocale;
}

export function KbLandingClient({ locale }: KbLandingClientProps) {
  const ui = UI_STRINGS[locale] || UI_STRINGS.en;
  const bundle = getLocaleBundle(locale);
  const [heroInput, setHeroInput] = useState("");
  const heroInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    heroInputRef.current?.focus();
  }, []);

  const triggerAskModal = (queryText: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("bandmath:open-ask-modal", {
          detail: { query: queryText },
        })
      );
    }
  };

  const firstGuideUrl =
    bundle.categories[0]?.articles[0]?.url ||
    (locale === "en"
      ? "/docs/Getting_Started/The_First_Tour"
      : `/${locale}/docs/Getting_Started/The_First_Tour`);

  return (
    <KbShell locale={locale}>
      {/* Hero Section: AI-First Support Hub */}
      <section className="relative border-b border-white/15 bg-gradient-to-b from-[#141414] to-[#0A0A0A] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-5">
            {ui.hubTitle}
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {ui.hubSubtitle}
          </p>

          {/* Hero Prompt Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              triggerAskModal(heroInput.trim());
            }}
            className="max-w-3xl mx-auto flex flex-col sm:flex-row items-stretch bg-[#0A0A0A] border-2 border-white/25 shadow-[0_0_50px_rgba(229,254,0,0.07)] transition-colors rounded-none"
          >
            <div className="flex-1 flex items-center px-5 py-3.5">
              <input
                ref={heroInputRef}
                type="text"
                autoFocus
                value={heroInput}
                maxLength={600}
                onChange={(e) => setHeroInput(e.target.value)}
                placeholder=""
                aria-label={ui.hubTitle}
                className="w-full bg-transparent text-sm sm:text-base text-white caret-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-4 bg-[#E5FE00] hover:bg-[#d4ec00] text-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors rounded-none shrink-0"
            >
              <span>{ui.askButton}</span>
            </button>
          </form>

          {/* Static 1-Line Localized Privacy Caption */}
          <p className="max-w-3xl mx-auto mt-2.5 text-[11px] text-zinc-500 leading-relaxed">
            {ui.privacyCaption}
          </p>

          {/* Browse the Knowledge Base Archive CTA */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={firstGuideUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#141414] hover:bg-[#1C1C1C] border border-[#E5FE00] text-sm font-display font-bold text-[#E5FE00] transition-colors rounded-none"
            >
              <BookOpen className="w-4 h-4" />
              <span>{ui.browseArchiveCta}</span>
            </Link>
            <Link
              href={locale === "en" ? "/docs/FAQ" : `/${locale}/docs/FAQ`}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#0A0A0A] hover:bg-[#141414] border border-white/20 text-sm font-display font-semibold text-zinc-200 hover:text-white transition-colors rounded-none"
            >
              <span>Read Full FAQ</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-[1600px] mx-auto py-14 px-4 sm:px-6">
        <div className="mb-8 pb-4 border-b border-white/15">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
            {ui.categoriesHeading}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Every guide includes our Sticky Right-Rail Phone Viewer that automatically crossfades app screens as you scroll.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundle.categories.map((cat) => {
            const totalScreens = cat.articles.reduce(
              (acc, a) => acc + a.screenshotCount,
              0
            );
            return (
              <div
                key={cat.id}
                className="bg-[#141414] border border-white/15 hover:border-white/30 p-6 flex flex-col justify-between rounded-none"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/12">
                    <h3 className="font-display font-bold text-lg text-white">
                      {cat.label}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-[#0A0A0A] border border-white/15 font-mono text-[10px] text-[#E5FE00] rounded-none">
                        {cat.articles.length} {ui.articlesCountLabel}
                      </span>
                      {totalScreens > 0 && (
                        <span className="px-2 py-0.5 bg-[#0A0A0A] border border-white/15 font-mono text-[10px] text-zinc-400 inline-flex items-center gap-1 rounded-none">
                          <Smartphone className="w-2.5 h-2.5 text-[#E5FE00]" />
                          {totalScreens}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {cat.articles.map((art) => (
                      <li key={art.id}>
                        <Link
                          href={art.url}
                          className="group flex items-center justify-between py-1.5 text-sm text-zinc-300 hover:text-[#E5FE00] transition-colors"
                        >
                          <span className="truncate pr-2">
                            {art.sidebarLabel}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 text-[#E5FE00] shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {cat.articles[0] && (
                  <Link
                    href={cat.articles[0].url}
                    className="pt-3 border-t border-white/10 text-xs font-mono font-bold text-[#E5FE00] hover:underline flex items-center justify-between"
                  >
                    <span>OPEN {cat.label.toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </KbShell>
  );
}
