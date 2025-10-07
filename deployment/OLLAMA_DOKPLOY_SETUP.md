# Add Ollama to Dokploy AI Configuration

Guide to configure Ollama as your AI provider in Dokploy.

## Option 1: Install Ollama on the Server (Recommended)

### Step 1: Install Ollama on VPS

SSH into your server:

```bash
ssh memo@51.79.55.171
```

Install Ollama:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Start Ollama Service

```bash
# Start Ollama in background
ollama serve &

# Or use systemd (recommended)
sudo systemctl enable ollama
sudo systemctl start ollama
```

### Step 3: Pull a Model

```bash
# Small, fast model (1.5GB)
ollama pull llama3.2:1.5b

# Or medium model (3GB)
ollama pull llama3.2:3b

# Or larger model (5GB) - better quality
ollama pull qwen2.5:7b
```

### Step 4: Configure in Dokploy

In Dokploy Dashboard → **Settings** → **AI**:

**Click "Add AI"** and fill in:

```
Name: Ollama Local
API URL: http://host.docker.internal:11434/v1
API Key: ollama
```

Click **Save**

Then:
- **Enable AI Features**: Toggle ON
- Select **Ollama Local** from the dropdown
- Click **Save**

---

## Option 2: Use Ollama as Docker Container

### Step 1: Add Ollama to Docker Compose

In Dokploy, create a new **Compose** service:

1. Click **+ Create** → **Compose**
2. Name: `ollama-service`
3. Paste this config:

```yaml
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0:11434

volumes:
  ollama_data:
```

4. Click **Deploy**

### Step 2: Pull Model in Container

After deployment, go to **Terminal** tab:

```bash
# Connect to container
docker exec -it ollama bash

# Pull a model
ollama pull llama3.2:3b

# Exit
exit
```

### Step 3: Configure in Dokploy

In Dokploy Dashboard → **Settings** → **AI**:

**Click "Add AI"** and fill in:

```
Name: Ollama Docker
API URL: http://ollama:11434/v1
API Key: ollama
```

Or if using host network:

```
API URL: http://localhost:11434/v1
```

Click **Save** and **Enable AI Features**

---

## Dokploy AI Configuration Form

Fill in the form you showed:

### Field Values for Ollama

**Name:**
```
Ollama Local
```

**API URL:**
```
http://host.docker.internal:11434/v1
```

Or if Ollama is running on the same server:
```
http://localhost:11434/v1
```

Or if using Docker Compose with service name:
```
http://ollama:11434/v1
```

**API Key:**
```
ollama
```

**Note:** Ollama doesn't require a real API key, but Dokploy might require something in the field. Use `ollama` or `not-needed`.

### Enable AI Features
- Toggle: **ON** ✅

---

## Verify Ollama is Working

### Test Ollama Directly

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Expected: List of pulled models

# Test generation
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

### Test from Dokploy

In Dokploy:
1. Create a test application
2. Use AI features (if available)
3. Check logs for Ollama API calls

---

## Available Models

### Small Models (Fast, less accurate)
```bash
ollama pull llama3.2:1.5b      # 1.5GB - Very fast
ollama pull qwen2:1.5b         # 1.5GB - Fast
```

### Medium Models (Balanced)
```bash
ollama pull llama3.2:3b        # 3GB - Good balance
ollama pull qwen2.5:3b         # 3GB - Good quality
```

### Large Models (Better quality, slower)
```bash
ollama pull qwen2.5:7b         # 5GB - High quality
ollama pull llama3.1:8b        # 8GB - Very good
ollama pull mixtral:8x7b       # 26GB - Excellent (needs lots of RAM)
```

### Recommended for Dokploy
```bash
ollama pull qwen2.5:3b
```

Good balance of speed and quality.

---

## For EchoHub Minerva AI

If you want to use Ollama for EchoHub's Minerva AI (not just Dokploy):

### Update Environment Variables

In Dokploy → EchoHub Application → **Environment**:

```env
MINERVA_AI_PROVIDER=ollama
MINERVA_AI_BASE_URL=http://localhost:11434
MINERVA_AI_MODEL=llama3.2:3b
```

Or if using Docker Compose Ollama:

```env
MINERVA_AI_BASE_URL=http://ollama:11434
```

Redeploy the application.

---

## Troubleshooting

### "Could not connect to Ollama"

**Check if Ollama is running:**
```bash
curl http://localhost:11434/api/tags
```

**If not running:**
```bash
ollama serve &
```

### "Model not found"

**Pull the model:**
```bash
ollama pull llama3.2:3b
```

**List available models:**
```bash
ollama list
```

### "Connection refused from Docker"

Use `host.docker.internal:11434` instead of `localhost:11434` in Docker containers.

### API URL Issues

**Try these URLs in order:**

1. `http://host.docker.internal:11434/v1`
2. `http://localhost:11434/v1`
3. `http://ollama:11434/v1` (if using compose)
4. `http://51.79.55.171:11434/v1` (if exposing publicly - not recommended)

---

## Security Note

**Do NOT expose Ollama to the internet without authentication!**

Keep it:
- Bound to localhost
- Or behind a firewall
- Or in a private Docker network

Dokploy should access it internally only.

---

## Comparison: Ollama vs Cloud AI

### Ollama (Local)
- ✅ **Free** - No API costs
- ✅ **Private** - Data stays on your server
- ✅ **Fast** - No network latency
- ⚠️ **Requires RAM** - 8GB+ recommended
- ⚠️ **Quality** - Good but not as good as GPT-4/Claude

### Claude/OpenAI (Cloud)
- ✅ **Best Quality** - State-of-the-art models
- ⚠️ **Costs Money** - Pay per token
- ⚠️ **Privacy** - Data sent to third party
- ⚠️ **Latency** - Network delay

---

## Recommended Setup

**For EchoHub with limited budget:**

1. **Install Ollama** on server (free)
2. **Use medium model** (qwen2.5:3b or llama3.2:3b)
3. **Configure Dokploy** to use Ollama
4. **Set up Minerva AI** with Ollama

**Total cost:** $0/month

**For better quality:**

1. Use Ollama for **development/testing**
2. Use Claude/OpenAI for **production**
3. Control costs with rate limiting

---

## Quick Commands

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama
ollama serve &

# Pull model
ollama pull llama3.2:3b

# List models
ollama list

# Test
curl http://localhost:11434/api/tags

# Check if running
ps aux | grep ollama

# Stop Ollama
pkill ollama
```

---

## Dokploy AI Form - Quick Reference

```
Name:         Ollama Local
API URL:      http://host.docker.internal:11434/v1
API Key:      ollama
Enable:       ✅ ON
```

**Save** and you're done!

---

**Ollama + Dokploy = Free AI-powered deployments!** 🚀
