# 🚀 Render.com Environment Variables Setup Guide

## 🔧 Required Environment Variables for ShareWheelz.uk

To ensure the chat support system works properly on production, set these environment variables in your Render.com dashboard:

### **CRITICAL Variables** 🚨

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Enables production mode and proper CORS |
| `FRONTEND_URL` | `https://sharewheelz.uk` | Required for WebSocket CORS configuration |

### **Optional Variables** ⚠️

| Variable | Value | Purpose |
|----------|-------|---------|
| `OPENAI_API_KEY` | `sk-...` | Enables AI-powered chat responses |
| `DATABASE_URL` | `postgresql://...` | Database connection (if not already set) |
| `JWT_SECRET` | `your-secret-key` | JWT authentication (if not already set) |

---

## 📋 How to Set Environment Variables on Render

### **Step 1: Access Render Dashboard**
1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Find your ShareWheelz service
3. Click on the service name

### **Step 2: Navigate to Environment**
1. Click on the **"Environment"** tab
2. Scroll down to **"Environment Variables"** section

### **Step 3: Add Variables**
Click **"Add Environment Variable"** for each variable:

#### **Add NODE_ENV**
- **Key**: `NODE_ENV`
- **Value**: `production`
- **Description**: Production environment flag

#### **Add FRONTEND_URL**
- **Key**: `FRONTEND_URL`
- **Value**: `https://sharewheelz.uk`
- **Description**: Frontend URL for CORS configuration

#### **Add OPENAI_API_KEY (Optional)**
- **Key**: `OPENAI_API_KEY`
- **Value**: `sk-your-openai-key-here`
- **Description**: OpenAI API key for AI chat responses

### **Step 4: Save and Deploy**
1. Click **"Save Changes"**
2. Render will automatically redeploy your service
3. Wait for deployment to complete (usually 2-5 minutes)

---

## 🔍 Verification Steps

### **Check Environment Variables**
After deployment, verify the variables are set:

1. Go to your service's **"Logs"** tab
2. Look for these log messages:
   ```
   Environment: production
   OpenAI API Key found: Yes (length: XX)
   ✅ OpenAI service initialized successfully
   ```

### **Test Chat Support**
1. Visit https://sharewheelz.uk
2. Look for blue chat button in bottom-right corner
3. Click to open chat
4. Send a test message: "What cars do you have in Manchester?"
5. Should receive a response mentioning Jaguar F-Type

---

## 🚨 Troubleshooting

### **If Chat Still Doesn't Work**

#### **Check Browser Console**
1. Open https://sharewheelz.uk
2. Press F12 to open DevTools
3. Go to **Console** tab
4. Look for errors like:
   - `WebSocket connection failed`
   - `CORS error`
   - `Failed to load resource`

#### **Check Network Tab**
1. In DevTools, go to **Network** tab
2. Try sending a chat message
3. Look for:
   - `/api/chatgpt/chat` requests
   - WebSocket connection attempts
   - Any failed requests (red entries)

#### **Common Issues**

| Issue | Symptom | Solution |
|-------|---------|----------|
| CORS Error | WebSocket blocked | Verify `NODE_ENV=production` is set |
| Generic Responses | No AI responses | Add `OPENAI_API_KEY` |
| Chat Button Missing | No chat widget | Check deployment logs for build errors |
| Connection Failed | Can't connect | Verify `FRONTEND_URL` is set correctly |

---

## 📊 Expected Behavior After Fix

### **With OpenAI API Key** ✅
- Dynamic, contextual responses
- References actual car data
- Natural language processing
- Handles complex queries

### **Without OpenAI API Key** ⚠️
- Pre-programmed but accurate responses
- Still mentions specific cars and prices
- Covers all 24 test scenarios
- Fully functional chat experience

---

## 🎯 Success Indicators

Your chat support is working correctly when:

- [ ] Blue chat button appears on all pages
- [ ] Chat window opens smoothly
- [ ] Messages send without errors
- [ ] Responses mention specific cars (Ferrari, Jaguar, etc.)
- [ ] Responses include prices (£75, £95, £110, etc.)
- [ ] Responses mention locations (Manchester, London, etc.)
- [ ] No CORS errors in browser console
- [ ] WebSocket connections succeed

---

## 📞 Support

If you continue to have issues:

1. **Check Render Logs**: Look for error messages during deployment
2. **Verify Environment Variables**: Ensure all variables are set correctly
3. **Test Locally**: Run `npm run dev` to test chat functionality locally
4. **Contact Support**: Use the Render support system if deployment issues persist

---

## ✅ Quick Checklist

- [ ] `NODE_ENV=production` is set
- [ ] `FRONTEND_URL=https://sharewheelz.uk` is set
- [ ] `OPENAI_API_KEY` is set (optional but recommended)
- [ ] Service has been redeployed
- [ ] Chat button appears on website
- [ ] Chat responses work correctly
- [ ] No errors in browser console

**Your chat support should now be fully functional! 🎉**
