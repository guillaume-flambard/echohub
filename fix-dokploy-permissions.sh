#!/bin/bash
#
# Fix Dokploy Log Directory Permissions
# Run this script on your VPS server to resolve deployment permission errors
#

set -e

echo "🔧 Fixing Dokploy permissions..."

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root or with sudo"
    echo "   sudo bash fix-dokploy-permissions.sh"
    exit 1
fi

# Find the user running Docker/Dokploy
DOCKER_USER=$(ps aux | grep dockerd | grep -v grep | awk '{print $1}' | head -1)
if [ -z "$DOCKER_USER" ]; then
    DOCKER_USER="root"
fi

echo "📋 Docker is running as: $DOCKER_USER"

# Create log directory if it doesn't exist
if [ ! -d "/etc/dokploy/logs" ]; then
    echo "📁 Creating /etc/dokploy/logs directory..."
    mkdir -p /etc/dokploy/logs
fi

# Fix ownership
echo "👤 Setting ownership to $DOCKER_USER..."
chown -R $DOCKER_USER:$DOCKER_USER /etc/dokploy/logs

# Fix permissions (rwxr-xr-x)
echo "🔐 Setting permissions to 755..."
chmod -R 755 /etc/dokploy/logs

# Check if dokploy container exists and restart it
if docker ps -a | grep -q dokploy; then
    echo "🔄 Restarting Dokploy container..."
    docker restart dokploy
else
    echo "⚠️  Dokploy container not found - skipping restart"
fi

echo ""
echo "✅ Permissions fixed!"
echo ""
echo "📊 Current permissions:"
ls -la /etc/dokploy/ | grep logs

echo ""
echo "🚀 Try redeploying your app in Dokploy now"
