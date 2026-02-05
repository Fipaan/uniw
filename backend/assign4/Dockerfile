FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/server.js"]
