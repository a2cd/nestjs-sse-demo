FROM node:16 AS builder
WORKDIR /tmp
COPY package.json pnpm-lock.json ./
RUN pnpm i --prod && pnpm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /tmp/dist ./dist
EXPOSE 3000
ENTRYPOINT node dist/main
