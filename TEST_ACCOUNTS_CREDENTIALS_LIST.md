# ShareWheelz - Test Accounts Credentials List

**Live Site:** https://sharewheelz.uk

**Generated:** January 2025

---

## ✅ VERIFIED WORKING

### Admin Account
```
Email:    admin@sharewheelz.uk
Password: Admin123!
Role:     Admin
Status:   ✅ VERIFIED AND WORKING
```

---

## 🔐 TEST ACCOUNTS - PASSWORDS TO BE RESET

### Owner Accounts (3)

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

### Renter Accounts (6)

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

## 📋 QUICK REFERENCE TABLE

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@sharewheelz.uk` | `Admin123!` ✅ |
| Owner | `testowner@sharewheelz.uk` | `TestOwner123!` |
| Owner | `owner@test.com` | `OwnerTest123!` |
| Owner | `marcohemma5@gmail.com` | `MarcoOwner123!` |
| Renter | `testrenter@sharewheelz.uk` | `TestRenter123!` |
| Renter | `localtest@test.com` | `LocalTest123!` |
| Renter | `test.user@example.com` | `TestUser123!` |
| Renter | `test@example.com` | `TestUser123!` |
| Renter | `test.user.demo+1@example.com` | `TestUser123!` |
| Renter | `testuser@example.com` | `TestUser123!` |

---

## 🔧 HOW TO RESET PASSWORDS

### Option 1: Admin Panel UI (Once Deployed)
1. Login: `admin@sharewheelz.uk` / `Admin123!`
2. Go to: Admin Panel → Users Tab
3. Click: Lock icon (🔒) next to each user
4. Enter: New password (see table above)
5. Click: "Reset Password"

### Option 2: Direct Database Update (Advanced)
Use the SQLite database directly with bcrypt hashing.

### Option 3: API Script (Once CSRF Issue Resolved)
Run: `node scripts/reset-test-passwords.mjs`

---

## ⚠️ NOTES

1. **Current Status:** Password reset endpoint exists but requires CSRF token handling
2. **Password Format:** `{Name}123!` - Easy to remember for testing
3. **Minimum Length:** All passwords are 8+ characters (meets requirements)
4. **Admin Access:** Only admin can reset passwords
5. **Deployment:** Backend route needs to be deployed to live server

---

## 📊 SUMMARY

- **Total Accounts:** 10
  - ✅ 1 Admin (working)
  - ⏳ 3 Owners (awaiting reset)
  - ⏳ 6 Renters (awaiting reset)

---

**Next Steps:**
1. Fix CSRF handling in API calls OR disable CSRF for admin API routes
2. Deploy backend changes to live server
3. Reset passwords using Admin Panel or script
4. Test login with all accounts
5. Verify access and functionality

---

**Document Version:** 1.0
**Last Updated:** January 2025

