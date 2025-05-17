# Etapa de build
FROM node:22 AS builder

WORKDIR /app

COPY ./transacao/package*.json ./
RUN yarn install

COPY ./transacao ./
RUN yarn build && yarn prisma generate

# Etapa de produção
FROM node:22-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

RUN mkdir -p ./logs

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]


