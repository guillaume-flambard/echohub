# Ollama + Dokploy - Quick Fix (5 minutes)

## Run These Commands on Your Server

SSH to server:
```bash
ssh memo@51.79.55.171
```

Stop Ollama:
```bash
pkill ollama
```

Create systemd service (copy entire block):
```bash
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
```

Start service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl start ollama
```

Verify:
```bash
netstat -tlnp | grep 11434
```

Expected: `0.0.0.0:11434` ✅

Find Docker gateway IP:
```bash
docker network inspect bridge | grep Gateway
```

Expected: `"Gateway": "172.17.0.1"` (save this IP!)

Test from Docker:
```bash
docker run --rm curlimages/curl:latest curl http://172.17.0.1:11434/api/tags
```

Expected: JSON with your models ✅

---

## Configure Dokploy

Go to: http://51.79.55.171:3000

**Settings → AI → Add AI**

Fill in:
```
Name:         Ollama - Qwen2 1.5B
API URL:      http://172.17.0.1:11434/v1
API Key:      ollama
```

Click **Save**

Toggle **Enable AI Features** to **ON**

Select `qwen2:1.5b` from dropdown

Click **Save**

---

## Done! ✅

Ollama is now accessible from Dokploy.

**Troubleshooting:** See `OLLAMA_DOKPLOY_FIX.md` for detailed help.
