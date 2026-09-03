# Pain Point Helpers

Fillable life, work, and family templates plus retirement, savings, and mortgage calculators. Fill online, print a clean PDF, share a link, or save under an account. Maybee, the house bee, explains what the site and each kit are for.

**All-access:** $5 / month · $25 / year · $59 lifetime

Built for Maybee Creations.

## Stack

TanStack Start, React 19, Tailwind v4, Better Auth (Google, X, email), Postgres (Neon in production, PGLite in preview).

## Local

```
npm install
npm run dev
```

## Deploy (Vercel)

1. Import this repo in Vercel.
2. Set `DATABASE_URL` to a Neon (or other Postgres) connection string.
3. Production builds run `npm run build`, which applies migrations.

Email/password works on your own Vercel project. Google / X sign-in uses the Grok auth broker and is injected on Grok-hosted deploys.

Filling helpers is free. Saving, printing, and sharing require all-access (activated in-app in preview).
