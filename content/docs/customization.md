---
title: Customization
description: Learn how to customize TerminalDocs
category: Guides
order: 2
---

# Customization

TerminalDocs is designed to be easily customizable to match your project's branding and requirements. This guide will show you how to customize various aspects of TerminalDocs.

## Styling

TerminalDocs uses Tailwind CSS for styling. You can customize the appearance by modifying the `tailwind.config.js` file and the global styles in `src/styles/globals.css`.

### Theme Colors

You can customize the theme colors by modifying the color variables in `src/styles/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... other color variables ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... other color variables ... */
}
```

### Typography

You can customize the typography by modifying the font settings in `src/app/layout.tsx`:

```tsx
import { Inter, Roboto, Lato } from 'next/font/google';

// Change the font
const inter = Inter({ subsets: ['latin'] });
// Or use a different font
const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'] 
});
```

## Components

The components are located in the `src/components` directory. You can modify them to suit your needs.

### Header

You can customize the header by modifying the `src/components/header.tsx` file. For example, you can change the logo, add navigation links, or modify the search functionality.

### Sidebar

You can customize the sidebar by modifying the `src/components/sidebar.tsx` file. For example, you can change the sidebar width, add custom icons, or modify the category display.

### Markdown Renderer

You can customize the markdown renderer by modifying the `src/components/markdown-renderer.tsx` file. For example, you can add custom components for specific markdown elements or modify the styling of the rendered content.

## Adding Custom Pages

You can add custom pages to TerminalDocs by creating new files in the `src/app` directory. For example, you can create a custom landing page, a blog, or a contact page.

### Example: Adding a Blog

To add a blog to TerminalDocs, you can create a new directory `src/app/blog` with the following files:

1. `page.tsx` - The main blog page that lists all blog posts
2. `[slug]/page.tsx` - The individual blog post page
3. `layout.tsx` - The layout for the blog pages

## Adding Custom Functionality

You can add custom functionality to TerminalDocs by creating new components and utilities. For example, you can add a newsletter subscription form, a feedback system, or integration with external services.

### Example: Adding a Newsletter Subscription Form

```tsx
// src/components/newsletter-form.tsx
"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      // Call your newsletter API here
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Subscribe to our newsletter
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Enter your email"
            required
          />
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
      </div>
      {status === "success" && (
        <p className="text-sm text-green-600">
          Thank you for subscribing!
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">
          An error occurred. Please try again.
        </p>
      )}
    </form>
  );
}
```

## Conclusion

This guide covers the basics of customizing TerminalDocs. You can customize almost every aspect of TerminalDocs to match your project's requirements. If you need more advanced customization, you can modify the source code directly. 