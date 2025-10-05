#!/bin/bash

# EchoHub Server Setup Script
# Run this on a fresh Ubuntu 22.04 server to prepare for EchoHub deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 EchoHub Server Setup${NC}"
echo "This script will install and configure all dependencies for EchoHub"
echo ""

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}This script should not be run as root${NC}"
   exit 1
fi

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update
sudo apt upgrade -y

# Install basic utilities
echo -e "${YELLOW}🔧 Installing basic utilities...${NC}"
sudo apt install -y software-properties-common curl wget git unzip zip htop vim

# Install Nginx
echo -e "${YELLOW}🌐 Installing Nginx...${NC}"
sudo apt install -y nginx

# Install PHP 8.2
echo -e "${YELLOW}🐘 Installing PHP 8.2...${NC}"
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
sudo apt install -y php8.2-fpm php8.2-cli php8.2-common php8.2-mysql \
    php8.2-zip php8.2-gd php8.2-mbstring php8.2-curl php8.2-xml \
    php8.2-bcmath php8.2-pgsql php8.2-sqlite3 php8.2-redis php8.2-intl

# Install PostgreSQL
echo -e "${YELLOW}🗄️  Installing PostgreSQL...${NC}"
sudo apt install -y postgresql postgresql-contrib

# Install Redis
echo -e "${YELLOW}📮 Installing Redis...${NC}"
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Install Docker
echo -e "${YELLOW}🐳 Installing Docker...${NC}"
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
rm get-docker.sh

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Install Bun
echo -e "${YELLOW}🥟 Installing Bun...${NC}"
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc || true

# Install Composer
echo -e "${YELLOW}🎼 Installing Composer...${NC}"
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

# Install Supervisor
echo -e "${YELLOW}👷 Installing Supervisor...${NC}"
sudo apt install -y supervisor
sudo systemctl enable supervisor
sudo systemctl start supervisor

# Install Certbot
echo -e "${YELLOW}🔐 Installing Certbot...${NC}"
sudo apt install -y certbot python3-certbot-nginx

# Install Fail2ban
echo -e "${YELLOW}🛡️  Installing Fail2ban...${NC}"
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Configure firewall
echo -e "${YELLOW}🔥 Configuring UFW firewall...${NC}"
sudo ufw --force enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Create directory structure
echo -e "${YELLOW}📁 Creating directory structure...${NC}"
sudo mkdir -p /var/www/echohub/{production,staging,development}
sudo chown -R $USER:$USER /var/www/echohub

# Setup PostgreSQL databases
echo -e "${YELLOW}🗃️  Setting up PostgreSQL databases...${NC}"
echo "Please enter a secure password for the 'echohub' PostgreSQL user:"
read -s PG_PASSWORD

sudo -u postgres psql <<EOF
CREATE DATABASE echohub_production;
CREATE DATABASE echohub_staging;
CREATE DATABASE echohub_development;
CREATE USER echohub WITH PASSWORD '$PG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE echohub_production TO echohub;
GRANT ALL PRIVILEGES ON DATABASE echohub_staging TO echohub;
GRANT ALL PRIVILEGES ON DATABASE echohub_development TO echohub;
EOF

# Configure PHP-FPM
echo -e "${YELLOW}⚙️  Configuring PHP-FPM...${NC}"
sudo sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 100M/' /etc/php/8.2/fpm/php.ini
sudo sed -i 's/post_max_size = 8M/post_max_size = 100M/' /etc/php/8.2/fpm/php.ini
sudo sed -i 's/max_execution_time = 30/max_execution_time = 300/' /etc/php/8.2/fpm/php.ini
sudo sed -i 's/memory_limit = 128M/memory_limit = 512M/' /etc/php/8.2/fpm/php.ini
sudo systemctl restart php8.2-fpm

# Setup log rotation
echo -e "${YELLOW}📋 Configuring log rotation...${NC}"
sudo tee /etc/logrotate.d/echohub > /dev/null <<'EOF'
/var/www/echohub/*/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload php8.2-fpm > /dev/null 2>&1 || true
    endscript
}
EOF

# Install Ollama (optional)
echo -e "${YELLOW}🤖 Do you want to install Ollama for local AI? (y/n)${NC}"
read -r INSTALL_OLLAMA
if [[ $INSTALL_OLLAMA =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Installing Ollama...${NC}"
    curl -fsSL https://ollama.com/install.sh | sh

    echo -e "${YELLOW}Pulling Llama 3.2 3B model...${NC}"
    ollama pull llama3.2:3b
fi

echo ""
echo -e "${GREEN}✅ Server setup completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Clone your repository to /var/www/echohub/production"
echo "2. Copy Nginx configs from deployment/nginx/ to /etc/nginx/sites-available/"
echo "3. Copy .env files from deployment/.env.*.example to each environment"
echo "4. Run: sudo certbot --nginx -d hub.echotravel.app"
echo "5. Deploy using: ./deployment/deploy.sh production"
echo ""
echo -e "${YELLOW}PostgreSQL Password:${NC} Save this password: $PG_PASSWORD"
echo ""
echo -e "${GREEN}🎉 Happy deploying!${NC}"
