# ─────────────────────────────────────────────────────────────
# Stage 1 — base: pnpm + Alpine node
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

# ─────────────────────────────────────────────────────────────
# Stage 2 — dependencies: install ALL deps (incl. devDeps for build)
# ─────────────────────────────────────────────────────────────
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─────────────────────────────────────────────────────────────
# Stage 3 — build: compile TypeScript → dist/
# ─────────────────────────────────────────────────────────────
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ─────────────────────────────────────────────────────────────
# Stage 4 — prod-dependencies: install ONLY production deps
# ─────────────────────────────────────────────────────────────
FROM base AS prod-dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# ─────────────────────────────────────────────────────────────
# Stage 5 — production: minimal runtime image
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only what is needed to run the server
COPY --from=prod-dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

# Ownership to non-root user
RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
ENV PORT=3001
ENV BACKEND_IP=0.0.0.0

EXPOSE 3001

# Health-check so Docker knows when the app is ready
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3001/ || exit 1

CMD ["node", "dist/index.js"]

# ─────────────────────────────────────────────────────────────
# Stage 6 — development: hot-reload via nodemon
# ─────────────────────────────────────────────────────────────
FROM base AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV PORT=3001
ENV BACKEND_IP=0.0.0.0
EXPOSE 3001
CMD ["pnpm", "run", "dev"]
