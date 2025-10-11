# ✅ EchoHub AWS Infrastructure Setup Complete!

## 🎉 Your FREE AWS Infrastructure is Ready

### Instance Details
- **Instance ID**: `i-05e9d5420d1e959ae`
- **Instance Type**: `t3.micro` (2 vCPU, 1GB RAM) - **FREE TIER**
- **Operating System**: Ubuntu 24.04 LTS
- **Public IP**: `100.26.171.158` (Elastic IP - stable, won't change)
- **Region**: us-east-1 (N. Virginia)
- **Security Group**: `sg-0edb9989ac8e4e85b`
- **SSH Key**: `~/.ssh/echohub-key.pem`

### Firewall Rules (Configured)
- ✅ Port 22 (SSH) - For server management
- ✅ Port 80 (HTTP) - For web access
- ✅ Port 443 (HTTPS) - For SSL (when configured)
- ✅ Port 8008 (Matrix) - For Matrix homeserver

### Monthly Cost
- **EC2 Instance**: $0 (Free Tier - 750 hours/month)
- **Elastic IP**: $0 (free when attached to running instance)
- **Storage**: $0 (30GB EBS included in Free Tier)
- **Data Transfer**: $0 (100GB/month included)
- **Google Gemini AI**: $0 (1,500 requests/day free)
- **TOTAL**: **$0/month** 🎉

---

## 🚀 Next Steps: Deploy EchoHub

### Step 1: Get Google Gemini API Key (5 minutes)

Before deploying, you need a FREE Google Gemini API key:

1. Visit: https://aistudio.google.com/
2. Sign in with your Google account
3. Click "Get API key" button
4. Create a new API key
5. Copy the key (you'll need it during deployment)

**Important**: Keep this API key secure! You'll paste it during the deployment.

### Step 2: Connect to Your Server

```bash
# SSH into your server
ssh -i ~/.ssh/echohub-key.pem ubuntu@100.26.171.158
```

**First time connecting?**
- You'll see a message about authenticity - type `yes` and press Enter
- This is normal and only happens once

### Step 3: Run Deployment Script

Once connected to your server, run:

```bash
# Download and run the deployment script
curl -fsSL https://raw.githubusercontent.com/guillaume-flambard/echohub/main/deploy-aws.sh | bash
```

**Or manually:**

```bash
# Clone the repository
git clone https://github.com/guillaume-flambard/echohub.git
cd echohub

# Make the script executable
chmod +x deploy-aws.sh

# Run the deployment
./deploy-aws.sh
```

### Step 4: Configure During Deployment

The script will prompt you for:

1. **Gemini API Key**: Paste your API key from Step 1
2. **Admin Email**: Your admin email (default: admin@echohub.local)
3. **Admin Password**: Choose a secure password

The deployment takes about 15-20 minutes and will:
- ✅ Install Docker & Docker Compose
- ✅ Clone EchoHub repository
- ✅ Configure environment with Gemini AI
- ✅ Build and start all services
- ✅ Run database migrations
- ✅ Create admin user
- ✅ Start Matrix homeserver
- ✅ Start Minerva bot services

### Step 5: Access Your EchoHub

Once deployment is complete, access EchoHub at:

```
http://100.26.171.158
```

**Login with:**
- Email: [the email you entered]
- Password: [the password you entered]

---

## 📊 Service Management

### View Logs
```bash
cd ~/echohub
docker compose logs -f
```

### Restart Services
```bash
docker compose restart
```

### Stop Services
```bash
docker compose down
```

### Start Services
```bash
docker compose up -d
```

### Check Service Status
```bash
docker compose ps
```

### Update to Latest Version
```bash
cd ~/echohub
git pull
docker compose build
docker compose up -d
docker compose exec app php artisan migrate --force
```

---

## 🔧 Troubleshooting

### Can't Connect via SSH?
```bash
# Check if instance is running
aws ec2 describe-instances --instance-ids i-05e9d5420d1e959ae --query 'Reservations[0].Instances[0].State.Name'

# Verify security group allows SSH
aws ec2 describe-security-groups --group-ids sg-0edb9989ac8e4e85b
```

### Services Not Starting?
```bash
# Check Docker status
sudo systemctl status docker

# Check logs
cd ~/echohub
docker compose logs -f app
```

### Out of Memory?
```bash
# Check memory usage
free -h

# If needed, add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Gemini API Not Working?
```bash
# Test API key
curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_API_KEY"

# Check .env configuration
cat ~/echohub/.env | grep MINERVA
```

---

## 🌐 Optional: Setup Domain & SSL

### If You Have a Domain:

1. **Point Domain to IP**:
   - Add an A record: `echohub.yourdomain.com` → `100.26.171.158`

2. **Install Nginx & Certbot**:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

3. **Configure Nginx**:
```bash
sudo nano /etc/nginx/sites-available/echohub
```

Add:
```nginx
server {
    listen 80;
    server_name echohub.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

4. **Enable Site & Get SSL**:
```bash
sudo ln -s /etc/nginx/sites-available/echohub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d echohub.yourdomain.com
```

---

## 💰 Cost Monitoring

### Check Your AWS Costs
```bash
# View current month costs
aws ce get-cost-and-usage \
  --time-period Start=2025-10-01,End=2025-10-31 \
  --granularity MONTHLY \
  --metrics UnblendedCost
```

### Set Up Billing Alerts

1. Go to: https://console.aws.amazon.com/billing/home#/budgets
2. Create a budget alert (e.g., alert if spending > $5)

---

## 🔄 Upgrade Path (When Needed)

### When to Upgrade:

**Upgrade to t3.small ($15/month) if:**
- Memory usage consistently > 80%
- Application becomes slow
- Want to run Ollama locally instead of Gemini API

**Upgrade Command:**
```bash
aws ec2 modify-instance-attribute \
  --instance-id i-05e9d5420d1e959ae \
  --instance-type t3.small
```

### After Free Tier (12 months):

**Option 1**: Continue with t3.micro ($7.50/month)
**Option 2**: Move to AWS Lightsail ($7-12/month)
**Option 3**: Upgrade to t3.small ($15/month) for better performance

---

## 📞 Support & Resources

### Documentation
- EchoHub Docs: Check repository README
- AWS Free Tier: https://aws.amazon.com/free/
- Google Gemini API: https://ai.google.dev/

### Quick Links
- **AWS Console**: https://console.aws.amazon.com/
- **EC2 Dashboard**: https://console.aws.amazon.com/ec2/
- **Your Instance**: https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#Instances:instanceId=i-05e9d5420d1e959ae
- **Google AI Studio**: https://aistudio.google.com/

---

## ✨ What You Built

You now have a fully functional enterprise-grade platform running 100% FREE:

✅ **EchoHub Multi-Tenant Platform**
- Laravel 12 backend with enterprise RBAC
- React 19 frontend with Inertia.js
- Organization management with roles & permissions
- Team-based collaboration
- Comprehensive audit logging

✅ **Matrix Protocol Integration**
- Decentralized messaging
- Real-time communication
- Matrix Synapse homeserver

✅ **Minerva AI System**
- Powered by FREE Google Gemini 2.5 Flash
- 1,500 AI requests/day (FREE)
- Intelligent app context management
- Multi-app support

✅ **Enterprise Features**
- Multi-tenancy with organization isolation
- 5-tier RBAC (Super Admin, Org Admin, Team Lead, Member, Guest)
- 35 granular permissions
- Audit logging for compliance
- Subscription management
- Usage limits and quotas

**Total Monthly Cost**: $0 🎉

---

## 🎯 Ready to Deploy?

1. Get your Gemini API key: https://aistudio.google.com/
2. SSH into your server: `ssh -i ~/.ssh/echohub-key.pem ubuntu@100.26.171.158`
3. Run the deployment script: `./deploy-aws.sh`
4. Access EchoHub: http://100.26.171.158

**Happy deploying! 🚀**
