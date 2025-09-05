# Payload CMS Starter Template

This is a starter template for building web applications with Payload CMS and SQLite database, powered by Next.js 15 and React 19.

## ✨ Features

- **Database**: SQLite with @libsql/client
- **CMS**: Payload CMS v3
- **Runtime**: Node.js (^18.20.2 || >=20.9.0)
- **Framework**: Next.js 15 with Turbopack
- **Search**: Algolia integration with InstantSearch
- **UI**:
  - Tailwind CSS
  - Headless UI components
  - Hero Icons
  - Motion for animations
  - Sonner for notifications
- **Internationalization**: next-intl
- **SSO Authentication**: NextAuth.js
- **SEO**: Payload CMS SEO plugin
- **Rich Text Editor**: Payload CMS Lexical editor

## 🛠️ Installation

1. Clone this repository

2. Copy the `.env.example` file as `.env` and fill in the required variables

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
pnpm i
```

4. Start the development environment:

```bash
pnpm dev
```

5. Open the admin UI at http://localhost:3000/admin or the website at http://localhost:3000

## 📜 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm devsafe` - Start development server with clean .next directory
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm generate:types` - Generate Payload CMS types
- `pnpm generate:importmap` - Generate import map
- `pnpm reindex` - Reindex data to Algolia
- `pnpm seed` - Run database seeding script
- `pnpm format` - Format all files with Prettier

## 📁 Project Structure

```
src/
├── app/              # Next.js app directory
├── blocks/           # Payload CMS block components
├── collections/      # Payload CMS collections
├── components/       # React components
├── fields/          # Custom Payload CMS fields
├── globals/         # Payload CMS single use collections
├── i18n/            # Internationalization configs
├── lib/             # Utility functions and shared code
├── messages/        # Translation messages
├── migrations/      # Database migrations
├── scripts/         # Utility scripts (seeding, reindexing)
├── types/           # TypeScript type definitions
├── middleware.ts    # Next.js middleware
└── payload.config.ts # Payload CMS configuration
```

## 📚 Style Guide

For detailed coding standards and naming conventions, please refer to our [Style Guide](./STYLEGUIDE.md).

## 👩‍💻 Development

The project uses several development tools:

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for Git hooks
- lint-staged for pre-commit checks

## 🔍 Search & Algolia

### Algolia Integration

The project uses Algolia for powerful content search functionality. The search implementation consists of three main components:

#### 🔧 Core Files

##### `src/lib/algolia-utils.ts`

Core utilities for Algolia integration:

- **`getAlgoliaClient()`**: Creates and returns Algolia client instance
- **`indexDocumentToAlgolia()`**: Indexes a single document to Algolia
- **`removeDocumentFromAlgolia()`**: Removes a document from Algolia index
- **`extractTextFromRichText()`**: Extracts searchable text from rich text content
- **`getAlgoliaIndexName()`**: Generates the correct index name for a language

##### `src/collections/hooks/indexToAlgolia.ts`

Automatic hooks for Payload CMS:

- **`indexToAlgoliaHook`**: Triggers when a document is created or updated
- **`removeFromAlgoliaHook`**: Triggers when a document is deleted
- Automatic category label fetching and processing
- Validation to skip documents with empty titles

##### `src/scripts/reindexToAlgolia.ts`

Bulk reindexing script:

- Clears existing indexes
- Fetches all published documents from all collections
- Indexes documents by language (`fi` and `en`)
- Handles categories and rich text content processing
- Error handling and comprehensive logging

#### 📊 Index Structure

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

#### 🔄 Automatic Indexing

Documents are automatically indexed:

- **Create/Update**: When a document is created or updated in Payload CMS
- **Delete**: When a document is deleted from CMS
- **Bulk reindex**: Using the `pnpm reindex` command

#### 📋 Supported Collections

The following collections are automatically indexed:

- `articles` (published only)
- `news`
- `collection-pages`

To modify which collections are indexed, update the `INDEXABLE_COLLECTIONS` array in `src/lib/constants.ts`:

```typescript
export const INDEXABLE_COLLECTIONS = ["articles", "news", "collection-pages"] as const;
```

#### ⚙️ Configuration

Set up environment variables:

```bash
ALGOLIA_APPLICATION_ID
ALGOLIA_ADMIN_API_KEY
NEXT_PUBLIC_ALGOLIA_APPLICATION_ID
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
```

**Note**: Don't use production credentials in development environment!
