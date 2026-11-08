"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  ExternalLink,
  Globe,
  Menu,
  X,
} from "lucide-react";
import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  SupportedLocale,
  UI_STRINGS,
} from "@/lib/kb";
import { AskBandMathModal } from "./AskBandMathModal";

interface KbShellProps {
  locale: SupportedLocale;
  children: React.ReactNode;
  onOpenMobileSidebar?: () => void;
  showMobileSidebarTrigger?: boolean;
}

export function KbShell({
  locale,
  children,
  onOpenMobileSidebar,
  showMobileSidebarTrigger = false,
}: KbShellProps) {
  const pathname = usePathname() || "/";
  const ui = UI_STRINGS[locale] || UI_STRINGS.en;

  const [askModalOpen, setAskModalOpen] = useState(false);
  const [initialModalQuery, setInitialModalQuery] = useState("");

  // Global Cmd+K / Ctrl+K shortcut & Esc listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setInitialModalQuery("");
        setAskModalOpen(true);
      } else if (e.key === "Escape" && askModalOpen) {
        setAskModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [askModalOpen]);

  // Listen for custom event from landing page Hero Prompt Box
  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const custom = e as CustomEvent<{ query?: string }>;
      setInitialModalQuery(custom.detail?.query || "");
      setAskModalOpen(true);
    };
    window.addEventListener("bandmath:open-ask-modal", handleCustomOpen);
    return () =>
      window.removeEventListener("bandmath:open-ask-modal", handleCustomOpen);
  }, []);

  // Compute localized target path when switching locales
  const buildLocaleHref = (targetLocale: SupportedLocale): string => {
    // Strip existing locale prefix if any
    const segments = pathname.split("/").filter(Boolean);
    if (
      segments.length > 0 &&
      SUPPORTED_LOCALES.includes(segments[0] as SupportedLocale)
    ) {
      segments.shift();
    }
    const cleanSubpath = segments.length > 0 ? `/${segments.join("/")}` : "";
    if (targetLocale === "en") {
      return cleanSubpath || "/";
    }
    return `/${targetLocale}${cleanSubpath}`;
  };

  const homeHref = locale === "en" ? "/" : `/${locale}`;
  const firstGuideHref =
    locale === "en"
      ? "/docs/Getting_Started/The_First_Tour"
      : `/${locale}/docs/Getting_Started/The_First_Tour`;
  const faqHref = locale === "en" ? "/docs/FAQ" : `/${locale}/docs/FAQ`;

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#F5F5F5]">
      {/* Sticky Brutalist-Glass Top Navbar */}
      <header className="sticky top-0 z-40 h-16 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/15">
        <div className="max-w-[1600px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Left: Mobile Sidebar Toggle + Logo + Primary Nav */}
          <div className="flex items-center gap-4">
            {showMobileSidebarTrigger && (
              <button
                type="button"
                onClick={onOpenMobileSidebar}
                className="lg:hidden p-2 bg-[#141414] border border-white/15 text-zinc-200 hover:text-[#E5FE00] cursor-pointer rounded-none"
                aria-label="Open documentation navigation"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            <Link
              href={homeHref}
              className="flex items-center gap-2.5 group"
            >
              <img
                src="/img/logo.png"
                alt="BandMath Logo"
                className="w-8 h-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-[#E5FE00] transition-colors leading-none">
                  BANDMATH
                </span>
                <span className="font-mono text-[10px] tracking-widest text-[#E5FE00] uppercase mt-0.5">
                  KNOWLEDGE BASE
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 ml-4 pl-4 border-l border-white/15 text-xs font-medium">
              <Link
                href={homeHref}
                className="px-3 py-1.5 text-zinc-300 hover:text-[#E5FE00] transition-colors"
              >
                AI Hub
              </Link>
              <Link
                href={firstGuideHref}
                className="px-3 py-1.5 text-zinc-300 hover:text-[#E5FE00] transition-colors"
              >
                Guides
              </Link>
              <Link
                href={faqHref}
                className="px-3 py-1.5 text-zinc-300 hover:text-[#E5FE00] transition-colors"
              >
                FAQ
              </Link>
              <a
                href="https://itsbandmath.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-zinc-300 hover:text-[#E5FE00] inline-flex items-center gap-1 transition-colors"
              >
                <span>{ui.MarketingSiteLink}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
              <a
                href="https://blog.itsbandmath.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-zinc-300 hover:text-[#E5FE00] inline-flex items-center gap-1 transition-colors"
              >
                <span>{ui.FounderBlogLink}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
              <a
                href="https://account.itsbandmath.com/joinbootstrappers"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-[#E5FE00] hover:underline inline-flex items-center gap-1 font-mono"
              >
                <span>{ui.BootstrappersLink}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </nav>
          </div>

          {/* Right: Search / ✨ Ask AI (⌘K) + 5-Locale Switcher */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setInitialModalQuery("");
                setAskModalOpen(true);
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-white/20 hover:border-[#E5FE00] text-xs text-white transition-colors cursor-pointer rounded-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E5FE00]" />
              <span className="font-medium">{ui.searchAskButton}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#0A0A0A] border border-white/15 text-zinc-400 rounded-none">
                ⌘K
              </kbd>
            </button>

            {/* Locale Switcher: EN | FR | DE | ES | PL */}
            <div className="hidden sm:flex items-center bg-[#141414] border border-white/15 p-0.5 rounded-none">
              <Globe className="w-3.5 h-3.5 text-zinc-400 mx-1.5" />
              {SUPPORTED_LOCALES.map((loc) => {
                const active = loc === locale;
                return (
                  <Link
                    key={loc}
                    href={buildLocaleHref(loc)}
                    className={`px-2 py-1 text-[11px] font-mono font-bold transition-colors rounded-none ${
                      active
                        ? "bg-[#E5FE00] text-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {LOCALE_LABELS[loc]}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Brutalist-Glass Footer with Bidirectional SEO Links */}
      <footer className="bg-[#0A0A0A] border-t border-white/15 py-10 px-4 sm:px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/img/logo.png"
                alt="BandMath"
                className="w-6 h-6 object-contain"
              />
              <span className="font-display font-bold text-sm text-white">
                BANDMATH KNOWLEDGE BASE
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1.5 max-w-md">
              Built for working musicians, independent venues, and tour managers. Zero spreadsheet chaos—100% mathematical precision.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-300">
            <a
              href="https://itsbandmath.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E5FE00] transition-colors"
            >
              Official Site (itsbandmath.com)
            </a>
            <a
              href="https://blog.itsbandmath.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E5FE00] transition-colors"
            >
              Founder&apos;s Blog & Chronicle (blog.itsbandmath.com)
            </a>
            <a
              href="https://account.itsbandmath.com/joinbootstrappers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E5FE00] font-medium hover:underline"
            >
              Join Bootstrapper&apos;s Club (€100 Lifetime)
            </a>
            <Link
              href={
                locale === "en"
                  ? "/docs/Terms_of_Service"
                  : `/${locale}/docs/Terms_of_Service`
              }
              className="hover:text-[#E5FE00] transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href={
                locale === "en"
                  ? "/docs/Privacy_Policy"
                  : `/${locale}/docs/Privacy_Policy`
              }
              className="hover:text-[#E5FE00] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href={
                locale === "en" ? "/docs/Support" : `/${locale}/docs/Support`
              }
              className="hover:text-[#E5FE00] transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </footer>

      {/* Ask BandMath AI & Instant Search Modal */}
      <AskBandMathModal
        isOpen={askModalOpen}
        onClose={() => setAskModalOpen(false)}
        locale={locale}
        initialQuery={initialModalQuery}
      />
    </div>
  );
}
