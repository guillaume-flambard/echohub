#!/bin/bash

# Start and configure Supervisor service
# Run this on the server to get Supervisor working

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting Supervisor Service${NC}"
echo ""

# Check if Supervisor is installed
if ! command -v supervisord &> /dev/null; then
    echo -e "${YELLOW}Supervisor not found. Installing...${NC}"
    sudo apt update
    sudo apt install -y supervisor
fi

# Check service status
echo -e "${YELLOW}Checking Supervisor status...${NC}"
if sudo systemctl is-active --quiet supervisor; then
    echo -e "${GREEN}✓ Supervisor is already running${NC}"
else
    echo -e "${YELLOW}Starting Supervisor service...${NC}"
    sudo systemctl enable supervisor
    sudo systemctl start supervisor
    sleep 2
fi

# Verify it's running
if sudo systemctl is-active --quiet supervisor; then
    echo -e "${GREEN}✓ Supervisor is running${NC}"
else
    echo -e "${RED}✗ Failed to start Supervisor${NC}"
    echo "Checking logs..."
    sudo journalctl -u supervisor -n 20 --no-pager
    exit 1
fi

echo ""
echo -e "${YELLOW}Copying supervisor configurations...${NC}"
sudo cp /var/www/echohub/production/deployment/supervisor/echohub-production.conf /etc/supervisor/conf.d/

# Create staging and development configs
sudo sed 's/production/staging/g' /etc/supervisor/conf.d/echohub-production.conf | sudo tee /etc/supervisor/conf.d/echohub-staging.conf > /dev/null
sudo sed 's/production/development/g' /etc/supervisor/conf.d/echohub-production.conf | sudo tee /etc/supervisor/conf.d/echohub-development.conf > /dev/null

echo -e "${YELLOW}Reloading Supervisor configurations...${NC}"
sudo supervisorctl reread
sudo supervisorctl update

echo -e "${YELLOW}Starting all workers...${NC}"
sudo supervisorctl start all

echo ""
echo -e "${GREEN}✅ Supervisor configured and running!${NC}"
echo ""
echo -e "${YELLOW}Worker status:${NC}"
sudo supervisorctl status
