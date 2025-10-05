#!/bin/bash

# Configure environment files for production
# Run this on the server

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ENV=$1

if [ -z "$ENV" ]; then
    echo "Usage: ./configure-env.sh [production|staging|development]"
    exit 1
fi

echo -e "${GREEN}🔧 Configuring $ENV environment...${NC}"

cd /var/www/echohub/$ENV

# Copy .env.example if .env doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
fi

# Generate app key
echo -e "${YELLOW}Generating application key...${NC}"
php artisan key:generate --force

# Configure database based on environment
if [ "$ENV" == "production" ]; then
    DB_NAME="echohub_production"
    APP_URL="https://hub.echotravel.app"
    APP_ENV="production"
    APP_DEBUG="false"
elif [ "$ENV" == "staging" ]; then
    DB_NAME="echohub_staging"
    APP_URL="https://hub-staging.echotravel.app"
    APP_ENV="staging"
    APP_DEBUG="true"
else
    DB_NAME="echohub_development"
    APP_URL="https://hub-dev.echotravel.app"
    APP_ENV="local"
    APP_DEBUG="true"
fi

# Update .env file
echo -e "${YELLOW}Updating .env configuration...${NC}"
sed -i "s|APP_URL=.*|APP_URL=$APP_URL|" .env
sed -i "s|APP_ENV=.*|APP_ENV=$APP_ENV|" .env
sed -i "s|APP_DEBUG=.*|APP_DEBUG=$APP_DEBUG|" .env
sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_NAME|" .env
sed -i "s|SANCTUM_STATEFUL_DOMAINS=.*|SANCTUM_STATEFUL_DOMAINS=${APP_URL#https://}|" .env

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
php artisan migrate --force

# Seed database
echo -e "${YELLOW}Seeding database...${NC}"
php artisan db:seed --force

# Clear and cache
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

if [ "$ENV" == "production" ]; then
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

echo -e "${GREEN}✅ $ENV environment configured successfully!${NC}"
echo ""
echo -e "${YELLOW}Access your site at: $APP_URL${NC}"
