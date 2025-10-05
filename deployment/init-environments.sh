#!/bin/bash

# Initialize EchoHub Environments on Server
# Run this on the server after setup-server.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Initializing EchoHub Environments${NC}"
echo ""

# Create directory structure
echo -e "${YELLOW}📁 Creating directory structure...${NC}"
sudo mkdir -p /var/www/echohub/{production,staging,development}
sudo chown -R $USER:$USER /var/www/echohub

# Clone repositories
echo -e "${YELLOW}📥 Cloning repositories...${NC}"

# Production
cd /var/www/echohub/production
if [ ! -d ".git" ]; then
    git clone https://github.com/guillaume-flambard/echohub.git .
    git checkout main
else
    git pull origin main
fi

# Staging
cd /var/www/echohub/staging
if [ ! -d ".git" ]; then
    git clone https://github.com/guillaume-flambard/echohub.git .
    git checkout development
else
    git pull origin development
fi

# Development
cd /var/www/echohub/development
if [ ! -d ".git" ]; then
    git clone https://github.com/guillaume-flambard/echohub.git .
    git checkout development
else
    git pull origin development
fi

# Setup Nginx configurations
echo -e "${YELLOW}🌐 Setting up Nginx configurations...${NC}"
sudo cp /var/www/echohub/production/deployment/nginx/production.conf /etc/nginx/sites-available/echohub-production
sudo cp /var/www/echohub/production/deployment/nginx/staging.conf /etc/nginx/sites-available/echohub-staging
sudo cp /var/www/echohub/production/deployment/nginx/development.conf /etc/nginx/sites-available/echohub-development

# Enable sites (temporarily without SSL)
echo -e "${YELLOW}Enabling Nginx sites (HTTP only for now)...${NC}"

# Create temporary HTTP-only configs for Certbot
for env in production staging development; do
    case $env in
        production) domain="hub.echotravel.app" ;;
        staging) domain="hub-staging.echotravel.app" ;;
        development) domain="hub-dev.echotravel.app" ;;
    esac

    sudo tee /etc/nginx/sites-available/echohub-${env}-temp > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${domain};

    root /var/www/echohub/${env}/public;
    index index.php index.html;

    location ~ /.well-known {
        allow all;
    }

    location / {
        return 200 'EchoHub ${env} - Setting up...';
        add_header Content-Type text/plain;
    }
}
EOF

    sudo ln -sf /etc/nginx/sites-available/echohub-${env}-temp /etc/nginx/sites-enabled/
done

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Install SSL certificates
echo -e "${YELLOW}🔐 Installing SSL certificates...${NC}"
echo "This will request Let's Encrypt certificates for all domains..."

# Install certificates
sudo certbot --nginx -d hub.echotravel.app --non-interactive --agree-tos --email memo@echotravel.app --redirect || true
sudo certbot --nginx -d hub-staging.echotravel.app --non-interactive --agree-tos --email memo@echotravel.app --redirect || true
sudo certbot --nginx -d hub-dev.echotravel.app --non-interactive --agree-tos --email memo@echotravel.app --redirect || true

# Now enable the real configs
echo -e "${YELLOW}🔄 Enabling production Nginx configs...${NC}"
sudo rm -f /etc/nginx/sites-enabled/echohub-*-temp
sudo ln -sf /etc/nginx/sites-available/echohub-production /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/echohub-staging /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/echohub-development /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx

# Setup Supervisor
echo -e "${YELLOW}👷 Setting up Supervisor...${NC}"
sudo cp /var/www/echohub/production/deployment/supervisor/echohub-production.conf /etc/supervisor/conf.d/

# Create staging and development supervisor configs
sudo sed 's/production/staging/g' /etc/supervisor/conf.d/echohub-production.conf | sudo tee /etc/supervisor/conf.d/echohub-staging.conf > /dev/null
sudo sed 's/production/development/g' /etc/supervisor/conf.d/echohub-production.conf | sudo tee /etc/supervisor/conf.d/echohub-development.conf > /dev/null

sudo supervisorctl reread
sudo supervisorctl update

# Create storage directories
echo -e "${YELLOW}📦 Creating storage directories...${NC}"
for env in production staging development; do
    cd /var/www/echohub/$env
    mkdir -p storage/{app,framework,logs}
    mkdir -p storage/framework/{cache,sessions,views}
    mkdir -p bootstrap/cache
done

echo ""
echo -e "${GREEN}✅ Server initialization complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure .env files for each environment"
echo "2. Trigger GitHub Actions deployment"
echo ""
echo -e "${YELLOW}Environment URLs:${NC}"
echo "  Production:  https://hub.echotravel.app"
echo "  Staging:     https://hub-staging.echotravel.app"
echo "  Development: https://hub-dev.echotravel.app"
