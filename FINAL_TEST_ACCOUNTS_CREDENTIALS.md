# ShareWheelz - Final Test Accounts Credentials

**Live Site:** https://sharewheelz.uk  
**Date:** January 2025

---

## ✅ VERIFIED WORKING

### Admin Account
```
Email:    admin@sharewheelz.uk
Password: Admin123!
Role:     Admin
Status:   ✅ WORKING
```

---

## 📋 TEST ACCOUNTS - PASSWORDS TO RESET

Once the backend is deployed, these passwords will be reset to the values below.

### 👔 OWNER ACCOUNTS (3)

#### 1. Test Owner
```
Email:    testowner@sharewheelz.uk
Password: TestOwner123!
Name:     Test Owner
Role:     Owner
Joined:   30/10/2025
```

#### 2. Owner Test  
```
Email:    owner@test.com
Password: OwnerTest123!
Name:     OwnerTest OwnerLast
Role:     Owner
Joined:   31/10/2025
```

#### 3. Marco Hemma
```
Email:    marcohemma5@gmail.com
Password: MarcoOwner123!
Name:     Marco Hemma
Role:     Owner
Joined:   23/10/2025
```

---

### 👤 RENTER ACCOUNTS (6)

#### 1. Test Renter (Verified ✅)
```
Email:    testrenter@sharewheelz.uk
Password: TestRenter123!
Name:     Test Renter
Role:     Renter (Verified)
Joined:   30/10/2025
```

#### 2. Local Test User
```
Email:    localtest@test.com
Password: LocalTest123!
Name:     LocalTest User
Role:     Renter
Joined:   30/10/2025
```

#### 3. Test User 1
```
Email:    test.user@example.com
Password: TestUser123!
Name:     Test User
Role:     Renter
Joined:   30/10/2025
```

#### 4. Test User 2
```
Email:    test@example.com
Password: TestUser123!
Name:     Test User
Role:     Renter
Joined:   30/10/2025
```

#### 5. Test User 3
```
Email:    test.user.demo+1@example.com
Password: TestUser123!
Name:     Test User
Role:     Renter
Joined:   31/10/2025
```

#### 6. Test User 4
```
Email:    testuser@example.com
Password: TestUser123!
Name:     TestUser TestLast
Role:     Renter
Joined:   31/10/2025
```

---

## 📊 QUICK REFERENCE TABLE

| # | Role   | Email                          | Password           |
|---|--------|--------------------------------|-------------------|
| 1 | Admin  | admin@sharewheelz.uk           | Admin123! ✅       |
| 2 | Owner  | testowner@sharewheelz.uk       | TestOwner123!      |
| 3 | Owner  | owner@test.com                 | OwnerTest123!      |
| 4 | Owner  | marcohemma5@gmail.com          | MarcoOwner123!     |
| 5 | Renter | testrenter@sharewheelz.uk       | TestRenter123!    |
| 6 | Renter | localtest@test.com             | LocalTest123!     |
| 7 | Renter | test.user@example.com          | TestUser123!      |
| 8 | Renter | test@example.com                | TestUser123!      |
| 9 | Renter | test.user.demo+1@example.com    | TestUser123!      |
| 10| Renter | testuser@example.com            | TestUser123!      |

---

## 🔧 HOW TO RESET PASSWORDS

### Method 1: Admin Panel UI (Recommended)

1. **Login as Admin:**
   - Go to: https://sharewheelz.uk/login
   - Email: `admin@sharewheelz.uk`
   - Password: `Admin123!`

2. **Navigate to Admin Panel:**
   - Click on Admin Panel (or go to: https://sharewheelz.uk/admin)
   - Click on **Users** tab

3. **Reset Password:**
   - Find the user you want to reset
   - Click the **🔒 Lock icon** button next to their name
   - Enter the new password (see table above)
   - Click **"Reset Password"**

4. **Verify:**
   - Try logging in with the new credentials

### Method 2: API Script

Once the backend is deployed, run:
```bash
node scripts/reset-test-passwords.mjs
```

This will automatically reset all passwords listed above.

---

## ✅ WHAT'S BEEN DONE

1. ✅ Password reset functionality added to Admin Panel
2. ✅ Backend API endpoint created: `POST /api/admin/users/:id/reset-password`
3. ✅ CSRF protection excluded for admin API routes
4. ✅ Frontend UI with Lock icon button added
5. ✅ Password reset script created
6. ✅ All code committed and pushed to repository

---

## ⚠️ WHAT'S PENDING

1. ⏳ **Backend Deployment** - Server needs to pull latest code
2. ⏳ **Password Reset** - Once deployed, reset passwords using Admin Panel or script
3. ⏳ **Testing** - Verify all accounts can login with new passwords

---

## 📝 PASSWORD PATTERN

All passwords follow a consistent pattern for easy testing:
- **Owners:** `{Name}Owner123!` or `{Name}Test123!`
- **Renters:** `TestRenter123!` or `{Name}Test123!` or `TestUser123!`
- **Minimum:** 8 characters (all meet this requirement)

---

## 🔐 SECURITY NOTES

1. **Password Requirements:** All passwords are 8+ characters with uppercase, lowercase, numbers, and special characters
2. **Admin Only:** Only admin accounts can reset passwords
3. **Token Auth:** Admin API routes use Bearer token authentication (no CSRF needed)
4. **Secure Hashing:** All passwords are hashed using bcrypt before storage

---

## 📈 SUMMARY

- **Total Accounts:** 10
  - ✅ 1 Admin (working)
  - ⏳ 3 Owners (awaiting password reset)
  - ⏳ 6 Renters (awaiting password reset)

- **Total Passwords to Reset:** 9 accounts

---

**Status:** ✅ Code ready, awaiting deployment  
**Next Action:** Deploy backend → Reset passwords → Test login

---

*Generated: January 2025*  
*Last Updated: After backend deployment*

