#!/usr/bin/env bash
set -euo pipefail

# Export PostgreSQL database from Docker Compose service to a local file.
# Usage:
#   scripts/db-export.sh [output_file]
#
# If output_file is omitted, a timestamped filename is created in the project root.

PROJECT_ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT_DIR"
SERVICE_NAME="postgres"
DB_NAME="payload"
DB_USER="postgres"
CONTAINER_NAME="payload-exove-postgres-1"

timestamp="$(date +%Y%m%d-%H%M%S)"
default_file="$OUTPUT_DIR/db-export-$timestamp.sql"
OUTPUT_FILE="${1:-$default_file}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed or not in PATH" >&2
  exit 1
fi

echo "Exporting database '$DB_NAME' from service '$SERVICE_NAME'..."

# Prefer docker compose (v2), fallback to docker-compose (v1)
if command -v docker compose >/dev/null 2>&1; then
  DCMD="docker compose"
else
  DCMD="docker-compose"
fi

# Ensure service is up (no-op if already running)
$DCMD up -d $SERVICE_NAME >/dev/null

# Use docker exec directly to avoid TTY issues and ensure consistent container name resolution
CID=$($DCMD ps -q $SERVICE_NAME)
if [ -z "$CID" ]; then
  echo "Error: could not find running container for service '$SERVICE_NAME'" >&2
  exit 1
fi

echo "Creating dump to '$OUTPUT_FILE'..."
docker exec -e PGPASSWORD=$DB_USER "${CID}" \
  bash -lc "pg_dump -U $DB_USER -d $DB_NAME -F p --no-owner --no-privileges" \
  > "$OUTPUT_FILE"

echo "Done: $OUTPUT_FILE"


