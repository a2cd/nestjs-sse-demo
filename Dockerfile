FROM node:20-alpine AS builder
WORKDIR /tmp
COPY . .
# RUN npm i && npm run build && npm i --omit=dev
RUN set -evx \
  && npm i -g pnpm \
  # 先下载所有依赖，包括devDependencies
  && pnpm i \
  && pnpm run build \
  # 打包完成后删除冗余devDependencies
  && rm -rf node_modules \
  # 重新安装dependencies
  && pnpm i --prod

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /tmp/dist ./dist
EXPOSE 3000
ENTRYPOINT node dist/main
