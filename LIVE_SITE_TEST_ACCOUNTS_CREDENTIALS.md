# ShareWheelz Live Site - Test Account Credentials

**Live Site URL:** https://sharewheelz.uk

**Last Updated:** January 2025

**Status:** ⚠️ Passwords need to be reset via Admin Panel (once backend is deployed)

---

## ✅ VERIFIED WORKING CREDENTIALS

### Admin Account
- **Email:** `admin@sharewheelz.uk`
- **Password:** `Admin123!`
- **Role:** Admin
- **Status:** ✅ **WORKING**
- **Access:** Full admin panel access confirmed

---

## 📋 TEST ACCOUNTS - PASSWORDS TO BE SET

### Owner Accounts

#### 1. Test Owner
- **Email:** `testowner@sharewheelz.uk`
- **Name:** Test Owner
- **Role:** Owner
- **Joined:** 30/10/2025
- **New Password:** `TestOwner123!`
- **Status:** ⏳ **Awaiting reset**

#### 2. Owner Test
- **Email:** `owner@test.com`
- **Name:** OwnerTest OwnerLast
- **Role:** Owner
- **Joined:** 31/10/2025
- **New Password:** `OwnerTest123!`
- **Status:** ⏳ **Awaiting reset**

#### 3. Marco Hemma
- **Email:** `marcohemma5@gmail.com`
- **Name:** Marco Hemma
- **Role:** Owner
- **Joined:** 23/10/2025
- **New Password:** `MarcoOwner123!`
- **Status:** ⏳ **Awaiting reset**

---

### Renter Accounts

#### 1. Test Renter
- **Email:** `testrenter@sharewheelz.uk`
- **Name:** Test Renter
- **Role:** Renter (Verified ✅)
- **Joined:** 30/10/2025
- **New Password:** `TestRenter123!`
- **Status:** ⏳ **Awaiting reset**

#### 2. Local Test User
- **Email:** `localtest@test.com`
- **Name:** LocalTest User
- **Role:** Renter
- **Joined:** 30/10/2025
- **New Password:** `LocalTest123!`
- **Status:** ⏳ **Awaiting reset**

#### 3. Test User 1
- **Email:** `test.user@example.com`
- **Name:** Test User
- **Role:** Renter
- **Joined:** 30/10/2025
- **New Password:** `TestUser123!`
- **Status:** ⏳ **Awaiting reset**

#### 4. Test User 2
- **Email:** `test@example.com`
- **Name:** Test User
- **Role:** Renter
- **Joined:** 30/10/2025
- **New Password:** `TestUser123!`
- **Status:** ⏳ **Awaiting reset**

#### 5. Test User 3
- **Email:** `test.user.demo+1@example.com`
- **Name:** Test User
- **Role:** Renter
- **Joined:** 31/10/2025
- **New Password:** `TestUser123!`
- **Status:** ⏳ **Awaiting reset**

#### 6. Test User 4
- **Email:** `testuser@example.com`
- **Name:** TestUser TestLast
- **Role:** Renter
- **Joined:** 31/10/2025
- **New Password:** `TestUser123!`
- **Status:** ⏳ **Awaiting reset**

---

## 🔐 PASSWORD SUMMARY

### Owner Accounts
| Email | Password |
|-------|---------|
| `testowner@sharewheelz.uk` | `TestOwner123!` |
| `owner@test.com` | `OwnerTest123!` |
| `marcohemma5@gmail.com` | `MarcoOwner123!` |

### Renter Accounts
| Email | Password |
|-------|---------|
| `testrenter@sharewheelz.uk` | `TestRenter123!` |
| `localtest@test.com` | `LocalTest123!` |
| `test.user@example.com` | `TestUser123!` |
| `test@example.com` | `TestUser123!` |
| `test.user.demo+1@example.com` | `TestUser123!` |
| `testuser@example.com` | `TestUser123!` |

---

## 📝 HOW TO RESET PASSWORDS

### Method 1: Admin Panel UI (Recommended - Once Deployed)
1. Login as admin: `admin@sharewheelz.uk` / `Admin123!`
2. Navigate to Admin Panel → Users tab
3. Click the **Lock icon** button next to each user
4. Enter new password (minimum 8 characters)
5. Click "Reset Password"

### Method 2: API Script (Once Backend Deployed)
Run the script:
```bash
node scripts/reset-test-passwords.mjs
```

This will automatically reset all passwords listed above.

---

## ⚠️ IMPORTANT NOTES

1. **Backend Deployment Required:** The password reset endpoint (`POST /api/admin/users/:id/reset-password`) needs to be deployed to the live server before passwords can be reset.

2. **Security:** Passwords must be at least 8 characters long.

3. **Admin Access:** Only admin accounts can reset user passwords.

4. **Password Policy:** All passwords follow the pattern: `{Name}123!` for easy testing.

---

## 📊 TOTAL ACCOUNTS

- **Total Users:** 10
  - 1 Admin ✅ (verified working)
  - 3 Owners ⏳ (awaiting password reset)
  - 6 Renters ⏳ (awaiting password reset)

---

## 🔄 STATUS UPDATE

**Current Status:** Code has been committed and pushed to repository. Backend route needs to be deployed to live server.

**Next Steps:**
1. Deploy latest code to live server
2. Run password reset script or use Admin Panel UI
3. Test login with new credentials
4. Update this document with confirmation

---

**Generated:** January 2025
**Last Tested:** Waiting for backend deployment

