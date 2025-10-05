#!/bin/bash

# Setup GitHub Secrets for EchoHub Deployment
# Requires: gh CLI (GitHub CLI)

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔐 Setting up GitHub Secrets for EchoHub Deployment${NC}"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "Please authenticate with GitHub CLI first:"
    echo "gh auth login"
    exit 1
fi

# Server details
PRODUCTION_HOST="51.79.55.171"
STAGING_HOST="51.79.55.171"
SSH_USERNAME="memo"
SSH_PORT="22"
SSH_KEY_PATH="$HOME/.ssh/id_ed25519_memo"

echo -e "${YELLOW}Setting GitHub secrets...${NC}"

# Set secrets
gh secret set PRODUCTION_HOST --body "$PRODUCTION_HOST"
gh secret set STAGING_HOST --body "$STAGING_HOST"
gh secret set SSH_USERNAME --body "$SSH_USERNAME"
gh secret set SSH_PORT --body "$SSH_PORT"

# Set SSH private key
if [ -f "$SSH_KEY_PATH" ]; then
    gh secret set SSH_PRIVATE_KEY < "$SSH_KEY_PATH"
    echo -e "${GREEN}✓ SSH_PRIVATE_KEY set${NC}"
else
    echo -e "${YELLOW}⚠️  SSH key not found at $SSH_KEY_PATH${NC}"
    echo "Please set SSH_PRIVATE_KEY manually:"
    echo "gh secret set SSH_PRIVATE_KEY < /path/to/your/ssh/key"
fi

echo ""
echo -e "${GREEN}✅ GitHub secrets configured successfully!${NC}"
echo ""
echo "Secrets set:"
echo "  ✓ PRODUCTION_HOST: $PRODUCTION_HOST"
echo "  ✓ STAGING_HOST: $STAGING_HOST"
echo "  ✓ SSH_USERNAME: $SSH_USERNAME"
echo "  ✓ SSH_PORT: $SSH_PORT"
echo "  ✓ SSH_PRIVATE_KEY: (from $SSH_KEY_PATH)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Setup your server: ssh -i ~/.ssh/id_ed25519_memo memo@51.79.55.171"
echo "2. Push to 'development' branch to deploy to staging"
echo "3. Push to 'main' branch to deploy to production"
