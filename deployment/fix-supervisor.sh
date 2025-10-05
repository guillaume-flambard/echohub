#!/bin/bash

# Fix Supervisor configuration and start workers
# Run this on the server if supervisor is having issues

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔧 Fixing Supervisor Configuration${NC}"
echo ""

# Copy supervisor configs from production
echo -e "${YELLOW}Copying supervisor configurations...${NC}"
sudo cp /var/www/echohub/production/deployment/supervisor/echohub-production.conf /etc/supervisor/conf.d/

# Create staging and development configs by replacing 'production' with env name
sudo sed 's/production/staging/g' /etc/supervisor/conf.d/echohub-production.conf | sudo tee /etc/supervisor/conf.d/echohub-staging.conf > /dev/null
sudo sed 's/production/development/g' /etc/supervisor/conf.d/echohub-production.conf | sudo tee /etc/supervisor/conf.d/echohub-development.conf > /dev/null

echo -e "${YELLOW}Restarting Supervisor service...${NC}"
sudo systemctl restart supervisor

sleep 2

echo -e "${YELLOW}Reloading Supervisor configurations...${NC}"
sudo supervisorctl reread
sudo supervisorctl update

echo -e "${YELLOW}Starting all workers...${NC}"
sudo supervisorctl start all

echo ""
echo -e "${GREEN}✅ Supervisor fixed!${NC}"
echo ""
echo -e "${YELLOW}Worker status:${NC}"
sudo supervisorctl status
