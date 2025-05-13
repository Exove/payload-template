import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import FrontPageTemplate from "@/components/templates/FrontPageTemplate";
import { SITE_NAME } from "@/lib/constants";
import { prepareOpenGraphImages } from "@/lib/utils";
import configPromise from "@payload-config";
// import * as Sentry from "@sentry/nextjs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

type Props = {
  params: Promise<{ locale: "fi" | "en" }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getFrontPage({ params }: Props) {
  try {
    const { locale } = await params;
    const isDraftMode = false; // Simplified for performance - no draft mode in static rendering

    const payload = await getPayload({
      config: configPromise,
    });

    const [frontPage, buildingsResult] = await Promise.all([
      payload.findGlobal({
        slug: "front-page",
        locale: locale,
        draft: isDraftMode,
      }),
      payload.find({
        collection: "buildings",
        locale: locale,
        draft: isDraftMode,
        depth: 2,
      }),
    ]);

    const buildings = buildingsResult.docs;

    // Fetch apartments for each building
    const apartmentsResult = await payload.find({
      collection: "apartments",
      locale: locale,
      draft: isDraftMode,
      depth: 2,
    });

    const apartmentsByBuilding = buildings.map((building) => ({
      ...building,
      apartments: apartmentsResult.docs.filter(
        (apartment) =>
          apartment.building &&
          typeof apartment.building === "object" &&
          "value" in apartment.building &&
          (typeof apartment.building.value === "number"
            ? apartment.building.value === building.id
            : typeof apartment.building.value === "object" &&
              "id" in apartment.building.value &&
              apartment.building.value.id === building.id),
      ),
    }));

    return { frontPage: frontPage, buildings: apartmentsByBuilding, error: null };
  } catch (error) {
    console.error("Error fetching page:", error);
    // Sentry.captureException(error);
    return { frontPage: null, buildings: [], error: error as Error };
  }
}

export default async function FrontPage(props: Props) {
  const { frontPage, buildings, error } = await getFrontPage(props);

  if (error) {
    return <ErrorTemplate error={error} />;
  }
  if (!frontPage) {
    notFound();
  }

  return (
    <Container>
      <Header />
      <FrontPageTemplate content={frontPage} buildings={buildings} />
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
    // Sentry.captureException(error);
    return {
      title: SITE_NAME,
    };
  }
}
