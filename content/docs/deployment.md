---
title: Deployment
description: Learn how to deploy TerminalDocs to production
category: Guides
order: 3
---

# Deployment

This guide will show you how to deploy TerminalDocs to various hosting platforms.

## Building for Production

Before deploying TerminalDocs, you need to build it for production:

```bash
npm run build
```

This will create an optimized production build in the `.next` directory.

## Deploying to Vercel

[Vercel](https://vercel.com/) is the easiest way to deploy TerminalDocs, as it's built on Next.js.

### Steps:

1. Push your TerminalDocs project to a Git repository (GitHub, GitLab, or Bitbucket).
2. Sign up for a Vercel account if you don't have one.
3. Click on "New Project" in the Vercel dashboard.
4. Import your Git repository.
5. Vercel will automatically detect that it's a Next.js project and configure the build settings.
6. Click "Deploy" and wait for the deployment to complete.

Vercel will automatically build and deploy your TerminalDocs site. It also provides automatic deployments for every push to your repository.

## Deploying to Netlify

[Netlify](https://www.netlify.com/) is another great option for deploying TerminalDocs.

### Steps:

1. Push your TerminalDocs project to a Git repository (GitHub, GitLab, or Bitbucket).
2. Sign up for a Netlify account if you don't have one.
3. Click on "New site from Git" in the Netlify dashboard.
4. Import your Git repository.
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy site" and wait for the deployment to complete.

You'll also need to add a `netlify.toml` file to the root of your project with the following content:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Deploying to GitHub Pages

You can deploy TerminalDocs to [GitHub Pages](https://pages.github.com/) using GitHub Actions.

### Steps:

1. Create a `.github/workflows/deploy.yml` file in your repository with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Export
        run: npm run export

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

2. Add the following to your `package.json`:

```json
{
  "scripts": {
    "export": "next export"
  }
}
```

3. Add the following to your `next.config.js`:

```js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['github.com', 'raw.githubusercontent.com'],
    unoptimized: true,
  },
  // Enable MDX files to be imported
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Add basePath for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/terminaldocs' : '',
};
```

4. Push your changes to the main branch.
5. GitHub Actions will build and deploy your site to the `gh-pages` branch.
6. Go to your repository settings, navigate to the "Pages" section, and select the `gh-pages` branch as the source.

## Deploying to a Custom Server

You can also deploy TerminalDocs to your own server.

### Steps:

1. Build the project:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start
```

This will start the Next.js server on port 3000. You can use a process manager like [PM2](https://pm2.keymetrics.io/) to keep the server running:

```bash
npm install -g pm2
pm2 start npm --name "terminaldocs" -- start
```

3. Set up a reverse proxy (e.g., Nginx or Apache) to forward requests to the Next.js server.

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name docs.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Using Docker

You can also deploy TerminalDocs using Docker.

1. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/content ./content

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. Add the following to your `next.config.js`:

```js
const nextConfig = {
  // ... other config
  output: 'standalone',
};
```

3. Build and run the Docker image:

```bash
docker build -t terminaldocs .
docker run -p 3000:3000 terminaldocs
```

## Conclusion

This guide covers the most common ways to deploy TerminalDocs. Choose the method that best fits your needs and infrastructure. If you encounter any issues during deployment, check the documentation of the hosting platform or the Next.js deployment documentation. 