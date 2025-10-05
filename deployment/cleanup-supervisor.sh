#!/bin/bash

# Clean up old Supervisor configurations
# Run this on the server to remove conflicting configs

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🧹 Cleaning up old Supervisor configurations${NC}"
echo ""

# Stop supervisor first
echo -e "${YELLOW}Stopping Supervisor service...${NC}"
sudo systemctl stop supervisor || true

# Remove old echotravel configs
echo -e "${YELLOW}Removing old configurations...${NC}"
sudo rm -f /etc/supervisor/conf.d/echotravel*.conf

# List remaining configs
echo -e "${YELLOW}Current Supervisor configurations:${NC}"
ls -la /etc/supervisor/conf.d/

echo ""
echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo ""
echo -e "${YELLOW}Now run: ./deployment/start-supervisor.sh${NC}"
