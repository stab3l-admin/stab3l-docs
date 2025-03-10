---
title: How to Add Your Own Docs
description: Learn how to add your own documentation to TerminalDocs
category: Usage
order: 3
---

# How to Add Your Own Docs

This guide explains how to add your own documentation to TerminalDocs.

## File Structure

All documentation files are stored as Markdown files in the `content/docs` directory. The file structure is simple:

```
content/
  └── docs/
      ├── getting-started.md
      ├── markdown-guide.md
      ├── customization.md
      ├── deployment.md
      ├── api-reference.md
      └── troubleshooting.md
```

## Creating a New Document

To add a new documentation page:

1. Create a new `.md` file in the `content/docs` directory
2. Add frontmatter at the top of the file to specify metadata

Here's an example of a new documentation file:

```markdown
---
title: My New Document
description: This is a description of my new document
category: Usage
order: 4
---

# My New Document

This is the content of my new document.

## Section 1

Content for section 1...

## Section 2

Content for section 2...
```

## Frontmatter Fields

The frontmatter at the top of each document (between the `---` markers) contains metadata about the document. The following fields are supported:

- `title`: The title of the document (required)
- `description`: A brief description of the document (optional)
- `category`: The category the document belongs to (required for organization)
- `order`: The order in which the document appears within its category (optional)

## Categories and Organization

Documents are automatically organized based on their `category` field in the frontmatter. Categories are displayed in the sidebar, and documents within each category are sorted by their `order` field.

To create a new category, simply set a new category name in the frontmatter of a document.

## Markdown Features

TerminalDocs supports all standard Markdown features:

- Headers (# H1, ## H2, etc.)
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Links
- Images
- Tables
- Blockquotes

### Code Blocks

You can add syntax-highlighted code blocks by specifying the language after the opening backticks:

```javascript
// This is a JavaScript code block
function hello() {
  console.log('Hello, world!');
}
```

### Tables

You can create tables using the standard Markdown syntax:

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

### Images

You can include images by placing them in the `public` directory and referencing them:

```markdown
![Alt text](/path/to/image.jpg)
```

## Updating the Navigation

The navigation sidebar is automatically generated based on the frontmatter in your documentation files. No additional configuration is needed.

## Rebuilding After Changes

After adding or modifying documentation files, you need to restart the development server to see the changes:

```bash
# Stop the current server (Ctrl+C) and then run:
npm run dev
```

For production builds, run:

```bash
npm run build
npm start
``` 