#!/usr/bin/env bash
set -euo pipefail

# Import a SQL dump into the PostgreSQL database running in the Docker Compose service.
# Usage:
#   scripts/db-import.sh <dump_file.sql>

if [ ${#} -lt 1 ]; then
  echo "Usage: $0 <dump_file.sql>" >&2
  exit 1
fi

DUMP_FILE="$1"
if [ ! -f "$DUMP_FILE" ]; then
  echo "Error: file not found: $DUMP_FILE" >&2
  exit 1
fi

SERVICE_NAME="postgres"
DB_NAME="payload"
DB_USER="postgres"

echo "WARNING: This will DROP ALL TABLES in database '$DB_NAME' and re-import from '$DUMP_FILE'."
read -r -p "Do you want to continue? (type 'yes' to proceed): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Aborted by user."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed or not in PATH" >&2
  exit 1
fi

# Prefer docker compose (v2), fallback to docker-compose (v1)
if command -v docker compose >/dev/null 2>&1; then
  DCMD="docker compose"
else
  DCMD="docker-compose"
fi

echo "Ensuring service '$SERVICE_NAME' is running..."
$DCMD up -d $SERVICE_NAME >/dev/null

CID=$($DCMD ps -q $SERVICE_NAME)
if [ -z "$CID" ]; then
  echo "Error: could not find running container for service '$SERVICE_NAME'" >&2
  exit 1
fi

echo "Creating database if it doesn't exist..."
docker exec -e PGPASSWORD=$DB_USER "$CID" bash -lc "psql -U $DB_USER -tc \"SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'\" | grep -q 1 || createdb -U $DB_USER $DB_NAME"

echo "Dropping all tables in database '$DB_NAME'..."
docker exec -e PGPASSWORD=$DB_USER "$CID" bash -lc "psql -q -X -U $DB_USER -d $DB_NAME -v ON_ERROR_STOP=1 -c 'DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO \"$DB_USER\"; GRANT ALL ON SCHEMA public TO public;' > /dev/null"

echo "Importing '$DUMP_FILE' into database '$DB_NAME'..."
cat "$DUMP_FILE" | docker exec -i -e PGPASSWORD=$DB_USER "$CID" bash -lc "psql -q -X -U $DB_USER -d $DB_NAME -v ON_ERROR_STOP=1 > /dev/null"

echo "Import completed."


