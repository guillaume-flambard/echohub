#!/bin/bash

# Update domains from staging.hub/dev.hub to hub-staging/hub-dev
# Run this on the server after updating DNS records

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔄 Updating EchoHub domain configuration${NC}"
echo ""

# Update Nginx configurations
echo -e "${YELLOW}Updating Nginx configurations...${NC}"
sudo cp /var/www/echohub/production/deployment/nginx/staging.conf /etc/nginx/sites-available/echohub-staging
sudo cp /var/www/echohub/production/deployment/nginx/development.conf /etc/nginx/sites-available/echohub-development

# Test Nginx config
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
sudo nginx -t

# Request new SSL certificates
echo -e "${YELLOW}Requesting SSL certificates for new domains...${NC}"
sudo certbot --nginx -d hub-staging.echotravel.app --non-interactive --agree-tos --email memo@echotravel.app --redirect || echo "Note: Certificate request may have failed"
sudo certbot --nginx -d hub-dev.echotravel.app --non-interactive --agree-tos --email memo@echotravel.app --redirect || echo "Note: Certificate request may have failed"

# Reload Nginx
echo -e "${YELLOW}Reloading Nginx...${NC}"
sudo systemctl reload nginx

echo ""
echo -e "${GREEN}✅ Domain update complete!${NC}"
echo ""
echo -e "${YELLOW}Testing new URLs:${NC}"
curl -I https://hub-staging.echotravel.app 2>&1 | head -1 || echo "Note: Staging may take a moment"
curl -I https://hub-dev.echotravel.app 2>&1 | head -1 || echo "Note: Development may take a moment"
echo ""
echo -e "${YELLOW}New URLs:${NC}"
echo "  Production:  https://hub.echotravel.app"
echo "  Staging:     https://hub-staging.echotravel.app"
echo "  Development: https://hub-dev.echotravel.app"
