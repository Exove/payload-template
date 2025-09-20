import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import FrontPageTemplate from "@/components/templates/FrontPageTemplate";
import { SITE_NAME } from "@/lib/constants";
import { prepareOpenGraphImages } from "@/lib/utils";
import { Locale } from "@/types/locales";
import configPromise from "@payload-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

export const dynamic = "force-static";
export const revalidate = 60; // This is needed for dynamic components to update

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getFrontPage({ params }: Props) {
  const { locale } = await params;
  try {
    const isDraftMode = false; // Simplified for performance - no draft mode in static rendering
    const payload = await getPayload({
      config: configPromise,
    });

    const frontPage = await payload.findGlobal({
      slug: "front-page",
      locale: locale,
      draft: isDraftMode,
    });

    return { frontPage: frontPage, error: null };
  } catch (error) {
    console.error("Error fetching page:", error);

    return { frontPage: null, error: error as Error };
  }
}

export default async function FrontPage(props: Props) {
  const { frontPage, error } = await getFrontPage(props);

  if (error) {
    return <ErrorTemplate error={error} />;
  }
  if (!frontPage) {
    notFound();
  }

  return (
    <Container>
      <Header />
      <FrontPageTemplate content={frontPage} />
    </Container>
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
