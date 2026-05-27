# Seed data — quick bootstrap (texts + images)

This folder lets you bring up the site with the current CMS content already in place.

- `db-dump.sql` — full Postgres dump (schema + data, UTF-8), includes translations,
  pages, settings, media records, shelter animals, and the default admin user.
- The actual uploaded images live in `../uploads/` (tracked in git) and match the
  `imagePath` / media records in the dump.

## Local restore

1. Start PostgreSQL and create an empty UTF-8 database:
   ```
   createdb -E UTF8 -O dostywalks dostywalks
   ```
2. Restore the dump:
   ```
   psql "postgresql://dostywalks:<password>@localhost:5432/dostywalks" -f seed-data/db-dump.sql
   ```
3. Images are already in `uploads/` — nothing to do.
4. Install deps and start the apps (see root README).

## Docker restore

```
docker compose -f docker-compose.prod.yml up -d postgres
docker compose -f docker-compose.prod.yml exec -T postgres \
  psql -U dostywalks -d dostywalks < seed-data/db-dump.sql
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```
(Skip the `migrate` step — the dump already contains the schema and Prisma migration
history. Or run `prisma migrate deploy`; it will be a no-op.)

## Notes

- The dump includes the default admin (`admin@dosty.local` / `admin12345`, bcrypt-hashed).
  **Change the admin password after first login.** For a clean prod DB, seed instead
  with the strong `ADMIN_PASSWORD` from `.env.production`.
- This is a one-time bootstrap snapshot, not a backup strategy. Re-dump with:
  ```
  pg_dump --no-owner --no-acl --encoding=UTF8 -d "<DATABASE_URL>" -f seed-data/db-dump.sql
  ```
