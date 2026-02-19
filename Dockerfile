FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm install

COPY . .

RUN chmod +x docker-entrypoint.sh

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "./docker-entrypoint.sh" ]

CMD ["node", "./dist/main.js"]
