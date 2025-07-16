# Use multi-stage build for optimization
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.0.0

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
COPY packages/node-prisma/package.json ./packages/node-prisma/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client only (don't migrate during build)
RUN pnpm --filter @devcord/node-prisma prisma:generate

# Build stage
FROM base AS builder

# Set a dummy DATABASE_URL for build time
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Build the project
RUN pnpm build

# Production stage for frontend
FROM node:18-alpine AS frontend
RUN npm install -g pnpm@9.0.0
WORKDIR /app

# Copy built frontend
COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/node-prisma ./packages/node-prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./

# Create startup script
COPY --from=builder /app/scripts/railway-start.sh ./scripts/
RUN chmod +x ./scripts/railway-start.sh

EXPOSE 3000
CMD ["./scripts/railway-start.sh", "frontend"]

# Production stage for backend
FROM node:18-alpine AS backend
RUN npm install -g pnpm@9.0.0
WORKDIR /app

# Copy built backend
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/node-prisma ./packages/node-prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./

# Create startup script
COPY --from=builder /app/scripts/railway-start.sh ./scripts/
RUN chmod +x ./scripts/railway-start.sh

EXPOSE 8000
CMD ["./scripts/railway-start.sh", "backend"]
