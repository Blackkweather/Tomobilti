# Manual OAuth Testing Guide

## 🎯 Testing Strategy

Since automated OAuth testing requires actual provider access, here's a comprehensive manual testing approach:

## 📋 Pre-Test Checklist

### 1. Environment Setup
```bash
# Check if .env file exists and has OAuth variables
cat .env | grep -E "(GOOGLE|FACEBOOK)"

# Expected output:
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# FACEBOOK_APP_ID=your-facebook-app-id
# FACEBOOK_APP_SECRET=your-facebook-app-secret
# VITE_GOOGLE_CLIENT_ID=your-google-client-id
# VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

### 2. Server Status
```bash
# Start the development server
npm run dev

# Check if server is running
curl http://localhost:5000/health
```

## 🔍 Step-by-Step Testing

### Test 1: Google OAuth Flow

1. **Open Browser**: Go to `http://localhost:5000/login`

2. **Check Google Button**: 
   - Look for "Continue with Google" or similar button
   - Button should be visible and clickable

3. **Click Google Button**:
   - Should redirect to Google OAuth page
   - URL should be: `https://accounts.google.com/o/oauth2/v2/auth?...`

4. **Google Login**:
   - Use your test Google account
   - Complete the OAuth flow
   - Grant permissions if prompted

5. **Callback Handling**:
   - Should redirect back to your app
   - URL should be: `http://localhost:5000/auth/google/callback?...`
   - Should then redirect to dashboard or role selection

6. **Verify Success**:
   - Check if you're logged in
   - Check browser localStorage for JWT token
   - Check if user data is displayed correctly

### Test 2: Facebook OAuth Flow

1. **Click Facebook Button**:
   - Look for "Continue with Facebook" button
   - Should redirect to Facebook OAuth page

2. **Facebook Login**:
   - Use your test Facebook account
   - Complete the OAuth flow

3. **Callback Handling**:
   - Should redirect to: `http://localhost:5000/auth/facebook/callback?...`
   - Should then redirect to dashboard or role selection

4. **Verify Success**:
   - Check if you're logged in
   - Check browser localStorage for JWT token

### Test 3: Error Handling

1. **Cancel OAuth Flow**:
   - Start OAuth process
   - Cancel/deny on provider's page
   - Should redirect back to login with error message

2. **Invalid Configuration**:
   - Temporarily change OAuth credentials in .env
   - Restart server
   - Try OAuth login
   - Should show appropriate error

## 🐛 Common Issues & Solutions

### Issue: "OAuth not configured" Error
**Solution**: Check environment variables are set correctly

### Issue: "Redirect URI mismatch" Error
**Solution**: 
- Google Console: Add `http://localhost:5000/auth/google/callback`
- Facebook App: Add `http://localhost:5000/auth/facebook/callback`

### Issue: "Invalid client" Error
**Solution**: Verify Client ID/App ID matches exactly

### Issue: Stuck on callback page
**Solution**: Check server logs for errors

## 📊 Testing Results Template

```
## OAuth Test Results - [Date]

### Google OAuth
- [ ] Button visible on login page
- [ ] Redirects to Google OAuth page
- [ ] Login successful with test account
- [ ] Callback handled correctly
- [ ] User logged in successfully
- [ ] JWT token stored in localStorage
- [ ] User redirected to correct dashboard

### Facebook OAuth
- [ ] Button visible on login page
- [ ] Redirects to Facebook OAuth page
- [ ] Login successful with test account
- [ ] Callback handled correctly
- [ ] User logged in successfully
- [ ] JWT token stored in localStorage
- [ ] User redirected to correct dashboard

### Error Handling
- [ ] OAuth cancellation handled gracefully
- [ ] Invalid credentials show appropriate error
- [ ] Network errors handled properly

### Issues Found:
- [List any issues encountered]

### Next Steps:
- [List any fixes needed]
```

## 🔧 Debugging Tools

### Browser Developer Tools
1. **Console Tab**: Check for JavaScript errors
2. **Network Tab**: Monitor OAuth requests/responses
3. **Application Tab**: Check localStorage for tokens

### Server Logs
```bash
# Watch server logs during testing
npm run dev

# Look for OAuth-related log messages:
# - "OAuth request received"
# - "Token exchange successful"
# - "Creating new OAuth user"
```

### Database Check
```bash
# Check if OAuth users are created
sqlite3 tomobilti.db "SELECT id, email, googleId, facebookId FROM users WHERE googleId IS NOT NULL OR facebookId IS NOT NULL;"
```

## 🚀 Production Testing

For production testing, update OAuth provider settings:

### Google Console
- Add production redirect URI: `https://yourdomain.com/auth/google/callback`

### Facebook App
- Add production redirect URI: `https://yourdomain.com/auth/facebook/callback`
- Switch app to "Live" mode

## 📝 Test Account Setup

### Google Test Account
1. Create new Gmail account
2. Verify email address
3. Add profile picture
4. Use for OAuth testing

### Facebook Test Account
1. Create new Facebook account
2. Verify email address
3. Add profile picture
4. Use for OAuth testing

**Note**: Keep test accounts separate from personal accounts for security.

