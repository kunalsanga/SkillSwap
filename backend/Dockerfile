FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE 5000

# We use npm run dev for hot-reloading in development
CMD ["npm", "run", "dev"]
