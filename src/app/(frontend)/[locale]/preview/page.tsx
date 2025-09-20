import { Locale } from "@/types/locales";
import { notFound } from "next/navigation";
import FrontPage from "../page";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function PreviewFrontPage({ params, searchParams }: Props) {
  type FrontPageProps = Parameters<typeof FrontPage>[0];
  const { token } = await searchParams;
  const pageProps: FrontPageProps = {
    params,
    preview: token === process.env.PREVIEW_SECRET,
  };
  if (token !== process.env.PREVIEW_SECRET) {
    notFound();
  }
  return FrontPage(pageProps);
}
