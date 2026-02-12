#!/bin/sh
set -e

echo "Generating Prisma client"
npx prisma generate

echo "Applying schema to database"
npx prisma db push --accept-data-loss

echo "Starting app"
exec "$@"
