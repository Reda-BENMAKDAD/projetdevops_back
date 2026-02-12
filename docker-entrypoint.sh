#!/bin/sh
set -e

# Ce script est utilisé pour deployer la migration de prisma  

if [ "$NODE_ENV" = "production" ]; then
    echo "Environment: PRODUCTION"
    echo "lancement du deploy de prisma"
    npx prisma migrate deploy
fi


echo "Démarrage de l'application..."
exec "$@"