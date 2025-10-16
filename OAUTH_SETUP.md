# OAuth Setup Guide

## Current Status

✅ **Google OAuth** - Fully configured and working
❌ **Facebook OAuth** - Needs App Secret configuration

## What's Working

1. **Google OAuth Flow**
   - Client ID configured
   - Client Secret configured
   - Redirect URI: `http://localhost:5000/auth/google/callback`
   - Backend callback handler implemented
   - Frontend callback page implemented

2. **OAuth Architecture**
   - Server-side callback handlers in `server/routes.ts`
   - Frontend callback pages for user feedback
   - Token exchange and user creation
   - Role selection for new users at `/select-role`

## What Needs Fixing

### Facebook OAuth Configuration

**Problem**: Facebook App Secret is not configured

**Solution**:

1. Go to [Facebook Developers Console](https://developers.facebook.com/apps/)
2. Select your app (ID: 879130531438151)
3. Go to Settings > Basic
4. Copy the "App Secret"
5. Update `.env` file:
   ```
   FACEBOOK_APP_SECRET=your_actual_app_secret_here
   ```

6. Add OAuth Redirect URI in Facebook App Settings:
   ```
   http://localhost:5000/auth/facebook/callback
   https://yourdomain.com/auth/facebook/callback (for production)
   ```

7. Restart the server:
   ```bash
   npm run dev
   ```

## Testing OAuth

### Google OAuth Test
1. Go to `/login`
2. Click "Google" button
3. Should redirect to Google login
4. After login, redirects to `/auth/google/callback`
5. Then redirects to dashboard or `/select-role` for new users

### Facebook OAuth Test
1. Configure App Secret first (see above)
2. Go to `/login`
3. Click "Facebook" button
4. Should redirect to Facebook login
5. After login, redirects to `/auth/facebook/callback`
6. Then redirects to dashboard or `/select-role` for new users

## OAuth Flow Diagram

```
User clicks OAuth button
    ↓
Redirect to OAuth provider (Google/Facebook)
    ↓
User authenticates with provider
    ↓
Provider redirects to /auth/{provider}/callback with code
    ↓
Server exchanges code for access token
    ↓
Server fetches user info from provider
    ↓
Server creates/finds user in database
    ↓
Server generates JWT token
    ↓
Server redirects to frontend with token
    ↓
Frontend stores token and fetches user data
    ↓
Redirect to dashboard or role selection
```

## Files Modified

1. `client/src/pages/SelectRole.tsx` - New role selection page
2. `client/src/pages/FacebookCallback.tsx` - Fixed callback handler
3. `server/routes.ts` - OAuth callback routes already implemented
4. `.env` - Updated Facebook App Secret placeholder

## Environment Variables

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here

# Frontend (Vite)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
```

## Troubleshooting

### Google OAuth not working
- Check redirect URI matches in Google Console
- Verify Client ID and Secret are correct
- Check browser console for errors

### Facebook OAuth not working
- **Most likely**: App Secret not configured
- Check redirect URI in Facebook App Settings
- Verify App ID is correct
- Check Facebook App is in "Live" mode (not Development)

### Token not being stored
- Check browser localStorage
- Verify `/api/auth/me` endpoint returns user data
- Check Network tab for failed requests

## Next Steps

1. Get Facebook App Secret from Facebook Developer Console
2. Update `.env` with the secret
3. Restart server
4. Test Facebook OAuth login
5. Verify role selection works for new users
