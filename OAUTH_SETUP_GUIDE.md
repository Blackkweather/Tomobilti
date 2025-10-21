# 🔐 OAuth Integration Setup Guide

## ✅ **COMPLETED UPDATES**

### **Removed GitHub OAuth:**
- ❌ GitHub OAuth completely removed from car owners
- ❌ GitHub callback page deleted
- ❌ GitHub routes removed from App.tsx
- ❌ GitHub environment variables removed

### **Updated OAuth Providers:**
- ✅ **Google OAuth** - Ready for testing
- ✅ **Facebook OAuth** - Ready for testing  
- ✅ **Microsoft OAuth** - Needs app registration
- ✅ **Apple OAuth** - Needs developer account

---

## 🚀 **QUICK SETUP (Google OAuth)**

### **Step 1: Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type: "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback`
   - `https://sharewheelz.uk/auth/google/callback`

### **Step 2: Environment Variables**
Add to your `.env` file:
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Frontend (Vite)
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### **Step 3: Test Google OAuth**
1. Start your server: `npm run dev`
2. Go to login page
3. Click "Continue with Google"
4. Complete OAuth flow

---

## 📱 **FACEBOOK OAUTH SETUP**

### **Step 1: Facebook Developers**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app → "Consumer" → "Next"
3. Add Facebook Login product
4. Set Valid OAuth Redirect URIs:
   - `http://localhost:5000/auth/facebook/callback`
   - `https://sharewheelz.uk/auth/facebook/callback`

### **Step 2: Environment Variables**
```env
# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id-here
FACEBOOK_APP_SECRET=your-facebook-app-secret-here

# Frontend
VITE_FACEBOOK_APP_ID=your-facebook-app-id-here
```

---

## 🏢 **MICROSOFT OAUTH SETUP**

### **Step 1: Azure Portal**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Azure Active Directory → App registrations → New registration
3. Set redirect URI: `https://sharewheelz.uk/auth/microsoft/callback`
4. Note Application (client) ID and create client secret

### **Step 2: Environment Variables**
```env
# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-microsoft-client-id-here
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret-here

# Frontend
VITE_MICROSOFT_CLIENT_ID=your-microsoft-client-id-here
```

---

## 🍎 **APPLE OAUTH SETUP**

### **Step 1: Apple Developer**
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Certificates, Identifiers & Profiles → Identifiers
3. Create new identifier → Services ID
4. Enable "Sign In with Apple"
5. Configure domains and redirect URLs

### **Step 2: Environment Variables**
```env
# Apple OAuth
APPLE_CLIENT_ID=your-apple-client-id-here
APPLE_CLIENT_SECRET=your-apple-client-secret-here

# Frontend
VITE_APPLE_CLIENT_ID=your-apple-client-id-here
```

---

## 🧪 **TESTING OAUTH**

### **Test Google OAuth:**
```bash
# Test with curl
curl -X POST http://localhost:5000/api/auth/oauth/google \
  -H "Content-Type: application/json" \
  -d '{"accessToken":"test-token"}'
```

### **Test Frontend Integration:**
1. Open browser console
2. Go to login page
3. Click OAuth buttons
4. Check for errors in console

---

## 🔧 **CURRENT STATUS**

### **Ready for Testing:**
- ✅ **Google OAuth** - Has default client ID
- ✅ **Facebook OAuth** - Has default app ID

### **Needs Configuration:**
- ⚠️ **Microsoft OAuth** - Needs Azure app registration
- ⚠️ **Apple OAuth** - Needs Apple Developer account

### **Default Credentials (for testing):**
```env
# Google (default - may work for testing)
VITE_GOOGLE_CLIENT_ID=865011521891-jnj5e09u8qc2hed7h6gnbgj4flscucf2.apps.googleusercontent.com

# Facebook (default - may work for testing)  
VITE_FACEBOOK_APP_ID=879130531438151
```

---

## 🎯 **RECOMMENDED NEXT STEPS**

1. **Start with Google OAuth** - Easiest to test
2. **Add your own Google Client ID** for production
3. **Test Facebook OAuth** with your own app
4. **Configure Microsoft OAuth** for UK users
5. **Add Apple OAuth** for iOS users

---

## 🚨 **IMPORTANT NOTES**

- **GitHub OAuth removed** - No longer available for car owners
- **All OAuth providers** create users as 'renter' by default
- **New OAuth users** are redirected to role selection
- **Existing users** can link OAuth accounts
- **All OAuth tokens** are properly validated server-side

---

## 📞 **SUPPORT**

If you need help with OAuth setup:
- **Google**: Check Google Cloud Console documentation
- **Facebook**: Check Facebook Developers documentation  
- **Microsoft**: Check Azure AD documentation
- **Apple**: Check Apple Developer documentation

**Your ShareWheelz platform now has clean, professional OAuth integration!** 🎉
