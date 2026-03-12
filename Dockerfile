FROM node:22-slim AS builder
WORKDIR /app
ENV HUSKY=0
ENV VITE_BASE_URL=/
ENV VITE_SENTRY_ENABLE=false
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm build:pages

FROM nginx:1.27-alpine AS runner
WORKDIR /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
