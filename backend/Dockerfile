# syntax=docker/dockerfile:1.6

##############################
# Builder: install deps + build
##############################
FROM node:24-alpine AS builder
WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy sources and build
COPY tsconfig.json ./
COPY src ./src
COPY drizzle.config.ts ./drizzle.config.ts
RUN npm run build

##############################
# Prod deps only
##############################
FROM node:24-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install drizzle-kit for migrations
RUN npm install -g drizzle-kit

# Copy runtime artifacts
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY package.json ./package.json
COPY paths.js /app/
COPY start.sh ./start.sh

EXPOSE 3000

RUN chmod +x /app/start.sh

CMD ["sh", "/app/start.sh"]