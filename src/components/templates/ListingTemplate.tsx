"use client";

import { Button } from "@/components/Button";
import Heading from "@/components/Heading";
import { Link } from "@/i18n/routing";
import { formatDateLong } from "@/lib/utils";
import { Article } from "@/payload-types";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";

const ITEMS_PER_PAGE = 25;

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
  const [announcement, setAnnouncement] = useState("");
  const newContentRef = useRef<HTMLDivElement>(null);

  // Calculate which articles to show (cumulative from page 1 to current page)
  const visibleArticles = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return articles.slice(0, endIndex);
  }, [articles, currentPage]);

  const hasMoreArticles = visibleArticles.length < articles.length;
  const remainingArticles = articles.length - visibleArticles.length;
  const newContentStartIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const handleShowMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());
    router.replace(`/articles?${params}`, { scroll: false });

    // Announce and focus new content
    const newItemsCount = Math.min(ITEMS_PER_PAGE, articles.length - currentPage * ITEMS_PER_PAGE);
    setAnnouncement(t("listing.newContentLoaded", { count: newItemsCount }));

    // Focus first new article link
    setTimeout(() => {
      const firstNewLink = newContentRef.current?.querySelector(
        'a[data-new-content="true"]',
      ) as HTMLElement;
      firstNewLink?.focus();
    }, 100);
  }, [currentPage, searchParams, router, articles.length, t]);

  return (
    <main id="main-content" className="mx-auto max-w-screen-md py-16">
      <Heading level="h1" size="lg" className="mb-8">
        {t("articles.title")}
      </Heading>
      {!!articles.length && (
        <div className="mb-8 text-stone-400">
          {t("listing.totalDocs")}: {articles.length}
        </div>
      )}
      <div ref={newContentRef} className="flex flex-col gap-8">
        {visibleArticles.map((article, index) => {
          const isNewContent = index >= newContentStartIndex;
          return (
            <div
              key={article.id}
              className="group relative rounded-lg bg-stone-800 p-6 transition-all hover:ring-1 hover:ring-amber-500"
            >
              <Link
                href={`/articles/${article.slug}`}
                className="inline-block"
                {...(isNewContent && { "data-new-content": "true", tabIndex: 0 })}
              >
                <span className="absolute inset-x-0 inset-y-0"></span>
                <h2 className="text-xl font-semibold text-stone-100">{article.title}</h2>
              </Link>
              {article.publishedDate && (
                <p className="mt-2 text-sm text-stone-400">
                  {formatDateLong(article.publishedDate, locale)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {hasMoreArticles && (
        <div className="mt-8 flex justify-center">
          <Button onClick={handleShowMore} aria-describedby="show-more-description">
            {t("listing.showMore")}
          </Button>
          <span id="show-more-description" className="sr-only">
            {t("listing.showMoreDescription", {
              remaining: remainingArticles,
              total: articles.length,
            })}
          </span>
        </div>
      )}

      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </main>
  );
}
