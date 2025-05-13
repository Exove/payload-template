import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import { SITE_NAME } from "@/lib/constants";
import { prepareOpenGraphImages } from "@/lib/utils";
import { Apartment, Building } from "@/payload-types";
import configPromise from "@payload-config";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

type Props = {
  params: Promise<{ locale: "fi" | "en"; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

interface BuildingFeature {
  feature: string;
}

interface ExtendedBuilding extends Building {
  apartments?: { value: Apartment }[];
  features?: BuildingFeature[];
}

async function getBuildingBySlug({ params }: Props) {
  try {
    const { slug, locale } = await params;
    const isDraftMode = false;

    const payload = await getPayload({
      config: configPromise,
    });

    const result = await payload.find({
      collection: "buildings",
      where: {
        slug: { equals: slug },
      },
      locale: locale,
      draft: isDraftMode,
      depth: 2,
    });

    return { building: result.docs[0] as ExtendedBuilding, error: null };
  } catch (error) {
    console.error("Error fetching building:", error);
    return { building: null, error: error as Error };
  }
}

export default async function BuildingPage(props: Props) {
  const { building, error } = await getBuildingBySlug(props);

  if (error) {
    return <ErrorTemplate error={error} />;
  }
  if (!building) {
    notFound();
  }

  const apartments = building.apartments
    ?.map((apt: { value: Apartment }) =>
      typeof apt === "object" && "value" in apt ? apt.value : null,
    )
    .filter((apt): apt is Apartment => apt !== null);

  return (
    <Container>
      <Header />
      <main id="main-content" className="mx-auto max-w-screen-lg py-16">
        <div className="mb-8">
          <Link href="/" className="mb-4 inline-block text-blue-600 hover:underline">
            ← Takaisin etusivulle
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {building.image && typeof building.image === "object" && building.image.url && (
            <div>
              <Image
                src={building.image.url}
                alt={building.title || ""}
                width={600}
                height={400}
                className="w-full rounded-lg object-cover"
              />
            </div>
          )}

          <div>
            <h1 className="mb-4 text-3xl font-bold">{building.title}</h1>

            {building.address && (
              <div className="mb-6">
                <p className="text-gray-600">
                  {building.address.street}, {building.address.postalCode} {building.address.city}
                </p>
              </div>
            )}

            {building.description && (
              <div className="mb-8">
                <h2 className="mb-2 text-xl font-bold">Kuvaus</h2>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: JSON.stringify(building.description) }} />
                </div>
              </div>
            )}

            {building.features && building.features.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-2 text-xl font-bold">Ominaisuudet</h2>
                <ul className="list-inside list-disc">
                  {building.features.map((feature: BuildingFeature, index: number) => (
                    <li key={index}>{feature.feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {apartments && apartments.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Asunnot</h2>
                <div className="grid gap-4">
                  {apartments.map((apartment) => (
                    <Link
                      key={apartment.id}
                      href={`/apartments/${apartment.slug}`}
                      className="block rounded-lg border p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{apartment.title}</p>
                          <p className="text-gray-600">
                            {apartment.size} m² • {apartment.rooms} h
                          </p>
                        </div>
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-sm ${
                            apartment.status === "available"
                              ? "bg-green-100 text-green-800"
                              : apartment.status === "reserved"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {apartment.status === "available"
                            ? "Saatavilla"
                            : apartment.status === "reserved"
                              ? "Varattu"
                              : "Myyty"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Container>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const { building } = await getBuildingBySlug(props);
    const openGraphImages = prepareOpenGraphImages(building?.image);

    return {
      title: building?.title ? `${building.title} | ${SITE_NAME}` : SITE_NAME,
      description: building?.description
        ? `${building.address?.street}, ${building.address?.postalCode} ${building.address?.city}`
        : undefined,
      openGraph: openGraphImages ? { images: openGraphImages } : undefined,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: SITE_NAME,
    };
  }
}
