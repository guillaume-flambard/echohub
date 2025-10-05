#!/bin/bash

# Clean up old Nginx configurations
# Run this on the server to remove conflicting old site configs

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🧹 Cleaning up old Nginx configurations${NC}"
echo ""

echo -e "${YELLOW}Disabling old site configs...${NC}"
sudo rm -f /etc/nginx/sites-enabled/hub
sudo rm -f /etc/nginx/sites-enabled/travels-*

echo -e "${YELLOW}Current enabled sites:${NC}"
ls -la /etc/nginx/sites-enabled/

echo ""
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
sudo nginx -t

echo ""
echo -e "${YELLOW}Reloading Nginx...${NC}"
sudo systemctl reload nginx

echo ""
echo -e "${GREEN}✅ Nginx cleanup complete!${NC}"
echo ""
echo -e "${YELLOW}Testing sites:${NC}"
curl -I https://hub.echotravel.app 2>&1 | head -1
curl -I https://staging.hub.echotravel.app 2>&1 | head -1
curl -I https://dev.hub.echotravel.app 2>&1 | head -1
