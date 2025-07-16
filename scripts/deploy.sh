#!/bin/bash

set -e

echo "🚀 Starting Devcord deployment..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set!"
    exit 1
fi

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm db:generate

# Run database migrations
echo "📊 Running database migrations..."
pnpm db:migrate

# Build the project
echo "🏗️  Building project..."
pnpm build

echo "✅ Deployment build complete!"
echo "🎯 Ready to start with: pnpm start"
