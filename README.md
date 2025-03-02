# TerminalDocs

A minimal, terminal-style documentation site built with Next.js.

## Features

- Markdown support with code syntax highlighting
- Search functionality
- Dark mode
- Responsive design
- Simple and minimal interface
- Fast and lightweight

## Getting Started

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Write Your Own Docs

### Adding Documentation Files

All documentation files are stored as Markdown files in the `content/docs` directory. To add a new documentation page:

1. Create a new `.md` file in the `content/docs` directory
2. Add frontmatter at the top of the file to specify metadata:

```markdown
---
title: Your Document Title
description: A brief description of the document
category: Category Name
order: 1
---

# Your Document Title

Content goes here...
```

The frontmatter fields are:
- `title`: The title of the document (required)
- `description`: A brief description (optional)
- `category`: The category the document belongs to (required for organization)
- `order`: The order in which the document appears within its category (optional)

### Writing Content

Write your documentation content using Markdown syntax. TerminalDocs supports all standard Markdown features:

- Headers (# H1, ## H2, etc.)
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Links
- Images
- Tables
- Blockquotes

Example:

```markdown
---
title: API Reference
description: Reference documentation for the API
category: Reference
order: 1
---

# API Reference

This page documents the API for TerminalDocs.

## Configuration

TerminalDocs can be configured using the `terminaldocs.config.js` file.

```js
module.exports = {
  title: 'My Documentation',
  description: 'Documentation for my project',
  logo: '/logo.svg',
  // Other configuration options
};
```

## Programmatic Usage

TerminalDocs can also be used programmatically:

```js
import { TerminalDocs } from 'terminaldocs';

const docs = new TerminalDocs({
  // Configuration options
});

docs.render();
```
```

### Organizing Documentation

Documents are automatically organized based on their `category` field in the frontmatter. Categories are displayed in the sidebar, and documents within each category are sorted by their `order` field.

To create a new category, simply set a new category name in the frontmatter of a document.

### Customizing Styles

You can customize the styles of your documentation site by editing the following files:

- `src/styles/globals.css`: Global styles
- `tailwind.config.js`: Tailwind CSS configuration

## Deployment

To build and deploy your documentation site:

1. Build the site:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

Or export as static HTML:

```bash
npm run export
```

## License

MIT 