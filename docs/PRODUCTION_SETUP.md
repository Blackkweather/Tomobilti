# 🚀 Production Deployment Guide

## Overview
This guide covers deploying the Tomobilti platform to production with proper security, monitoring, and scalability configurations.

## Prerequisites

### 1. Server Requirements
- **Node.js**: 20.18.0+ (recommended: 22.15.0)
- **Memory**: Minimum 2GB RAM (recommended: 4GB+)
- **Storage**: Minimum 20GB SSD
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### 2. External Services
- **Database**: PostgreSQL 14+ (recommended cloud providers: Supabase, Neon, Render DB)
- **Email Service**: SMTP provider (SendGrid, Mailgun, AWS SES)
- **Payment Gateway**: Stripe (with webhook endpoints)
- **Monitoring**: Sentry or similar error tracking
- **CDN**: CloudFlare or AWS CloudFront (optional)

## Deployment Steps

### 1. Environment Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd tomobilti

# Install dependencies
npm ci

# Setup environment variables
npm run setup-env
```

### 2. Environment Variables

Copy the production template and configure:

```bash
cp docs/PRODUCTION_ENV_TEMPLATE.md .env.production
```

**Critical Production Variables:**
```bash
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@host:port/db

# Security (⚠️ Generate new secrets!)
JWT_SECRET=<64-character-random-string>
SESSION_SECRET=<32-character-random-string>
CSRF_SECRET=<32-character-random-string>

# Email Service (Required)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Stripe Payments (Required)
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. Database Setup

```bash
# For PostgreSQL (Production)
npm run db:push

# Run any migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### 4. Build and Test

```bash
# Run security audit
npm run security:audit

# Run tests
npm run test:run

# Build application
npm run build
```

### 5. Deployment Options

#### Option A: Render.com (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Configure environment variables
5. Enable auto-deploy on main branch

#### Option B: Railway
1. Import from GitHub
2. Deploy automatically
3. Configure environment variables
4. Enable auto-deploy

#### Option C: Traditional VPS
1. Setup PM2 process manager
2. Configure nginx reverse proxy
3. Setup SSL certificates
4. Configure firewall

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js --env production

# Setup auto-restart
pm2 startup
pm2 save
```

### 6. Security Configuration

#### SSL/HTTPS
- Use Let's Encrypt for free SSL certificates
- Force HTTPS redirects
- Configure HSTS headers

#### Firewall
```bash
# UFW setup (Ubuntu)
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

#### Rate Limiting
Configure nginx rate limiting:
```nginx
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        location /api/ {
            limit_req zone=api burst=20 nodelay;
        }
    }
}
```

### 7. Monitoring Setup

#### Sentry Integration
```bash
# Add to environment variables
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

#### Log Management
```bash
# Configure log rotation
npm install -g pm2-logrotate
```

#### Health Checks
```bash
# Add to CI/CD pipeline
curl -f https://yourdomain.com/api/health || exit 1
```

### 8. Backup Strategy

#### Database Backups
```bash
# Create backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### File Storage Backups
If using local storage, implement S3 sync:
```bash
aws s3 sync ./public/uploads s3://your-bucket/uploads
```

## Performance Optimization

### 1. Database Optimization
- Configure connection pooling
- Add database indexes
- Enable query caching

### 2. Caching Layer
```bash
# Redis configuration
REDIS_URL=redis://localhost:6379
```

### 3. Image Optimization
- Enable WebP conversion
- Implement lazy loading
- Use CDN for static assets

### 4. Frontend Optimization
- Enable gzip compression
- Minify assets
- Implement browser caching

## Security Checklist

- [ ] Environment variables secured
- [ ] Database credentials encrypted
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] CSP headers set
- [ ] Input validation enabled
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection enabled
- [ ] Authentication secure
- [ ] File upload restrictions
- [ ] Error logging configured
- [ ] Monitoring alerts set

## Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check connection string format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:port/db
```

#### Memory Issues
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096"
```

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Health Check Endpoints
- `/api/health` - Basic health check
- `/api/health/detailed` - Detailed system status
- `/api/health/database` - Database connectivity

## Maintenance

### Regular Tasks
1. **Weekly**: Review error logs and performance metrics
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Review and rotate secrets
4. **Annually**: Security audit and penetration testing

### Updates
```bash
# Update dependencies
npm audit fix
npm update

# Deploy updates
git pull origin main
npm ci
npm run build
pm2 restart all
```

## Support

For production support:
- 📧 Email: admin@tomobilti.com
- 📚 Documentation: https://docs.tomobilti.com
- 🐛 Issues: GitHub Issues
- 💬 Community: Discord Community

---

**⚠️ Security Reminder**: Never commit production secrets to version control. Always use environment variables or secure secret management systems.
