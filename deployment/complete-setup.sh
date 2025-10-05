#!/bin/bash

# Complete server setup and environment configuration
# Run this on the server after install-dependencies.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Completing EchoHub Setup${NC}"
echo ""

# Ensure Bun is in PATH
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Fix git ownership and permissions
echo -e "${YELLOW}Fixing git ownership...${NC}"
git config --global --add safe.directory /var/www/echohub/production
git config --global --add safe.directory /var/www/echohub/staging
git config --global --add safe.directory /var/www/echohub/development

sudo chown -R $USER:$USER /var/www/echohub

# Configure each environment
for env in staging production development; do
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}Configuring ${env} environment...${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    cd /var/www/echohub/$env

    # Install composer dependencies
    echo -e "${YELLOW}Installing PHP dependencies...${NC}"
    if [ "$env" == "production" ]; then
        composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs
    else
        composer install --optimize-autoloader --no-interaction --ignore-platform-reqs
    fi

    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        echo -e "${YELLOW}Creating .env file...${NC}"
        cp .env.example .env
    fi

    # Generate app key
    echo -e "${YELLOW}Generating application key...${NC}"
    php artisan key:generate --force

    # Configure environment-specific settings
    case $env in
        production)
            APP_URL="https://hub.echotravel.app"
            APP_ENV="production"
            APP_DEBUG="false"
            DB_DATABASE="echohub_production"
            ;;
        staging)
            APP_URL="https://staging.hub.echotravel.app"
            APP_ENV="staging"
            APP_DEBUG="true"
            DB_DATABASE="echohub_staging"
            ;;
        development)
            APP_URL="https://dev.hub.echotravel.app"
            APP_ENV="local"
            APP_DEBUG="true"
            DB_DATABASE="echohub_development"
            ;;
    esac

    # Update .env file
    echo -e "${YELLOW}Updating .env configuration...${NC}"
    sed -i "s|APP_URL=.*|APP_URL=$APP_URL|" .env
    sed -i "s|APP_ENV=.*|APP_ENV=$APP_ENV|" .env
    sed -i "s|APP_DEBUG=.*|APP_DEBUG=$APP_DEBUG|" .env
    sed -i "s|DB_CONNECTION=.*|DB_CONNECTION=sqlite|" .env
    sed -i "s|DB_DATABASE=.*|DB_DATABASE=/var/www/echohub/$env/database/$DB_DATABASE.sqlite|" .env
    sed -i "s|SANCTUM_STATEFUL_DOMAINS=.*|SANCTUM_STATEFUL_DOMAINS=${APP_URL#https://}|" .env

    # Create database directory and file
    mkdir -p database
    touch database/$DB_DATABASE.sqlite

    # Install frontend dependencies and build
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    bun install

    echo -e "${YELLOW}Building frontend assets...${NC}"
    bun run build

    # Create storage directories
    echo -e "${YELLOW}Creating storage directories...${NC}"
    mkdir -p storage/{app,framework,logs}
    mkdir -p storage/framework/{cache,sessions,views}
    mkdir -p bootstrap/cache

    # Run migrations
    echo -e "${YELLOW}Running database migrations...${NC}"
    php artisan migrate --force

    # Seed database
    echo -e "${YELLOW}Seeding database...${NC}"
    php artisan db:seed --force || echo "Seeding skipped (no seeders or already seeded)"

    # Clear and cache
    echo -e "${YELLOW}Clearing caches...${NC}"
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
    php artisan cache:clear

    if [ "$env" == "production" ]; then
        echo -e "${YELLOW}Caching configuration...${NC}"
        php artisan config:cache
        php artisan route:cache
        php artisan view:cache
    fi

    # Set permissions
    echo -e "${YELLOW}Setting permissions...${NC}"
    sudo chown -R www-data:www-data storage bootstrap/cache database
    sudo chmod -R 775 storage bootstrap/cache
    sudo chmod -R 664 database/$DB_DATABASE.sqlite
    sudo chown www-data:www-data database/$DB_DATABASE.sqlite

    echo -e "${GREEN}✅ ${env} environment configured!${NC}"
done

# Restart services
echo ""
echo -e "${YELLOW}Restarting services...${NC}"
sudo systemctl reload php8.2-fpm

echo -e "${YELLOW}Updating Supervisor...${NC}"
sudo supervisorctl reread || echo "Note: Supervisor reread failed (may not be critical)"
sudo supervisorctl update || echo "Note: Supervisor update failed (may not be critical)"
sudo supervisorctl restart all || echo "Note: Supervisor restart failed (workers may need manual restart later)"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ EchoHub setup complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Your sites are now available at:${NC}"
echo "  Production:  https://hub.echotravel.app"
echo "  Staging:     https://staging.hub.echotravel.app"
echo "  Development: https://dev.hub.echotravel.app"
echo ""
echo -e "${YELLOW}GitHub Actions is configured for automatic deployments:${NC}"
echo "  • Push to 'development' branch → Deploys to staging"
echo "  • Push to 'main' branch → Deploys to production"
echo ""
