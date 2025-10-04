# Production Environment Variables

## Required Variables

Copy this template to your production environment and fill in the actual values:

```bash
# Application
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:password@host:port/database

# Security (Generate new secrets for production!)
JWT_SECRET=CPrRdIYh5k9vYN1cb0DqGTeOYSGo+VJ2yhDLRcdZtrqpyuogkV1zVmyG7CufkL1sLbJ2orSfzRfgUUcVLBIncg==
SESSION_SECRET=f720a6b65b4b2540cea68e94c6c7c088e6cac5db4c8bab4a5711dcd9b913e309
CSRF_SECRET=6946e7fab50f668f9db518480b0c9efd1b7a504839be1a4d7a024a1bcc22fa95

# Email Service (Required)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-app-password

# Stripe Payments (Required)
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# OpenAI API (Optional)
OPENAI_API_KEY=sk-your-openai-api-key

# Monitoring (Optional)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# CDN (Optional)
CDN_URL=https://your-cdn-domain.com
```

## Security Checklist

- [ ] Generate new JWT_SECRET for production
- [ ] Generate new SESSION_SECRET for production
- [ ] Generate new CSRF_SECRET for production
- [ ] Use strong passwords for database
- [ ] Enable HTTPS only
- [ ] Set up proper rate limiting
- [ ] Configure email service
- [ ] Set up Stripe webhooks
- [ ] Enable monitoring/logging
