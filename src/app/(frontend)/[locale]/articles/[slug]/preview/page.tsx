import { Locale } from "@/types/locales";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import ArticlePage from "../page";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function PreviewPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { token } = await searchParams;

  if (token !== process.env.PREVIEW_SECRET) {
    notFound();
  }
  return ArticlePage({ params, preview: true });
}
