"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  Copy,
  Info,
  Lightbulb,
  ShieldAlert,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import { DocScreenshot } from "@/lib/kb";

function SupportEmailCopySpan() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("support@itsbandmath.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 font-semibold text-[#E5FE00] underline decoration-[#E5FE00]/60 underline-offset-4 hover:text-white cursor-pointer"
      title="Click to copy support@itsbandmath.com"
    >
      <span>{copied ? "Copied!" : "support@itsbandmath.com"}</span>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function renderInlineMarkdown(text: string): React.ReactNode[] {
  // Handle support email MDX snippet if present
  const supportSpanRegex = /<span[^>]*support\{'@'\}itsbandmath\.com<\/span>/g;
  if (supportSpanRegex.test(text)) {
    const parts = text.split(supportSpanRegex);
    const out: React.ReactNode[] = [];
    parts.forEach((p, idx) => {
      out.push(...renderInlineMarkdown(p));
      if (idx < parts.length - 1) {
        out.push(<SupportEmailCopySpan key={`support-${idx}`} />);
      }
    });
    return out;
  }

  // Strip raw HTML tags like <br/> or <strong> while preserving text
  const cleaned = text.replace(/<br\s*\/?>/gi, " ");

  const tokenRegex =
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = cleaned.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-white">
          {renderInlineMarkdown(part.slice(2, -2))}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={idx} className="italic text-zinc-200">
          {renderInlineMarkdown(part.slice(1, -1))}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={idx}
          className="bg-[#1C1C1C] border border-white/15 px-1.5 py-0.5 text-[0.85em] font-mono text-[#E5FE00] rounded-none"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      if (isExternal) {
        return (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#E5FE00] underline decoration-[#E5FE00]/50 underline-offset-4 hover:decoration-[#E5FE00]"
          >
            {renderInlineMarkdown(label)}
          </a>
        );
      }
      return (
        <Link
          key={idx}
          href={href}
          className="font-medium text-[#E5FE00] underline decoration-[#E5FE00]/50 underline-offset-4 hover:decoration-[#E5FE00]"
        >
          {renderInlineMarkdown(label)}
        </Link>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

interface MarkdownBlocksProps {
  content: string;
  onSelectScreenshot?: (screen: DocScreenshot) => void;
  onOpenMobilePeek?: (screen: DocScreenshot) => void;
  sectionScreenshots?: DocScreenshot[];
  mobileButtonLabel?: string;
}

export function MarkdownBlocks({
  content,
  onSelectScreenshot,
  onOpenMobilePeek,
  sectionScreenshots = [],
  mobileButtonLabel = "📱 View Screen",
}: MarkdownBlocksProps) {
  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  let i = 0;
  let screenCursor = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Code fence ```
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div
          key={`code-${i}`}
          className="my-4 bg-[#111111] border border-white/15 p-4 overflow-x-auto rounded-none"
        >
          {lang && (
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
              {lang}
            </div>
          )}
          <pre className="text-xs sm:text-sm font-mono text-zinc-200 leading-relaxed m-0">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // 2. Docusaurus Admonition :::note / :::tip / :::info / :::warning / :::danger
    const admMatch = trimmed.match(/^:::(note|tip|info|warning|danger|caution)(?:\s+(.*))?$/i);
    if (admMatch) {
      const kind = admMatch[1].toLowerCase();
      const customTitle = admMatch[2]?.trim();
      const admLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") {
        admLines.push(lines[i]);
        i++;
      }
      i++; // skip closing :::

      const styles: Record<
        string,
        { border: string; bg: string; badge: string; label: string; Icon: React.ComponentType<{ className?: string }> }
      > = {
        note: {
          border: "border-l-4 border-l-zinc-300 border border-white/12",
          bg: "bg-[#141414]",
          badge: "text-zinc-200",
          label: customTitle || "NOTE",
          Icon: Info,
        },
        info: {
          border: "border-l-4 border-l-sky-400 border border-white/12",
          bg: "bg-[#141414]",
          badge: "text-sky-400",
          label: customTitle || "INFO",
          Icon: Info,
        },
        tip: {
          border: "border-l-4 border-l-[#E5FE00] border border-white/12",
          bg: "bg-[#141414]",
          badge: "text-[#E5FE00]",
          label: customTitle || "PRO TIP",
          Icon: Lightbulb,
        },
        warning: {
          border: "border-l-4 border-l-amber-400 border border-white/12",
          bg: "bg-[#141414]",
          badge: "text-amber-400",
          label: customTitle || "WARNING",
          Icon: AlertTriangle,
        },
        caution: {
          border: "border-l-4 border-l-amber-400 border border-white/12",
          bg: "bg-[#141414]",
          badge: "text-amber-400",
          label: customTitle || "CAUTION",
          Icon: AlertTriangle,
        },
        danger: {
          border: "border-l-4 border-l-red-500 border border-white/12",
          bg: "bg-[#141414]",
          badge: "text-red-400",
          label: customTitle || "IMPORTANT",
          Icon: ShieldAlert,
        },
      };

      const st = styles[kind] || styles.note;
      const IconComp = st.Icon;

      elements.push(
        <div
          key={`adm-${i}`}
          className={`my-5 p-4 rounded-none ${st.bg} ${st.border}`}
        >
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 ${st.badge}`}>
            <IconComp className="w-4 h-4 shrink-0" />
            <span>{st.label}</span>
          </div>
          <div className="text-sm text-zinc-300 leading-relaxed space-y-2">
            <MarkdownBlocks content={admLines.join("\n")} />
          </div>
        </div>
      );
      continue;
    }

    // 3. Exclusive FAQ Accordion <details name="faq_accordion">
    if (trimmed.startsWith("<details")) {
      const detailLines: string[] = [rawLine];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("</details>")) {
        detailLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        detailLines.push(lines[i]);
        i++;
      }
      const blockStr = detailLines.join("\n");
      const summaryMatch = blockStr.match(/<summary>([\s\S]*?)<\/summary>/i);
      const summaryText = summaryMatch ? summaryMatch[1].trim() : "Details";
      const innerBody = blockStr
        .replace(/<details[^>]*>/i, "")
        .replace(/<summary>[\s\S]*?<\/summary>/i, "")
        .replace(/<\/details>/i, "")
        .trim();

      elements.push(
        <details
          key={`details-${i}`}
          name="faq_accordion"
          className="group my-3 bg-[#141414] border border-white/12 open:border-[#E5FE00] rounded-none transition-colors"
        >
          <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-5 py-4 font-display font-semibold text-white hover:text-[#E5FE00]">
            <span>{summaryText}</span>
            <ChevronRight className="w-4 h-4 text-[#E5FE00] shrink-0 transition-transform group-open:rotate-90" />
          </summary>
          <div className="px-5 pb-5 pt-2 border-t border-white/10 text-sm text-zinc-300 leading-relaxed">
            <MarkdownBlocks content={innerBody} />
          </div>
        </details>
      );
      continue;
    }

    // 4. Markdown or HTML Image -> Trigger button for Sticky Right-Rail Phone Viewer (Desktop) & Peek Drawer (Mobile)
    const mdImgSingle = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    const htmlImgSingle = trimmed.match(/^<img[^>]+src=["']([^"']+)["'][^>]*>$/);
    if (mdImgSingle || htmlImgSingle) {
      const matchedScreen =
        sectionScreenshots[screenCursor] ||
        ({
          id: `inline-${i}`,
          sectionId: "overview",
          sectionTitle: mdImgSingle ? mdImgSingle[1] : "App Screen",
          alt: mdImgSingle ? mdImgSingle[1] : "App Screen",
          src: mdImgSingle ? mdImgSingle[2] : htmlImgSingle![1],
        } satisfies DocScreenshot);
      screenCursor++;
      i++;

      elements.push(
        <div key={`img-trigger-${i}`} className="my-3 flex flex-wrap items-center gap-2">
          {/* Desktop indicator pill that syncs with Sticky Right-Rail Phone Viewer */}
          <button
            type="button"
            onClick={() => onSelectScreenshot?.(matchedScreen)}
            className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 bg-[#141414] hover:bg-[#1C1C1C] border border-white/15 hover:border-[#E5FE00] text-xs font-mono text-zinc-300 hover:text-[#E5FE00] transition-colors cursor-pointer rounded-none"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#E5FE00]" />
            <span>{matchedScreen.alt || "Inspect in Right-Rail Phone Viewer"}</span>
          </button>

          {/* Mobile/Tablet (<1024px) compact inline peek button */}
          <button
            type="button"
            onClick={() => onOpenMobilePeek?.(matchedScreen)}
            className="inline-flex lg:hidden items-center gap-2 px-3.5 py-2 bg-[#141414] active:bg-[#1C1C1C] border border-[#E5FE00]/60 text-xs font-mono font-semibold text-[#E5FE00] rounded-none"
          >
            <span>{mobileButtonLabel}:</span>
            <span className="text-white font-sans font-normal">
              {matchedScreen.alt || matchedScreen.sectionTitle}
            </span>
          </button>
        </div>
      );
      continue;
    }

    // 5. Markdown Table
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim().startsWith("|") &&
        lines[i].trim().endsWith("|")
      ) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const parseRow = (row: string) =>
          row
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim());
        const headers = parseRow(tableLines[0]);
        const bodyRows = tableLines
          .slice(2)
          .map(parseRow);

        elements.push(
          <div key={`table-${i}`} className="my-5 overflow-x-auto border border-white/15 rounded-none">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#141414] border-b border-white/15">
                  {headers.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="px-4 py-3 font-display font-semibold text-white text-xs uppercase tracking-wider"
                    >
                      {renderInlineMarkdown(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="bg-[#0A0A0A] hover:bg-[#141414]/60">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-3 text-zinc-300 align-top">
                        {renderInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 6. Subheadings (H3/H4 inside a section)
    const subHeadingMatch = trimmed.match(/^(#{3,4})\s+(.+)$/);
    if (subHeadingMatch) {
      const level = subHeadingMatch[1].length;
      const text = subHeadingMatch[2].trim();
      i++;
      elements.push(
        level === 3 ? (
          <h3
            key={`h3-${i}`}
            className="font-display text-lg font-bold text-white mt-6 mb-2"
          >
            {renderInlineMarkdown(text)}
          </h3>
        ) : (
          <h4
            key={`h4-${i}`}
            className="font-display text-base font-semibold text-zinc-200 mt-4 mb-1.5"
          >
            {renderInlineMarkdown(text)}
          </h4>
        )
      );
      continue;
    }

    // 7. Unordered List (* or -)
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-3 space-y-2 pl-5 list-disc marker:text-[#E5FE00]">
          {items.map((item, idx) => (
            <li key={idx} className="text-zinc-300 leading-relaxed text-[15px]">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 8. Ordered List (1. 2. etc.)
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: Array<{ num: string; text: string }> = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const m = lines[i].trim().match(/^(\d+)\.\s+(.*)$/);
        if (m) {
          items.push({ num: m[1], text: m[2] });
        }
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-3 space-y-2.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-zinc-300 leading-relaxed text-[15px]">
              <span className="inline-flex items-center justify-center w-6 h-6 shrink-0 bg-[#141414] border border-white/15 font-mono text-xs font-bold text-[#E5FE00] mt-0.5 rounded-none">
                {item.num}
              </span>
              <div className="flex-1">{renderInlineMarkdown(item.text)}</div>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 9. Horizontal rule
    if (/^---+$/.test(trimmed)) {
      i++;
      elements.push(<hr key={`hr-${i}`} className="my-6 border-white/12" />);
      continue;
    }

    // 10. Blockquote >
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className="my-4 pl-4 border-l-2 border-[#E5FE00] italic text-zinc-300 text-sm"
        >
          {renderInlineMarkdown(quoteLines.join(" "))}
        </blockquote>
      );
      continue;
    }

    // 11. Standard paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith(":::") &&
      !lines[i].trim().startsWith("<details") &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("|") &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^!\[([^\]]*)\]\(([^)]+)\)$/.test(lines[i].trim()) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      elements.push(
        <p key={`p-${i}`} className="my-3 text-zinc-300 leading-relaxed text-[15px]">
          {renderInlineMarkdown(paraLines.join(" "))}
        </p>
      );
    } else {
      i++;
    }
  }

  return <>{elements}</>;
}
