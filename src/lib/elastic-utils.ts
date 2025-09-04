import { Client } from "@elastic/elasticsearch/index";
import { Payload } from "payload";
import { ELASTIC_INDEX_NAME } from "./constants";

export interface IndexableDocument {
  id: string | number;
  title: string;
  content?: RichTextContent | null;
  slug: string;
  publishedDate?: string | Date | null;
  createdAt?: string | Date;
  [key: string]: unknown;
}
interface RichTextChild {
  text?: string;
  [key: string]: unknown;
}
interface RichTextBlock {
  children?: RichTextChild[];
  [key: string]: unknown;
}
interface RichTextContent {
  root: {
    children: RichTextBlock[];
  };
}

export const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME!,
    password: process.env.ELASTICSEARCH_PASSWORD!,
  },
});

export const createElasticMappings = (language: "finnish" | "swedish") =>
  ({
    settings: {
      analysis: {
        analyzer: {
          default: {
            type: language,
          },
          sort_analyzer: {
            tokenizer: "keyword",
            filter: ["lowercase", "trim"],
          },
        },
        normalizer: {
          sort_normalizer: {
            type: "custom",
            char_filter: [],
            filter: ["lowercase", "trim"],
          },
        },
      },
    },
    mappings: {
      properties: {
        title: {
          type: "text",
          analyzer: language,
          fields: {
            keyword: {
              type: "keyword",
              normalizer: "sort_normalizer",
            },
            sort: {
              type: "text",
              analyzer: "sort_analyzer",
              fielddata: true,
            },
          },
        },
        content: {
          type: "text",
          analyzer: language,
        },
        slug: { type: "keyword" },
        publishedDate: { type: "date" },
        createdAt: {
          type: "date",
          fields: {
            sort: {
              type: "date",
            },
          },
        },
        categories: {
          type: "keyword",
          fields: {
            keyword: { type: "keyword" },
          },
        },
        collection: { type: "keyword" },
        locale: { type: "keyword" },
      },
    },
  }) as const;

export const indexDocumentToElastic = async (
  doc: IndexableDocument,
  indexName: string,
  collection: { slug: string },
  locale: string,
  validCategoryLabels: string[] = [],
) => {
  try {
    await elasticClient.index({
      index: indexName,
      id: doc.id.toString(),
      body: {
        id: doc.id,
        title: doc.title,
        content: doc.content ? richTextToPlainText(doc.content) : null,
        slug: doc.slug,
        publishedDate: doc.publishedDate,
        createdAt: doc.createdAt,
        categories: validCategoryLabels,
        collection: collection.slug,
        locale: locale,
      },
      refresh: true,
    });
    return true;
  } catch (error) {
    console.error(`Error indexing document ${doc.id} to ${indexName}:`, error);
    return false;
  }
};

export const richTextToPlainText = (content: RichTextContent): string => {
  if (!content || !content.root || !content.root.children) {
    return "";
  }

  return content.root.children
    .map((block: RichTextBlock) => {
      if (block.children) {
        return block.children.map((child: RichTextChild) => child.text || "").join(" ");
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
};

export const getLanguageIndexName = (locale: string): string => {
  const lang = locale === "fi" ? "fi" : "sv";
  return `${ELASTIC_INDEX_NAME}_${lang}`;
};

export const fetchCategoryLabels = async (
  categories: Array<number | { id: number }>,
  payload: Payload,
): Promise<string[]> => {
  if (!categories || !Array.isArray(categories)) {
    return [];
  }

  const categoryLabels = await Promise.all(
    categories.map(async (categoryId: number | { id: number }) => {
      // Ensure categoryId is a number or can be converted to number
      const id =
        typeof categoryId === "object" && categoryId !== null ? categoryId.id : Number(categoryId);

      try {
        const category = await payload.findByID({
          collection: "categories",
          id,
        });
        return category?.label || null;
      } catch (error) {
        console.error(`Error fetching category ${id}:`, error);
        return null;
      }
    }),
  );

  // Filter out null values from categoryLabels
  return categoryLabels.filter((label) => label !== null);
};
