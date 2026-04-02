FROM oven/bun:1.2-alpine AS builder
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM node:22-alpine AS runtime
WORKDIR /app
RUN addgroup -g 1001 -S cascade && adduser -u 1001 -S cascade -G cascade
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
RUN mkdir -p /app/logs && chown -R cascade:cascade /app/logs
USER cascade
CMD ["node", "dist/index.js"]
