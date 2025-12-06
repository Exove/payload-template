import { Article } from "@/payload-types";
import { Locale } from "@/types/locales";
import configPromise from "@payload-config";
import { getPayload } from "payload";

type MostReadResult = {
  articles: Article[];
  viewCounts: Record<string, number>;
};

type PostHogQueryResult = {
  results: [string, number, number][]; // [slug, views, unique_visitors]
};

async function fetchFromPostHog(days: number, limit: number): Promise<Map<string, number>> {
  const apiKey = process.env.POSTHOG_ADMIN_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";

  if (!apiKey || !projectId) {
    console.warn("PostHog credentials not configured");
    return new Map();
  }

  const query = `
    SELECT 
      replaceRegexpAll(properties.$pathname, '^/(fi|en)/articles/', '') as slug,
      count() as views,
      count(DISTINCT person_id) as unique_visitors
    FROM events
    WHERE 
      event = '$pageview'
      AND properties.$pathname LIKE '%/articles/%'
      AND properties.$pathname NOT LIKE '%/articles'
      AND timestamp > now() - INTERVAL ${days} DAY
    GROUP BY slug
    ORDER BY views DESC
    LIMIT ${limit}
  `;

  const response = await fetch(`${host}/api/projects/${projectId}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: { kind: "HogQLQuery", query },
    }),
    next: { revalidate: 1800 }, // Cache for 30 minutes
  });

  if (!response.ok) {
    console.error("PostHog API error:", response.status);
    return new Map();
  }

  const data: PostHogQueryResult = await response.json();
  const viewCounts = new Map<string, number>();

  data.results?.forEach(([slug, views]) => {
    viewCounts.set(slug, views);
  });

  return viewCounts;
}

export async function getMostReadArticles(
  options: { days?: number; limit?: number; locale?: Locale } = {},
): Promise<MostReadResult> {
  const { days = 7, limit = 5, locale = "fi" } = options;

  const viewCounts = await fetchFromPostHog(days, limit);

  if (viewCounts.size === 0) {
    return { articles: [], viewCounts: {} };
  }

  const slugs = Array.from(viewCounts.keys());
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "articles",
    where: {
      and: [{ slug: { in: slugs } }, { _status: { equals: "published" } }],
    },
    select: {
      id: true,
      title: true,
      slug: true,
      publishedDate: true,
      createdAt: true,
      image: true,
    },
    depth: 1,
    locale,
    fallbackLocale: locale,
    limit,
  });

  // Sort by view count
  const sortedArticles = result.docs.sort((a, b) => {
    return (viewCounts.get(b.slug) || 0) - (viewCounts.get(a.slug) || 0);
  });

  return {
    articles: sortedArticles,
    viewCounts: Object.fromEntries(viewCounts),
  };
}
