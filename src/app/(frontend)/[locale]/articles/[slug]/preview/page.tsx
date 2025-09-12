import { Locale } from "@/types/locales";
import { notFound } from "next/navigation";
import ArticlePage from "../page";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function PreviewPage({ params, searchParams }: Props) {
  type ArticlePageProps = Parameters<typeof ArticlePage>[0];
  const { token } = await searchParams;
  const pageProps: ArticlePageProps = {
    params,
    preview: token === process.env.PREVIEW_SECRET,
  };
  if (token !== process.env.PREVIEW_SECRET) {
    notFound();
  }
  return ArticlePage(pageProps);
}
