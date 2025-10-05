#!/bin/bash

# Install missing dependencies on server
# Run this on the server to install Bun and PHP SQLite extension

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}📦 Installing missing dependencies...${NC}"

# Install Bun
echo -e "${YELLOW}Installing Bun...${NC}"
if ! command -v bun &> /dev/null; then
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"

    # Add to bashrc if not already there
    if ! grep -q 'BUN_INSTALL' ~/.bashrc; then
        echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
        echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
    fi

    echo -e "${GREEN}✓ Bun installed${NC}"
else
    echo -e "${GREEN}✓ Bun already installed${NC}"
fi

# Install PHP SQLite extension
echo -e "${YELLOW}Installing PHP SQLite extension...${NC}"
sudo apt update
sudo apt install -y php8.2-sqlite3

# Restart PHP-FPM
echo -e "${YELLOW}Restarting PHP-FPM...${NC}"
sudo systemctl restart php8.2-fpm

echo -e "${GREEN}✅ All dependencies installed!${NC}"
echo ""
echo -e "${YELLOW}Verifying installations:${NC}"
bun --version
php -m | grep -i sqlite
