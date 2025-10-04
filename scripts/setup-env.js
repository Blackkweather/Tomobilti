#!/usr/bin/env node

/**
 * Environment Setup Script for Tomobilti Platform
 * Generates secure environment files for development and production
 */

import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate secure random string
function generateSecureSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Generate secure JWT secret
function generateJWTSecret() {
  return crypto.randomBytes(64).toString('base64');
}

// Environment templates
const environments = {
  development: {
    NODE_ENV: 'development',
    PORT: '5000',
    FRONTEND_URL: 'http://localhost:5000',
    DATABASE_URL: 'file:./tomobilti.db',
    JWT_SECRET: generateJWTSecret(),
    JWT_EXPIRES_IN: '7d',
    BCRYPT_ROUNDS: '12',
    SESSION_SECRET: generateSecureSecret(),
    CSRF_SECRET: generateSecureSecret(),
    RATE_LIMIT_WINDOW_MS: '900000',
    RATE_LIMIT_MAX_REQUESTS: '100',
    AUTH_RATE_LIMIT_MAX_REQUESTS: '5',
    MAX_FILE_SIZE: '10485760',
    IMAGE_QUALITY: '85',
    THUMBNAIL_SIZE: '300',
    RESPONSIVE_SIZES: '400,800,1200,1600',
    LOG_LEVEL: 'debug',
    // Email configuration (mock for development)
    SMTP_HOST: 'localhost',
    SMTP_PORT: '587',
    SMTP_SECURE: 'false',
    SMTP_USER: 'dev@tomobilti.com',
    SMTP_PASS: 'dev-password',
    // OpenAI (optional)
    OPENAI_API_KEY: 'sk-dev-placeholder',
    // Mock services enabled
    ENABLE_MOCK_SERVICES: 'true'
  },
  
  production: {
    NODE_ENV: 'production',
    PORT: '${PORT}',
    FRONTEND_URL: '${FRONTEND_URL}',
    DATABASE_URL: '${DATABASE_URL}',
    JWT_SECRET: '${JWT_SECRET}',
    JWT_EXPIRES_IN: '1d',
    BCRYPT_ROUNDS: '12',
    SESSION_SECRET: '${SESSION_SECRET}',
    CSRF_SECRET: '${CSRF_SECRET}',
    RATE_LIMIT_WINDOW_MS: '900000',
    RATE_LIMIT_MAX_REQUESTS: '50',
    AUTH_RATE_LIMIT_MAX_REQUESTS: '3',
    MAX_FILE_SIZE: '10485760',
    IMAGE_QUALITY: '85',
    THUMBNAIL_SIZE: '300',
    RESPONSIVE_SIZES: '400,800,1200,1600',
    LOG_LEVEL: 'info',
    // Email service (required for production)
    SMTP_HOST: '${SMTP_HOST}',
    SMTP_PORT: '${SMTP_PORT}',
    SMTP_SECURE: '${SMTP_SECURE}',
    SMTP_USER: '${SMTP_USER}',
    SMTP_PASS: '${SMTP_PASS}',
    // Stripe payments (required for production)
    STRIPE_SECRET_KEY: '${STRIPE_SECRET_KEY}',
    STRIPE_PUBLISHABLE_KEY: '${STRIPE_PUBLISHABLE_KEY}',
    STRIPE_WEBHOOK_SECRET: '${STRIPE_WEBHOOK_SECRET}',
    // Monitoring (optional)
    SENTRY_DSN: '${SENTRY_DSN}',
    // CDN (optional)
    CDN_URL: '${CDN_URL}',
    // Disable mock services
    ENABLE_MOCK_SERVICES: 'false'
  },

  testing: {
    NODE_ENV: 'test',
    PORT: '5001',
    FRONTEND_URL: 'http://localhost:5001',
    DATABASE_URL: 'file:./test.db',
    JWT_SECRET: 'test-jwt-secret-do-not-use-in-production',
    JWT_EXPIRES_IN: '1h',
    BCRYPT_ROUNDS: '4',
    SESSION_SECRET: 'test-session-secret',
    CSRF_SECRET: 'test-csrf-secret',
    RATE_LIMIT_WINDOW_MS: '60000',
    RATE_LIMIT_MAX_REQUESTS: '1000',
    AUTH_RATE_LIMIT_MAX_REQUESTS: '100',
    MAX_FILE_SIZE: '1048576',
    IMAGE_QUALITY: '50',
    THUMBNAIL_SIZE: '100',
    RESPONSIVE_SIZES: '200,400',
    LOG_LEVEL: 'error',
    // Mock everything for tests
    ENABLE_MOCK_SERVICES: 'true',
    OPENAI_API_KEY: 'sk-test-placeholder'
  }
};

// Write environment file
function writeEnvFile(envName, config) {
  const filename = envName === 'production' ? '.env.production' : `.env.${envName}`;
  const envPath = path.join(__dirname, '..', filename);
  
  const envContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Created ${filename}`);
}

// Write .env (default to development)
function writeDefaultEnv() {
  const defaultEnvPath = path.join(__dirname, '..', '.env');
  const devConfig = environments.development;
  
  const envContent = Object.entries(devConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(defaultEnvPath, envContent);
  console.log('✅ Created .env (development)');
}

// Create production env template
function writeProductionTemplate() {
  const templatePath = path.join(__dirname, '..', 'docs', 'PRODUCTION_ENV_TEMPLATE.md');
  const template = `# Production Environment Variables

## Required Variables

Copy this template to your production environment and fill in the actual values:

\`\`\`bash
# Application
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:password@host:port/database

# Security (Generate new secrets for production!)
JWT_SECRET=${generateJWTSecret()}
SESSION_SECRET=${generateSecureSecret()}
CSRF_SECRET=${generateSecureSecret()}

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
\`\`\`

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
`;

  // Ensure docs directory exists
  const docsDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  fs.writeFileSync(templatePath, template);
  console.log('✅ Created production environment template');
}

// Main execution
console.log('🚀 Setting up environment files...\n');

try {
  writeDefaultEnv();
  writeEnvFile('development', environments.development);
  writeEnvFile('production', environments.production);
  writeEnvFile('testing', environments.testing);
  writeProductionTemplate();
  
  console.log('\n🎉 Environment setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Review the generated .env file');
  console.log('2. Check docs/PRODUCTION_ENV_TEMPLATE.md for production setup');
  console.log('3. Never commit .env files to git (they are in .gitignore)');
  
} catch (error) {
  console.error('❌ Error setting up environment:', error.message);
  process.exit(1);
}
