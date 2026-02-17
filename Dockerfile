FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && npx prisma db push --accept-data-loss && node dist/main.js"]
