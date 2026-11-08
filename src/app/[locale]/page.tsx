import React from "react";
import { notFound } from "next/navigation";
import { KbLandingClient } from "@/components/KbLandingClient";
import { SUPPORTED_LOCALES, SupportedLocale, normalizeLocale } from "@/lib/kb";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((l) => l !== "en").map((locale) => ({
    locale,
  }));
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!SUPPORTED_LOCALES.includes(rawLocale as SupportedLocale)) {
    notFound();
  }
  const locale = normalizeLocale(rawLocale);
  return <KbLandingClient locale={locale} />;
}
