import { redirect } from "next/navigation";
import { normalizeLocale } from "@/lib/kb";

export default async function LocalizedDocsIndexRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  if (locale === "en") {
    redirect("/docs/Getting_Started/The_First_Tour");
  }
  redirect(`/${locale}/docs/Getting_Started/The_First_Tour`);
}
