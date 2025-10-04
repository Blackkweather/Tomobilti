# 🚀 Tomobilti Platform - Render Deployment Guide

## Prerequisites
- GitHub account
- Render account (free tier available)
- Your Tomobilti code pushed to GitHub

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Ensure all files are included:**
   - `render.yaml` ✅
   - `package.json` ✅ (updated with production scripts)
   - `server/index.ts` ✅ (updated for production)
   - `scripts/setup-production-db.js` ✅
   - All source code files ✅

## Step 2: Deploy on Render

### Option A: Using Render Dashboard (Recommended)

1. **Go to [render.com](https://render.com) and sign up/login**

2. **Create a New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your Tomobilti repository

3. **Configure the Service:**
   - **Name:** `tomobilti-platform`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

5. **Click "Create Web Service"**

### Option B: Using render.yaml (Blue-Green Deployment)

1. **Push render.yaml to your repository**
2. **In Render Dashboard:**
   - Go to "Blueprints"
   - Click "New Blueprint"
   - Connect your repository
   - Render will automatically detect and use `render.yaml`

## Step 3: Database Setup

1. **Create a PostgreSQL Database:**
   - In Render Dashboard, click "New +" → "PostgreSQL"
   - Name: `tomobilti-db`
   - Plan: Free
   - Click "Create Database"

2. **Update Environment Variables:**
   - Go to your web service
   - Add environment variable:
   ```
   DATABASE_URL=<your-postgres-connection-string>
   ```

## Step 4: Custom Domain (Optional)

1. **In your web service settings:**
   - Go to "Settings" → "Custom Domains"
   - Add your domain (e.g., `tomobilti.com`)
   - Follow DNS configuration instructions

## Step 5: Verify Deployment

1. **Check your service URL:**
   - Your app will be available at: `https://tomobilti-platform.onrender.com`
   - API endpoints: `https://tomobilti-platform.onrender.com/api/cars`

2. **Test the platform:**
   - Visit the homepage
   - Register a new user
   - Browse cars
   - Create a booking

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `DATABASE_URL` | Database connection | `postgresql://...` |

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`

2. **Database Connection Issues:**
   - Verify `DATABASE_URL` is correct
   - Check database is running

3. **Port Issues:**
   - Ensure app listens on `process.env.PORT`
   - Render uses port 10000 by default

### Logs:
- View logs in Render Dashboard → Your Service → Logs
- Check for any error messages during build/start

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] `render.yaml` configured
- [ ] Environment variables set
- [ ] Database created and connected
- [ ] Service deployed successfully
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic on Render)

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Tomobilti Issues: Create GitHub issue

---

**🎉 Your Tomobilti platform is now live on Render!**

