# OAuth Role Selection Flow

## Problem
When users sign up with Google/Facebook/OAuth, we don't know if they want to be a **Renter** or **Car Owner**. We need to ask them to choose their role after OAuth authentication.

## Solution
Implement a role selection page that appears after OAuth login for new users only.

---

## Flow Diagram

### New User OAuth Flow
```
1. User clicks "Sign in with Google"
2. Google authentication → Success
3. Backend creates user with default role: 'renter'
4. Backend returns: { user, token, isNewUser: true }
5. Frontend detects isNewUser = true
6. → Redirect to /select-role
7. User selects: "Rent a Car" OR "Become a Car Owner"
8. API call: PUT /api/auth/update-role { userType: 'renter' | 'owner' }
9. → Redirect to appropriate dashboard
```

### Existing User OAuth Flow
```
1. User clicks "Sign in with Google"
2. Google authentication → Success
3. Backend finds existing user
4. Backend returns: { user, token, isNewUser: false }
5. Frontend detects isNewUser = false
6. → Redirect directly to their dashboard (based on stored userType)
```

---

## Implementation Details

### 1. Backend Changes

#### A. OAuth Routes (`server/routes/oauth.ts`)
Track whether user is new:

```typescript
let isNewUser = false;

if (!user) {
  isNewUser = true;
  // Create new user with default role
  user = await storage.createUser({
    email: googleUser.email,
    userType: 'renter', // Default
    // ... other fields
  });
}

// Return isNewUser flag
res.json({
  user,
  token,
  isNewUser, // ← New field
  message: 'Successfully authenticated'
});
```

#### B. New Endpoint: Update Role (`server/routes.ts`)
```typescript
PUT /api/auth/update-role

Body: { userType: 'renter' | 'owner' }

Response: { user, message: 'Role updated successfully' }
```

### 2. Frontend Changes

#### A. New Page: SelectRole (`client/src/pages/SelectRole.tsx`)
- Shows two cards: "Rent a Car" and "Become a Car Owner"
- Calls `/api/auth/update-role` when user selects
- Redirects to appropriate dashboard

#### B. SocialLoginButtons Component
```typescript
const data = await response.json();
setAuthToken(data.token);

// Check if new user
if (data.isNewUser) {
  window.location.href = '/select-role';
  return;
}

// Existing user - normal flow
onSuccess(data.user);
```

#### C. AuthContext
Prevent auto-redirect when on `/select-role` page:

```typescript
if (window.location.pathname === '/select-role') {
  return; // Don't redirect
}
```

#### D. App Routes
```typescript
<Route path="/select-role" component={SelectRole} />
```

---

## API Endpoints

### 1. OAuth Login
```http
POST /api/auth/oauth/google
Content-Type: application/json

{
  "token": "google_id_token"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "renter",
    "isVerified": true
  },
  "token": "jwt_token",
  "isNewUser": true,  ← Indicates if role selection needed
  "message": "Successfully authenticated with Google"
}
```

### 2. Update Role
```http
PUT /api/auth/update-role
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "userType": "owner"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "userType": "owner",  ← Updated
    ...
  },
  "message": "Role updated successfully"
}
```

---

## User Experience

### Scenario 1: New User Signs Up with Google

1. **Login Page**: User clicks "Continue with Google"
2. **Google Auth**: User authenticates with Google
3. **Role Selection Page**: 
   ```
   Welcome to ShareWheelz! 🎉
   One more step - tell us what you'd like to do
   
   [Rent a Car]  [Become a Car Owner]
   ```
4. **User Selects**: Clicks "Rent a Car"
5. **Dashboard**: Redirected to `/renter-dashboard`

### Scenario 2: Existing User Logs In with Google

1. **Login Page**: User clicks "Continue with Google"
2. **Google Auth**: User authenticates with Google
3. **Dashboard**: Directly redirected to their dashboard (no role selection)

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  userType TEXT NOT NULL DEFAULT 'renter', -- 'owner', 'renter', 'both'
  googleId TEXT,
  facebookId TEXT,
  microsoftId TEXT,
  appleId TEXT,
  isVerified BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

---

## Security Considerations

1. **Token Validation**: JWT token required for role update
2. **User Ownership**: Can only update own role
3. **Valid Roles**: Only 'renter', 'owner', 'both' allowed
4. **One-Time Selection**: Role can be changed later in settings

---

## Testing

### Test New User Flow

1. **Clear browser data** (to simulate new user)
2. Go to `/login`
3. Click "Continue with Google"
4. Authenticate with Google
5. ✅ Should redirect to `/select-role`
6. Select "Rent a Car"
7. ✅ Should redirect to `/renter-dashboard`
8. Check database: `userType` should be 'renter'

### Test Existing User Flow

1. Use same Google account as above
2. Logout and login again with Google
3. ✅ Should redirect directly to `/renter-dashboard`
4. ✅ Should NOT see role selection page

### Test Role Update

1. On `/select-role`, select "Become a Car Owner"
2. ✅ Should call `PUT /api/auth/update-role`
3. ✅ Should redirect to `/owner-dashboard`
4. Check database: `userType` should be 'owner'

---

## Supported OAuth Providers

### ✅ Google
- Full implementation
- Role selection for new users
- Direct redirect for existing users

### ✅ Facebook
- Full implementation
- Role selection for new users
- Direct redirect for existing users

### 🚧 Microsoft
- Basic implementation
- Role selection supported

### 🚧 Apple
- Basic implementation
- Role selection supported

---

## Edge Cases

### Case 1: User Closes Role Selection Page
**Solution**: Role selection page is accessible at `/select-role`. User can return anytime. Default role is 'renter'.

### Case 2: User Wants to Change Role Later
**Solution**: Add role change option in Settings page.

### Case 3: Network Error During Role Update
**Solution**: Show error message, allow retry. User stays on role selection page.

### Case 4: User Has Multiple OAuth Accounts
**Solution**: Each OAuth provider links to same email. First login creates account, subsequent logins use existing account.

---

## Benefits

1. ✅ **Clear Intent**: Users explicitly choose their purpose
2. ✅ **Better UX**: No confusion about which dashboard to use
3. ✅ **Seamless OAuth**: Works with all OAuth providers
4. ✅ **Existing Users**: No disruption for returning users
5. ✅ **Flexible**: Can add more roles in future

---

## Future Enhancements

1. **Skip for Renters**: Auto-assign 'renter' and skip selection (most users are renters)
2. **Smart Defaults**: Suggest role based on user behavior
3. **Both Role**: Allow users to select "Both" during OAuth signup
4. **Progressive Profiling**: Ask for more info after role selection

---

## Summary

The OAuth role selection flow ensures that:
- ✅ New OAuth users choose their role (Renter or Owner)
- ✅ Existing OAuth users skip role selection
- ✅ All users end up in the correct dashboard
- ✅ Role is stored in database and persists
- ✅ Works with Google, Facebook, and other OAuth providers

**Result**: Seamless OAuth experience with proper role-based routing! 🎉
