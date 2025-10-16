# Role-Based Registration and Dashboard System

## Overview
ShareWheelz now has a complete role-based registration and dashboard system that automatically redirects users to their appropriate dashboard based on their selected role during registration.

## User Roles

### 1. **Renter** (Default)
- Users who want to rent cars from owners
- Redirected to: `/renter-dashboard`
- Features:
  - Browse available cars
  - Make bookings
  - View booking history
  - Manage payments
  - Leave reviews

### 2. **Owner**
- Users who want to list their cars for rent
- Redirected to: `/owner-dashboard`
- Features:
  - Add and manage vehicles
  - View booking requests
  - Track earnings
  - Manage availability
  - View reviews

### 3. **Both** (Optional)
- Users who want both renter and owner capabilities
- Redirected to: `/dashboard` (Dashboard Selector)
- Can switch between owner and renter dashboards

## Registration Flow

### Step 1: User Registration
1. User visits `/register`
2. Fills in required fields:
   - First Name
   - Last Name
   - Email
   - Password
   - Phone (optional)
   - **Role Selection** (Radio buttons):
     - ✅ "Rent a Car" (Renter)
     - ✅ "Become a Car Owner" (Owner)

### Step 2: Account Creation
1. Form validation:
   - Email format validation
   - Password minimum 8 characters
   - Password confirmation match
   - All required fields filled

2. Backend processing:
   - Check if email already exists
   - Hash password with bcrypt (12 rounds)
   - Create user with selected `userType`
   - Generate JWT token
   - Send verification email

3. Database storage:
   ```sql
   INSERT INTO users (
     email, 
     password, 
     firstName, 
     lastName, 
     phone, 
     userType  -- 'renter' or 'owner'
   ) VALUES (...)
   ```

### Step 3: Automatic Redirection
After successful registration, user is automatically redirected based on their role:

```typescript
if (userType === 'owner') {
  redirect('/owner-dashboard');
} else if (userType === 'renter') {
  redirect('/renter-dashboard');
} else if (userType === 'both') {
  redirect('/dashboard'); // Shows selector
}
```

## Login Flow

### Step 1: User Login
1. User visits `/login`
2. Enters email and password
3. Backend verifies credentials

### Step 2: Role-Based Redirection
After successful login, system checks user's `userType` from database and redirects:

```typescript
const user = await storage.verifyPassword(email, password);
const token = generateToken(user.id);

// Redirect based on stored userType
if (user.userType === 'owner') {
  redirect('/owner-dashboard');
} else if (user.userType === 'renter') {
  redirect('/renter-dashboard');
}
```

## Dashboard Selector (For "Both" Users)

The Dashboard Selector (`/dashboard`) is only shown to users with `userType: 'both'`. It provides:

1. **Auto-redirect logic**:
   ```typescript
   useEffect(() => {
     if (user.userType === 'owner') {
       redirect('/owner-dashboard');
     } else if (user.userType === 'renter') {
       redirect('/renter-dashboard');
     }
     // Only shows selector if userType === 'both'
   }, [user]);
   ```

2. **Manual selection** (for 'both' users):
   - Owner Dashboard card
   - Renter Dashboard card
   - Click to navigate

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  phone TEXT,
  userType TEXT NOT NULL DEFAULT 'renter', -- 'owner', 'renter', 'both'
  profileImage TEXT,
  membershipTier TEXT DEFAULT 'none',
  isEmailVerified BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+44 7XXX XXX XXX",
  "userType": "renter" // or "owner"
}

Response:
{
  "message": "Account created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "renter"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "renter"
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer jwt_token_here

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "renter",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Frontend Components

### 1. Register.tsx
- Radio button selection for role
- Visual distinction between roles
- Form validation
- Auto-redirect after registration

### 2. Login.tsx
- Email/password authentication
- Auto-redirect based on stored role
- Remember me functionality

### 3. DashboardSelector.tsx
- Only shown for users with `userType: 'both'`
- Auto-redirects single-role users
- Manual selection for dual-role users

### 4. AuthContext.tsx
- Manages authentication state
- Handles OAuth callbacks
- Provides role-based redirection logic

## Security Features

1. **Password Security**
   - Bcrypt hashing with 12 rounds
   - Minimum 8 characters required
   - Password confirmation validation

2. **JWT Authentication**
   - Secure token generation
   - 7-day expiration
   - Token stored in localStorage

3. **Role Verification**
   - Server-side role validation
   - Protected routes based on role
   - Authorization middleware

4. **Input Validation**
   - Zod schema validation
   - Email format validation
   - SQL injection prevention
   - XSS protection

## Testing

### Manual Testing Steps

1. **Test Renter Registration**:
   ```
   1. Go to /register
   2. Fill in all fields
   3. Select "Rent a Car"
   4. Submit form
   5. Verify redirect to /renter-dashboard
   6. Check database for userType: 'renter'
   ```

2. **Test Owner Registration**:
   ```
   1. Go to /register
   2. Fill in all fields
   3. Select "Become a Car Owner"
   4. Submit form
   5. Verify redirect to /owner-dashboard
   6. Check database for userType: 'owner'
   ```

3. **Test Login Redirection**:
   ```
   1. Register as renter
   2. Logout
   3. Login with same credentials
   4. Verify redirect to /renter-dashboard
   5. Repeat for owner account
   ```

### Automated Testing
Run the test script:
```bash
npm run test:registration
```

Or manually:
```bash
npx tsx scripts/test-registration.ts
```

## User Experience Flow

### New Renter Journey
```
1. Visit homepage → Click "Sign Up"
2. Fill registration form → Select "Rent a Car"
3. Submit → Account created
4. Auto-redirect → Renter Dashboard
5. Browse cars → Make booking
6. Never see owner features
```

### New Owner Journey
```
1. Visit homepage → Click "Sign Up"
2. Fill registration form → Select "Become a Car Owner"
3. Submit → Account created
4. Auto-redirect → Owner Dashboard
5. Add first car → Manage listings
6. Never see renter booking features
```

### Returning User Journey
```
1. Visit homepage → Click "Sign In"
2. Enter credentials → Submit
3. System checks userType from database
4. Auto-redirect to appropriate dashboard
5. No role selection needed
```

## Benefits

1. **Clear User Intent**: Users declare their purpose during registration
2. **Streamlined Experience**: No confusion about which dashboard to use
3. **Automatic Routing**: System handles redirection based on role
4. **Persistent Role**: Role is stored in database and remembered
5. **Flexible System**: Supports future "both" role for dual-purpose users
6. **Security**: Role-based access control at API level

## Future Enhancements

1. **Role Switching**: Allow users to upgrade from renter to owner
2. **Dual Role**: Implement full "both" functionality
3. **Role Permissions**: Fine-grained permissions per role
4. **Admin Role**: Add admin dashboard for platform management
5. **Role Analytics**: Track user behavior by role

## Troubleshooting

### Issue: User redirected to wrong dashboard
**Solution**: Check `userType` in database:
```sql
SELECT id, email, firstName, lastName, userType 
FROM users 
WHERE email = 'user@example.com';
```

### Issue: Dashboard selector shows for single-role user
**Solution**: Verify DashboardSelector auto-redirect logic is working

### Issue: Registration doesn't save userType
**Solution**: Check backend registration endpoint saves userType field

## Summary

The role-based system is now fully implemented with:
- ✅ Clear role selection during registration
- ✅ Automatic database storage of user role
- ✅ Role-based redirection after login/registration
- ✅ Separate dashboards for owners and renters
- ✅ No role selection screen for single-role users
- ✅ Secure authentication and authorization
- ✅ Persistent role across sessions

Users will never see the role selection screen again after registration - they'll always be directed to their appropriate dashboard based on their chosen role.
