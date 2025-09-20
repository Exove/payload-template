import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { usePagination } from "react-instantsearch";

export default function SearchPagination() {
  const { pages, currentRefinement, nbPages, isFirstPage, isLastPage, refine, createURL } =
    usePagination();
  const t = useTranslations("search");

  const handlePageChange = (page: number) => {
    refine(page);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  if (nbPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2" aria-label={t("pagination")}>
      <button
        onClick={(event) => {
          event.preventDefault();
          handlePageChange(currentRefinement - 1);
        }}
        disabled={isFirstPage}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-700 hover:border-amber-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-stone-700"
        aria-label={t("previousPage")}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <ul className="flex gap-2">
        {pages.map((page) => {
          const isActive = currentRefinement === page;

          return (
            <li key={page}>
              <Link
                href={createURL(page)}
                onClick={(event) => {
                  event.preventDefault();
                  handlePageChange(page);
                }}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg border text-white",
                  {
                    "border-amber-500": isActive,
                    "border-stone-700 hover:border-amber-500": !isActive,
                  },
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {page + 1}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        onClick={(event) => {
          event.preventDefault();
          handlePageChange(currentRefinement + 1);
        }}
        disabled={isLastPage}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-700 hover:border-amber-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-stone-700"
        aria-label={t("nextPage")}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </nav>
  );
}
