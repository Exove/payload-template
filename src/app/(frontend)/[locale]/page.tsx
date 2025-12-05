import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import FrontPageTemplate from "@/components/templates/FrontPageTemplate";
import TopBanner from "@/components/TopBanner";
import { SITE_NAME } from "@/lib/constants";
import { getMostReadArticles } from "@/lib/get-most-read-articles";
import { prepareOpenGraphImages } from "@/lib/utils";
import { Locale } from "@/types/locales";
import configPromise from "@payload-config";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

export const dynamic = "force-static";
export const revalidate = 60;

type Props = {
  params: Promise<{ locale: Locale }>;
};

async function getFrontPage({ params }: Props, preview = false) {
  const { locale } = await params;
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const frontPage = await payload.findGlobal({
      slug: "front-page",
      locale: locale,
      draft: preview,
    });

    return { frontPage: frontPage, error: null };
  } catch (error) {
    console.error("Error fetching page:", error);

    return { frontPage: null, error: error as Error };
  }
}

export default async function FrontPage({ params }: Props, preview = false) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { frontPage, error } = await getFrontPage({ params }, preview);
  const { articles: mostReadArticles } = await getMostReadArticles({
    days: 100,
    limit: 5,
    locale,
  });

  if (error) return <ErrorTemplate error={error as Error} />;
  if (!frontPage) return notFound();

  return (
    <>
      {preview && <TopBanner label="Preview" />}
      <Container>
        <Header />
        <FrontPageTemplate content={frontPage} mostReadArticles={mostReadArticles} />
      </Container>
    </>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const { frontPage } = await getFrontPage(props);
    const openGraphImages = prepareOpenGraphImages(frontPage?.meta?.image);

    return {
      title: frontPage?.meta?.title || SITE_NAME,
      description: frontPage?.meta?.description,
      openGraph: openGraphImages ? { images: openGraphImages } : undefined,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    return {
      title: SITE_NAME,
    };
  }
}
