FROM node:20-alpine AS builder
WORKDIR /tmp
COPY . .
# RUN npm i && npm run build && npm i --omit=dev
RUN npm i -g pnpm && pnpm i -g @nestjs/cli && pnpm i --prod && pnpm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /tmp/dist ./dist
EXPOSE 3000
ENTRYPOINT node dist/main
