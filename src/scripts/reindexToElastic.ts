import {
  createElasticMappings,
  elasticClient,
  fetchCategoryLabels,
  getLanguageIndexName,
  indexDocumentToElastic,
} from "@/lib/elastic-utils";
import config from "@/payload.config";
import { getPayload } from "payload";
import { Article, CollectionPage, News } from "../payload-types";

type IndexableDocument = Article | CollectionPage | News;

type PayloadLocale = "sv" | "fi" | "all";

const reindexToElastic = async () => {
  try {
    const payload = await getPayload({ config });
    const languages = ["sv", "fi"] as PayloadLocale[];

    // Process each language separately
    for (const locale of languages) {
      const indexName = getLanguageIndexName(locale);

      // Delete existing language-specific index if it exists
      try {
        const indexExists = await elasticClient.indices.exists({ index: indexName });
        if (indexExists) {
          payload.logger.info(`Deleting existing index ${indexName}...`);
          await elasticClient.indices.delete({ index: indexName });
          payload.logger.info(`Successfully deleted index ${indexName}`);
        }
      } catch (_error) {
        payload.logger.info(
          `Warning: Failed to delete index ${indexName}, it may not exist. Continuing with creation.`,
        );
      }

      // Create new index with explicit settings and mappings
      try {
        await elasticClient.indices.create({
          index: indexName,
          body: createElasticMappings(locale === "fi" ? "finnish" : "swedish"),
        });

        // Log the settings to verify they were applied
        const settings = await elasticClient.indices.getSettings({ index: indexName });
        payload.logger.info(`Index ${indexName} settings:`, JSON.stringify(settings, null, 2));
      } catch (error) {
        payload.logger.error(`Error creating index ${indexName}:`, error);
        continue;
      }

      // Get all collections that should be indexed
      const collections = ["articles", "collection-pages", "news"] as const;

      for (const collectionSlug of collections) {
        payload.logger.info(`Processing collection: ${collectionSlug} for locale: ${locale}`);

        const docs = await payload.find({
          collection: collectionSlug,
          limit: 1000,
          locale: locale,
          fallbackLocale: false,
          draft: false,
          where: {
            title: {
              exists: true,
              not_equals: "",
            },
          },
        });

        payload.logger.info(
          `Found ${docs.docs.length} documents in ${collectionSlug} for locale ${locale}`,
        );

        for (const doc of docs.docs as IndexableDocument[]) {
          const validCategoryLabels =
            "categories" in doc && doc.categories
              ? await fetchCategoryLabels(doc.categories, payload)
              : [];

          const success = await indexDocumentToElastic(
            { ...doc },
            indexName,
            { slug: collectionSlug },
            locale,
            validCategoryLabels,
          );

          if (success) {
            payload.logger.info(
              `Indexed document ${doc.id} from ${collectionSlug} in index ${indexName}`,
            );
          }
        }
      }
    }

    payload.logger.info("Reindexing completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during reindexing:", error);
    process.exit(1);
  }
};

reindexToElastic();
