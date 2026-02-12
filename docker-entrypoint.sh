#!/bin/sh
set -e

# Ce script est utilisé pour lancer soit des migrations soit un deploy selon l'environnement (production ou developpement)
# définit dans la variable NODE_ENV

if [ "$NODE_ENV" = "production" ]; then
    echo "Environment: PRODUCTION"
    echo "lancement du deploy de prisma"
    npx prisma migrate deploy
else
    echo "Environment: DEVELOPPEMENT"
    echo "⚠️ Lancez 'npx prisma migrate dev' manuellement dans le conteneur pour appliquer les migrations."
fi


echo "Starting application..."
exec "$@"