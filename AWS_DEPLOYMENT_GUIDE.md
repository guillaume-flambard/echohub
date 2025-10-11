# EchoHub AWS Deployment Guide

Complete guide for deploying EchoHub (Laravel 12 + React 19 + Matrix) on AWS.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [AWS Setup](#aws-setup)
3. [Deployment Options](#deployment-options)
4. [Option A: AWS Lightsail (Simple & Cost-Effective)](#option-a-aws-lightsail)
5. [Option B: AWS EC2 + RDS (Production)](#option-b-aws-ec2--rds)
6. [Option C: AWS ECS Fargate (Container-based)](#option-c-aws-ecs-fargate)
7. [Post-Deployment](#post-deployment)

---

## Prerequisites

### Local Requirements
- AWS CLI installed ✅
- Docker installed (for testing and ECS deployment)
- SSH key pair for EC2 access

### AWS Requirements
- AWS Account with billing enabled
- IAM user with appropriate permissions
- AWS Access Key ID and Secret Access Key

---

## AWS Setup

### 1. Configure AWS CLI

```bash
# Configure AWS credentials
aws configure

# Enter when prompted:
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: us-east-1 (or your preferred region)
# Default output format: json
```

### 2. Verify Configuration

```bash
# Test AWS CLI
aws sts get-caller-identity

# Should return your AWS account info
```

---

## Deployment Options

### Cost Comparison

| Option | Monthly Cost | Best For |
|--------|-------------|----------|
| **Lightsail** | $10-40 | Small teams, development, staging |
| **EC2 + RDS** | $50-200 | Production, scalable workloads |
| **ECS Fargate** | $40-300 | Containerized apps, auto-scaling |

---

## Option A: AWS Lightsail (Simple & Cost-Effective)

**Best for**: Getting started, development, small teams (< 10 users)
**Cost**: $10-40/month
**Setup time**: 30 minutes

### 1. Create Lightsail Instance

```bash
# Create Ubuntu 22.04 instance
aws lightsail create-instances \
  --instance-names echohub-prod \
  --availability-zone us-east-1a \
  --blueprint-id ubuntu_22_04 \
  --bundle-id medium_3_0

# Wait for instance to be running (2-3 minutes)
aws lightsail get-instance --instance-name echohub-prod
```

### 2. Get Static IP

```bash
# Allocate static IP
aws lightsail allocate-static-ip --static-ip-name echohub-ip

# Attach to instance
aws lightsail attach-static-ip \
  --static-ip-name echohub-ip \
  --instance-name echohub-prod

# Get the static IP
aws lightsail get-static-ip --static-ip-name echohub-ip
```

### 3. Open Ports

```bash
# Open HTTP, HTTPS, SSH, Matrix (8008)
aws lightsail open-instance-public-ports \
  --instance-name echohub-prod \
  --port-info fromPort=80,toPort=80,protocol=TCP

aws lightsail open-instance-public-ports \
  --instance-name echohub-prod \
  --port-info fromPort=443,toPort=443,protocol=TCP

aws lightsail open-instance-public-ports \
  --instance-name echohub-prod \
  --port-info fromPort=22,toPort=22,protocol=TCP

aws lightsail open-instance-public-ports \
  --instance-name echohub-prod \
  --port-info fromPort=8008,toPort=8008,protocol=TCP
```

### 4. Get SSH Key

```bash
# Download SSH key
aws lightsail download-default-key-pair --output text --query privateKeyBase64 | base64 --decode > ~/.ssh/echohub-lightsail.pem

# Set permissions
chmod 400 ~/.ssh/echohub-lightsail.pem

# Get connection info
INSTANCE_IP=$(aws lightsail get-static-ip --static-ip-name echohub-ip --query staticIp.ipAddress --output text)
echo "SSH into your instance: ssh -i ~/.ssh/echohub-lightsail.pem ubuntu@$INSTANCE_IP"
```

### 5. Deploy EchoHub

SSH into the instance and run the deployment:

```bash
# SSH into instance
ssh -i ~/.ssh/echohub-lightsail.pem ubuntu@$INSTANCE_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Clone repository
git clone https://github.com/guillaume-flambard/echohub.git
cd echohub

# Copy environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

**Update `.env` with:**
```bash
APP_URL=http://$INSTANCE_IP
APP_ENV=production
APP_DEBUG=false

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

MATRIX_HOMESERVER_URL=http://localhost:8008
MATRIX_SERVER_NAME=echohub.local

MINERVA_AI_PROVIDER=ollama
MINERVA_AI_BASE_URL=http://host.docker.internal:11434
```

**Continue deployment:**
```bash
# Install Ollama (for local AI)
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama
ollama serve &

# Pull AI model
ollama pull llama3.2:3b

# Build and start containers
docker compose up -d

# Run migrations
docker compose exec app php artisan migrate --force
docker compose exec app php artisan db:seed --class=RolesAndPermissionsSeeder
docker compose exec app php artisan db:seed --class=DefaultOrganizationSeeder

# Create admin user
docker compose exec app php artisan tinker --execute="
\$user = App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@echohub.local',
    'password' => Hash::make('your-secure-password'),
    'email_verified_at' => now()
]);
echo 'Admin user created: ' . \$user->email;
"

# Start Minerva bots
cd bots/minerva-bot
npm install
npm run build
npm start &
```

### 6. Set Up Domain (Optional)

```bash
# Point your domain to the static IP
# Add A record: echohub.yourdomain.com -> $INSTANCE_IP

# Install Nginx and Certbot
sudo apt install nginx certbot python3-certbot-nginx -y

# Configure Nginx
sudo nano /etc/nginx/sites-available/echohub
```

**Nginx configuration:**
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

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/echohub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificate
sudo certbot --nginx -d echohub.yourdomain.com
```

---

## Option B: AWS EC2 + RDS (Production)

**Best for**: Production workloads, scalable teams (10+ users)
**Cost**: $50-200/month
**Setup time**: 1-2 hours

### 1. Create VPC and Security Groups

```bash
# Create VPC
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=echohub-vpc}]' \
  --query 'Vpc.VpcId' --output text)

# Create Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=echohub-igw}]' \
  --query 'InternetGateway.InternetGatewayId' --output text)

aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID

# Create subnet
SUBNET_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=echohub-subnet}]' \
  --query 'Subnet.SubnetId' --output text)

# Create route table
ROUTE_TABLE_ID=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=echohub-rt}]' \
  --query 'RouteTable.RouteTableId' --output text)

aws ec2 create-route --route-table-id $ROUTE_TABLE_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID
aws ec2 associate-route-table --route-table-id $ROUTE_TABLE_ID --subnet-id $SUBNET_ID

# Create security group
SG_ID=$(aws ec2 create-security-group \
  --group-name echohub-sg \
  --description "EchoHub security group" \
  --vpc-id $VPC_ID \
  --query 'GroupId' --output text)

# Add inbound rules
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 8008 --cidr 0.0.0.0/0
```

### 2. Create RDS PostgreSQL Database

```bash
# Create DB subnet group
SUBNET_ID_2=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=echohub-subnet-2}]' \
  --query 'Subnet.SubnetId' --output text)

aws rds create-db-subnet-group \
  --db-subnet-group-name echohub-subnet-group \
  --db-subnet-group-description "EchoHub DB subnet group" \
  --subnet-ids $SUBNET_ID $SUBNET_ID_2

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier echohub-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username echohub \
  --master-user-password "YOUR_SECURE_PASSWORD" \
  --allocated-storage 20 \
  --vpc-security-group-ids $SG_ID \
  --db-subnet-group-name echohub-subnet-group \
  --backup-retention-period 7 \
  --no-publicly-accessible

# Wait for DB to be available (10-15 minutes)
aws rds wait db-instance-available --db-instance-identifier echohub-db

# Get DB endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier echohub-db \
  --query 'DBInstances[0].Endpoint.Address' --output text)

echo "Database endpoint: $DB_ENDPOINT"
```

### 3. Launch EC2 Instance

```bash
# Create key pair
aws ec2 create-key-pair \
  --key-name echohub-key \
  --query 'KeyMaterial' --output text > ~/.ssh/echohub-key.pem

chmod 400 ~/.ssh/echohub-key.pem

# Launch instance (Ubuntu 22.04)
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id ami-0c7217cdde317cfec \
  --instance-type t3.medium \
  --key-name echohub-key \
  --security-group-ids $SG_ID \
  --subnet-id $SUBNET_ID \
  --associate-public-ip-address \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=echohub-prod}]' \
  --query 'Instances[0].InstanceId' --output text)

# Wait for instance
aws ec2 wait instance-running --instance-ids $INSTANCE_ID

# Get public IP
INSTANCE_IP=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)

echo "Instance IP: $INSTANCE_IP"
echo "SSH: ssh -i ~/.ssh/echohub-key.pem ubuntu@$INSTANCE_IP"
```

### 4. Deploy Application

SSH into the instance and follow similar steps as Lightsail, but update `.env` with:

```bash
DB_CONNECTION=pgsql
DB_HOST=$DB_ENDPOINT
DB_PORT=5432
DB_DATABASE=echohub
DB_USERNAME=echohub
DB_PASSWORD=YOUR_SECURE_PASSWORD
```

---

## Option C: AWS ECS Fargate (Container-based)

**Best for**: Auto-scaling, microservices, DevOps teams
**Cost**: $40-300/month
**Setup time**: 2-3 hours

### 1. Create ECR Repository

```bash
# Create repository
aws ecr create-repository --repository-name echohub

# Get repository URI
REPO_URI=$(aws ecr describe-repositories \
  --repository-names echohub \
  --query 'repositories[0].repositoryUri' --output text)

echo "Repository: $REPO_URI"
```

### 2. Build and Push Docker Image

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $REPO_URI

# Build image
docker build -t echohub .

# Tag image
docker tag echohub:latest $REPO_URI:latest

# Push image
docker push $REPO_URI:latest
```

### 3. Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster --cluster-name echohub-cluster

# Create task execution role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ecs-tasks.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### 4. Create Task Definition

Create `ecs-task-definition.json`:

```json
{
  "family": "echohub-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [{
    "name": "echohub",
    "image": "YOUR_REPO_URI:latest",
    "portMappings": [{
      "containerPort": 8000,
      "protocol": "tcp"
    }],
    "environment": [
      {"name": "APP_ENV", "value": "production"},
      {"name": "APP_DEBUG", "value": "false"}
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/echohub",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }]
}
```

```bash
# Register task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json
```

### 5. Create Service with Load Balancer

```bash
# Create Application Load Balancer
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name echohub-alb \
  --subnets $SUBNET_ID $SUBNET_ID_2 \
  --security-groups $SG_ID \
  --query 'LoadBalancers[0].LoadBalancerArn' --output text)

# Create target group
TG_ARN=$(aws elbv2 create-target-group \
  --name echohub-tg \
  --protocol HTTP \
  --port 8000 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --query 'TargetGroups[0].TargetGroupArn' --output text)

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN

# Create ECS service
aws ecs create-service \
  --cluster echohub-cluster \
  --service-name echohub-service \
  --task-definition echohub-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_ID,$SUBNET_ID_2],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=$TG_ARN,containerName=echohub,containerPort=8000
```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Check application
curl http://$INSTANCE_IP

# Check Matrix homeserver
curl http://$INSTANCE_IP:8008/_matrix/client/versions

# Check Ollama
curl http://$INSTANCE_IP:11434/api/tags
```

### 2. Monitor Resources

```bash
# Lightsail monitoring
aws lightsail get-instance-metric-data \
  --instance-name echohub-prod \
  --metric-name CPUUtilization \
  --period 300 \
  --start-time $(date -u -d '1 hour ago' +%s) \
  --end-time $(date -u +%s) \
  --statistics Average

# EC2 monitoring
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=$INSTANCE_ID \
  --start-time $(date -u -d '1 hour ago' +%FT%TZ) \
  --end-time $(date -u +%FT%TZ) \
  --period 300 \
  --statistics Average
```

### 3. Set Up Backups

```bash
# Lightsail snapshot
aws lightsail create-instance-snapshot \
  --instance-name echohub-prod \
  --instance-snapshot-name echohub-snapshot-$(date +%Y%m%d)

# RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier echohub-db \
  --db-snapshot-identifier echohub-db-snapshot-$(date +%Y%m%d)
```

### 4. Set Up Automated Backups

Create `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)

# Backup database
docker compose exec -T app php artisan backup:run

# Upload to S3
aws s3 cp /path/to/backup s3://echohub-backups/backup-$DATE.tar.gz
```

Schedule with cron:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

---

## Costs Breakdown

### Lightsail ($10-40/month)
- Instance: $10-40/month (1-4 GB RAM)
- Static IP: Free (if attached)
- Data transfer: 1-3 TB included

### EC2 + RDS ($50-200/month)
- EC2 t3.medium: $30/month
- RDS db.t3.micro: $15/month
- EBS storage: $5-10/month
- Data transfer: $10-50/month
- Load Balancer (optional): $20/month

### ECS Fargate ($40-300/month)
- Fargate tasks: $30-150/month
- ALB: $20/month
- RDS: $15-50/month
- Data transfer: $10-50/month

---

## Troubleshooting

### SSH Connection Issues
```bash
# Check security group
aws ec2 describe-security-groups --group-ids $SG_ID

# Verify key permissions
chmod 400 ~/.ssh/echohub-key.pem
```

### Application Not Starting
```bash
# Check logs
docker compose logs -f app

# Check disk space
df -h

# Check memory
free -h
```

### Database Connection Issues
```bash
# Test database connection
docker compose exec app php artisan tinker --execute="DB::connection()->getPdo();"

# Check RDS security group
aws rds describe-db-instances --db-instance-identifier echohub-db
```

---

## Next Steps

1. ✅ AWS CLI installed and configured
2. ⏭️ Choose deployment option (Lightsail recommended for getting started)
3. ⏭️ Set up domain and SSL certificate
4. ⏭️ Configure monitoring and alerts
5. ⏭️ Set up CI/CD pipeline (GitHub Actions)

**Recommended**: Start with **AWS Lightsail** for simplicity and cost-effectiveness, then migrate to EC2/RDS or ECS Fargate as your needs grow.
