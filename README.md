# Nutrivue

Nutrivue is a modern nutrition tracking app foundation inspired by MyFitnessPal, Cronometer, Apple Fitness, and premium fintech dashboards.

## Current Foundation

- Next.js App Router with TypeScript
- Tailwind CSS design system
- Mobile-first shell with bottom navigation
- Dashboard, onboarding, diary, add-food, progress, and profile screens
- Barcode lookup route using Open Food Facts first, then USDA when configured
- USDA food search route with generic versus packaged source ordering
- Prisma schema for user profiles, foods, diary entries, saved meals, water, weight, and barcode cache
- Placeholder AI assistant route and UI surface
- Capacitor-ready iOS and Android wrapper configuration
- Native-safe layout handling for notches, status bars, keyboards, and bottom home indicators

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL`, `AUTH_SECRET`, optionally `USDA_API_KEY`, and `OPEN_FOOD_FACTS_CONTACT_EMAIL` for the Open Food Facts User-Agent.

4. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the app:

```bash
npm run dev
```

## iOS and Android Distribution

Nutrivue is set up as a Capacitor app. This lets the same Next.js frontend ship inside native iOS and Android shells while the API routes, Prisma, PostgreSQL, auth, Open Food Facts integration, USDA integration, and AI assistant run on a hosted backend.

For mobile builds:

1. Deploy the Next.js app to a production URL.

2. Set the deployed URL in `.env`:

```bash
NEXT_PUBLIC_APP_URL="https://your-nutrivue-domain.com"
```

3. Add native projects once:

```bash
npm run mobile:init
```

4. Sync changes into the native projects:

```bash
npm run mobile:sync
```

5. Open the native projects:

```bash
npm run mobile:ios
npm run mobile:android
```

The app already includes Capacitor plugins for app lifecycle, camera/barcode-scanner readiness, haptics, keyboard resizing, status bar styling, preferences, and network state. The actual barcode scanner implementation can use a Capacitor barcode scanning plugin in the next iteration.

## API Routes

- `GET /api/barcode/[barcode]`
- `GET /api/foods/search?q=chicken%20breast`
- `POST /api/user/profile`
- `POST /api/assistant`

## Notes

The first version focuses on the product foundation and polished UX surface. Authentication, persistence wiring, scanner SDK integration, and full food logging mutations are intentionally staged for the next iteration.
