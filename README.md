# Payload CMS Starter Template

This is a starter kit for building web applications with Payload CMS and SQLite database, powered by Next.js.

## Features

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

## Installation

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

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm generate:types` - Generate Payload CMS types
- `pnpm generate:importmap` - Generate import map
- `pnpm reindex` - Reindex data to Algolia
- `pnpm create:admin` - Create admin user
- `pnpm format` - Format all files with Prettier

## Project Structure

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

## Style Guide

For detailed coding standards and naming conventions, please refer to our [Style Guide](./STYLEGUIDE.md).

## Development

The project uses several development tools:

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for Git hooks
- lint-staged for pre-commit checks

## Search & Algolia

For detailed information about the search functionality and Algolia integration, please refer to [README_search.md](./README_search.md).
