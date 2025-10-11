#!/bin/bash
set -e

echo "🚀 EchoHub AWS Deployment Script"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo DEBIAN_FRONTEND=noninteractive apt upgrade -y

# Install Docker
echo -e "${YELLOW}🐳 Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi

# Install Docker Compose
echo -e "${YELLOW}📦 Installing Docker Compose...${NC}"
if ! command -v docker compose &> /dev/null; then
    sudo apt install -y docker-compose-plugin
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

# Apply Docker group (need to re-login for this to take effect)
if groups | grep -q docker; then
    echo -e "${GREEN}✓ User already in docker group${NC}"
else
    echo -e "${YELLOW}⚠️  Added user to docker group. You'll need to log out and back in for this to take effect.${NC}"
fi

# Clone repository
echo -e "${YELLOW}📥 Cloning EchoHub repository...${NC}"
if [ -d "echohub" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd echohub
    git pull
else
    git clone https://github.com/guillaume-flambard/echohub.git
    cd echohub
fi

# Copy environment file
echo -e "${YELLOW}⚙️  Configuring environment...${NC}"
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: You need to edit .env with your Google Gemini API key!${NC}"
    echo ""
    echo "1. Get your free API key from: https://aistudio.google.com/"
    echo "2. Edit .env file:"
    echo "   nano .env"
    echo ""
    echo "Update these lines:"
    echo "   MINERVA_AI_PROVIDER=google"
    echo "   MINERVA_AI_API_KEY=your_gemini_api_key_here"
    echo "   MINERVA_AI_MODEL=gemini-2.0-flash-exp"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Generate app key
echo -e "${YELLOW}🔑 Generating application key...${NC}"
if ! grep -q "APP_KEY=base64:" .env; then
    docker compose run --rm app php artisan key:generate
    echo -e "${GREEN}✓ Application key generated${NC}"
fi

# Create database directory
mkdir -p database
touch database/database.sqlite
chmod 664 database/database.sqlite

# Build and start containers
echo -e "${YELLOW}🏗️  Building Docker containers...${NC}"
docker compose build

echo -e "${YELLOW}🚀 Starting services...${NC}"
docker compose up -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Run migrations
echo -e "${YELLOW}📊 Running database migrations...${NC}"
docker compose exec -T app php artisan migrate --force

# Seed roles and permissions
echo -e "${YELLOW}👥 Seeding roles and permissions...${NC}"
docker compose exec -T app php artisan db:seed --class=RolesAndPermissionsSeeder --force

# Seed default organization
echo -e "${YELLOW}🏢 Creating default organization...${NC}"
docker compose exec -T app php artisan db:seed --class=DefaultOrganizationSeeder --force

# Create admin user
echo -e "${YELLOW}👤 Creating admin user...${NC}"
echo ""
read -p "Enter admin email (default: admin@echohub.local): " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@echohub.local}

read -s -p "Enter admin password: " ADMIN_PASSWORD
echo ""

docker compose exec -T app php artisan tinker --execute="
\$user = App\Models\User::firstOrCreate(
    ['email' => '$ADMIN_EMAIL'],
    [
        'name' => 'Admin',
        'password' => Hash::make('$ADMIN_PASSWORD'),
        'email_verified_at' => now()
    ]
);
echo 'Admin user created: ' . \$user->email . PHP_EOL;
"

# Start Minerva bots
echo -e "${YELLOW}🤖 Starting Minerva bot services...${NC}"
if [ -d "bots/minerva-bot" ]; then
    cd bots/minerva-bot

    # Install Node.js if not present
    if ! command -v node &> /dev/null; then
        echo "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install -y nodejs
    fi

    npm install
    npm run build

    # Start bots in background with PM2
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi

    pm2 start npm --name "minerva-bot" -- start
    pm2 save
    pm2 startup | tail -1 | sudo bash

    cd ../..
    echo -e "${GREEN}✓ Minerva bots started${NC}"
fi

# Get instance IP
INSTANCE_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo ""
echo -e "${GREEN}=================================="
echo "✅ EchoHub Deployment Complete!"
echo "==================================${NC}"
echo ""
echo "🌐 Your EchoHub is now running at:"
echo "   http://$INSTANCE_IP"
echo ""
echo "🔐 Admin Login:"
echo "   Email: $ADMIN_EMAIL"
echo "   Password: [the password you entered]"
echo ""
echo "📊 Service Status:"
docker compose ps
echo ""
echo "📝 Useful Commands:"
echo "   View logs:        docker compose logs -f"
echo "   Restart services: docker compose restart"
echo "   Stop services:    docker compose down"
echo "   Start services:   docker compose up -d"
echo ""
echo "🎉 Enjoy your FREE EchoHub deployment!"
echo "   - EC2 t3.micro: FREE (Free Tier)"
echo "   - Google Gemini AI: FREE (1,500 requests/day)"
echo "   - Total Cost: $0/month"
echo ""
