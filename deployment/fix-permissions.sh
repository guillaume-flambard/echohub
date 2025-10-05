#!/bin/bash

# Fix Laravel permissions for storage, cache, and database
# Run this on the server to fix permission issues

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ENV=${1:-production}

if [[ ! "$ENV" =~ ^(production|staging|development)$ ]]; then
    echo "Usage: ./fix-permissions.sh [production|staging|development]"
    exit 1
fi

echo -e "${GREEN}🔧 Fixing permissions for $ENV environment${NC}"
echo ""

cd /var/www/echohub/$ENV

# Fix storage directory
echo -e "${YELLOW}Fixing storage directory permissions...${NC}"
sudo chown -R www-data:www-data storage/
sudo chmod -R 775 storage/

# Fix bootstrap cache
echo -e "${YELLOW}Fixing bootstrap/cache permissions...${NC}"
sudo chown -R www-data:www-data bootstrap/cache/
sudo chmod -R 775 bootstrap/cache/

# Fix database directory and files
echo -e "${YELLOW}Fixing database permissions...${NC}"
sudo chown -R www-data:www-data database/
sudo chmod 775 database/

# Fix SQLite database files specifically
if ls database/*.sqlite 1> /dev/null 2>&1; then
    echo -e "${YELLOW}Fixing SQLite database file permissions...${NC}"
    sudo chmod 664 database/*.sqlite
    sudo chown www-data:www-data database/*.sqlite
else
    echo -e "${YELLOW}No SQLite database files found${NC}"
fi

# Verify permissions
echo ""
echo -e "${GREEN}✅ Permissions fixed!${NC}"
echo ""
echo -e "${YELLOW}Current permissions:${NC}"
echo "Storage directory:"
ls -la storage/ | head -5
echo ""
echo "Database directory:"
ls -la database/
echo ""
echo "Database files:"
ls -la database/*.sqlite 2>/dev/null || echo "No SQLite files found"

echo ""
echo -e "${GREEN}You can now run database operations:${NC}"
echo "  php artisan migrate"
echo "  php artisan db:seed"
