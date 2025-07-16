#!/bin/bash

# Docker production script for Devcord

set -e

echo "🚀 Starting Devcord production environment..."

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo "❌ .env.prod file not found!"
    echo "Please create .env.prod with production environment variables."
    exit 1
fi

# Load production environment variables
export $(cat .env.prod | grep -v '#' | xargs)

# Build and start production containers
docker-compose -f docker-compose.prod.yml up --build -d

echo "✅ Production environment started!"
echo "🌐 Application: http://localhost"
echo ""
echo "📋 Useful commands:"
echo "  docker-compose -f docker-compose.prod.yml logs -f  # View logs"
echo "  docker-compose -f docker-compose.prod.yml down     # Stop services"
