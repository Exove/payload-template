export const SITE_NAME = "Payload Demo";
export const ALGOLIA_INDEX_NAME = "global";
export const INDEXABLE_COLLECTIONS = ["articles"] as const;

// Type definition for indexable collections
export type IndexableCollectionSlug = (typeof INDEXABLE_COLLECTIONS)[number];
