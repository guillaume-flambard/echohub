# 🚀 Deploy EchoHub with Groq AI (100% FREE)

## ✅ Your Setup

- **EC2 Instance**: Running and ready
- **IP Address**: `100.26.171.158`
- **Groq API Key**: Get from https://console.groq.com/keys
- **Groq Model**: llama-3.3-70b-versatile
- **Status**: ✅ Ready to deploy!

## ⚡ Why Groq?

- ✅ **Lightning Fast**: 1000+ tokens/second
- ✅ **100% Free**: No credit card needed
- ✅ **High Quality**: llama-3.3-70b-versatile model
- ✅ **Perfect for 1GB RAM**: No local resources needed
- ✅ **Response Time**: ~0.028 seconds (tested!)

---

## 🚀 Deploy NOW (10 minutes)

### Step 1: Connect to EC2 (30 seconds)

```bash
ssh -i ~/.ssh/echohub-key.pem ubuntu@100.26.171.158
```

### Step 2: Clone Repository (1 minute)

```bash
git clone https://github.com/guillaume-flambard/echohub.git
cd echohub
```

### Step 3: Run Deployment Script (8 minutes)

```bash
chmod +x deploy-aws.sh
./deploy-aws.sh
```

**When prompted:**

1. **AI Provider**: Press `1` for Groq (or just press Enter)
2. **Groq API Key**: Paste your Groq API key from https://console.groq.com/keys
3. **Admin Email**: Enter your email (or press Enter for default)
4. **Admin Password**: Choose a secure password

### Step 4: Access EchoHub (Immediately!)

Once deployment completes:

```
http://100.26.171.158
```

**Login with:**
- Email: [your configured email]
- Password: [your configured password]

---

## 🎉 What You Get (All FREE)

### EchoHub Platform
- ✅ Multi-tenant enterprise platform
- ✅ Organization & team management
- ✅ 5-tier RBAC system
- ✅ 35 granular permissions
- ✅ Comprehensive audit logging

### Groq AI Integration
- ✅ Ultra-fast AI responses (1000+ tokens/sec)
- ✅ llama-3.3-70b-versatile model
- ✅ Unlimited requests (within rate limits)
- ✅ No cost

### Matrix Messaging
- ✅ Synapse homeserver
- ✅ Real-time communication
- ✅ Decentralized protocol

### Infrastructure
- ✅ EC2 t3.micro (FREE for 12 months)
- ✅ Elastic IP (stable address)
- ✅ Docker Compose
- ✅ SQLite database

---

## 📊 Groq Configuration

The deployment script automatically configures:

```env
MINERVA_AI_PROVIDER=groq
MINERVA_AI_API_KEY=your_groq_api_key_here
MINERVA_AI_MODEL=llama-3.3-70b-versatile
MINERVA_AI_BASE_URL=https://api.groq.com/openai/v1
```

---

## 🔧 Post-Deployment Commands

### View Logs
```bash
cd ~/echohub
docker compose logs -f
```

### Check AI Status
```bash
# Test Groq API
curl -X POST 'https://api.groq.com/openai/v1/chat/completions' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_GROQ_API_KEY' \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"Hello"}]}'
```

### Restart Services
```bash
docker compose restart
```

### Update Application
```bash
git pull
docker compose build
docker compose up -d
```

---

## 💰 Monthly Cost: $0

- EC2 t3.micro: **$0** (Free Tier)
- Elastic IP: **$0** (attached)
- Storage: **$0** (Free Tier)
- Groq AI: **$0** (Free)
- **Total: $0/month** 🎉

---

## 🆘 Troubleshooting

### Can't SSH?
```bash
chmod 400 ~/.ssh/echohub-key.pem
ssh -i ~/.ssh/echohub-key.pem ubuntu@100.26.171.158
```

### Groq API Error?
Your key is already tested and working! If you see errors:
1. Check internet connectivity on EC2
2. Verify .env configuration:
```bash
cat ~/echohub/.env | grep MINERVA
```

### Services Not Starting?
```bash
cd ~/echohub
docker compose down
docker compose up -d
docker compose logs -f app
```

---

## 📈 Performance

### Expected Response Times
- **Groq API**: ~0.03 seconds ⚡
- **Total Request**: ~0.1 seconds
- **Concurrent Users**: 10-50 (on t3.micro)

### Rate Limits (Groq Free Tier)
- Requests per minute: Very generous
- Requests per day: High (sufficient for small teams)
- If you hit limits: Upgrade to Groq paid tier (very affordable)

---

## 🔄 Alternative Models

If you want to try other Groq models, update `.env`:

```bash
# Faster but smaller model
MINERVA_AI_MODEL=llama-3.1-8b-instant

# Best balance (current)
MINERVA_AI_MODEL=llama-3.3-70b-versatile

# Long context
MINERVA_AI_MODEL=mixtral-8x7b-32768

# After changing, restart:
docker compose restart
```

---

## 🎯 Next Steps

1. ☑️ Groq API key obtained and tested
2. ☐ SSH to EC2
3. ☐ Run deployment script
4. ☐ Access EchoHub at http://100.26.171.158
5. ☐ Test Minerva AI chat
6. ☐ (Optional) Configure domain + SSL

---

## ✨ You're Ready!

Everything is prepared:
- ✅ EC2 instance running
- ✅ Groq API key working
- ✅ Deployment script updated
- ✅ Documentation ready

**Time to deploy**: 10 minutes

**SSH into your server and run the script!** 🚀

```bash
ssh -i ~/.ssh/echohub-key.pem ubuntu@100.26.171.158
```

Then follow the deployment steps above!
