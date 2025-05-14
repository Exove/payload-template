import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import { Link } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/constants";
import { prepareOpenGraphImages } from "@/lib/utils";
import { Building } from "@/payload-types";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import configPromise from "@payload-config";
import { Metadata } from "next";
import Image from "next/image";
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
        <div className="mb-12">
          {building && (
            <Link
              href={`/buildings/${building.slug}`}
              className="flex items-center text-blue-600 transition-all hover:text-blue-800"
            >
              <ChevronLeftIcon className="mr-2 h-4 w-4 stroke-2" />
              Takaisin rakennuksen sivulle
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {apartment.image && typeof apartment.image === "object" && apartment.image.url && (
            <Image
              src={apartment.image.url}
              alt={apartment.title || ""}
              width={600}
              height={400}
              className="h-[450px] w-full rounded-xl object-cover"
            />
          )}

          <div>
            <h1 className="mb-6 text-4xl font-bold text-gray-900">{apartment.title}</h1>

            <div className="mb-8">
              <span
                className={`inline-block rounded-full px-5 py-2 text-sm font-medium ${
                  apartment.status === "available"
                    ? "bg-green-100/80 text-green-800"
                    : apartment.status === "reserved"
                      ? "bg-yellow-100/80 text-yellow-800"
                      : "bg-red-100/80 text-red-800"
                }`}
              >
                {apartment.status === "available"
                  ? "Saatavilla"
                  : apartment.status === "reserved"
                    ? "Varattu"
                    : "Myyty"}
              </span>
            </div>

            <div className="mb-10 grid grid-cols-2 gap-6">
              {apartment.size && (
                <div className="rounded-xl border border-gray-200 bg-gray-100 p-5 transition-all">
                  <p className="text-sm text-gray-600">Koko</p>
                  <p className="text-lg font-semibold text-gray-900">{apartment.size} m²</p>
                </div>
              )}
              {apartment.rooms && (
                <div className="bor rounded-xl border bg-gray-100 p-5 transition-all">
                  <p className="text-sm text-gray-600">Huoneet</p>
                  <p className="text-lg font-semibold text-gray-900">{apartment.rooms} h</p>
                </div>
              )}
              {apartment.floor && (
                <div className="bor rounded-xl border bg-gray-100 p-5 transition-all">
                  <p className="text-sm text-gray-600">Kerros</p>
                  <p className="text-lg font-semibold text-gray-900">{apartment.floor}</p>
                </div>
              )}
              {apartment.price && (
                <div className="bor rounded-xl border bg-gray-100 p-5 transition-all">
                  <p className="text-sm text-gray-600">Hinta</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {apartment.price.toLocaleString()} €
                  </p>
                </div>
              )}
            </div>

            {building && (
              <div className="bor mb-10 rounded-xl border bg-gray-100 p-6 transition-all">
                <h2 className="mb-3 text-2xl font-bold text-gray-900">Rakennus</h2>
                <Link href={`/buildings/${building.slug}`} className="group">
                  <p className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {building.title}
                  </p>
                </Link>
                {building.address && (
                  <p className="mt-2 text-gray-600">
                    {building.address.street}, {building.address.postalCode} {building.address.city}
                  </p>
                )}
              </div>
            )}

            {apartment.features && apartment.features.length > 0 && (
              <div className="bor mb-10 rounded-xl border bg-gray-100 p-6 transition-all">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Ominaisuudet</h2>
                <ul className="list-inside list-disc space-y-2 text-gray-700">
                  {apartment.features.map((feature, index) => (
                    <li key={index}>{feature.feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {apartment.description && (
              <div className="bor rounded-xl border bg-gray-100 p-6 transition-all">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Kuvaus</h2>
                <div className="prose max-w-none text-gray-700">
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
