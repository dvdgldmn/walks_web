#!/usr/bin/env bash
# Backup the Postgres DB + uploads. Intended to run on the host via cron.
#
# Usage:
#   DATABASE_URL="postgresql://user:pass@host:5432/db" \
#   UPLOADS_DIR="./uploads" \
#   scripts/backup.sh [output_dir]
#
# Docker (DB inside compose) alternative for the dump line:
#   docker compose -f docker-compose.prod.yml exec -T postgres \
#     pg_dump --no-owner --no-acl -U "$POSTGRES_USER" "$POSTGRES_DB" > "$OUT/db-$TS.sql"
#
# Suggested cron (daily 03:30):
#   30 3 * * * cd /path/to/www && DATABASE_URL=... UPLOADS_DIR=./uploads scripts/backup.sh >> backups/backup.log 2>&1
set -euo pipefail

OUT="${1:-backups}"
UPLOADS="${UPLOADS_DIR:-uploads}"
RETAIN="${RETAIN:-14}"
TS="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$OUT"

: "${DATABASE_URL:?Set DATABASE_URL}"

echo "[backup] dumping database -> $OUT/db-$TS.sql"
pg_dump --no-owner --no-acl --encoding=UTF8 -d "$DATABASE_URL" -f "$OUT/db-$TS.sql"

if [ -d "$UPLOADS" ]; then
  echo "[backup] archiving uploads -> $OUT/uploads-$TS.tar.gz"
  tar -czf "$OUT/uploads-$TS.tar.gz" -C "$(dirname "$UPLOADS")" "$(basename "$UPLOADS")"
fi

# Retention: keep the newest $RETAIN of each kind.
ls -1t "$OUT"/db-*.sql 2>/dev/null | tail -n "+$((RETAIN + 1))" | xargs -r rm -f
ls -1t "$OUT"/uploads-*.tar.gz 2>/dev/null | tail -n "+$((RETAIN + 1))" | xargs -r rm -f

echo "[backup] done."
