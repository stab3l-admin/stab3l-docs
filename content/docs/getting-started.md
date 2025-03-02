---
title: Getting Started
description: Learn how to use TerminalDocs
category: Introduction
order: 1
---

# Getting Started with TerminalDocs

Welcome to TerminalDocs, a standalone documentation site for your projects. This guide will help you get started with using TerminalDocs to create beautiful documentation for your projects.

## Installation

To install TerminalDocs, you need to have Node.js and npm installed on your system. Then, you can clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/terminaldocs.git
cd terminaldocs
npm install
```

## Running the Development Server

To start the development server, run:

```bash
npm run dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

## Adding Documentation

Documentation files are stored in the `content/docs` directory as Markdown files. Each file should include frontmatter with metadata:

```markdown
---
title: Getting Started
description: Learn how to use TerminalDocs
category: Introduction
order: 1
---

# Getting Started with TerminalDocs

Your content here...
```

### Frontmatter Options

- `title`: The title of the document (required)
- `description`: A brief description of the document (optional)
- `category`: The category the document belongs to (optional, defaults to "Uncategorized")
- `order`: The order in which the document appears in its category (optional, defaults to 999)

## Building for Production

To build the application for production, run:

```bash
npm run build
```

Then, you can start the production server:

```bash
npm run start
```

## Next Steps

Now that you have TerminalDocs up and running, you can start adding your own documentation. Check out the following guides to learn more:

- [Markdown Guide](/docs/markdown-guide)
- [Customization](/docs/customization)
- [Deployment](/docs/deployment) 