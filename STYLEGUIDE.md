# Style Guide

This document outlines the coding standards and naming conventions for the project.

## File Naming

- **React Components**: PascalCase with `.tsx` extension
  - Example: `Button.tsx`, `UserProfile.tsx`
- **Utility Functions**: kebab-case with `.ts` extension
  - Example: `format-date.ts`, `use-auth.ts`
- **Payload CMS Collections**: kebab-case with `.ts` extension
  - Example: `users.ts`, `blog-posts.ts`
- **Payload CMS Globals**: PascalCase with `.ts` extension
  - Example: `FrontPage.ts`, `MainMenu.ts`
- **Payload CMS Blocks**: kebab-case with `.ts` extension
  - Example: `hero.ts`, `dynamic-list.ts`
- **Tests**: Same name as the tested file + `.test` or `.spec`
  - Example: `Button.test.tsx`, `formatDate.spec.ts`
- **Configuration Files**: kebab-case or camelCase depending on the tool's convention
  - Example: `payload.config.ts`, `tsconfig.json`, `next-env.d.ts`
- **Next.js Pages and Layouts**: kebab-case with `.tsx` extension
  - Example: `page.tsx`, `layout.tsx`, `loading.tsx`
- **API Routes**: kebab-case with `.ts` extension
  - Example: `route.ts`

### File Extension Guidelines

- Use `.tsx` for files containing JSX
- Use `.ts` for pure TypeScript files

## Directory Naming

- Use lowercase and singular form
  - Example: `component/`, `util/`, `hook/`
- Exception: Feature directories can be plural
  - Example: `collections/`, `blocks/`

## Component Naming

- **React Components**: PascalCase
  - Example: `Button`, `UserProfile`
- **Custom Hooks**: camelCase, prefixed with `use`
  - Example: `useAuth`, `useForm`
- **Contexts**: PascalCase, suffixed with `Context`
  - Example: `ThemeContext`, `AuthContext`
- **Types**: PascalCase, optionally suffixed with `Type`, `Props`, or `Interface`
  - Example: `UserType`, `ButtonProps`, `ApiResponse`

## Variable and Function Naming

- **Variables**: camelCase, descriptive name
  - Example: `userName`, `isLoading`
- **Functions**: camelCase, starts with a verb
  - Example: `handleSubmit`, `fetchData`
- **Constants**: SCREAMING_SNAKE_CASE
  - Example: `MAX_RETRY_COUNT`, `API_BASE_URL`
- **Enums**: PascalCase
  - Example: `UserRole`, `ButtonVariant`

## Payload CMS Naming Conventions

- **Collections**: PascalCase, plural form
  - Example: `Users`, `Posts`
  - Slugs: kebab-case (e.g., `slug: "blog-posts"`)
- **Globals**: PascalCase, singular form
  - Example: `FrontPage`, `MainMenu`
  - Slugs: kebab-case (e.g., `slug: "front-page"`)
- **Fields**: camelCase
  - Example: `firstName`, `createdAt`
- **Relations**: camelCase
  - Example: `author`, `categories`
- **Blocks**: PascalCase + Block suffix
  - Example: `HeroBlock`, `ContentBlock`
  - Slugs: camelCase (e.g., `slug: "dynamicList"`)

## File Organization in Components

1. Imports
   - Automatically sorted by prettier

2. Types and interfaces
   - Component Props types should be defined separately as export type
   - Use `type` instead of `interface`
   - Name the type with the component name and `Props` suffix
   - Example:
     ```typescript
     export type ComponentProps = {
       title: string;
       isOptional?: boolean;
     };
     ```

3. Component
   - Use named function with export default syntax
   - Destructure props parameters
   - Check required props values at the beginning of the component
   - For helper functions, prefer using const with arrow function syntax
   - Example:

     ```typescript
     export default function Component({ title, isOptional }: ComponentProps) {
       if (!title) return null;

       const helperFunction = () => {
         // helper function logic
       };

       return (
         // JSX
       );
     }
     ```

### Component Structure Example

```typescript
import { ExternalDependency } from 'external-lib';
import { InternalComponent } from '@/components';
import { SomeType } from '@/types';

export type ComponentProps = {
  required: string;
  optional?: boolean;
};

export default function Component({ required, optional }: ComponentProps) {

  const helperFunction = () => {
    // helper function logic
  };

  return (
    // JSX structure
  );
}
```
