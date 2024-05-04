FROM node:16 AS builder
WORKDIR /tmp
COPY package.json package-lock.json ./
RUN npm install --production && npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /tmp/dist ./dist
EXPOSE 3000
ENTRYPOINT node dist/main
