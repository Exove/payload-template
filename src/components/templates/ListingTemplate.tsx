import { Link } from "@/i18n/routing";
import { formatDateLong } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Article } from "../../payload-types";
import Container from "../Container";
import Header from "../Header";
import Heading from "../Heading";

interface ListingTemplateProps {
  articles: Article[];
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  locale: string;
}

export function ListingTemplate({
  articles,
  totalDocs,
  totalPages,
  currentPage,
  locale,
}: ListingTemplateProps) {
  const t = useTranslations();

  return (
    <Container>
      <Header />
      <main id="main-content" className="mx-auto flex max-w-screen-md flex-col gap-8 py-16">
        <Heading level="h1" size="lg" className="mb-8">
          {t("articles.title")}
        </Heading>
        {totalDocs && (
          <div className="text-stone-400">
            {t("listing.totalDocs")}: {totalDocs}
          </div>
        )}
        {articles.map((article) => (
          <div
            key={article.id}
            className="group relative rounded-lg bg-stone-800 p-6 transition-all hover:ring-1 hover:ring-amber-500"
          >
            <Link href={`/articles/${article.slug}`} className="inline-block">
              <span className="absolute inset-x-0 inset-y-0"></span>
              <h2 className="text-xl font-semibold text-stone-100 group-hover:text-amber-500">
                {article.title}
              </h2>
            </Link>
            {article.publishedDate && (
              <p className="mt-2 text-sm text-stone-400">
                {formatDateLong(article.publishedDate, locale)}
              </p>
            )}
          </div>
        ))}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-4">
            {currentPage > 1 && (
              <Link
                href={`/articles?page=${currentPage - 1}`}
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
                href={`/articles?page=${currentPage + 1}`}
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
