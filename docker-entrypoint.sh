#!/bin/sh
set -e

echo "Applying schema to database"
npx prisma migrate deploy
npx prisma db seed

echo "Starting app"
exec "$@"
