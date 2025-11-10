# Payload CMS Starter Template

This is a starter kit for building web applications with Payload CMS and SQLite database, powered by Next.js.

## ✨ Features

- **Database**: SQLite
- **CMS**: Payload CMS v3
- **Runtime**: Node.js (22.x)
- **Framework**: Next.js (15.x)
- **Search**: Algolia with InstantSearch
- **UI**:
  - Tailwind CSS
  - Headless UI components
  - Shadcn UI components
  - Hero Icons
  - Motion animations
- **Internationalization**: next-intl
- **SEO**: Payload CMS SEO plugin
- **Rich Text Editor**: Payload CMS Lexical editor

## 🛠️ Installation

1. Clone this repository and make sure Docker is running

2. Start the development environment:

```bash
pnpm dev
```

3. Open the admin UI at http://localhost:3000/admin or the website at http://localhost:3000

4. Extra steps (optional):

- Import staging database (replace the local database file):

```bash
scp user@staging:/path/to/database.sql .
```

- Create admin user:

```bash
pnpm create:admin
```

- Copy staging media files to your local media folder:

```bash
scp "user@staging:/path/to/media/*" ./media
```

- Set up your personal Algolia credentials: [algolia.com](https://www.algolia.com/)

## 📜 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm generate:types` - Generate Payload CMS types
- `pnpm generate:importmap` - Generate import map
- `pnpm reindex` - Reindex data to Algolia
- `pnpm create:admin` - Create admin user
- `pnpm db:export` - Export database
- `pnpm db:import` - Import database
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

## 🏢 Multi-tenant Demo

This project ships with the official Payload multi-tenant plugin to showcase branch-specific content. The setup focuses on two demo branches and can be extended to real tenants without changing code.

### Tenant collection

- `tenants` collection stores branch metadata such as name, slug, optional domains, colour theme and feature flags.
- Only global admins (`users.role = admin`) can create or edit tenants.
- Plugin-generated tenant selector appears in the admin top bar and filters all tenant-aware lists automatically.

### Demo branches

Create the following tenants from the admin UI:

| Name                         | Slug            | Suggested domain     | Notes                                                             |
| ---------------------------- | --------------- | -------------------- | ----------------------------------------------------------------- |
| Aurora Labs Special Branch   | `aurora-labs`   | `aurora.localhost`   | Focus on advanced research content and premium hardware products. |
| Borealis Tech Special Branch | `borealis-tech` | `borealis.localhost` | Focus on energy-tech insights and grid monitoring products.       |

Populate the optional theme group (primary/accent colours, logo) to highlight tenant-specific branding in future UI experiments.

### Users and roles

- `users` keep a global `role` (`admin`, `editor`, `user`) for platform-wide permissions.
- Each user can hold multiple tenant assignments via the `tenants` array:
  - `role`: `tenant-admin`, `tenant-editor`, `tenant-viewer`.
  - `canPublish`: toggles publish rights per branch.
  - `canManageMembers`: toggles ability to curate tenant membership.
- Global admins can manage every tenant; tenant admins can only access content inside their assigned branches.

### Tenant-scoped collections

The plugin injects an enforced tenant relationship into key collections:

- `articles`
- `products`
- `categories`
- `contacts`

All queries routed through Payload will automatically filter by the currently selected tenant. When working via the REST or Local API, pass the tenant cookie/header set by the admin UI or supply `where` clauses that match the assigned tenant.

### Demo content suggestions

Seed content manually from the admin panel (no automated script included):

- For each tenant, author a couple of articles highlighting branch-specific themes.
- Add categories per branch to illustrate isolated taxonomies.
- Create products and assign contacts to demonstrate cross-collection tenant constraints.

### Tenant-aware workflows

1. Sign in as a global admin and create the tenants listed above.
2. Invite or create users, assigning the appropriate tenant roles and optional permissions.
3. Switch tenants via the selector in the admin navigation to verify list filtering.
4. Create articles and products under each tenant and confirm they only appear for users assigned to that branch.

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
- Indexes documents by language
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
