---
title: Customization
description: Learn how to customize TerminalDocs to match your brand and requirements
category: Usage
order: 6
---

# Customization

TerminalDocs is designed to be highly customizable. This guide covers the various ways you can customize TerminalDocs to match your brand and requirements.

## Theme Customization

TerminalDocs uses Tailwind CSS for styling, making it easy to customize the look and feel of your documentation site.

### Colors

You can customize the colors used throughout the site by modifying the `tailwind.config.js` file:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Add more custom colors as needed
      },
    },
  },
};
```

### Usage of Custom Colors

Once you've defined your custom colors, you can use them throughout your components:

```jsx
// Example button component using custom colors
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded">
  Click me
</button>
```

### Fonts

You can customize the fonts used in TerminalDocs by modifying the `tailwind.config.js` file and importing the fonts in your CSS:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
};
```

Then import the fonts in your global CSS file:

```css
/* src/styles/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');
```

## Layout Customization

### Sidebar

You can customize the sidebar by modifying the `Sidebar.tsx` component:

```tsx
// src/components/sidebar.tsx
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Document } from '@/types';

interface SidebarProps {
  documents: Document[];
}

export function Sidebar({ documents }: SidebarProps) {
  const router = useRouter();
  const { pathname } = router;

  // Group documents by category
  const groupedDocuments = documents.reduce((acc, doc) => {
    const category = doc.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  // Sort categories
  const sortedCategories = Object.keys(groupedDocuments).sort((a, b) => {
    // Custom category order
    const order = ['Getting Started', 'Usage', 'Advanced', 'API'];
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="w-64 h-screen overflow-y-auto border-r border-border bg-background">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Documentation</h2>
        {sortedCategories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              {category}
            </h3>
            <ul className="space-y-1">
              {groupedDocuments[category]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((doc) => (
                  <li key={doc.slug}>
                    <Link href={`/docs/${doc.slug}`}>
                      <a
                        className={`block px-2 py-1 rounded-md text-sm ${
                          pathname === `/docs/${doc.slug}`
                            ? 'bg-primary-50 text-primary-600 font-medium dark:bg-primary-950 dark:text-primary-400'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        {doc.title}
                      </a>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Header

You can customize the header by modifying the `Header.tsx` component:

```tsx
// src/components/header.tsx
import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Document } from '@/types';

interface HeaderProps {
  documents: Document[];
}

export function Header({ documents }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Document[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const results = documents.filter((doc) => 
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.description?.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <span className="text-xl font-bold">TerminalDocs</span>
            </a>
          </Link>
          
          <nav className="hidden md:flex space-x-4">
            <Link href="/docs/getting-started">
              <a className="text-sm font-medium hover:text-primary-600">Docs</a>
            </Link>
            <Link href="/blog">
              <a className="text-sm font-medium hover:text-primary-600">Blog</a>
            </Link>
            <Link href="/about">
              <a className="text-sm font-medium hover:text-primary-600">About</a>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-md hover:bg-muted"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            
            {showSearch && (
              <div className="absolute right-0 mt-2 w-72 bg-background border border-border rounded-md shadow-lg">
                <div className="p-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search documentation..."
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                </div>
                
                {searchResults.length > 0 && (
                  <ul className="max-h-60 overflow-y-auto border-t border-border">
                    {searchResults.map((doc) => (
                      <li key={doc.slug} className="border-b border-border last:border-b-0">
                        <Link href={`/docs/${doc.slug}`}>
                          <a
                            className="block p-2 hover:bg-muted"
                            onClick={clearSearch}
                          >
                            <div className="font-medium">{doc.title}</div>
                            {doc.description && (
                              <div className="text-sm text-muted-foreground">
                                {doc.description}
                              </div>
                            )}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                
                {searchQuery && searchResults.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
          
          <ThemeToggle />
          
          <a
            href="https://github.com/yourusername/terminaldocs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md hover:bg-muted"
            aria-label="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
```

## Content Customization

### Frontmatter Options

You can customize the frontmatter options for your documentation files:

```markdown
---
title: My Document
description: A detailed description of my document
category: Getting Started
order: 1
image: /images/cover.png
author: John Doe
tags: [react, nextjs, documentation]
---
```

You can access these frontmatter options in your components:

```tsx
// src/pages/docs/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { getAllDocuments, getDocumentBySlug } from '@/lib/api';
import { Document } from '@/types';

interface DocPageProps {
  document: Document;
  mdxSource: any;
}

export default function DocPage({ document, mdxSource }: DocPageProps) {
  return (
    <div>
      <h1>{document.title}</h1>
      {document.description && <p>{document.description}</p>}
      {document.author && <p>Author: {document.author}</p>}
      {document.tags && (
        <div>
          Tags: {document.tags.map(tag => (
            <span key={tag} className="mr-2">{tag}</span>
          ))}
        </div>
      )}
      <MDXRemote {...mdxSource} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const document = getDocumentBySlug(params?.slug as string);
  const mdxSource = await serialize(document.content);
  
  return {
    props: {
      document,
      mdxSource,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const documents = getAllDocuments();
  
  return {
    paths: documents.map((doc) => ({
      params: {
        slug: doc.slug,
      },
    })),
    fallback: false,
  };
};
```

## Advanced Customization

### Custom Components

You can create custom components for your documentation:

```tsx
// src/components/custom-components/api-endpoint.tsx
interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  children?: React.ReactNode;
}

export function ApiEndpoint({ method, path, description, children }: ApiEndpointProps) {
  const methodColors = {
    GET: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    PATCH: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };

  return (
    <div className="my-6 border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border bg-muted">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${methodColors[method]}`}>
            {method}
          </span>
          <code className="text-sm font-mono">{path}</code>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      {children && <div className="p-4">{children}</div>}
    </div>
  );
}
```

To use this custom component in your MDX files:

```jsx
// In your MDX file
import { ApiEndpoint } from '@/components/custom-components/api-endpoint';

<ApiEndpoint
  method="GET"
  path="/api/users"
  description="Get a list of all users"
>
  <h4>Parameters</h4>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>page</td>
        <td>number</td>
        <td>Page number (default: 1)</td>
      </tr>
      <tr>
        <td>limit</td>
        <td>number</td>
        <td>Number of items per page (default: 10)</td>
      </tr>
    </tbody>
  </table>
</ApiEndpoint>
```

### Custom MDX Components

You can customize the components used to render MDX content:

```tsx
// src/components/mdx-components.tsx
import Link from 'next/link';
import Image from 'next/image';

const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-bold mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="my-4 leading-7" {...props} />,
  a: ({ href, ...props }: any) => {
    if (href.startsWith('/')) {
      return <Link href={href}><a className="text-primary-600 hover:underline" {...props} /></Link>;
    }
    return <a href={href} className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />;
  },
  ul: (props: any) => <ul className="my-4 ml-6 list-disc" {...props} />,
  ol: (props: any) => <ol className="my-4 ml-6 list-decimal" {...props} />,
  li: (props: any) => <li className="my-1" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-primary-200 pl-4 my-4 italic" {...props} />,
  code: ({ className, ...props }: any) => (
    <code
      className={`${className} rounded bg-muted px-1 py-0.5 font-mono text-sm`}
      {...props}
    />
  ),
  pre: (props: any) => <pre className="my-4 p-4 rounded-lg bg-muted overflow-x-auto" {...props} />,
  img: ({ src, alt, ...props }: any) => (
    <div className="my-4">
      <Image
        src={src}
        alt={alt}
        layout="responsive"
        width={800}
        height={400}
        className="rounded-lg"
        {...props}
      />
      {alt && <p className="text-center text-sm text-muted-foreground mt-2">{alt}</p>}
    </div>
  ),
  table: (props: any) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: any) => <th className="border border-border px-4 py-2 text-left font-bold bg-muted" {...props} />,
  td: (props: any) => <td className="border border-border px-4 py-2" {...props} />,
};

export default components;
```

To use these custom components:

```tsx
// src/pages/docs/[slug].tsx
import { MDXRemote } from 'next-mdx-remote';
import components from '@/components/mdx-components';

export default function DocPage({ mdxSource }) {
  return (
    <div>
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}
```

## Deployment Customization

### Environment Variables

You can customize your deployment using environment variables:

```
# Site configuration
NEXT_PUBLIC_SITE_NAME=TerminalDocs
NEXT_PUBLIC_SITE_DESCRIPTION=Beautiful documentation for your projects
NEXT_PUBLIC_SITE_URL=https://terminaldocs.com

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# API endpoints
NEXT_PUBLIC_API_URL=https://api.example.com
```

You can access these environment variables in your components:

```tsx
// src/components/seo.tsx
import Head from 'next/head';

interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export function SEO({
  title,
  description = process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
  canonical,
  ogImage,
}: SeoProps) {
  const siteTitle = process.env.NEXT_PUBLIC_SITE_NAME;
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const pageUrl = canonical || process.env.NEXT_PUBLIC_SITE_URL;
  const imageUrl = ogImage || `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
}
```

## Conclusion

TerminalDocs offers extensive customization options to help you create a documentation site that matches your brand and requirements. By leveraging the power of Next.js, Tailwind CSS, and MDX, you can create a unique and powerful documentation experience for your users.

{% hint style="info" %}
Remember to restart your development server after making changes to configuration files like `tailwind.config.js` to see the changes take effect.
{% endhint %} 