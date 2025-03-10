---
title: Getting Started
description: Learn how to use TerminalDocs
category: Introduction
order: 1
---

# Getting Started with TerminalDocs

Welcome to TerminalDocs, a standalone documentation site for your projects. This guide will help you get started with using TerminalDocs to create beautiful documentation for your projects.

{% hint style="info" %}
TerminalDocs now supports GitBook-like features such as hint blocks, tabs, and more. Check out the [GitBook Features](/docs/gitbook-features) page for more information.
{% endhint %}

## Installation

To install TerminalDocs, you need to have Node.js and npm installed on your system. Then, you can clone the repository and install the dependencies:

### Using npm

```bash
git clone https://github.com/stab3l/terminaldocs.git
cd terminaldocs
npm install
```

### Using yarn

```bash
git clone https://github.com/stab3l/terminaldocs.git
cd terminaldocs
yarn install
```

### Using pnpm

```bash
git clone https://github.com/stab3l/terminaldocs.git
cd terminaldocs
pnpm install
```

## Running the Development Server

To start the development server, run:

```bash
npm run dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

{% hint style="warning" %}
Make sure port 3000 is available on your system. If it's already in use, the development server will try to use the next available port.
{% endhint %}

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

| Option | Type | Description | Required |
|--------|------|-------------|----------|
| title | string | The title of the document | Yes |
| description | string | A brief description of the document | No |
| category | string | The category the document belongs to | No (defaults to "Uncategorized") |
| order | number | The order in which the document appears in its category | No (defaults to 999) |

## Building for Production

To build the application for production, run:

### Build command

```bash
npm run build
```

### Start command

```bash
npm run start
```

{% hint style="success" %}
Your documentation site is now ready for deployment! Check out the [Deployment](/docs/deployment) guide for more information on how to deploy your site.
{% endhint %}

## Next Steps

Now that you have TerminalDocs up and running, you can start adding your own documentation. Check out the following guides to learn more:

- [Markdown Guide](/docs/markdown-guide)
- [Customization](/docs/customization)
- [Deployment](/docs/deployment)
- [GitBook Features](/docs/gitbook-features) 