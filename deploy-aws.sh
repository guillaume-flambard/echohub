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
    echo -e "${YELLOW}⚠️  IMPORTANT: You need to edit .env with your AI API key!${NC}"
    echo ""
    echo "Which AI provider do you want to use?"
    echo "1. Groq (Fast & Free - Recommended)"
    echo "2. Google Gemini (Free)"
    echo "3. OpenAI (Paid)"
    echo ""
    read -p "Enter choice (1-3) [default: 1]: " AI_CHOICE
    AI_CHOICE=${AI_CHOICE:-1}

    if [ "$AI_CHOICE" = "1" ]; then
        echo ""
        echo "Using Groq AI (llama-3.3-70b-versatile)"
        echo "Get your free API key from: https://console.groq.com/keys"
        echo ""
        read -p "Enter your Groq API key: " GROQ_KEY
        sed -i.bak "s/MINERVA_AI_PROVIDER=.*/MINERVA_AI_PROVIDER=groq/" .env
        sed -i.bak "s/MINERVA_AI_API_KEY=.*/MINERVA_AI_API_KEY=$GROQ_KEY/" .env
        sed -i.bak "s/MINERVA_AI_MODEL=.*/MINERVA_AI_MODEL=llama-3.3-70b-versatile/" .env
        sed -i.bak "s|MINERVA_AI_BASE_URL=.*|MINERVA_AI_BASE_URL=https://api.groq.com/openai/v1|" .env
    elif [ "$AI_CHOICE" = "2" ]; then
        echo ""
        echo "Using Google Gemini"
        echo "Get your free API key from: https://aistudio.google.com/"
        echo ""
        read -p "Enter your Gemini API key: " GEMINI_KEY
        sed -i.bak "s/MINERVA_AI_PROVIDER=.*/MINERVA_AI_PROVIDER=google/" .env
        sed -i.bak "s/MINERVA_AI_API_KEY=.*/MINERVA_AI_API_KEY=$GEMINI_KEY/" .env
        sed -i.bak "s/MINERVA_AI_MODEL=.*/MINERVA_AI_MODEL=gemini-2.0-flash-exp/" .env
    else
        echo ""
        echo "Using OpenAI"
        read -p "Enter your OpenAI API key: " OPENAI_KEY
        sed -i.bak "s/MINERVA_AI_PROVIDER=.*/MINERVA_AI_PROVIDER=openai/" .env
        sed -i.bak "s/MINERVA_AI_API_KEY=.*/MINERVA_AI_API_KEY=$OPENAI_KEY/" .env
        sed -i.bak "s/MINERVA_AI_MODEL=.*/MINERVA_AI_MODEL=gpt-4/" .env
        sed -i.bak "s|MINERVA_AI_BASE_URL=.*|MINERVA_AI_BASE_URL=https://api.openai.com/v1|" .env
    fi
    rm -f .env.bak
    echo -e "${GREEN}✓ AI configuration complete${NC}"
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
