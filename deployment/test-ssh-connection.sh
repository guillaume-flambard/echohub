#!/bin/bash
# SSH Connection Test Script
# Run this locally to verify SSH access before deployment

set -e

echo "=== EchoHub VPS SSH Connection Test ==="
echo ""

# Check if required variables are set
if [ -z "$VPS_HOST" ]; then
    echo "❌ VPS_HOST not set"
    echo "Usage: VPS_HOST=your-vps-ip VPS_USER=your-user ./test-ssh-connection.sh"
    exit 1
fi

if [ -z "$VPS_USER" ]; then
    echo "❌ VPS_USER not set"
    echo "Usage: VPS_HOST=your-vps-ip VPS_USER=your-user ./test-ssh-connection.sh"
    exit 1
fi

echo "Testing connection to: $VPS_USER@$VPS_HOST"
echo ""

# Test 1: Ping
echo "1️⃣ Testing network connectivity (ping)..."
if ping -c 3 "$VPS_HOST" >/dev/null 2>&1; then
    echo "✅ VPS is reachable via ping"
else
    echo "❌ VPS is not reachable via ping"
    echo "   This could indicate:"
    echo "   - VPS is down"
    echo "   - Firewall blocks ICMP"
    echo "   - Wrong IP address"
fi
echo ""

# Test 2: Port 22
echo "2️⃣ Testing SSH port (22)..."
if nc -zv "$VPS_HOST" 22 2>&1 | grep -q succeeded; then
    echo "✅ SSH port 22 is open"
else
    echo "❌ SSH port 22 is closed or filtered"
    echo "   Solutions:"
    echo "   - Enable SSH on VPS: sudo systemctl start sshd"
    echo "   - Open firewall: sudo ufw allow 22/tcp"
    echo "   - Check if SSH runs on different port"
fi
echo ""

# Test 3: SSH Connection
echo "3️⃣ Testing SSH authentication..."
if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "echo 'Connection successful'" 2>/dev/null; then
    echo "✅ SSH authentication successful"
else
    echo "❌ SSH authentication failed"
    echo "   Solutions:"
    echo "   - Verify credentials"
    echo "   - Check SSH key permissions: chmod 600 ~/.ssh/your_key"
    echo "   - Test: ssh -v $VPS_USER@$VPS_HOST"
fi
echo ""

# Test 4: Docker
echo "4️⃣ Testing Docker on VPS..."
if ssh -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "docker --version" 2>/dev/null; then
    echo "✅ Docker is installed and accessible"
else
    echo "⚠️  Docker not accessible (may need sudo or user in docker group)"
    echo "   Solutions:"
    echo "   - Add user to docker group: sudo usermod -aG docker $VPS_USER"
    echo "   - Log out and back in for group changes to take effect"
fi
echo ""

# Test 5: GitHub Actions IPs
echo "5️⃣ Testing GitHub Actions connectivity..."
echo "GitHub Actions uses dynamic IP ranges from:"
echo "- 140.82.112.0/20"
echo "- 143.55.64.0/20"
echo "- 185.199.108.0/22"
echo "- 192.30.252.0/22"
echo ""
echo "To allow GitHub Actions, run on VPS:"
echo "sudo ufw allow from 140.82.112.0/20 to any port 22"
echo "sudo ufw allow from 143.55.64.0/20 to any port 22"
echo ""

# Test 6: dokploy-network
echo "6️⃣ Testing dokploy-network..."
if ssh -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "docker network ls | grep dokploy-network" 2>/dev/null; then
    echo "✅ dokploy-network exists"
else
    echo "⚠️  dokploy-network not found"
    echo "   Create it: docker network create dokploy-network"
fi
echo ""

# Test 7: PostgreSQL
echo "7️⃣ Testing PostgreSQL container..."
if ssh -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "docker ps | grep postgres" 2>/dev/null; then
    echo "✅ PostgreSQL container is running"
else
    echo "⚠️  PostgreSQL container not running"
    echo "   Check Dokploy PostgreSQL service"
fi
echo ""

echo "=== Test Complete ==="
echo ""
echo "Next steps:"
echo "1. Fix any ❌ or ⚠️ issues above"
echo "2. Set GitHub Secrets (if not already set):"
echo "   - VPS_HOST=$VPS_HOST"
echo "   - VPS_USER=$VPS_USER"
echo "   - VPS_SSH_KEY (copy from ~/.ssh/your_key)"
echo "3. Try deployment again"
