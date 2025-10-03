# 🚀 Tomobilti Platform - Production Deployment Guide

## 📋 Overview

This guide provides comprehensive instructions for deploying the Tomobilti car rental platform to production with all the implemented improvements.

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **TanStack Query** for state management
- **Wouter** for routing
- **React i18next** for internationalization

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** for production database
- **JWT** authentication
- **Stripe** for payments
- **Nodemailer** for email services
- **Socket.IO** for real-time notifications
- **Sharp** for image optimization

## 🔧 Prerequisites

### System Requirements
- Node.js 18+ 
- PostgreSQL 13+
- Redis (optional, for caching)
- Nginx (for reverse proxy)
- SSL certificate

### External Services
- Stripe account for payments
- SMTP service for emails
- CDN service (CloudFront/CloudFlare)
- Monitoring service (Sentry)

## 📦 Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-org/tomobilti.git
cd tomobilti
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp env.example .env
```

Edit `.env` with your production values:
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tomobilti

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Email
SMTP_HOST=smtp.your-provider.com
SMTP_USER=your-email@domain.com
SMTP_PASS=your-app-password
```

## 🗄️ Database Setup

### 1. Create Database
```sql
CREATE DATABASE tomobilti;
CREATE USER tomobilti_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE tomobilti TO tomobilti_user;
```

### 2. Run Migrations
```bash
# Run production database setup
psql -h localhost -U tomobilti_user -d tomobilti -f server/migrations/production-setup.sql
```

### 3. Verify Tables
```sql
\dt
```

## 🔐 Security Configuration

### 1. SSL Certificate
```bash
# Using Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

### 2. Firewall Setup
```bash
# UFW configuration
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 3. Environment Security
- Use strong, unique passwords
- Enable 2FA on all service accounts
- Regularly rotate API keys
- Monitor access logs

## 🚀 Deployment Options

### Option 1: Traditional VPS Deployment

#### 1. Build Application
```bash
npm run build
```

#### 2. Setup PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

#### 2. Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/tomobilti
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=tomobilti
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### 3. Deploy with Docker
```bash
docker-compose up -d
```

### Option 3: Cloud Platform Deployment

#### AWS Deployment
1. **EC2 Instance**: Launch Ubuntu 20.04 LTS
2. **RDS**: PostgreSQL database
3. **S3**: File storage
4. **CloudFront**: CDN
5. **Route 53**: DNS

#### DigitalOcean Deployment
1. **Droplet**: Ubuntu 20.04 LTS
2. **Managed Database**: PostgreSQL
3. **Spaces**: Object storage
4. **Load Balancer**: Traffic distribution

## 🔧 Production Optimizations

### 1. Performance
```bash
# Enable gzip compression
npm install compression

# Enable caching
npm install redis

# Image optimization
npm install sharp
```

### 2. Monitoring
```bash
# Application monitoring
npm install @sentry/node

# Health checks
curl https://your-domain.com/api/health
```

### 3. Logging
```bash
# Structured logging
npm install winston

# Log rotation
npm install winston-daily-rotate-file
```

## 📊 Monitoring & Maintenance

### 1. Health Checks
- Database connectivity
- External service availability
- Disk space monitoring
- Memory usage tracking

### 2. Backup Strategy
```bash
# Database backup
pg_dump tomobilti > backup_$(date +%Y%m%d).sql

# File backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz public/uploads/
```

### 3. Updates
```bash
# Application updates
git pull origin main
npm install
npm run build
pm2 restart all

# Database migrations
npm run migrate
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection
```bash
# Check connection
psql -h localhost -U tomobilti_user -d tomobilti -c "SELECT 1;"
```

#### 2. SSL Certificate
```bash
# Renew certificate
sudo certbot renew
```

#### 3. Memory Issues
```bash
# Monitor memory
free -h
top -p $(pgrep node)
```

#### 4. Log Analysis
```bash
# Application logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔒 Security Checklist

- [ ] SSL certificate installed and valid
- [ ] Firewall configured
- [ ] Database credentials secured
- [ ] API keys rotated
- [ ] Regular security updates
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured
- [ ] Access logs reviewed

## 📈 Performance Optimization

### 1. Frontend
- Enable gzip compression
- Implement lazy loading
- Optimize images
- Use CDN for static assets

### 2. Backend
- Database indexing
- Query optimization
- Caching strategy
- Rate limiting

### 3. Database
- Connection pooling
- Query optimization
- Index maintenance
- Regular VACUUM

## 🎯 Post-Deployment

### 1. Testing
- [ ] User registration/login
- [ ] Car listing/search
- [ ] Booking flow
- [ ] Payment processing
- [ ] Email notifications
- [ ] Mobile responsiveness

### 2. Performance Testing
```bash
# Load testing
npm install -g artillery
artillery quick --count 100 --num 10 https://your-domain.com/api/cars
```

### 3. Security Testing
- SSL Labs test
- OWASP ZAP scan
- Penetration testing

## 📞 Support

For deployment issues:
- Check logs: `pm2 logs`
- Monitor health: `/api/health`
- Database status: `pg_isready`
- SSL status: `openssl s_client -connect your-domain.com:443`

## 🎉 Success!

Your Tomobilti platform is now production-ready with:
- ✅ Real payment processing
- ✅ Email verification system
- ✅ Production database
- ✅ Push notifications
- ✅ Internationalization
- ✅ Advanced analytics
- ✅ Image optimization
- ✅ Security hardening

The platform is scalable, secure, and ready to handle real users!























