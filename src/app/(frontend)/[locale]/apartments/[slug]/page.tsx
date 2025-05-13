import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import { SITE_NAME } from "@/lib/constants";
import { prepareOpenGraphImages } from "@/lib/utils";
import { Building } from "@/payload-types";
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

async function getApartmentBySlug({ params }: Props) {
  try {
    const { slug, locale } = await params;
    const isDraftMode = false;

    const payload = await getPayload({
      config: configPromise,
    });

    const result = await payload.find({
      collection: "apartments",
      where: {
        slug: { equals: slug },
      },
      locale: locale,
      draft: isDraftMode,
      depth: 2,
    });

    return { apartment: result.docs[0], error: null };
  } catch (error) {
    console.error("Error fetching apartment:", error);
    return { apartment: null, error: error as Error };
  }
}

export default async function ApartmentPage(props: Props) {
  const { apartment, error } = await getApartmentBySlug(props);

  if (error) {
    return <ErrorTemplate error={error} />;
  }
  if (!apartment) {
    notFound();
  }

  const building =
    apartment.building && typeof apartment.building === "object" && "value" in apartment.building
      ? (apartment.building.value as Building)
      : null;

  return (
    <Container>
      <Header />
      <main id="main-content" className="mx-auto max-w-screen-lg py-16">
        <div className="mb-8">
          <Link href="/" className="mb-4 inline-block text-blue-600 hover:underline">
            ← Takaisin etusivulle
          </Link>
          {building && (
            <Link
              href={`/buildings/${building.slug}`}
              className="ml-4 text-blue-600 hover:underline"
            >
              ← Takaisin rakennuksen sivulle
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {apartment.image && typeof apartment.image === "object" && apartment.image.url && (
            <div>
              <Image
                src={apartment.image.url}
                alt={apartment.title || ""}
                width={600}
                height={400}
                className="w-full rounded-lg object-cover"
              />
            </div>
          )}

          <div>
            <h1 className="mb-4 text-3xl font-bold">{apartment.title}</h1>

            <div className="mb-6">
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

            <div className="mb-8 grid grid-cols-2 gap-4">
              {apartment.size && (
                <div className="border-b pb-2">
                  <p className="text-gray-600">Koko</p>
                  <p className="font-semibold">{apartment.size} m²</p>
                </div>
              )}
              {apartment.rooms && (
                <div className="border-b pb-2">
                  <p className="text-gray-600">Huoneet</p>
                  <p className="font-semibold">{apartment.rooms} h</p>
                </div>
              )}
              {apartment.floor && (
                <div className="border-b pb-2">
                  <p className="text-gray-600">Kerros</p>
                  <p className="font-semibold">{apartment.floor}</p>
                </div>
              )}
              {apartment.price && (
                <div className="border-b pb-2">
                  <p className="text-gray-600">Hinta</p>
                  <p className="font-semibold">{apartment.price.toLocaleString()} €</p>
                </div>
              )}
            </div>

            {building && (
              <div className="mb-8">
                <h2 className="mb-2 text-xl font-bold">Rakennus</h2>
                <Link href={`/buildings/${building.slug}`} className="hover:underline">
                  <p className="font-semibold">{building.title}</p>
                </Link>
                {building.address && (
                  <p className="text-gray-600">
                    {building.address.street}, {building.address.postalCode} {building.address.city}
                  </p>
                )}
              </div>
            )}

            {apartment.features && apartment.features.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-2 text-xl font-bold">Ominaisuudet</h2>
                <ul className="list-inside list-disc">
                  {apartment.features.map((feature, index) => (
                    <li key={index}>{feature.feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {apartment.description && (
              <div>
                <h2 className="mb-2 text-xl font-bold">Kuvaus</h2>
                <div className="prose max-w-none">
                  {/* Tässä olisi hyvä olla richtext-renderöinti */}
                  <div
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(apartment.description) }}
                  />
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
    const { apartment } = await getApartmentBySlug(props);
    const openGraphImages = prepareOpenGraphImages(apartment?.image);

    return {
      title: apartment?.title ? `${apartment.title} | ${SITE_NAME}` : SITE_NAME,
      description: apartment?.description
        ? `${apartment.size} m², ${apartment.rooms} h`
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
