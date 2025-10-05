#!/bin/bash

# EchoHub Deployment Script
# Usage: ./deploy.sh [production|staging|development]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get environment
ENV=${1:-staging}

if [ "$ENV" != "production" ] && [ "$ENV" != "staging" ] && [ "$ENV" != "development" ]; then
    echo -e "${RED}Error: Invalid environment. Use: production, staging, or development${NC}"
    exit 1
fi

# Set paths
BASE_PATH="/var/www/echohub/${ENV}"

# Confirmation for production
if [ "$ENV" == "production" ]; then
    echo -e "${YELLOW}⚠️  WARNING: You are about to deploy to PRODUCTION!${NC}"
    read -p "Are you sure you want to continue? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo -e "${RED}Deployment cancelled.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}🚀 Starting deployment to ${ENV}...${NC}"

# Navigate to project directory
cd "$BASE_PATH"

# Enable maintenance mode
echo -e "${YELLOW}📝 Enabling maintenance mode...${NC}"
php artisan down || true

# Git pull
echo -e "${YELLOW}📥 Pulling latest code...${NC}"
git fetch origin
if [ "$ENV" == "production" ]; then
    git reset --hard origin/main
else
    git reset --hard origin/development
fi

# Install PHP dependencies
echo -e "${YELLOW}📦 Installing PHP dependencies...${NC}"
if [ "$ENV" == "production" ]; then
    composer install --no-dev --optimize-autoloader --no-interaction
else
    composer install --optimize-autoloader --no-interaction
fi

# Install Node dependencies and build
echo -e "${YELLOW}🏗️  Building frontend assets...${NC}"
bun install
bun run build

# Run migrations
echo -e "${YELLOW}🗃️  Running database migrations...${NC}"
php artisan migrate --force

# Clear caches
echo -e "${YELLOW}🧹 Clearing caches...${NC}"
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Cache for production
if [ "$ENV" == "production" ]; then
    echo -e "${YELLOW}⚡ Optimizing for production...${NC}"
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Set permissions
echo -e "${YELLOW}🔐 Setting permissions...${NC}"
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Restart services
echo -e "${YELLOW}🔄 Restarting services...${NC}"
sudo systemctl reload php8.2-fpm
sudo supervisorctl restart "echohub-${ENV}-worker:*"

# Disable maintenance mode
echo -e "${YELLOW}✅ Disabling maintenance mode...${NC}"
php artisan up

echo -e "${GREEN}✨ Deployment to ${ENV} completed successfully!${NC}"
echo -e "${GREEN}🌐 Visit: https://$([ "$ENV" == "production" ] && echo "hub.echotravel.app" || echo "${ENV}.hub.echotravel.app")${NC}"
