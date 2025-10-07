#!/bin/bash

# Create Matrix Bot User
# Usage: ./deployment/create-matrix-bot.sh <bot_username> [password]
#
# Registers a new Matrix user for a bot application

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Parse arguments
BOT_USERNAME=${1}
BOT_PASSWORD=${2:-$(openssl rand -hex 32)}

if [ -z "$BOT_USERNAME" ]; then
    echo -e "${RED}❌ Usage: ./deployment/create-matrix-bot.sh <bot_username> [password]${NC}"
    echo ""
    echo "Examples:"
    echo "  ./deployment/create-matrix-bot.sh echotravel"
    echo "  ./deployment/create-matrix-bot.sh phangan_ai my_password"
    exit 1
fi

echo -e "${GREEN}🤖 Creating Matrix bot user: @${BOT_USERNAME}:echohub.local${NC}"
echo ""

# Check if Matrix container is running
if ! docker ps | grep -q echohub_synapse; then
    echo -e "${RED}❌ Matrix Synapse container is not running${NC}"
    echo ""
    echo "Start it with: docker compose -f docker-compose.matrix.yml up -d"
    exit 1
fi

# Register the user
echo -e "${YELLOW}📝 Registering user with Matrix Synapse...${NC}"

docker exec -it echohub_synapse register_new_matrix_user \
    -u "$BOT_USERNAME" \
    -p "$BOT_PASSWORD" \
    -c /data/homeserver.yaml \
    http://localhost:8008

echo ""
echo -e "${YELLOW}🔑 Getting access token...${NC}"

# Login to get access token
ACCESS_TOKEN_RESPONSE=$(curl -s -X POST "http://localhost:8008/_matrix/client/r0/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"type\": \"m.login.password\",
        \"user\": \"$BOT_USERNAME\",
        \"password\": \"$BOT_PASSWORD\"
    }")

ACCESS_TOKEN=$(echo "$ACCESS_TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*"' | sed 's/"access_token":"\([^"]*\)"/\1/')

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}⚠️  Could not retrieve access token automatically${NC}"
    echo "Response: $ACCESS_TOKEN_RESPONSE"
else
    echo -e "${GREEN}✅ Access token retrieved!${NC}"
fi

echo ""
echo -e "${GREEN}✅ Matrix bot user created successfully!${NC}"
echo ""
echo -e "${YELLOW}Bot Credentials:${NC}"
echo "  User ID: @${BOT_USERNAME}:echohub.local"
echo "  Password: ${BOT_PASSWORD}"
if [ -n "$ACCESS_TOKEN" ]; then
    echo "  Access Token: ${ACCESS_TOKEN}"
fi
echo ""
echo -e "${YELLOW}💡 Update AppSeeder with this configuration:${NC}"
echo "  'api_config' => ["
echo "      'matrix_access_token' => '${ACCESS_TOKEN}',"
echo "      ..."
echo "  ]"
echo ""
echo -e "${YELLOW}🔐 Store these credentials securely!${NC}"
