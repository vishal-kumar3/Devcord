#!/bin/bash

# Docker development script for Devcord

set -e

echo "🐳 Starting Devcord development environment..."

# Build and start development containers
docker-compose up --build -d

echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "🗄️  PostgreSQL: localhost:5432"
echo "🔴 Redis: localhost:6379"
echo "📨 Kafka: localhost:9092"

echo ""
echo "📋 Useful commands:"
echo "  docker-compose logs -f devcord-dev  # View application logs"
echo "  docker-compose logs -f postgres    # View database logs"
echo "  docker-compose down                # Stop all services"
echo "  docker-compose down -v             # Stop and remove volumes"
