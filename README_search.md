# Search & Algolia

## Algolia Integration

The project uses Algolia for powerful content search functionality. The search implementation consists of three main components:

### Core Files

#### `src/lib/algolia-utils.ts`

Core utilities for Algolia integration:

- **`getAlgoliaClient()`**: Creates and returns Algolia client instance
- **`indexDocumentToAlgolia()`**: Indexes a single document to Algolia
- **`removeDocumentFromAlgolia()`**: Removes a document from Algolia index
- **`extractTextFromRichText()`**: Extracts searchable text from rich text content
- **`getAlgoliaIndexName()`**: Generates the correct index name for a language

#### `src/collections/hooks/indexToAlgolia.ts`

Automatic hooks for Payload CMS:

- **`indexToAlgoliaHook`**: Triggers when a document is created or updated
- **`removeFromAlgoliaHook`**: Triggers when a document is deleted
- Automatic category label fetching and processing
- Validation to skip documents with empty titles

#### `src/scripts/reindexToAlgolia.ts`

Bulk reindexing script:

- Clears existing indexes
- Fetches all published documents from all collections
- Indexes documents by language
- Handles categories and rich text content processing
- Error handling and comprehensive logging

### Index Structure

**Index naming**: `{ALGOLIA_INDEX_NAME}_fi` and `{ALGOLIA_INDEX_NAME}_en`

**Indexed document structure:**

```typescript
{
  objectID: string;        // Unique ID: "{collection}-{documentId}"
  title: string;           // Document title
  content: string;         // Extracted text from rich text
  slug: string;           // URL slug
  publishedDate?: Date;    // Publication date (articles only)
  createdAt: Date;        // Creation timestamp
  categories: string[];    // Category labels
  collection: string;     // Source collection name
  locale: string;         // Document language
}
```

To modify the document structure, update the `IndexableDocument` interface in `src/lib/algolia-utils.ts` and ensure the corresponding indexing logic is updated in:

- `src/collections/hooks/indexToAlgolia.ts` (for automatic indexing)
- `src/scripts/reindexToAlgolia.ts` (for bulk reindexing)

### Automatic Indexing

Documents are automatically indexed:

- **Create/Update**: When a document is created or updated in Payload CMS
- **Delete**: When a document is deleted from CMS
- **Bulk reindex**: Using the `pnpm reindex` command

### Supported Collections

To modify which collections are indexed, update the `INDEXABLE_COLLECTIONS` array in `src/lib/constants.ts`:

```typescript
export const INDEXABLE_COLLECTIONS = ["articles", "news", "collection-pages"] as const;
```

### Configuration

Set up environment variables:

```bash
ALGOLIA_APPLICATION_ID
ALGOLIA_ADMIN_API_KEY
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
```

**Note**: Don't use production credentials in development environment!
