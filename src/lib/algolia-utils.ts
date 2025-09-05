import { algoliasearch, SearchClient } from "algoliasearch";
import { Payload } from "payload";
import { ALGOLIA_INDEX_NAME } from "./constants";

export interface IndexableDocument {
  objectID: string | number;
  title: string;
  content?: RichTextContent | null;
  slug: string;
  publishedDate?: string | Date | null;
  createdAt?: string | Date;
  categories?: string[];
  collection: string;
  locale: string;
  [key: string]: unknown;
}

type RichTextContent = {
  [k: string]: unknown;
}[];

let algoliaClient: SearchClient | null = null;

export const getAlgoliaClient = (): SearchClient => {
  if (!algoliaClient) {
    if (!process.env.ALGOLIA_APPLICATION_ID || !process.env.ALGOLIA_ADMIN_API_KEY) {
      throw new Error("Algolia credentials are not configured");
    }

    algoliaClient = algoliasearch(
      process.env.ALGOLIA_APPLICATION_ID,
      process.env.ALGOLIA_ADMIN_API_KEY,
    );
  }
  return algoliaClient;
};

export const indexDocumentToAlgolia = async (
  document: IndexableDocument,
  payload: Payload,
  language: "fi" | "en" = "fi",
): Promise<boolean> => {
  try {
    const client = getAlgoliaClient();
    const indexName = getAlgoliaIndexName(language);

    let searchableContent = "";
    if (document.content) {
      searchableContent = extractTextFromRichText(document.content);
    }

    const uniqueObjectID = `${document.collection}-${document.objectID}`;

    const algoliaDocument = {
      objectID: uniqueObjectID,
      title: document.title,
      content: searchableContent,
      slug: document.slug,
      publishedDate: document.publishedDate,
      createdAt: document.createdAt,
      categories: document.categories || [],
      collection: document.collection,
      locale: language,
    };

    await client.saveObjects({ indexName, objects: [algoliaDocument] });

    payload.logger.info(`Document ${uniqueObjectID} indexed to Algolia`);
    return true;
  } catch (error) {
    payload.logger.error("Error indexing document to Algolia:", error);
    return false;
  }
};

export const removeDocumentFromAlgolia = async (
  documentId: string | number,
  collection: string,
  language: "fi" | "en" = "fi",
): Promise<boolean> => {
  try {
    const client = getAlgoliaClient();
    const indexName = getAlgoliaIndexName(language);

    const uniqueObjectID = `${collection}-${documentId}`;

    await client.deleteObjects({ indexName, objectIDs: [uniqueObjectID] });

    console.log(`Document ${uniqueObjectID} removed from Algolia`);
    return true;
  } catch (error) {
    console.error("Error removing document from Algolia:", error);
    return false;
  }
};

export const getAlgoliaIndexName = (lang: "fi" | "en"): string => {
  return `${ALGOLIA_INDEX_NAME}_${lang}`;
};

const extractTextFromRichText = (content: RichTextContent): string => {
  const extractText = (node: unknown): string => {
    if (typeof node === "string") {
      return node;
    }

    if (node && typeof node === "object") {
      const obj = node as Record<string, unknown>;
      if (typeof obj.text === "string") {
        return obj.text;
      }

      if (Array.isArray(obj.children)) {
        return obj.children.map(extractText).join(" ");
      }

      if (Array.isArray(node)) {
        return (node as unknown[]).map(extractText).join(" ");
      }
    }

    return "";
  };

  if (!content || !Array.isArray(content)) {
    return "";
  }

  return content.map(extractText).join(" ").trim();
};
