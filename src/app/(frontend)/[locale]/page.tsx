import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import FrontPageTemplate from "@/components/templates/FrontPageTemplate";
import TopBanner from "@/components/TopBanner";
import { SITE_NAME } from "@/lib/constants";
import { prepareOpenGraphImages } from "@/lib/utils";
import { Locale } from "@/types/locales";
import configPromise from "@payload-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

export const dynamic = "force-static";
export const revalidate = 60;

type Props = {
  params: Promise<{ locale: Locale }>;
  preview: boolean;
};

async function getFrontPage({ params, preview = false }: Props) {
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

export default async function FrontPage(props: Props) {
  const { frontPage, error } = await getFrontPage(props);

  if (error) return <ErrorTemplate error={error as Error} />;
  if (!frontPage) return notFound();

  return (
    <>
      {props.preview && <TopBanner label="Preview" />}
      <Container>
        <Header />
        <FrontPageTemplate content={frontPage} />
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
