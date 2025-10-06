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
JWT_SECRET=N4FoSaiTH+xuOVjOWdc98MoBU9kA8pie/Tfzf3CjFjZK79Vt0QkWtWsl6sKzxueRRkHmlnn2exfOaKNyXPG3ZQ==
SESSION_SECRET=62266419b4d555b57519f6367e3ac834db4db8c21a2e8ec700ac80d32570e119
CSRF_SECRET=7317c41c12a0a1a6d3ccb5e5499b269a5ceb94c1102e75e01ce4435bd49d57d7

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
