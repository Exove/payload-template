export const SITE_NAME = "Payload Template";
export const ALGOLIA_INDEX_NAME = "global";
export const INDEXABLE_COLLECTIONS = ["articles", "news", "collection-pages"] as const;

// Type definition for indexable collections
export type IndexableCollectionSlug = (typeof INDEXABLE_COLLECTIONS)[number];
