# Deploying Nutrivue

Nutrivue is a full-stack Next.js app. It should not be deployed with GitHub Pages because GitHub Pages can only host static files and cannot run Next.js API routes, Prisma, authentication, barcode lookup routes, or future AI assistant routes.

## Recommended Setup

Use GitHub for source control and CI, then deploy the app to a Next.js host.

Good hosting options:

- Vercel for the Next.js app
- Neon, Supabase, or Railway for PostgreSQL

## First GitHub Push

This project should be its own repository. From this folder:

```bash
git init
git add .
git commit -m "Initial Nutrivue app foundation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nutrivue.git
git push -u origin main
```

If this folder is already inside a larger git repository, move or copy the Nutrivue folder into its own clean folder before running those commands.

## Vercel Environment Variables

Set these in the Vercel project settings:

```bash
DATABASE_URL="your hosted postgres connection string"
AUTH_SECRET="a long random secret"
AUTH_URL="https://your-vercel-domain.vercel.app"
NEXT_PUBLIC_APP_URL="https://blink-indol.vercel.app"
USDA_API_KEY="optional for now"
```

## Build Settings

Use these defaults:

```bash
Install command: npm ci
Build command: npm run build
Output directory: .next
Node version: 22
```

## After The Web App Deploys

Use the deployed URL for the iOS and Android wrapper:

```bash
NEXT_PUBLIC_APP_URL="https://blink-indol.vercel.app"
npm run mobile:init
npm run mobile:sync
```

The native shell loads `NEXT_PUBLIC_APP_URL`. The local `capacitor-www/index.html` file is only an offline fallback so Capacitor has valid web assets during sync.
