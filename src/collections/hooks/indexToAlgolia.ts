import {
  IndexableDocument,
  indexDocumentToAlgolia,
  removeDocumentFromAlgolia,
} from "@/lib/algolia-utils";
import config from "@payload-config";
import { CollectionAfterChangeHook, CollectionAfterDeleteHook, getPayload } from "payload";

export const indexToAlgoliaHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  collection,
  req,
}) => {
  try {
    if (operation === "create" || operation === "update") {
      // Skip indexing if title is empty
      if (!doc.title || doc.title.trim() === "") {
        console.log(`Skipping indexing for document ${doc.id}: title is empty`);
        return doc;
      }

      // Determine document language (assuming there's a locale field in the document)
      const locale = req.locale || "fi";
      const payload = await getPayload({ config });

      // Fetch category labels
      const validCategoryLabels = doc.categories
        ? await fetchCategoryLabels(doc.categories, payload)
        : [];

      // Create indexable document
      const indexableDoc: IndexableDocument = {
        objectID: doc.id,
        title: doc.title || "",
        content: doc.content,
        slug: doc.slug || "",
        publishedDate: doc.publishedDate,
        createdAt: doc.createdAt,
        categories: validCategoryLabels,
        collection: collection?.slug || "",
        locale: locale,
      };

      // Index document to Algolia
      const success = await indexDocumentToAlgolia(
        indexableDoc,
        payload,
        locale === "fi" ? "fi" : "en",
      );

      if (!success) {
        payload.logger.error(`Failed to index document ${doc.id} to Algolia`);
      }
    }
  } catch (error) {
    console.error(`Error in indexToAlgoliaHook for ${doc.id}:`, error);
  }
  return doc;
};

export const removeFromAlgoliaHook: CollectionAfterDeleteHook = async ({ doc, collection }) => {
  const payload = await getPayload({ config });
  try {
    const locale = doc.locale || "fi";

    const success = await removeDocumentFromAlgolia(
      doc.id,
      collection?.slug || "",
      locale === "fi" ? "fi" : "en",
    );

    if (success) {
      payload.logger.info(`Document ${doc.id} removed from Algolia`);
    } else {
      payload.logger.error(`Failed to remove document ${doc.id} from Algolia`);
    }
  } catch (error) {
    console.error(`Error in removeFromAlgoliaHook for ${doc.id}:`, error);
  }
  return doc;
};

// Helper function to fetch category labels
const fetchCategoryLabels = async (
  categories: string[] | { id: string }[],
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<string[]> => {
  if (!categories || categories.length === 0) return [];

  try {
    // If categories are already strings, return them
    if (typeof categories[0] === "string") {
      return categories as string[];
    }

    // If categories are objects with IDs, fetch the actual category data
    const categoryIds = categories.map((cat: unknown) =>
      typeof cat === "string" ? cat : (cat as { id: string }).id,
    );
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
        const category = cat as { title?: string; name?: string };
        return category.title || category.name || "";
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching category labels:", error);
    return [];
  }
};
