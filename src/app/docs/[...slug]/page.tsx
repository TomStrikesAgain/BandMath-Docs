import React from "react";
import { notFound } from "next/navigation";
import {
  findDocBySlug,
  getLocaleBundle,
  getPrevNextArticles,
} from "@/lib/kb";
import { DocArticleClient } from "@/components/DocArticleClient";

export function generateStaticParams() {
  const bundle = getLocaleBundle("en");
  return bundle.articles.map((art) => ({
    slug: art.routeSegments,
  }));
}

export default async function EnglishDocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const article = findDocBySlug("en", slug);
  if (!article) {
    notFound();
  }

  const bundle = getLocaleBundle("en");
  const { prev, next } = getPrevNextArticles("en", article.id);

  return (
    <DocArticleClient
      locale="en"
      article={article}
      categories={bundle.categories}
      rootArticles={bundle.rootArticles}
      prevArticle={prev}
      nextArticle={next}
    />
  );
}
