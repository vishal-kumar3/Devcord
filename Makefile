# Makefile for Devcord Docker operations

.PHONY: help dev prod stop clean logs deploy

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dev: ## Start development environment
	@echo "🐳 Starting development environment..."
	@chmod +x scripts/docker-dev.sh
	@./scripts/docker-dev.sh

prod: ## Start production environment
	@echo "🚀 Starting production environment..."
	@chmod +x scripts/docker-prod.sh
	@./scripts/docker-prod.sh

stop: ## Stop all containers
	@echo "⏹️  Stopping containers..."
	@docker-compose down
	@docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

clean: ## Stop containers and remove volumes
	@echo "🧹 Cleaning up containers and volumes..."
	@docker-compose down -v
	@docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true
	@docker system prune -f

logs: ## View application logs
	@docker-compose logs -f devcord-dev

logs-prod: ## View production logs
	@docker-compose -f docker-compose.prod.yml logs -f

shell: ## Access development container shell
	@docker-compose exec devcord-dev sh

db-shell: ## Access database shell
	@docker-compose exec postgres psql -U devcord -d devcord

redis-shell: ## Access Redis shell
	@docker-compose exec redis redis-cli

deploy: ## Deploy the application
	@echo "🚀 Deploying Devcord..."
	@chmod +x scripts/deploy.sh
	@./scripts/deploy.sh

build-prod: ## Build for production with migrations
	@echo "🏗️  Building for production..."
	@pnpm build:prod

start-prod: ## Start production servers
	@echo "▶️  Starting production servers..."
	@pnpm start
