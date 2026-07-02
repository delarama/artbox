# ArtBox

Canadian children's-artwork preservation service — marketing site and ordering app built with Next.js 15, Prisma, and Supabase.

## Development

```bash
cp .env.example .env.local
# Fill DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL

npm install
npm run db:push   # or: npm run db:migrate (production)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Check `/api/health` for backend status.

## Production environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Supabase Postgres connection string |
| `AUTH_SECRET` | Yes | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Production app URL |
| `ADMIN_EMAILS` | Recommended | Comma-separated admin emails |
| `STRIPE_*` | For payments | Checkout + webhook |
| `RESEND_API_KEY` | For email | Password reset + order confirmation |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` + `SUPABASE_STORAGE_BUCKET` | For uploads | Durable photo storage |

Create a public Supabase Storage bucket named `order-photos` (or match `SUPABASE_STORAGE_BUCKET`).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add all environment variables from `.env.example`.
4. Set `NEXTAUTH_URL` to your Vercel domain (e.g. `https://artbox.vercel.app`).
5. Add Stripe webhook endpoint: `https://<your-domain>/api/webhooks/stripe` (event: `checkout.session.completed`).
6. Deploy — build runs `prisma migrate deploy` then `next build`.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run db:migrate` — create/apply migrations (dev)
- `npm run db:push` — sync schema without migrations (dev only)
- `npm run db:studio` — Prisma Studio

## Design reference

See [designs/README.md](designs/README.md) for tokens, flows, and screen specs.
