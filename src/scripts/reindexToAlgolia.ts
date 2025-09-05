import {
  getAlgoliaClient,
  getAlgoliaIndexName,
  IndexableDocument,
  indexDocumentToAlgolia,
} from "@/lib/algolia-utils";
import { INDEXABLE_COLLECTIONS, IndexableCollectionSlug } from "@/lib/constants";
import { Article, CollectionPage, News } from "@/payload-types";
import { getPayload } from "payload";
import config from "../payload.config";

// Type for rich text content
type RichTextContent = {
  [k: string]: unknown;
}[];

// Type guard to check if document is an Article
const isArticle = (doc: Article | News | CollectionPage): doc is Article => {
  return "categories" in doc && "publishedDate" in doc;
};

const reindexToAlgolia = async () => {
  const payload = await getPayload({ config });

  payload.logger.info("Starting Algolia reindex...");

  const collections = INDEXABLE_COLLECTIONS;
  const locales = ["fi", "en"];

  try {
    const client = getAlgoliaClient();

    for (const locale of locales) {
      const indexName = getAlgoliaIndexName(locale as "fi" | "en");
      payload.logger.info(`Processing index: ${indexName}`);

      // Clear existing index
      try {
        await client.clearObjects({ indexName });
        payload.logger.info(`Cleared existing data from ${indexName}`);
      } catch (_error) {
        payload.logger.info(`Index ${indexName} doesn't exist yet, creating new one`);
      }

      // Reindex all collections for this locale
      for (const collectionSlug of collections) {
        payload.logger.info(`Reindexing ${collectionSlug} in ${locale}...`);

        try {
          const docs = await payload.find({
            collection: collectionSlug as IndexableCollectionSlug,
            locale: locale as "fi" | "en",
            limit: 1000,
            /* Filter out drafts and documents that don't have a title or are empty */
            where:
              collectionSlug === "articles"
                ? {
                    and: [
                      {
                        _status: {
                          equals: "published",
                        },
                      },
                      {
                        title: {
                          exists: true,
                        },
                      },
                      {
                        title: {
                          not_equals: "",
                        },
                      },
                    ],
                  }
                : {
                    and: [
                      {
                        title: {
                          exists: true,
                        },
                      },
                      {
                        title: {
                          not_equals: "",
                        },
                      },
                    ],
                  },
          });

          payload.logger.info(
            `Found ${docs.docs.length} documents in ${collectionSlug} (${locale})`,
          );

          for (const doc of docs.docs) {
            // Type-safe access to categories and publishedDate
            const categoryLabels =
              isArticle(doc) && doc.categories
                ? await fetchCategoryLabels(doc.categories, payload)
                : [];

            // Convert rich text content to the expected format
            const richTextContent =
              doc.content &&
              typeof doc.content === "object" &&
              doc.content !== null &&
              "root" in doc.content
                ? ([doc.content] as RichTextContent)
                : null;

            const indexableDoc: IndexableDocument = {
              objectID: doc.id,
              title: doc.title || "",
              content: richTextContent,
              slug: doc.slug || "",
              publishedDate: isArticle(doc) ? doc.publishedDate : undefined,
              createdAt: doc.createdAt,
              categories: categoryLabels,
              collection: collectionSlug,
              locale: locale,
            };

            const success = await indexDocumentToAlgolia(
              indexableDoc,
              payload,
              locale as "fi" | "en",
            );

            if (!success) {
              payload.logger.error(`✗ Failed to index document ${doc.id}`);
            }
          }
        } catch (error) {
          payload.logger.error(
            `Error processing collection ${collectionSlug} in ${locale}:`,
            error,
          );
        }
      }

      payload.logger.info(`Completed reindexing for locale: ${locale}`);
    }

    payload.logger.info("✅ Algolia reindex completed successfully!");
  } catch (error) {
    payload.logger.error("❌ Error during Algolia reindex:", error);
    process.exit(1);
  }
};

// Helper function to fetch category labels
const fetchCategoryLabels = async (
  categories: (
    | number
    | { id: string | number }
    | { id: string | number; label?: string; title?: string }
  )[],
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<string[]> => {
  if (!categories || categories.length === 0) return [];

  try {
    // Extract category IDs
    const categoryIds = categories.map((cat: unknown) => {
      if (typeof cat === "string" || typeof cat === "number") {
        return cat;
      }
      return (cat as { id: string | number }).id;
    });

    const categoryData = await payload.find({
      collection: "categories",
      where: {
        id: {
          in: categoryIds,
        },
      },
    });

    return categoryData.docs
      .map((cat: unknown) => {
        const category = cat as { title?: string; name?: string; label?: string };
        return category.title || category.name || category.label || "";
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching category labels:", error);
    return [];
  }
};

reindexToAlgolia();
