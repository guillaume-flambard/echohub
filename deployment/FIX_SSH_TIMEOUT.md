# Fix SSH Timeout Error

## Current Error
```
dial tcp ***:22: i/o timeout
```

**This means:** GitHub Actions cannot connect to your VPS via SSH.

## Root Cause

The VPS either:
1. **Not reachable** from GitHub Actions servers
2. **Firewall blocking** SSH port 22
3. **Wrong IP/hostname** in GitHub Secrets
4. **SSH service not running**
5. **GitHub Actions IPs blocked**

## Step-by-Step Fix

### Step 1: Verify VPS is Running

```bash
# From your local machine, test connection
ssh your-user@your-vps-ip

# If this works, continue to Step 2
# If this fails, check:
# - VPS is powered on
# - Correct IP address
# - SSH service running: sudo systemctl status sshd
```

### Step 2: Test SSH Connection

Use the test script provided:

```bash
cd deployment
VPS_HOST=your-vps-ip VPS_USER=your-user ./test-ssh-connection.sh
```

Fix any ❌ errors shown by the script.

### Step 3: Configure Firewall for GitHub Actions

GitHub Actions uses these IP ranges:
- `140.82.112.0/20`
- `143.55.64.0/20`
- `185.199.108.0/22`
- `192.30.252.0/22`

**Option A: Allow GitHub Actions IPs (Recommended)**

```bash
# SSH into your VPS
ssh your-user@your-vps-ip

# Allow GitHub Actions IP ranges
sudo ufw allow from 140.82.112.0/20 to any port 22
sudo ufw allow from 143.55.64.0/20 to any port 22
sudo ufw allow from 185.199.108.0/22 to any port 22
sudo ufw allow from 192.30.252.0/22 to any port 22

# Reload firewall
sudo ufw reload

# Check rules
sudo ufw status numbered
```

**Option B: Allow all SSH (Less Secure)**

```bash
sudo ufw allow 22/tcp
sudo ufw reload
```

### Step 4: Verify GitHub Secrets

Go to your GitHub repository:
**Settings → Secrets and variables → Actions**

Required secrets (case-sensitive):

| Secret Name | Example Value | How to Get |
|-------------|---------------|------------|
| `VPS_HOST` | `192.168.1.100` or `vps.example.com` | Your VPS IP or hostname |
| `VPS_USER` | `deploy` or `root` | SSH username |
| `VPS_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Run `cat ~/.ssh/id_ed25519` |
| `APP_KEY` | `base64:xyz123...` | Run `php artisan key:generate --show` |
| `DB_PASSWORD_PROD` | `your-db-password` | PostgreSQL password for production |

### Step 5: Set Up SSH Key (if not done)

```bash
# On your local machine, generate SSH key
ssh-keygen -t ed25519 -C "github-actions-echohub" -f ~/.ssh/echohub_deploy

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/echohub_deploy.pub your-user@your-vps-ip

# Test key-based auth
ssh -i ~/.ssh/echohub_deploy your-user@your-vps-ip

# Copy PRIVATE key for GitHub Secret (VPS_SSH_KEY)
cat ~/.ssh/echohub_deploy
# Copy entire output including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ...
# -----END OPENSSH PRIVATE KEY-----
```

### Step 6: Test from GitHub Actions IP Range (Advanced)

If you have access to a server in GitHub's IP range, test from there:

```bash
# Use a cloud instance in same region as GitHub Actions
# (GitHub Actions runs in Azure, mostly US East/West regions)

# Test connection
ssh -i your_key your-user@your-vps-ip

# If this works but GitHub Actions still fails,
# check if VPS has rate limiting or fail2ban blocking
```

### Step 7: Check VPS Logs

```bash
# SSH into VPS
ssh your-user@your-vps-ip

# Check SSH authentication logs
sudo tail -f /var/log/auth.log  # Debian/Ubuntu
# or
sudo tail -f /var/log/secure     # CentOS/RHEL

# Look for failed connection attempts
# Common issues:
# - "Connection reset by peer" → Firewall blocking
# - "Permission denied" → Wrong key or user
# - "No route to host" → Network issue
```

### Step 8: Alternative - Use GitHub Actions Self-Hosted Runner

If firewall restrictions persist, use a self-hosted runner on your VPS:

```bash
# On VPS, install GitHub Actions runner
# Follow: https://github.com/[your-org]/echohub/settings/actions/runners/new

# This eliminates SSH entirely - runner is already on VPS
```

## Quick Diagnostic Checklist

Run these locally to verify setup:

```bash
# 1. Can you ping VPS?
ping your-vps-ip

# 2. Is SSH port open?
nc -zv your-vps-ip 22

# 3. Can you SSH in?
ssh your-user@your-vps-ip

# 4. Is Docker running?
ssh your-user@your-vps-ip "docker --version"

# 5. Does dokploy-network exist?
ssh your-user@your-vps-ip "docker network ls | grep dokploy"
```

All ✅? Then GitHub Secrets are likely wrong.

## After Fixing

Once SSH is working:

1. **Test deployment locally** using the SSH connection:
   ```bash
   ssh your-user@your-vps-ip "cd /opt && mkdir -p echohub-production"
   ```

2. **Trigger GitHub Actions** by pushing a commit:
   ```bash
   git commit --allow-empty -m "test: trigger deployment"
   git push
   ```

3. **Monitor deployment** in GitHub Actions tab

## Still Not Working?

### Check GitHub Actions Runner Location

GitHub Actions runs in Microsoft Azure datacenters. If your VPS has geo-blocking:

```bash
# Allow Azure IP ranges (very broad, use with caution)
# Download Azure IP ranges: https://www.microsoft.com/en-us/download/details.aspx?id=56519
```

### Use SSH Bastion/Jump Host

If direct access is blocked, use a jump host:

```yaml
# In .github/workflows/ci-cd.yml, modify SSH action:
- name: 🚀 Deploy to VPS
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USER }}
    key: ${{ secrets.VPS_SSH_KEY }}
    proxy_host: ${{ secrets.JUMP_HOST }}        # Add jump host
    proxy_username: ${{ secrets.JUMP_USER }}
    proxy_key: ${{ secrets.JUMP_SSH_KEY }}
    script: |
      # deployment script
```

### Enable SSH Debug in GitHub Actions

Temporarily add debug output:

```yaml
- name: 🚀 Deploy to VPS
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USER }}
    key: ${{ secrets.VPS_SSH_KEY }}
    debug: true  # Add this line
    script: |
      # your script
```

## Common VPS Provider Fixes

### DigitalOcean
- Enable firewall in Networking → Firewalls
- Add inbound rule: SSH, Port 22, Sources: Custom (GitHub IPs)

### AWS EC2
- Security Group: Add inbound rule SSH (22) from GitHub IP ranges
- Check Network ACLs

### Hetzner
- Firewall → Add rule: SSH (22) from 140.82.112.0/20, 143.55.64.0/20

### Linode
- Cloud Firewall → Add inbound rule: SSH, Port 22, GitHub IPs

### Azure
- Network Security Group → Add inbound rule: SSH (22), GitHub IPs

## Need More Help?

1. Share these logs in GitHub Issues:
   - Output of `./test-ssh-connection.sh`
   - VPS `/var/log/auth.log` (last 50 lines)
   - GitHub Actions deployment log (full)

2. Verify:
   - VPS provider and plan
   - Firewall/security group configuration
   - SSH works locally but not from GitHub

3. Alternative: Use Dokploy's built-in GitHub integration instead of custom CI/CD
