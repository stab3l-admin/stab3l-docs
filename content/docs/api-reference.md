---
title: API Reference
description: Reference documentation for the TerminalDocs API
category: Reference
order: 1
---

# API Reference

TerminalDocs provides a set of utility functions that you can use to customize and extend the functionality of your documentation site. This reference documents the available functions and their usage.

## Documentation Utilities

### `getAllDocs()`

Returns a Promise that resolves to an array of all documentation files with their metadata.

```typescript
import { getAllDocs } from "@/lib/docs";

// In an async function
const docs = await getAllDocs();
```

#### Return Value

A Promise that resolves to an array of `DocMeta` objects:

```typescript
interface DocMeta {
  title: string;
  description?: string;
  category?: string;
  order?: number;
  slug: string;
  path: string;
}
```

### `getDocBySlug(slug: string)`

Returns a Promise that resolves to a specific document by its slug.

```typescript
import { getDocBySlug } from "@/lib/docs";

// In an async function
const doc = await getDocBySlug("getting-started");
```

#### Parameters

- `slug`: The slug of the document to retrieve.

#### Return Value

A Promise that resolves to a `DocContent` object or `null` if the document is not found:

```typescript
interface DocContent extends DocMeta {
  content: string;
}
```

### `getDocsByCategory(category: string)`

Returns a Promise that resolves to all documents in a specific category.

```typescript
import { getDocsByCategory } from "@/lib/docs";

// In an async function
const docs = await getDocsByCategory("Introduction");
```

#### Parameters

- `category`: The category to filter by.

#### Return Value

A Promise that resolves to an array of `DocMeta` objects in the specified category.

### `getAllCategories()`

Returns a Promise that resolves to an array of all categories.

```typescript
import { getAllCategories } from "@/lib/docs";

// In an async function
const categories = await getAllCategories();
```

#### Return Value

A Promise that resolves to an array of category names as strings.

## Component Props

### `MarkdownRenderer`

The `MarkdownRenderer` component renders Markdown content with syntax highlighting and GitHub Flavored Markdown support.

```tsx
import { MarkdownRenderer } from "@/components/markdown-renderer";

<MarkdownRenderer content={markdownContent} />
```

#### Props

- `content`: The Markdown content to render as a string.

### `Sidebar`

The `Sidebar` component displays a navigation sidebar with categories and documents.

```tsx
import { Sidebar } from "@/components/sidebar";

<Sidebar docs={docs} categories={categories} />
```

#### Props

- `docs`: An array of `DocMeta` objects.
- `categories`: An array of category names as strings.

### `Header`

The `Header` component displays a header with search functionality and theme toggle.

```tsx
import { Header } from "@/components/header";

<Header docs={docs} />
```

#### Props

- `docs`: An array of `DocMeta` objects for search functionality.

### `ThemeToggle`

The `ThemeToggle` component displays a button to toggle between light and dark mode.

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

<ThemeToggle />
```

## Theme Provider

The `ThemeProvider` component provides theme context to the application.

```tsx
import { ThemeProvider } from "@/components/theme-provider";

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

#### Props

- `attribute`: The attribute to apply to the HTML element. Default is `"class"`.
- `defaultTheme`: The default theme. Can be `"light"`, `"dark"`, or `"system"`.
- `enableSystem`: Whether to enable system theme detection.
- `disableTransitionOnChange`: Whether to disable transitions when changing themes.
- `children`: The children to render within the theme provider.

## Conclusion

This reference documents the main utilities and components provided by TerminalDocs. You can use these to customize and extend the functionality of your documentation site. 