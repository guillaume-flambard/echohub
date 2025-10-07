#!/bin/bash
# Fix Ollama for Dokploy Access
# Run this on your VPS: ./deployment/fix-ollama-now.sh

set -e

echo "🔧 Fixing Ollama for Dokploy..."
echo ""

# Stop current Ollama
echo "Stopping current Ollama..."
pkill ollama || true
sleep 2

# Create systemd service
echo "Creating Ollama systemd service..."
sudo tee /etc/systemd/system/ollama.service > /dev/null << 'EOF'
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
Environment="OLLAMA_HOST=0.0.0.0:11434"
Restart=always
RestartSec=3
User=root

[Install]
WantedBy=multi-user.target
EOF

# Start service
echo "Starting Ollama service..."
sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl start ollama
sleep 3

# Verify
echo ""
echo "=== ✅ Ollama Status ==="
sudo systemctl status ollama --no-pager | head -10

echo ""
echo "=== ✅ Listening On ==="
netstat -tlnp | grep 11434

echo ""
echo "=== ✅ Docker Gateway IP ==="
GATEWAY_IP=$(docker network inspect bridge | grep -oP '"Gateway": "\K[^"]+')
echo "Gateway IP: $GATEWAY_IP"

echo ""
echo "=== ✅ Test from Docker ==="
docker run --rm curlimages/curl:latest curl -s http://$GATEWAY_IP:11434/api/tags | head -20

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Ollama is now configured!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Now go to Dokploy: http://51.79.55.171:3000"
echo ""
echo "Settings → AI → Add AI:"
echo ""
echo "  Name:         Ollama - Qwen2 1.5B"
echo "  API URL:      http://$GATEWAY_IP:11434/v1"
echo "  API Key:      ollama"
echo ""
echo "Click Save, then Enable AI Features"
echo ""
