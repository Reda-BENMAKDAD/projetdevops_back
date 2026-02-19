#!/bin/sh
set -e

echo "Applying schema to database"
npx prisma deploy

echo "Starting app"
exec "$@"
