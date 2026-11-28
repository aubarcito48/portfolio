# syntax=docker/dockerfile:1
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG DJANGO_API_BASE_URL=http://localhost:8001/api/v1
RUN node scripts/configure-docker-env.mjs && npm run build

FROM nginx:stable-alpine AS runtime

COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/cv-proyecto/browser /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
