#!/bin/bash

# Configure passwordless sudo for deployment commands
# Run this on the server to allow GitHub Actions to run sudo commands

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔐 Configuring passwordless sudo for deployment${NC}"
echo ""

# Create sudoers file for deployment user
SUDOERS_FILE="/etc/sudoers.d/echohub-deploy"

echo -e "${YELLOW}Creating sudoers configuration...${NC}"

sudo tee "$SUDOERS_FILE" > /dev/null <<'EOF'
# Allow memo user to run specific deployment commands without password
memo ALL=(ALL) NOPASSWD: /bin/chown -R memo\:memo /var/www/echohub/*
memo ALL=(ALL) NOPASSWD: /bin/chown -R www-data\:www-data /var/www/echohub/*/storage*
memo ALL=(ALL) NOPASSWD: /bin/chown -R www-data\:www-data /var/www/echohub/*/bootstrap/cache*
memo ALL=(ALL) NOPASSWD: /bin/chown -R www-data\:www-data /var/www/echohub/*/database*
memo ALL=(ALL) NOPASSWD: /bin/chown www-data\:www-data /var/www/echohub/*/database/*
memo ALL=(ALL) NOPASSWD: /bin/chmod -R 775 /var/www/echohub/*/storage*
memo ALL=(ALL) NOPASSWD: /bin/chmod -R 775 /var/www/echohub/*/bootstrap/cache*
memo ALL=(ALL) NOPASSWD: /bin/chmod 664 /var/www/echohub/*/database/*
memo ALL=(ALL) NOPASSWD: /bin/systemctl reload php8.2-fpm
memo ALL=(ALL) NOPASSWD: /usr/bin/supervisorctl restart echohub-*
memo ALL=(ALL) NOPASSWD: /usr/bin/supervisorctl reread
memo ALL=(ALL) NOPASSWD: /usr/bin/supervisorctl update
memo ALL=(ALL) NOPASSWD: /usr/bin/supervisorctl start echohub-*
memo ALL=(ALL) NOPASSWD: /usr/bin/supervisorctl stop echohub-*
memo ALL=(ALL) NOPASSWD: /usr/bin/supervisorctl status
EOF

# Set correct permissions on sudoers file
sudo chmod 0440 "$SUDOERS_FILE"

# Validate sudoers file
sudo visudo -c -f "$SUDOERS_FILE"

echo ""
echo -e "${GREEN}✅ Passwordless sudo configured successfully!${NC}"
echo ""
echo -e "${YELLOW}Testing sudo commands:${NC}"
sudo -n chown -R $USER:$USER /var/www/echohub/staging && echo "✓ chown works" || echo "✗ chown failed"
sudo -n systemctl reload php8.2-fpm && echo "✓ systemctl works" || echo "✗ systemctl failed"
