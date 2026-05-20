# Base Stage (installs pnpm and sets up workspace)
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

# Dependencies Stage (installs all dependencies including devDependencies)
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build Stage (compiles typescript code)
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Production Dependencies Stage (installs only production dependencies)
FROM base AS prod-dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Production Stage (minimal image runner)
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=prod-dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/index.js"]

# Development Stage (for local development auto-reload)
FROM base AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV PORT=3001
EXPOSE 3001
CMD ["pnpm", "run", "dev"]
