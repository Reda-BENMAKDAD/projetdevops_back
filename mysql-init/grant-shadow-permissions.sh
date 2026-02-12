#!/bin/bash

# Le but de ce script est de donner les privilèges nécessaires à l'utilisateur MySQL pour que Prisma puisse créer et gérer la base de données Shadow.
# Ce script n'est sensé être exécuté qu'en environnement de développement
# il est appellé dans le docker-compose.override.yml 
set -e

echo "Granting extended privileges to $MYSQL_USER for Prisma Shadow Database..."

mysql -u root -p"$MYSQL_ROOT_PASSWORD" --execute \
"GRANT CREATE, ALTER, DROP, REFERENCES ON *.* TO '$MYSQL_USER'@'%'; FLUSH PRIVILEGES;"

