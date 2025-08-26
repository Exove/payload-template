import { Link } from "@/i18n/routing";
import { formatDateLong } from "@/lib/utils";
import { Article, Event } from "@/payload-types";
import { useTranslations } from "next-intl";
import Container from "../Container";
import Header from "../Header";
import Heading from "../Heading";

interface ListingTemplateProps {
  items: Array<Article | Event>;
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  locale: string;
  basePath: string;
  titleKey: string;
  dateField?: "publishedDate" | "startDate";
}

export function ListingTemplate({
  items,
  totalDocs,
  totalPages,
  currentPage,
  locale,
  basePath,
  titleKey,
  dateField = "publishedDate",
}: ListingTemplateProps) {
  const t = useTranslations();

  return (
    <Container>
      <Header />
      <main id="main-content" className="mx-auto flex max-w-screen-md flex-col gap-8 py-16">
        <Heading level="h1" size="lg" className="mb-8">
          {t(titleKey)}
        </Heading>
        {totalDocs && (
          <div className="text-stone-400">
            {t("listing.totalDocs")}: {totalDocs}
          </div>
        )}
        {items.map((item) => {
          const dateValue =
            ("startDate" in item && (dateField === "startDate" ? item.startDate : undefined)) ??
            ("publishedDate" in item &&
              (dateField === "publishedDate" ? item.publishedDate : undefined));
          return (
            <div
              key={item.id}
              className="group relative rounded-lg bg-stone-800 p-6 transition-all"
            >
              <Link href={`${basePath}/${item.slug}`} className="inline-block">
                <span className="absolute inset-x-0 inset-y-0"></span>
                <h2 className="text-xl font-semibold text-stone-100 group-hover:text-amber-500">
                  {item.title}
                </h2>
              </Link>
              {dateValue && (
                <p className="mt-2 text-sm text-stone-400">{formatDateLong(dateValue, locale)}</p>
              )}
            </div>
          );
        })}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-4">
            {currentPage > 1 && (
              <Link
                href={`${basePath}?page=${currentPage - 1}`}
                className="rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-stone-100 ring-1 ring-stone-700 transition-colors hover:bg-stone-700 hover:text-amber-500"
              >
                {t("listing.previousPage")}
              </Link>
            )}
            <span className="flex items-center text-sm text-stone-400">
              {t("listing.pagination")} {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`${basePath}?page=${currentPage + 1}`}
                className="rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-stone-100 ring-1 ring-stone-700 transition-colors hover:bg-stone-700 hover:text-amber-500"
              >
                {t("listing.nextPage")}
              </Link>
            )}
          </div>
        )}
      </main>
    </Container>
  );
}
