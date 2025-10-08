# 🌐 ShareWheelz.uk DNS Configuration Guide

## Domain: sharewheelz.uk (Purchased from name.com)

### Step 1: Deploy to Render.com First
Before configuring DNS, deploy your platform:

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Deploy on Render.com:**
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will auto-detect render.yaml
   - Your site will be live at: `https://sharewheelz-platform.onrender.com`

### Step 2: Configure DNS at name.com

1. **Login to name.com:**
   - Go to https://www.name.com
   - Login to your account
   - Go to "My Domains" → "sharewheelz.uk"

2. **Add DNS Records:**
   
   **A Record (Required):**
   ```
   Type: A
   Host: @
   Answer: 76.76.19.61
   TTL: 300
   ```
   
   **CNAME Record (Required):**
   ```
   Type: CNAME
   Host: www
   Answer: sharewheelz-platform.onrender.com
   TTL: 300
   ```
   
   **CNAME Record for Render:**
   ```
   Type: CNAME
   Host: sharewheelz-platform
   Answer: sharewheelz-platform.onrender.com
   TTL: 300
   ```

### Step 3: Configure Custom Domain in Render

1. **In Render Dashboard:**
   - Go to your web service
   - Click "Settings" → "Custom Domains"
   - Click "Add Custom Domain"
   - Enter: `sharewheelz.uk`
   - Click "Add"

2. **Render will show DNS instructions:**
   - Copy the CNAME record from Render
   - Add it to name.com DNS settings

### Step 4: SSL Certificate
- Render automatically provides SSL certificates
- Wait 5-10 minutes for SSL to activate
- Your site will be available at: `https://sharewheelz.uk`

### Step 5: Test Everything

Run the testing script:
```bash
node scripts/test-sharewheelz.cjs
```

### Expected Timeline:
- DNS propagation: 5-30 minutes
- SSL certificate: 5-10 minutes
- Total time: 10-40 minutes

### Troubleshooting:
- If DNS doesn't work, check name.com DNS settings
- If SSL fails, wait longer or contact Render support
- Test with: `https://sharewheelz.uk` and `https://www.sharewheelz.uk`

## 🎉 Result:
Your ShareWheelz UK platform will be live at:
- **Primary:** https://sharewheelz.uk
- **WWW:** https://www.sharewheelz.uk
- **Render:** https://sharewheelz-platform.onrender.com
