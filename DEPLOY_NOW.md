# 🚀 Deploy EchoHub NOW - Quick Start

## ✅ Infrastructure Ready

Your FREE AWS infrastructure is **LIVE and READY**:

- **Public IP**: `100.26.171.158` (Elastic IP - won't change)
- **Instance**: t3.micro (2 vCPU, 1GB RAM) - FREE TIER
- **Region**: us-east-1
- **Cost**: $0/month 🎉

## 🎯 Deploy in 3 Steps (15 minutes)

### Step 1: Get FREE Google Gemini API Key (2 minutes)

1. Go to: **https://aistudio.google.com/**
2. Sign in with your Google account
3. Click "**Get API key**"
4. Click "**Create API key**"
5. **Copy the key** (looks like: `AIzaSy...`)

Keep this key handy - you'll need it in Step 3!

### Step 2: Connect to Your Server (1 minute)

Open your terminal and run:

```bash
ssh -i ~/.ssh/echohub-key.pem ubuntu@100.26.171.158
```

**First time?** Type `yes` when asked about authenticity.

### Step 3: Deploy EchoHub (10 minutes)

Once connected, run these commands:

```bash
# Clone the repository
git clone https://github.com/guillaume-flambard/echohub.git
cd echohub

# Run the deployment script
./deploy-aws.sh
```

**During deployment, you'll be asked:**

1. **Gemini API Key**: Paste the key from Step 1
2. **Admin Email**: Your email (or press Enter for default)
3. **Admin Password**: Choose a secure password

The script will automatically:
- ✅ Install all dependencies
- ✅ Configure EchoHub with Gemini AI
- ✅ Build and start all services
- ✅ Create your admin user
- ✅ Start Matrix homeserver
- ✅ Start Minerva AI bots

**Wait for completion message** (~10 minutes)

## 🎉 Access Your EchoHub

Once deployment completes, open your browser:

```
http://100.26.171.158
```

**Login with:**
- Email: [the email you entered]
- Password: [the password you entered]

## 💡 What You Get

✅ **Full EchoHub Platform** (100% FREE)
- Multi-tenant organization management
- Enterprise RBAC with 5 role levels
- Team-based collaboration
- 35 granular permissions
- Comprehensive audit logging

✅ **Matrix Messaging**
- Decentralized real-time chat
- Matrix Synapse homeserver

✅ **Minerva AI** (Powered by FREE Google Gemini)
- 1,500 AI requests/day (FREE)
- GPT-4 level intelligence
- Intelligent app context management

✅ **Zero Monthly Cost**
- EC2: $0 (Free Tier)
- Storage: $0 (Free Tier)
- AI: $0 (Gemini Free Tier)

## 📱 Quick Commands

### View logs:
```bash
cd ~/echohub
docker compose logs -f
```

### Restart services:
```bash
docker compose restart
```

### Check status:
```bash
docker compose ps
```

### Stop services:
```bash
docker compose down
```

### Start services:
```bash
docker compose up -d
```

## 🆘 Need Help?

### Can't connect via SSH?
```bash
# Make sure key has correct permissions
chmod 400 ~/.ssh/echohub-key.pem

# Try again
ssh -i ~/.ssh/echohub-key.pem ubuntu@100.26.171.158
```

### Services not starting?
```bash
# Check Docker logs
docker compose logs app

# Restart services
docker compose restart
```

### Forgot admin password?
```bash
# Reset via tinker
docker compose exec app php artisan tinker

# Then run:
$user = User::where('email', 'your@email.com')->first();
$user->password = Hash::make('new_password');
$user->save();
```

## 📖 Full Documentation

- **Complete Guide**: See `AWS_SETUP_COMPLETE.md`
- **Deployment Options**: See `AWS_DEPLOYMENT_GUIDE.md`
- **GitHub Repo**: https://github.com/guillaume-flambard/echohub

## 🎯 Ready? Let's Deploy!

1. ✅ Get Gemini API key: https://aistudio.google.com/
2. ✅ SSH to server: `ssh -i ~/.ssh/echohub-key.pem ubuntu@100.26.171.158`
3. ✅ Run: `./deploy-aws.sh`

**Your EchoHub will be live in 15 minutes!** 🚀
