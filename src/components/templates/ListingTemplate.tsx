"use client";

import { Link } from "@/i18n/routing";
import { formatDateLong } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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
  const router = useRouter();

  const initialPage = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calculate which articles to show (cumulative from page 1 to current page)
  const visibleArticles = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return articles.slice(0, endIndex);
  }, [articles, currentPage]);

  const hasMoreArticles = visibleArticles.length < articles.length;

  const handleShowMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    // Update URL without page refresh
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());
    const queryString = params.toString();
    router.replace(`/articles${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [currentPage, searchParams, router]);

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
      {visibleArticles.map((article) => (
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

      {hasMoreArticles && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleShowMore}
            className="rounded-md bg-stone-800 px-6 py-3 text-sm font-medium text-stone-100 ring-1 ring-stone-700 transition-colors hover:bg-stone-700 hover:text-amber-500"
          >
            {t("listing.showMore")}
          </button>
        </div>
      )}
    </main>
  );
}
