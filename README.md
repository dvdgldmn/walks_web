# Dosty Walks Platform

CMS workspace for:

- `apps/api` — `NestJS + Prisma + Postgres`
- `apps/admin` — `Next.js` admin panel
- `apps/website` — `Next.js` public website backed by CMS
- `uploads/` — local file storage

## What is implemented

- JWT-protected admin API
- content modules for `settings`, `translations`, `pages`, and `media`
- public read-only API for website consumption
- admin screens for:
  - login
  - translations
  - media
  - pages
  - settings
- website routes:
  - `/[lang]`
  - `/[lang]/[slug]` for legal pages from CMS
- Prisma schema, seed, and initial SQL migration
- production Dockerfiles and `docker-compose.prod.yml`

## Local run

1. Copy `.env.example` to `.env`
2. Start PostgreSQL
3. Run `npm install`
4. Run `npm run prisma:generate`
5. Run migrations against your database
6. Run `npm run prisma:seed`
7. Start:
   - `npm run dev:api`
   - `npm run dev:admin`
   - `npm run dev:website`

## Admin credentials

Local dev defaults (from `.env`): `admin@dosty.local` / `admin12345`.

For production, set strong `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.production`
(see `.env.production.example`) **before** the first seed, and change the password
after first login. Never deploy with the dev defaults.

## Notes

- `docker compose up -d` is included, but Docker must be installed on the machine.
- uploads are stored locally in `uploads/`
- public site data is served from `/api/public/*`
- legal page slugs are editable in CMS and resolved by the dynamic website route

## Production

1. Set real secrets and URLs in `.env`
2. Ensure `DATABASE_URL` points to the production Postgres service
3. Run migrations and seed once
4. Build and start with `docker compose -f docker-compose.prod.yml up -d --build`
