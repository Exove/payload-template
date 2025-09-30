import { Locale } from "@/types/locales";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import FrontPage from "../page";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function PreviewFrontPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { token } = await searchParams;

  if (token !== process.env.PREVIEW_SECRET) {
    notFound();
  }
  return FrontPage({ params }, true);
}
