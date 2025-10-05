#!/bin/bash

# Fix deployment issues on server

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔧 Fixing deployment issues...${NC}"

# Fix git ownership issues
echo -e "${YELLOW}Fixing git ownership...${NC}"
git config --global --add safe.directory /var/www/echohub/production
git config --global --add safe.directory /var/www/echohub/staging
git config --global --add safe.directory /var/www/echohub/development

# Fix directory ownership
echo -e "${YELLOW}Fixing directory ownership...${NC}"
sudo chown -R $USER:$USER /var/www/echohub

# Re-run composer install with --ignore-platform-reqs for PHP version mismatch
echo -e "${YELLOW}Reinstalling dependencies...${NC}"
for env in production staging development; do
    echo "Processing $env..."
    cd /var/www/echohub/$env

    # Update composer (ignoring PHP version requirement for now)
    composer install --optimize-autoloader --no-interaction --ignore-platform-reqs || true

    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env 2>/dev/null || touch .env
        php artisan key:generate
    fi

    # Install bun dependencies and build
    bun install
    bun run build

    # Create storage directories
    mkdir -p storage/{app,framework,logs}
    mkdir -p storage/framework/{cache,sessions,views}
    mkdir -p bootstrap/cache

    # Set permissions
    sudo chown -R www-data:www-data storage bootstrap/cache
    sudo chmod -R 775 storage bootstrap/cache
done

echo -e "${GREEN}✅ Fixes applied!${NC}"
echo ""
echo -e "${YELLOW}Next: Configure .env files and run migrations${NC}"
