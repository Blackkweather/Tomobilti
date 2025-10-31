# Manual Browser Testing Checklist
**Created:** Based on Code Verification  
**Instructions:** Start the dev server (`npm run dev`) and test each item in your browser at `http://localhost:5000`

---

## 🚀 Quick Start
1. Open terminal and run: `npm run dev`
2. Wait for server to start (should show "Server running on http://127.0.0.1:5000")
3. Open browser to `http://localhost:5000`
4. Follow this checklist systematically

---

## ✅ 1. HOMEPAGE TESTING

### 1.1 Visual & Layout
- [ ] Page loads without errors (check browser console - F12)
- [ ] Navigation menu visible and functional
- [ ] Search bar appears in header
- [ ] Featured cars section displays (should show 6 cars)
- [ ] Weather banner shows temperatures for UK cities
- [ ] Footer links are visible
- [ ] No layout breaks on mobile (resize browser window)

### 1.2 Email Capture Modal
- [ ] Modal appears after a few seconds (non-intrusive)
- [ ] Can dismiss modal with X button
- [ ] Can submit email address
- [ ] Success message appears after submission
- [ ] Modal doesn't reappear after dismissal (checks localStorage)

### 1.3 Car Cards
- [ ] Each car card shows:
  - [ ] Car image
  - [ ] Car name
  - [ ] Location
  - [ ] Price per day (£XX.XX format)
  - [ ] Fuel type, transmission, seats, year
  - [ ] Owner verification badge (if applicable)
- [ ] Clicking car card navigates to car details page
- [ ] Image gallery thumbnails work (if multiple images)

---

## ✅ 2. REGISTRATION FLOW

### 2.1 Registration Page (`/register`)
- [ ] Navigate to `/register`
- [ ] Form fields visible:
  - [ ] First Name
  - [ ] Last Name
  - [ ] Email
  - [ ] Phone
  - [ ] Password
  - [ ] Confirm Password
- [ ] **Real-time validation** (test these):
  - [ ] Invalid email shows error immediately
  - [ ] Password < 8 chars shows error
  - [ ] Passwords don't match shows error
  - [ ] Empty required fields show error on blur
- [ ] Submit button enabled only when form is valid
- [ ] Success: Redirects to dashboard after registration
- [ ] Error: Shows error message if email already exists

### 2.2 Document Upload (After Registration)
- [ ] Can upload ID document
- [ ] Can upload Driver's License
- [ ] Drag & drop works
- [ ] File picker works
- [ ] Invalid file types rejected (try .txt file)
- [ ] File size validation works (try > 5MB)
- [ ] Upload progress shows
- [ ] Success message after upload

---

## ✅ 3. LOGIN FLOW

### 3.1 Login Page (`/login`)
- [ ] Navigate to `/login`
- [ ] Email and password fields visible
- [ ] Submit button works
- [ ] **If already logged in:**
  - [ ] Shows "Already Signed In" message
  - [ ] Shows user email
  - [ ] "Sign Out and Switch Account" button works
  - [ ] "Go to Dashboard" button works
- [ ] Error message on invalid credentials
- [ ] Success: Redirects to dashboard

### 3.2 OAuth Buttons (if configured)
- [ ] Google login button visible
- [ ] Facebook login button visible
- [ ] Apple login button visible
- [ ] Microsoft login button visible
- [ ] Clicking initiates OAuth flow (may need production keys)

---

## ✅ 4. CAR MANAGEMENT (Owner Dashboard)

### 4.1 Owner Dashboard (`/dashboard`)
- [ ] Navigate to `/dashboard` (must be logged in as owner)
- [ ] Dashboard loads with skeleton loader (brief flash)
- [ ] Stats cards show:
  - [ ] Total Cars
  - [ ] Active Bookings
  - [ ] Total Revenue
- [ ] Tabs visible: "My Cars", "Bookings", "Profile"
- [ ] "My Cars" tab shows owned cars

### 4.2 Add Car (`/add-car`)
- [ ] Navigate to `/add-car`
- [ ] Form fields visible:
  - [ ] Make, Model, Year
  - [ ] Price per day
  - [ ] Location
  - [ ] Description
  - [ ] Features checkboxes
  - [ ] Image upload (multiple images)
- [ ] **Image Upload Test:**
  - [ ] Can select multiple images
  - [ ] Can drag & drop images
  - [ ] Image preview shows
  - [ ] Can remove selected images
  - [ ] Submit creates car with images
- [ ] Form validation works
- [ ] Success: Car appears in "My Cars" tab

### 4.3 Edit Car (`/cars/:id/edit`)
- [ ] Navigate to car edit page (from "My Cars" tab)
- [ ] Form pre-populated with car data
- [ ] Can modify all fields
- [ ] **Image Upload Test:**
  - [ ] Can add new images
  - [ ] Can remove existing images
  - [ ] Changes save correctly
- [ ] Save button updates car
- [ ] Success message appears

### 4.4 Delete Car
- [ ] Delete button visible on car card (in "My Cars" tab)
- [ ] Click delete shows confirmation dialog
- [ ] Confirm deletion removes car
- [ ] Car no longer appears in list

---

## ✅ 5. BOOKING FLOW (Renter)

### 5.1 Car Details Page (`/cars/:id`)
- [ ] Navigate to any car details page
- [ ] Car information displays:
  - [ ] All images in gallery
  - [ ] Car specs (fuel, transmission, seats, year)
  - [ ] Owner information
  - [ ] Location map (if available)
  - [ ] Price per day
- [ ] "Book Now" button visible
- [ ] Date picker for start/end dates visible

### 5.2 Booking Form
- [ ] Select start date
- [ ] Select end date
- [ ] Total price calculates automatically
- [ ] Click "Book Now"
- [ ] Redirects to payment page

### 5.3 Payment Page (`/payment`)
- [ ] Booking summary shows:
  - [ ] Car details
  - [ ] Dates
  - [ ] Total amount (should NOT show "£NaN")
- [ ] Stripe payment form loads (or test mode)
- [ ] Can enter test card: `4242 4242 4242 4242`
- [ ] Expiry: Any future date
- [ ] CVC: Any 3 digits
- [ ] Payment processes successfully
- [ ] Redirects to renter dashboard
- [ ] Booking appears in "My Bookings" tab

---

## ✅ 6. RENTER DASHBOARD

### 6.1 Renter Dashboard (`/dashboard` as renter)
- [ ] Navigate to `/dashboard` (logged in as renter)
- [ ] "My Bookings" tab shows active bookings
- [ ] Each booking shows:
  - [ ] Car image and name
  - [ ] Dates
  - [ ] Total amount (check: should NOT show "£NaN")
  - [ ] Status (Pending, Confirmed, Completed)
- [ ] Can cancel booking (if allowed)
- [ ] Booking history shows past bookings

---

## ✅ 7. PROFILE MANAGEMENT

### 7.1 Profile Edit
- [ ] Navigate to Profile tab in dashboard
- [ ] Can edit:
  - [ ] First Name
  - [ ] Last Name
  - [ ] Phone Number
  - [ ] Email
- [ ] Changes save successfully
- [ ] Success message appears

### 7.2 Password Change
- [ ] Navigate to Profile settings
- [ ] Password change form visible
- [ ] Enter current password
- [ ] Enter new password (min 8 chars)
- [ ] Confirm new password
- [ ] Submit updates password
- [ ] Can login with new password

---

## ✅ 8. EMAIL & PHONE VERIFICATION

### 8.1 Email Verification
- [ ] After registration, check for verification email (in dev, may log to console)
- [ ] Navigate to `/verify-email` or use verification link
- [ ] Enter verification code
- [ ] Success: Email verified
- [ ] Badge shows "Email Verified" in profile

### 8.2 Phone Verification
- [ ] Navigate to Profile
- [ ] Click "Verify Phone" button
- [ ] Enter phone number
- [ ] Receive verification code (may log to console in dev)
- [ ] Enter code
- [ ] Success: Phone verified
- [ ] Badge shows "Phone Verified" in profile

---

## ✅ 9. PASSWORD RESET

### 9.1 Forgot Password
- [ ] Navigate to `/login`
- [ ] Click "Forgot Password?" link
- [ ] Enter email address
- [ ] Submit form
- [ ] **In development:** Check response for `resetToken` (logs to console)
- [ ] **In production:** Check email for reset link

### 9.2 Reset Password
- [ ] Navigate to `/reset-password?token=RESET_TOKEN`
- [ ] Enter new password (min 8 chars)
- [ ] Confirm password
- [ ] Submit
- [ ] Success: Password reset
- [ ] Can login with new password

---

## ✅ 10. SEARCH & FILTERING

### 10.1 Car Search
- [ ] Use search bar in header
- [ ] Type car name/model
- [ ] Results filter correctly
- [ ] Click result navigates to car page

### 10.2 Filter on `/cars` Page
- [ ] Navigate to `/cars`
- [ ] Select location filter
- [ ] Select date range
- [ ] Select fuel type
- [ ] Select transmission
- [ ] Results update correctly
- [ ] "Clear Filters" button works

---

## ✅ 11. RESPONSIVE DESIGN

### 11.1 Mobile View (< 768px)
- [ ] Resize browser to mobile width
- [ ] Navigation menu becomes hamburger menu
- [ ] Car cards stack vertically
- [ ] Forms are readable and usable
- [ ] No horizontal scrolling
- [ ] Touch targets are adequate size

### 11.2 Tablet View (768px - 1024px)
- [ ] Layout adapts appropriately
- [ ] Grid layouts adjust
- [ ] Navigation remains functional

### 11.3 Desktop View (> 1024px)
- [ ] Full layout displays correctly
- [ ] Car grid shows multiple columns
- [ ] Sidebar visible (if applicable)

---

## ✅ 12. ERROR HANDLING

### 12.1 404 Page
- [ ] Navigate to `/nonexistent-page`
- [ ] Custom 404 page displays
- [ ] "Go Home" button works
- [ ] Design matches site theme

### 12.2 Network Errors
- [ ] Disconnect internet
- [ ] Try to submit form
- [ ] Error message displays gracefully
- [ ] Reconnect internet
- [ ] Retry works

### 12.3 Validation Errors
- [ ] Submit empty forms
- [ ] Enter invalid data
- [ ] Error messages display clearly
- [ ] Error fields highlighted in red

---

## ✅ 13. ACCESSIBILITY

### 13.1 Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Skip to main content link works (first tab)
- [ ] Focus indicators visible
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals

### 13.2 Screen Reader (Optional)
- [ ] Use screen reader (NVDA/JAWS/VoiceOver)
- [ ] All images have alt text
- [ ] Forms have labels
- [ ] Buttons have aria-labels
- [ ] Modals announce correctly

---

## ✅ 14. PERFORMANCE

### 14.1 Loading States
- [ ] Skeleton loaders show during data fetch
- [ ] No layout shift after content loads
- [ ] Images load progressively

### 14.2 Console Errors
- [ ] Open browser console (F12)
- [ ] Check for:
  - [ ] No red errors
  - [ ] No failed network requests (404s)
  - [ ] Warnings are acceptable (not critical)

---

## ✅ 15. BROWSER COMPATIBILITY

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 📝 TESTING NOTES

**Date Tested:** _____________  
**Tester:** _____________  
**Browser:** _____________  
**Version:** _____________  

**Issues Found:**
1. _____________
2. _____________
3. _____________

**Critical Issues:** _____  
**Major Issues:** _____  
**Minor Issues:** _____

---

## 🎯 PRIORITY CHECKLIST (Quick Smoke Test)

If short on time, test these critical paths:

1. ✅ Register → Upload Documents → Login
2. ✅ Login → Add Car → Edit Car → Delete Car
3. ✅ Browse Cars → View Details → Book → Payment
4. ✅ Login → View Dashboard → Edit Profile
5. ✅ Forgot Password → Reset Password → Login

**If all 5 pass, core functionality is working!**

---

## 🔧 DEBUGGING TIPS

### If server won't start:
- Check if port 5000 is already in use
- Run `npm install` to ensure dependencies are installed
- Check `.env` file exists with required variables

### If features don't work:
- Check browser console for errors (F12)
- Check Network tab for failed API calls
- Verify you're logged in with correct user type (owner vs renter)

### If images don't load:
- Check file paths in `client/public/assets/`
- Verify image names match database entries
- Check browser Network tab for 404 errors

---

**Good luck with testing! 🚀**


