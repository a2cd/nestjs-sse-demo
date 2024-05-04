FROM node:16 AS builder
WORKDIR /tmp
COPY . .
RUN npm i && npm run build && npm i --omit=dev
#RUN npm i pnpm -g && pnpm i && pnpm run build && pnpm i --prod

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /tmp/dist ./dist
EXPOSE 3000
ENTRYPOINT node dist/main
