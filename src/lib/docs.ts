import path from 'path';
import matter from 'gray-matter';

/**
 * Interface for document metadata
 */
export interface DocMeta {
  title: string;
  description?: string;
  category?: string;
  order?: number;
  slug: string;
  path: string;
}

/**
 * Interface for document content
 */
export interface DocContent extends DocMeta {
  content: string;
}

// Sample documentation data
const SAMPLE_DOCS = [
  {
    title: 'Getting Started',
    description: 'Learn how to use TerminalDocs',
    category: 'Introduction',
    order: 1,
    slug: 'getting-started',
    path: '/getting-started.md',
    content: `
# Getting Started with TerminalDocs

Welcome to TerminalDocs, a standalone documentation site for your projects.

## Features

- Markdown support
- Code syntax highlighting
- Dark mode
- Search functionality
- Sidebar navigation
- Mobile responsive

## Adding Content

To add content, create markdown files in the \`content/docs\` directory.
    `
  },
  {
    title: 'Markdown Usage',
    description: 'Learn how to use Markdown in TerminalDocs',
    category: 'Usage',
    order: 1,
    slug: 'markdown-usage',
    path: '/markdown-usage.md',
    content: `
# Markdown Usage

TerminalDocs supports standard Markdown syntax as well as some additional features.

## Basic Syntax

### Headers

# H1
## H2
### H3
#### H4
##### H5
###### H6

### Emphasis

*Italic* or _Italic_
**Bold** or __Bold__
**_Bold and Italic_**
~~Strikethrough~~

### Lists

Unordered:
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

Ordered:
1. Item 1
2. Item 2
   1. Subitem 2.1
   2. Subitem 2.2

### Links

[Link Text](https://example.com)

### Images

![Alt Text](https://example.com/image.jpg)

### Code

Inline \`code\`

\`\`\`javascript
// Code block
function hello() {
  console.log('Hello, world!');
}
\`\`\`

### Blockquotes

> This is a blockquote
> > Nested blockquote

### Tables

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
    `
  },
  {
    title: 'Customization',
    description: 'Learn how to customize TerminalDocs',
    category: 'Usage',
    order: 2,
    slug: 'customization',
    path: '/customization.md',
    content: `
# Customization

TerminalDocs can be customized in several ways to match your project's branding and requirements.

## Theme Customization

You can customize the theme by modifying the \`tailwind.config.js\` file. The default theme includes light and dark modes.

## Layout Customization

The layout can be customized by modifying the components in the \`src/components\` directory.

## Adding Custom Pages

You can add custom pages by creating new files in the \`src/app\` directory.
    `
  },
  {
    title: 'Deployment',
    description: 'Learn how to deploy TerminalDocs',
    category: 'Advanced',
    order: 1,
    slug: 'deployment',
    path: '/deployment.md',
    content: `
# Deployment

TerminalDocs can be deployed to various platforms.

## Static Export

You can create a static export of your documentation site:

\`\`\`bash
npm run build
\`\`\`

## Vercel Deployment

The easiest way to deploy TerminalDocs is with Vercel:

1. Push your code to a Git repository
2. Import the repository in Vercel
3. Deploy

## Other Platforms

TerminalDocs can also be deployed to other platforms like Netlify, GitHub Pages, or any static hosting service.
    `
  },
  {
    title: 'API Reference',
    description: 'API Reference for TerminalDocs',
    category: 'Reference',
    order: 1,
    slug: 'api-reference',
    path: '/api-reference.md',
    content: `
# API Reference

This page documents the API for TerminalDocs.

## Configuration

TerminalDocs can be configured using the \`terminaldocs.config.js\` file.

\`\`\`javascript
module.exports = {
  title: 'My Documentation',
  description: 'Documentation for my project',
  logo: '/logo.svg',
  // Other configuration options
};
\`\`\`

## Programmatic Usage

TerminalDocs can also be used programmatically:

\`\`\`javascript
import { TerminalDocs } from 'terminaldocs';

const docs = new TerminalDocs({
  // Configuration options
});

docs.render();
\`\`\`
    `
  },
  {
    title: 'Troubleshooting',
    description: 'Troubleshooting common issues with TerminalDocs',
    category: 'Reference',
    order: 2,
    slug: 'troubleshooting',
    path: '/troubleshooting.md',
    content: `
# Troubleshooting

This page provides solutions to common issues with TerminalDocs.

## Common Issues

### Content Not Updating

If your content is not updating, try the following:

1. Clear your browser cache
2. Restart the development server
3. Check for syntax errors in your markdown files

### Styling Issues

If you're experiencing styling issues:

1. Make sure Tailwind CSS is properly configured
2. Check for conflicting CSS rules
3. Verify that the correct classes are being applied

### Deployment Issues

If you're having trouble deploying:

1. Check your build logs for errors
2. Verify that all dependencies are installed
3. Make sure your environment variables are set correctly
    `
  }
];

/**
 * Get all documentation files
 * @returns Array of document metadata
 */
export function getAllDocs(): DocMeta[] {
  return SAMPLE_DOCS.map(doc => ({
    title: doc.title,
    description: doc.description || '',
    category: doc.category || 'Uncategorized',
    order: doc.order || 999,
    slug: doc.slug,
    path: doc.path,
  }));
}

/**
 * Get a specific document by slug
 * @param slug Document slug
 * @returns Document content or null if not found
 */
export function getDocBySlug(slug: string): DocContent | null {
  const doc = SAMPLE_DOCS.find((d) => d.slug === slug);
  return doc || null;
}

/**
 * Get documents by category
 * @param category Category name
 * @returns Array of documents in the category
 */
export function getDocsByCategory(category: string): DocMeta[] {
  return SAMPLE_DOCS
    .filter((doc) => doc.category === category)
    .map(doc => ({
      title: doc.title,
      description: doc.description || '',
      category: doc.category || 'Uncategorized',
      order: doc.order || 999,
      slug: doc.slug,
      path: doc.path,
    }));
}

/**
 * Get all categories
 * @returns Array of category names
 */
export function getAllCategories(): string[] {
  const categoriesSet = new Set<string>();
  
  SAMPLE_DOCS.forEach(doc => {
    if (doc.category) {
      categoriesSet.add(doc.category);
    }
  });
  
  return Array.from(categoriesSet);
} 