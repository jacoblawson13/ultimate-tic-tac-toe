# syntax=docker/dockerfile:1

# ---- builder: install dependencies and build the static site ----
FROM node:24-slim AS builder

RUN npm install --global pnpm

WORKDIR /app
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY frontend/ ./
RUN pnpm build

# ---- runtime: serve the built static files, non-root nginx ----
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

COPY infra/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
