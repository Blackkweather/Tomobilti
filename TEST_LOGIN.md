# 🧪 Testing Login Functionality

## Quick Test Guide

### Step 1: Create Test Users

Run this command to create test accounts:

```bash
npx tsx scripts/create-test-users.ts
```

This will create two test accounts:

### Test Accounts

#### 🔵 Renter Account
- **Email**: `renter@test.com`
- **Password**: `Demo123!`
- **Expected Behavior**: Redirects to `/renter-dashboard`

#### 🟢 Owner Account
- **Email**: `owner@test.com`
- **Password**: `Demo123!`
- **Expected Behavior**: Redirects to `/owner-dashboard`

---

### Step 2: Start the Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

---

### Step 3: Test Login Flow

#### Test Renter Login:
1. Go to `http://localhost:5173/login`
2. Enter:
   - Email: `renter@test.com`
   - Password: `Demo123!`
3. Click "Sign In"
4. ✅ **Expected**: Redirect to `/renter-dashboard`
5. ✅ **Expected**: See renter-specific features (browse cars, bookings)

#### Test Owner Login:
1. Logout (if logged in)
2. Go to `http://localhost:5173/login`
3. Enter:
   - Email: `owner@test.com`
   - Password: `Demo123!`
4. Click "Sign In"
5. ✅ **Expected**: Redirect to `/owner-dashboard`
6. ✅ **Expected**: See owner-specific features (add cars, manage listings)

---

### Step 4: Test Registration Flow

#### Test Renter Registration:
1. Go to `http://localhost:5173/register`
2. Fill in:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.renter@test.com`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
3. Select: **"Rent a Car"** (radio button)
4. Check "I agree to terms"
5. Click "Create Account"
6. ✅ **Expected**: Redirect to `/renter-dashboard`

#### Test Owner Registration:
1. Logout
2. Go to `http://localhost:5173/register`
3. Fill in:
   - First Name: `Jane`
   - Last Name: `Smith`
   - Email: `jane.owner@test.com`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
4. Select: **"Become a Car Owner"** (radio button)
5. Check "I agree to terms"
6. Click "Create Account"
7. ✅ **Expected**: Redirect to `/owner-dashboard`

---

## Verification Checklist

### ✅ Login Tests
- [ ] Renter login redirects to `/renter-dashboard`
- [ ] Owner login redirects to `/owner-dashboard`
- [ ] Wrong password shows error message
- [ ] Invalid email shows error message
- [ ] User stays logged in after page refresh

### ✅ Registration Tests
- [ ] "Rent a Car" option creates renter account
- [ ] "Become a Car Owner" option creates owner account
- [ ] Renter registration redirects to `/renter-dashboard`
- [ ] Owner registration redirects to `/owner-dashboard`
- [ ] Duplicate email shows error
- [ ] Password validation works (min 8 chars)
- [ ] Password confirmation validation works

### ✅ Dashboard Tests
- [ ] Renter dashboard shows renter features only
- [ ] Owner dashboard shows owner features only
- [ ] User cannot access wrong dashboard
- [ ] Dashboard persists after logout/login

---

## Database Verification

Check users in database:

```sql
-- View all users with their roles
SELECT id, email, firstName, lastName, userType, createdAt 
FROM users 
ORDER BY createdAt DESC;

-- Count users by type
SELECT userType, COUNT(*) as count 
FROM users 
GROUP BY userType;
```

---

## Troubleshooting

### Issue: "Invalid email or password"
**Solution**: Make sure test users are created. Run:
```bash
npx tsx scripts/create-test-users.ts
```

### Issue: Redirects to wrong dashboard
**Solution**: Check userType in database:
```sql
SELECT email, userType FROM users WHERE email = 'renter@test.com';
```

### Issue: Not redirecting after login
**Solution**: 
1. Check browser console for errors
2. Verify AuthContext is working
3. Check network tab for API response

### Issue: Registration not saving userType
**Solution**: Check backend logs and verify registration endpoint

---

## Expected Console Output

When you run the test user creation script, you should see:

```
🔧 Creating test users for login testing...

✅ Created renter: renter@test.com
   Password: Demo123!
   Name: Test Renter
   ID: [uuid]

✅ Created owner: owner@test.com
   Password: Demo123!
   Name: Test Owner
   ID: [uuid]

📋 Test Login Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Renter Account:
  Email: renter@test.com
  Password: Demo123!
  Expected redirect: /renter-dashboard

Owner Account:
  Email: owner@test.com
  Password: Demo123!
  Expected redirect: /owner-dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Success Criteria

✅ All tests pass when:
1. Renter login → `/renter-dashboard`
2. Owner login → `/owner-dashboard`
3. Renter registration → `/renter-dashboard`
4. Owner registration → `/owner-dashboard`
5. Role persists across sessions
6. No errors in console
7. Database shows correct userType

---

## Quick Commands

```bash
# Create test users
npx tsx scripts/create-test-users.ts

# Start dev server
npm run dev

# Check database
npx tsx scripts/check-cars.ts

# Run all tests
npm test
```
