import React from "react";
import { notFound } from "next/navigation";
import {
  SUPPORTED_LOCALES,
  SupportedLocale,
  findDocBySlug,
  getLocaleBundle,
  getPrevNextArticles,
  normalizeLocale,
} from "@/lib/kb";
import { DocArticleClient } from "@/components/DocArticleClient";

export function generateStaticParams() {
  const out: Array<{ locale: string; slug: string[] }> = [];
  for (const loc of SUPPORTED_LOCALES.filter((l) => l !== "en")) {
    const bundle = getLocaleBundle(loc);
    for (const art of bundle.articles) {
      out.push({
        locale: loc,
        slug: art.routeSegments,
      });
    }
  }
  return out;
}

export default async function LocalizedDocPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!SUPPORTED_LOCALES.includes(rawLocale as SupportedLocale)) {
    notFound();
  }
  const locale = normalizeLocale(rawLocale);
  const article = findDocBySlug(locale, slug);
  if (!article) {
    notFound();
  }

  const bundle = getLocaleBundle(locale);
  const { prev, next } = getPrevNextArticles(locale, article.id);

  return (
    <DocArticleClient
      locale={locale}
      article={article}
      categories={bundle.categories}
      rootArticles={bundle.rootArticles}
      prevArticle={prev}
      nextArticle={next}
    />
  );
}
