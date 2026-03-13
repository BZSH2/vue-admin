FROM node:22-slim AS builder
WORKDIR /app
ENV HUSKY=0
# 接收构建参数，默认为 production
ARG BUILD_ENV=production

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
# 根据传入的 BUILD_ENV 参数执行对应的打包命令
RUN pnpm build:${BUILD_ENV}

FROM nginx:1.27-alpine AS runner
WORKDIR /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
