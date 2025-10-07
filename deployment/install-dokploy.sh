#!/bin/bash

# Install Dokploy on Ubuntu Server
# Run this script on your VPS to install Dokploy

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Installing Dokploy PaaS Platform    ║${NC}"
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ Do not run this script as root${NC}"
    echo "Run as regular user: ./deployment/install-dokploy.sh"
    exit 1
fi

# Check if ports are available
echo -e "${YELLOW}🔍 Checking port availability...${NC}"

check_port() {
    local port=$1
    if sudo lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}❌ Port $port is already in use${NC}"
        echo "Dokploy requires ports 80, 443, and 3000 to be free"
        exit 1
    else
        echo -e "${GREEN}✓ Port $port is available${NC}"
    fi
}

check_port 80
check_port 443
check_port 3000

echo ""

# Get server IP
SERVER_IP=$(curl -s https://api.ipify.org)
echo -e "${YELLOW}📡 Server IP: ${GREEN}$SERVER_IP${NC}"
echo ""

# Confirm installation
echo -e "${YELLOW}This will install Dokploy on your server:${NC}"
echo "  • Docker (if not installed)"
echo "  • Dokploy PaaS platform"
echo "  • Traefik reverse proxy"
echo "  • PostgreSQL support"
echo ""
echo -e "${YELLOW}After installation, access dashboard at:${NC}"
echo -e "${GREEN}  http://$SERVER_IP:3000${NC}"
echo ""

read -p "Continue with installation? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Installation cancelled"
    exit 0
fi

echo ""
echo -e "${GREEN}🚀 Starting Dokploy installation...${NC}"
echo ""

# Run Dokploy installation script
curl -sSL https://dokploy.com/install.sh | sh

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Dokploy Installation Complete! 🎉   ║${NC}"
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo -e "${GREEN}1.${NC} Access Dokploy dashboard:"
echo -e "   ${GREEN}http://$SERVER_IP:3000${NC}"
echo ""
echo -e "${GREEN}2.${NC} Create your admin account (first user is admin)"
echo ""
echo -e "${GREEN}3.${NC} Follow the migration guide:"
echo "   deployment/DOKPLOY_MIGRATION.md"
echo ""
echo -e "${YELLOW}What you can do now:${NC}"
echo "  • Create PostgreSQL databases"
echo "  • Deploy EchoHub applications"
echo "  • Configure auto-deploy from GitHub"
echo "  • Set up SSL certificates (automatic)"
echo "  • Monitor resources & logs"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  • View logs:    docker logs dokploy"
echo "  • Restart:      docker restart dokploy"
echo "  • Update:       curl -sSL https://dokploy.com/install.sh | sh -s update"
echo ""
