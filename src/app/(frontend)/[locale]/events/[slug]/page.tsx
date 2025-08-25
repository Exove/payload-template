import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import EventTemplate, { getEventOpenGraphImages } from "@/components/templates/EventTemplate";
import { SITE_NAME } from "@/lib/constants";
import { Event } from "@/payload-types";
import configPromise from "@payload-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

type Props = {
  params: Promise<{ locale: "fi" | "en"; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getEventBySlug({ params }: Props) {
  try {
    const { slug, locale } = await params;
    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
      collection: "events",
      where: { slug: { equals: slug } },
      locale,
      draft: false,
    });

    return { event: result.docs[0] as Event | undefined, error: null };
  } catch (error) {
    console.error("Error fetching event:", error);
    return { event: null, error: error as Error };
  }
}

export default async function EventPage(props: Props) {
  const { event, error } = await getEventBySlug(props);

  if (error) {
    console.error("Error fetching event:", error);
    return <ErrorTemplate error={error} />;
  }

  if (!event) {
    notFound();
  }

  return (
    <Container>
      <Header />
      <EventTemplate event={event as Event} />
    </Container>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { event } = await getEventBySlug(props);
  const openGraphImages = event ? getEventOpenGraphImages(event as Event) : undefined;

  return {
    title:
      (event?.meta?.title as string) || `${(event?.title as string) || "Event"} | ${SITE_NAME}`,
    description: (event?.meta?.description as string) || (event?.description as string),
    openGraph: openGraphImages ? { images: openGraphImages } : undefined,
  };
}
