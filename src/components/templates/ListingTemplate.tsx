"use client";

import { Link } from "@/i18n/routing";
import { formatDateLong } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Article } from "../../payload-types";
import Heading from "../Heading";

const ITEMS_PER_PAGE = 40;

export type ListingTemplateProps = {
  articles: Article[];
  locale: string;
};

export function ListingTemplate({ articles, locale }: ListingTemplateProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);

  // Calculate which articles to show for current page
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return articles.slice(startIndex, endIndex);
  }, [articles, currentPage]);

  const createPageUrl = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }
      const queryString = params.toString();
      return `/articles${queryString ? `?${queryString}` : ""}`;
    },
    [searchParams],
  );

  return (
    <main id="main-content" className="mx-auto flex max-w-screen-md flex-col gap-8 py-16">
      <Heading level="h1" size="lg" className="mb-8">
        {t("articles.title")}
      </Heading>
      {articles.length > 0 && (
        <div className="text-stone-400">
          {t("listing.totalDocs")}: {articles.length}
        </div>
      )}
      {paginatedArticles.map((article) => (
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
              href={createPageUrl(currentPage - 1)}
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
              href={createPageUrl(currentPage + 1)}
              className="rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-stone-100 ring-1 ring-stone-700 transition-colors hover:bg-stone-700 hover:text-amber-500"
            >
              {t("listing.nextPage")}
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
