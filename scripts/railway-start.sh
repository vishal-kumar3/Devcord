#!/bin/bash

set -e

echo "🚀 Starting Railway deployment..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set!"
    exit 1
fi

echo "✅ Environment variables are set"

# Run database migrations
echo "📦 Running database migrations..."
pnpm --filter @devcord/node-prisma prisma:migrate:deploy

# Generate Prisma client with latest schema
echo "🔧 Generating Prisma client..."
pnpm --filter @devcord/node-prisma prisma:generate

echo "✅ Database setup complete"

# Start the appropriate service
if [ "$1" = "frontend" ]; then
    echo "🎨 Starting frontend..."
    cd apps/frontend && pnpm start
elif [ "$1" = "backend" ]; then
    echo "⚡ Starting backend..."
    cd apps/backend && pnpm start
else
    echo "❌ Unknown service: $1"
    echo "Usage: $0 [frontend|backend]"
    exit 1
fi
