# Fix Ollama Access from Dokploy - Complete Guide

Step-by-step fix to make Ollama accessible from Dokploy containers.

## The Problem

Dokploy runs in Docker containers. When you use `http://localhost:11434`, Docker looks for Ollama inside its own container (not on your host server). We need to make Ollama accessible from Docker.

---

## The Fix (5 minutes)

### Step 1: SSH to Your Server

```bash
ssh memo@51.79.55.171
```

### Step 2: Stop Current Ollama

```bash
pkill ollama
```

### Step 3: Create Ollama Systemd Service

Copy and paste this entire block:

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

### Step 4: Start Ollama Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl start ollama
```

### Step 5: Verify Ollama is Running

```bash
# Check service status
sudo systemctl status ollama

# Check it's listening on 0.0.0.0:11434
netstat -tlnp | grep 11434
```

**Expected output:**
```
tcp  0  0  0.0.0.0:11434  0.0.0.0:*  LISTEN  [process_id]/ollama
```

**Important:** It should say `0.0.0.0:11434`, NOT `127.0.0.1:11434`

### Step 6: Find Docker Bridge Gateway IP

```bash
docker network inspect bridge | grep Gateway
```

**Expected output:**
```
"Gateway": "172.17.0.1"
```

**Save this IP!** You'll use it in Step 8.

### Step 7: Test Ollama from Docker Container

```bash
# Create a temporary container and test
docker run --rm curlimages/curl:latest curl http://172.17.0.1:11434/api/tags
```

**Expected:** JSON response showing your models (including qwen2:1.5b)

**If this works:** ✅ Ollama is accessible from Docker!

**If this fails:** Try these alternatives:
```bash
# Test with your server IP
docker run --rm curlimages/curl:latest curl http://51.79.55.171:11434/api/tags

# Test with different bridge IP
docker run --rm curlimages/curl:latest curl http://10.0.0.1:11434/api/tags
```

Use whichever IP works in the next step.

---

## Step 8: Configure Dokploy AI

Now go to your Dokploy dashboard in browser:

**URL:** http://51.79.55.171:3000

1. Go to **Settings** → **AI**
2. Click **Add AI** (or edit existing)
3. Fill in the form:

```
Name:         Ollama - Qwen2 1.5B
API URL:      http://172.17.0.1:11434/v1
API Key:      ollama
```

**Important:** Use the Gateway IP from Step 6 (probably `172.17.0.1`)

4. Click **Save**

**Expected:** "Successfully connected" or models list appears

5. If models load:
   - Toggle **Enable AI Features** to **ON**
   - Select `qwen2:1.5b` from dropdown
   - Click **Save**

---

## Verification

### On Server

```bash
# Ollama is running
sudo systemctl status ollama

# Listening on all interfaces
netstat -tlnp | grep 11434
# Should show: 0.0.0.0:11434

# Models are available
curl http://localhost:11434/api/tags
# Should list qwen2:1.5b

# Accessible from Docker
docker run --rm curlimages/curl:latest curl http://172.17.0.1:11434/api/tags
# Should return models JSON
```

### In Dokploy

- ✅ AI configuration shows "Connected"
- ✅ Models dropdown shows `qwen2:1.5b`
- ✅ AI Features enabled

---

## Troubleshooting

### "Failed to fetch models" in Dokploy

**Problem:** Wrong IP address

**Fix:** Try these URLs in Dokploy AI config:

1. `http://172.17.0.1:11434/v1` (most common)
2. `http://51.79.55.171:11434/v1` (your server IP)
3. `http://10.0.0.1:11434/v1` (alternative bridge IP)

Test each from Docker first:
```bash
docker run --rm curlimages/curl:latest curl http://[IP]:11434/api/tags
```

Use the one that works.

### Ollama Not Listening on 0.0.0.0

**Check:**
```bash
netstat -tlnp | grep 11434
```

**If showing 127.0.0.1:11434:**

```bash
# Restart with correct config
sudo systemctl restart ollama

# Verify environment variable
sudo systemctl show ollama | grep Environment
# Should show: OLLAMA_HOST=0.0.0.0:11434
```

### Docker Can't Reach Ollama

**Test connectivity:**
```bash
# From any Dokploy container terminal
curl http://172.17.0.1:11434/api/tags
```

**If fails:**

Check firewall:
```bash
sudo ufw status
# If active, allow port 11434
sudo ufw allow 11434
```

Check Docker network:
```bash
# Find correct gateway
docker network inspect bridge | grep -A5 Gateway

# Try that IP
```

### Ollama Service Won't Start

```bash
# Check logs
sudo journalctl -u ollama -f

# Common issues:
# - Binary not at /usr/local/bin/ollama
which ollama
# Update ExecStart path if different

# - Permission issues
sudo chown root:root /usr/local/bin/ollama
sudo chmod +x /usr/local/bin/ollama
```

---

## Alternative: Use Server IP Directly

If Docker bridge doesn't work, use your server's IP:

**In Dokploy AI config:**
```
API URL: http://51.79.55.171:11434/v1
```

**But first, ensure Ollama allows external connections:**

Check `/etc/systemd/system/ollama.service`:
```
Environment="OLLAMA_HOST=0.0.0.0:11434"
```

Not:
```
Environment="OLLAMA_HOST=127.0.0.1:11434"
```

---

## Make Ollama Auto-Start on Reboot

Already done! The systemd service is enabled.

**Verify:**
```bash
sudo systemctl is-enabled ollama
# Should return: enabled
```

**Test reboot:**
```bash
sudo reboot
# Wait 1 minute, then SSH back
ssh memo@51.79.55.171

# Check Ollama started automatically
sudo systemctl status ollama
curl http://localhost:11434/api/tags
```

---

## Quick Commands Reference

```bash
# Check Ollama status
sudo systemctl status ollama

# Start Ollama
sudo systemctl start ollama

# Stop Ollama
sudo systemctl stop ollama

# Restart Ollama
sudo systemctl restart ollama

# View Ollama logs
sudo journalctl -u ollama -f

# Check what's listening on 11434
netstat -tlnp | grep 11434

# Test Ollama
curl http://localhost:11434/api/tags

# Test from Docker
docker run --rm curlimages/curl:latest curl http://172.17.0.1:11434/api/tags

# Find Docker gateway IP
docker network inspect bridge | grep Gateway
```

---

## Summary: What Changed

### Before
- ❌ Ollama listening on 127.0.0.1:11434 (localhost only)
- ❌ Docker containers can't reach localhost on host
- ❌ Dokploy AI config fails with "fetch failed"

### After
- ✅ Ollama listening on 0.0.0.0:11434 (all interfaces)
- ✅ Docker containers reach Ollama via 172.17.0.1:11434
- ✅ Dokploy AI config works with correct URL
- ✅ Ollama auto-starts on boot

---

## For EchoHub Applications

When deploying EchoHub apps in Dokploy, use these environment variables:

```env
MINERVA_AI_PROVIDER=ollama
MINERVA_AI_BASE_URL=http://172.17.0.1:11434
MINERVA_AI_MODEL=qwen2:1.5b
```

Or:
```env
MINERVA_AI_BASE_URL=http://51.79.55.171:11434
```

Use the same IP that worked in Dokploy AI config.

---

## Next Steps After Fix

1. ✅ Configure Dokploy AI (done)
2. ✅ Deploy EchoHub with correct Ollama settings
3. ✅ Test Minerva AI in hub
4. ✅ Enjoy free AI without API costs!

---

**Total setup time: 5 minutes**

**Cost: $0/month** (vs $50-100/month for Claude/OpenAI)

---

## Need Help?

Run this diagnostic and share output:

```bash
echo "=== Ollama Service Status ==="
sudo systemctl status ollama

echo "=== Listening Ports ==="
netstat -tlnp | grep 11434

echo "=== Docker Gateway ==="
docker network inspect bridge | grep Gateway

echo "=== Ollama API Test ==="
curl http://localhost:11434/api/tags

echo "=== Docker Access Test ==="
docker run --rm curlimages/curl:latest curl http://172.17.0.1:11434/api/tags
```

Share the output for help troubleshooting.
