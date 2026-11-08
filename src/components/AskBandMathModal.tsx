"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Send,
  X,
  BookOpen,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  SupportedLocale,
  UI_STRINGS,
  getLocaleBundle,
} from "@/lib/kb";
import { MarkdownBlocks } from "./MarkdownRenderer";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
  sig?: string;
  citations?: Array<{ title: string; url: string; category: string }>;
}

interface AskBandMathModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: SupportedLocale;
  initialQuery?: string;
}

export function AskBandMathModal({
  isOpen,
  onClose,
  locale,
  initialQuery = "",
}: AskBandMathModalProps) {
  const ui = UI_STRINGS[locale] || UI_STRINGS.en;
  const bundle = getLocaleBundle(locale);

  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const lastDispatchedQueryRef = useRef<string>("");

  const submitQuestion = async (questionText: string) => {
    const trimmed = questionText.trim().slice(0, 600);
    if (!trimmed || loading) return;

    const nextUserTurn: ChatTurn = { role: "user", content: trimmed };
    const updatedTurns = [...turns, nextUserTurn];
    setTurns(updatedTurns);
    setInput("");
    setError(null);
    setLoading(true);
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = 0;
    }

    try {
      const res = await fetch("/api/kb-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          message: trimmed,
          history: turns.map((t) => ({
            role: t.role,
            content: t.content,
            sig: t.sig,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to reach Ask BandMath right now.");
      } else {
        setTurns([
          ...updatedTurns,
          {
            role: "assistant",
            content: data.reply,
            sig: data.sig,
            citations: data.citations || [],
          },
        ]);
      }
    } catch {
      setError("Network error while contacting Ask BandMath.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      if (
        initialQuery &&
        initialQuery.trim() !== "" &&
        initialQuery !== lastDispatchedQueryRef.current
      ) {
        lastDispatchedQueryRef.current = initialQuery;
        submitQuestion(initialQuery);
      }
    } else {
      lastDispatchedQueryRef.current = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialQuery]);

  // Quick instant title filter while typing
  const matchingGuides =
    input.trim().length >= 2
      ? bundle.articles
          .filter(
            (a) =>
              a.title.toLowerCase().includes(input.toLowerCase()) ||
              a.categoryLabel.toLowerCase().includes(input.toLowerCase())
          )
          .slice(0, 4)
      : [];

  if (!isOpen) return null;

  // Group turns into Q&A exchanges and reverse so the newest exchange is always at the top
  const exchanges: ChatTurn[][] = [];
  for (let i = 0; i < turns.length; i++) {
    const t = turns[i];
    if (t.role === "user") {
      const next = turns[i + 1];
      if (next && next.role === "assistant") {
        exchanges.push([t, next]);
        i++;
      } else {
        exchanges.push([t]);
      }
    } else {
      exchanges.push([t]);
    }
  }
  const newestFirstExchanges = [...exchanges].reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 sm:pt-16 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#0A0A0A] border border-white/20 shadow-2xl rounded-none overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#141414] border-b border-white/15">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#E5FE00]" />
            <span className="font-display font-bold text-sm uppercase tracking-wider text-white">
              BandMath Instant Search Guide
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white border border-transparent hover:border-white/15 cursor-pointer rounded-none"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitQuestion(input);
          }}
          className="flex items-center border-b border-white/15 bg-[#0A0A0A]"
        >
          <div className="pl-4 text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            maxLength={600}
            onChange={(e) => setInput(e.target.value)}
            placeholder={ui.askPlaceholder}
            className="flex-1 bg-transparent px-3.5 py-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="mr-3 px-4 py-2 bg-[#E5FE00] hover:bg-[#d4ec00] disabled:opacity-40 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-none"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{ui.askButton}</span>
          </button>
        </form>

        {/* Instant Guide Title Matches while typing */}
        {matchingGuides.length > 0 && (
          <div className="px-5 py-3 bg-[#111111] border-b border-white/12">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Direct Guide Matches
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matchingGuides.map((g) => (
                <Link
                  key={g.id}
                  href={g.url}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-white/10 hover:border-[#E5FE00] text-xs text-white transition-colors rounded-none"
                >
                  <span className="truncate font-medium">{g.title}</span>
                  <span className="text-[10px] font-mono text-[#E5FE00] ml-2 shrink-0">
                    {g.categoryLabel}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Conversation Body (Newest Exchange First at Top) */}
        <div
          ref={conversationContainerRef}
          className="max-h-[65vh] overflow-y-auto p-5 space-y-6"
        >
          {turns.length === 0 && !loading && (
            <div className="py-6 text-center text-xs font-mono text-zinc-500">
              Type a question above or search any guide title to get started.
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-950/40 border border-red-500/50 text-xs text-red-200 rounded-none">
              {error}
            </div>
          )}

          {newestFirstExchanges.map((pair, exIdx) => {
            const isLatestPending =
              exIdx === 0 && loading && pair.length === 1 && pair[0].role === "user";
            return (
              <div
                key={`exchange-${exchanges.length - exIdx}`}
                className="space-y-3"
              >
                {pair.map((turn, tIdx) => (
                  <div
                    key={tIdx}
                    className={
                      turn.role === "user"
                        ? "bg-[#141414] border border-white/15 p-3.5 rounded-none"
                        : "bg-[#111111] border-l-4 border-l-[#E5FE00] border border-white/15 p-4 rounded-none"
                    }
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#E5FE00]">
                        {turn.role === "user" ? "YOU" : "BANDMATH GUIDE"}
                      </span>
                    </div>
                    {turn.role === "user" ? (
                      <p className="text-sm text-white font-medium m-0">
                        {turn.content}
                      </p>
                    ) : (
                      <div className="text-sm text-zinc-200">
                        <MarkdownBlocks content={turn.content} />
                        {turn.citations && turn.citations.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-white/10">
                            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                              Verified Source Guides
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {turn.citations.map((cit, cIdx) => (
                                <Link
                                  key={cIdx}
                                  href={cit.url}
                                  onClick={onClose}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#141414] hover:bg-[#1C1C1C] border border-white/15 hover:border-[#E5FE00] text-xs text-[#E5FE00] rounded-none"
                                >
                                  <BookOpen className="w-3 h-3" />
                                  <span>{cit.title}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isLatestPending && (
                  <div className="flex items-center gap-3 p-4 bg-[#141414] border-l-4 border-l-[#E5FE00] border border-white/15 text-xs font-mono text-[#E5FE00] rounded-none">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching BandMath Knowledge Base...</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-[#141414] border-t border-white/12 flex items-center justify-end text-[11px] text-zinc-400">
          <span>
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-[#0A0A0A] border border-white/15 font-mono text-zinc-300">
              ESC
            </kbd>{" "}
            to close
          </span>
        </div>
      </div>
    </div>
  );
}
