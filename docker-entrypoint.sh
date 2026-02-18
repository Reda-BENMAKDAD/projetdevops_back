#!/bin/sh
set -e

echo "Applying schema to database"
npx prisma db push --accept-data-loss

echo "Starting app"
exec "$@"
