import { BlockRenderer } from "@/components/BlockRenderer";
import { Link } from "@/i18n/routing";
import { Apartment, Building, FrontPage } from "@/payload-types";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type ExtendedBuilding = Building & {
  apartments: Apartment[];
};

type FrontPageTemplateProps = {
  content: FrontPage;
  buildings: ExtendedBuilding[];
};

export default function FrontPageTemplate({ content, buildings }: FrontPageTemplateProps) {
  return (
    <main id="main-content">
      {content.hero && <BlockRenderer blocks={content.hero} />}
      <div className="mx-auto max-w-screen-lg py-16">
        {content.content && <BlockRenderer blocks={content.content} />}

        <div className="mt-16">
          <h2 className="mb-12 text-4xl font-bold text-gray-900">Rakennukset ja asunnot</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {buildings.map((building) => (
              <div
                key={building.id}
                className="mb-16 overflow-hidden rounded-2xl bg-white/80 shadow-xl shadow-gray-200/60 backdrop-blur-sm transition-all"
              >
                <div className="relative">
                  {building.image && typeof building.image === "object" && building.image.url && (
                    <Link href={`/buildings/${building.slug}`}>
                      <Image
                        src={building.image.url}
                        alt={building.title || ""}
                        width={1200}
                        height={600}
                        className="h-72 w-full object-cover"
                      />
                    </Link>
                  )}
                </div>
                <div className="p-8">
                  <Link href={`/buildings/${building.slug}`} className="group mb-4 block">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                        {building.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600 transition-colors group-hover:text-blue-600">
                          Talosivulle
                        </span>
                        <ChevronRightIcon className="h-4 w-4 transform stroke-2 text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-blue-600" />
                      </div>
                    </div>
                    {building.address && (
                      <p className="mt-2 text-gray-600">
                        {building.address.street}, {building.address.postalCode}{" "}
                        {building.address.city}
                      </p>
                    )}
                  </Link>

                  {building.apartments && building.apartments.length > 0 ? (
                    <div className="mt-8">
                      <h4 className="mb-4 text-xl font-bold text-gray-900">Asunnot</h4>
                      <div className="grid gap-4">
                        {building.apartments.map((apartment) => (
                          <Link
                            key={apartment.id}
                            href={`/apartments/${apartment.slug}`}
                            className="block rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition-all hover:shadow-md"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">{apartment.title}</p>
                                <p className="text-gray-600">
                                  {apartment.size} m² • {apartment.rooms} h
                                </p>
                              </div>
                              <span
                                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
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
                  ) : (
                    <p className="mt-4 text-gray-600">Ei saatavilla olevia asuntoja</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
