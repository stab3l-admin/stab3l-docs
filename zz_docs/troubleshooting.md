---
title: Troubleshooting
description: Solutions to common issues with TerminalDocs
category: Support
order: 1
---

# Troubleshooting

This guide provides solutions to common issues you might encounter when using TerminalDocs.

## Installation Issues

### Error: Cannot find module 'next'

This error occurs when the Next.js package is not installed correctly.

**Solution:**

1. Make sure you have installed the dependencies:

```bash
npm install
```

2. If the error persists, try reinstalling the Next.js package:

```bash
npm install next@latest
```

### Error: Cannot find module '@/components/...'

This error occurs when TypeScript cannot resolve the path aliases.

**Solution:**

1. Make sure your `tsconfig.json` has the correct path configuration:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. Restart your development server:

```bash
npm run dev
```

## Build Issues

### Error: Failed to compile

This error occurs when there are syntax errors or other issues in your code.

**Solution:**

1. Check the error message for details about the specific issue.
2. Fix the identified issues in your code.
3. If the error is related to a specific package, try updating or reinstalling it:

```bash
npm install package-name@latest
```

### Error: Image Optimization requires next/legacy/image

This error occurs when using the Next.js Image component with an external image source.

**Solution:**

1. Add the domain to the `next.config.js` file:

```js
const nextConfig = {
  images: {
    domains: ['example.com'],
  },
};
```

2. Or use the `unoptimized` option if you don't need image optimization:

```js
const nextConfig = {
  images: {
    unoptimized: true,
  },
};
```

## Runtime Issues

### Error: Hydration failed because the initial UI does not match what was rendered on the server

This error occurs when the server-rendered HTML doesn't match the client-side rendered HTML.

**Solution:**

1. Make sure you're not using browser-specific APIs in your server-side code.
2. Use the `useEffect` hook for code that should only run on the client:

```jsx
import { useEffect, useState } from 'react';

function MyComponent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading state
  }

  // Client-side only code
  return <div>...</div>;
}
```

3. Add the `suppressHydrationWarning` attribute to elements with dynamic content:

```jsx
<div suppressHydrationWarning>{new Date().toLocaleTimeString()}</div>
```

### Error: Cannot find module 'gray-matter'

This error occurs when the `gray-matter` package is not installed correctly.

**Solution:**

1. Install the `gray-matter` package:

```bash
npm install gray-matter
```

2. If the error persists, check your import statement:

```js
import matter from 'gray-matter';
```

## Markdown Issues

### Code blocks are not syntax highlighted

This issue occurs when the syntax highlighting plugin is not configured correctly.

**Solution:**

1. Make sure you have installed the required packages:

```bash
npm install rehype-highlight
```

2. Check your `markdown-renderer.tsx` file to ensure the plugin is correctly configured:

```jsx
import rehypeHighlight from 'rehype-highlight';

<ReactMarkdown
  rehypePlugins={[rehypeHighlight]}
  // ...
>
  {content}
</ReactMarkdown>
```

### Images in Markdown are not displayed

This issue occurs when the image paths in your Markdown files are not correctly resolved.

**Solution:**

1. Use absolute URLs for images:

```markdown
![Alt text](https://example.com/image.jpg)
```

2. Or place your images in the `public` directory and reference them with a leading slash:

```markdown
![Alt text](/images/image.jpg)
```

## Deployment Issues

### Error: ENOENT: no such file or directory, open 'content/docs/...'

This error occurs when the content directory is not included in the deployment.

**Solution:**

1. Make sure your deployment process includes the `content` directory.
2. If you're using a custom server, make sure the `content` directory is copied to the deployment directory.
3. If you're using Docker, make sure the `content` directory is copied to the Docker image:

```dockerfile
COPY --from=builder /app/content ./content
```

### Error: Cannot find module 'next/dist/compiled/next-server/pages-api.compiled.js'

This error occurs when deploying to certain platforms that don't fully support Next.js.

**Solution:**

1. Try using the standalone output option in your `next.config.js`:

```js
const nextConfig = {
  output: 'standalone',
};
```

2. Or deploy to a platform that fully supports Next.js, such as Vercel.

## Still Need Help?

If you're still experiencing issues, you can:

1. Check the [Next.js documentation](https://nextjs.org/docs) for more information.
2. Open an issue on the [TerminalDocs GitHub repository](https://github.com/yourusername/terminaldocs/issues).
3. Search for similar issues on Stack Overflow or other forums. 