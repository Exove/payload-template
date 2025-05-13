import { BlockRenderer } from "@/components/BlockRenderer";
import { Link } from "@/i18n/routing";
import { Apartment, Building, FrontPage } from "@/payload-types";

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

        <div className="mt-12">
          <h2 className="mb-8 text-3xl font-bold">Rakennukset ja asunnot</h2>
          {buildings.map((building) => (
            <div key={building.id} className="mb-12 rounded-lg border p-6">
              <Link href={`/buildings/${building.slug}`} className="mb-4 block">
                <h3 className="text-2xl font-semibold hover:text-blue-600">{building.title}</h3>
                {building.address && (
                  <p className="text-gray-600">
                    {building.address.street}, {building.address.postalCode} {building.address.city}
                  </p>
                )}
              </Link>

              {building.apartments && building.apartments.length > 0 ? (
                <div className="mt-6">
                  <h4 className="mb-4 text-xl font-semibold">Asunnot</h4>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {building.apartments.map((apartment) => (
                      <Link
                        key={apartment.id}
                        href={`/apartments/${apartment.slug}`}
                        className="block rounded-lg border p-4 transition-colors hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-semibold">{apartment.title}</p>
                          <div className="mt-2 text-sm text-gray-600">
                            {apartment.size && <span>{apartment.size} m² • </span>}
                            {apartment.rooms && <span>{apartment.rooms} h • </span>}
                            {apartment.floor && <span>{apartment.floor}. kerros</span>}
                          </div>
                          {apartment.price && (
                            <p className="mt-2 font-semibold">
                              {apartment.price.toLocaleString()} €
                            </p>
                          )}
                          <span
                            className={`mt-2 inline-block rounded-full px-2 py-1 text-xs ${
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
          ))}
        </div>
      </div>
    </main>
  );
}
