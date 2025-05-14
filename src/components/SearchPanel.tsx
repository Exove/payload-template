"use client";

import { Link, useRouter } from "@/i18n/routing";
import { ELASTIC_INDEX_NAME } from "@/lib/constants";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import createClient from "@searchkit/instantsearch-client";
import { useLocale, useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { InstantSearch, useHits, useSearchBox, useStats } from "react-instantsearch";
import SidePanel from "./SidePanel";

interface Hit {
  title: string;
  slug: string;
  collection?: string;
}
interface SearchRequest {
  params?: {
    query?: string;
  };
}

const SearchContext = createContext<{
  query: string;
  setSearchQuery: (query: string) => void;
}>({
  query: "",
  setSearchQuery: () => {},
});

function SearchContextProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <SearchContext.Provider value={{ query: searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

const searchClient = {
  ...createClient({
    url: "/api/search",
  }),

  // If no search query, return empty results
  search(requests: SearchRequest[]) {
    const shouldSearch = requests.some(
      (request: SearchRequest) => request.params?.query && request.params.query.length > 0,
    );
    if (!shouldSearch) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
        })),
      });
    }

    return createClient({ url: "/api/search" }).search(requests);
  },
};

// Only used for screen readers
function SearchStats() {
  const { nbHits } = useStats();
  const t = useTranslations("search");

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {nbHits} {nbHits === 1 ? t("result") : t("results")}
    </div>
  );
}

function CustomHits() {
  const { items } = useHits<Hit>();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ol>
      {items.map((hit: Hit) => (
        <li key={hit.slug}>
          <div className="group relative flex items-center justify-between gap-3 rounded-lg p-4 hover:bg-stone-700">
            <Link href={`/${hit.collection}/${hit.slug}`} className="block">
              <h2 className="font-medium">{hit.title}</h2>
              <span className="absolute inset-x-0 inset-y-0 z-10"></span>
            </Link>
            <div className="text-xs uppercase text-stone-400 group-hover:text-stone-300">
              {hit.collection}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function CustomSearchBox({ inSidePanel = false }: { inSidePanel?: boolean }) {
  const { query, refine } = useSearchBox();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setSearchQuery } = useContext(SearchContext);
  const t = useTranslations("search");
  const router = useRouter();

  useEffect(() => {
    // Focus the search box when the side panel is opened
    if (inSidePanel && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.click();
    }
  }, [inSidePanel]);

  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`);
    }
  };

  return (
    <div className="relative mt-2">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => refine(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("searchPlaceholder")}
        className="search-panel-input w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-white placeholder-stone-400 focus:border-amber-500 focus:outline-none"
      />
      {query && (
        <button
          onClick={() => refine("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
          aria-label={t("clearSearch")}
          tabIndex={-1}
        >
          <XMarkIcon className="h-5 w-5 stroke-2" />
        </button>
      )}
    </div>
  );
}

function AdvancedSearchLink() {
  const { query } = useContext(SearchContext);
  const t = useTranslations("search");
  return (
    <div className="pb-10 pt-4 text-center">
      <Link
        href={`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`}
        className="p-4 text-amber-500 underline-offset-2 hover:underline"
      >
        {t("advancedSearch")}
      </Link>
    </div>
  );
}

export default function SearchSidePanel() {
  const t = useTranslations("search");
  const locale = useLocale();
  return (
    <SearchContextProvider>
      <SidePanel
        openLabel={
          <button className="group flex items-center gap-2">
            <MagnifyingGlassIcon className="h-5 w-5 group-hover:text-blue-500" />
            <div className="sr-only text-sm font-medium uppercase xl:not-sr-only">
              {t("search")}
            </div>
          </button>
        }
        title={t("search")}
        footer={<AdvancedSearchLink />}
      >
        <div className="flex flex-col gap-2">
          <InstantSearch searchClient={searchClient} indexName={`${ELASTIC_INDEX_NAME}_${locale}`}>
            <div className="sticky top-0 z-10 bg-stone-800 pb-2 pt-4">
              <CustomSearchBox inSidePanel={true} />
            </div>
            <SearchStats />
            <CustomHits />
          </InstantSearch>
        </div>
      </SidePanel>
    </SearchContextProvider>
  );
}
