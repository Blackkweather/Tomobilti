# 🚗 **Complete User Journey Testing Guide - ShareWheelz Platform**

## 📋 **Testing Checklist**

### ✅ **1. Password Reset with Dual Verification**
- **URL**: `http://localhost:5000/password-reset`
- **Steps**:
  1. Enter email address
  2. Enter phone number
  3. Verify both codes
  4. Create new password
  5. Success confirmation

### ✅ **2. Social Login Integration**
- **Google Login**: Redirects to Google OAuth
- **Apple Login**: Redirects to Apple OAuth  
- **Microsoft Login**: Redirects to Microsoft OAuth
- **Callback URLs**: `/auth/google/callback`, `/auth/apple/callback`, `/auth/microsoft/callback`

---

## 🚙 **CAR OWNER JOURNEY TESTING**

### **Step 1: Register as Car Owner**
1. **Go to**: `http://localhost:5000/register`
2. **Fill out**:
   - Name: "John Smith"
   - Email: "john.smith@example.com"
   - Phone: "+44 7123 456789"
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"
   - User Type: "Car Owner"
3. **Click**: "Create Account"

### **Step 2: Add Your Car**
1. **Go to**: `http://localhost:5000/add-car`
2. **Fill out car details**:
   - **Make**: "BMW"
   - **Model**: "3 Series"
   - **Year**: "2022"
   - **Price per day**: "£85"
   - **Location**: "London, UK"
   - **Fuel Type**: "Petrol"
   - **Transmission**: "Automatic"
   - **Seats**: "5"
   - **Mileage**: "25000"
   - **License Plate**: "BM22 ABC"
   - **Description**: "Beautiful BMW 3 Series in excellent condition. Perfect for city driving and weekend trips."

3. **Select Features**:
   - ✅ Air Conditioning
   - ✅ Bluetooth
   - ✅ GPS Navigation
   - ✅ Backup Camera
   - ✅ Heated Seats
   - ✅ USB Ports

4. **Upload Images**:
   - Upload 3-5 high-quality car photos
   - Include exterior, interior, and dashboard shots

5. **Click**: "List My Car"

### **Step 3: Verify Car Listing**
1. **Go to**: `http://localhost:5000/dashboard/owner`
2. **Check**:
   - Car appears in "My Cars" section
   - All details are correct
   - Images are displayed properly
   - Status shows as "Available"

---

## 🚗 **RENTER JOURNEY TESTING**

### **Step 1: Register as Renter**
1. **Go to**: `http://localhost:5000/register`
2. **Fill out**:
   - Name: "Sarah Johnson"
   - Email: "sarah.johnson@example.com"
   - Phone: "+44 7987 654321"
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"
   - User Type: "Renter"
3. **Click**: "Create Account"

### **Step 2: Browse and Book Car**
1. **Go to**: `http://localhost:5000/cars`
2. **Search for**:
   - Location: "London"
   - Dates: Next weekend
   - Car type: "BMW"
3. **Click on**: BMW 3 Series listing
4. **Review**:
   - Car details
   - Photos
   - Owner information
   - Pricing breakdown

### **Step 3: Complete Booking**
1. **Select dates**: Next weekend (2 days)
2. **Review pricing**:
   - Daily rate: £85
   - Total: £170
   - Service fee: £17
   - Insurance: £15
   - **Total**: £202
3. **Add message**: "Hi! I'm interested in renting your BMW for the weekend. I'm a responsible driver with a clean license."
4. **Click**: "Book Now"

### **Step 4: Payment Process**
1. **Payment page** loads with booking summary
2. **Enter payment details**:
   - Card number: "4242 4242 4242 4242" (test card)
   - Expiry: "12/25"
   - CVV: "123"
   - Name: "Sarah Johnson"
3. **Click**: "Pay Now"

### **Step 5: Booking Confirmation**
1. **Confirmation page** shows:
   - Booking ID
   - Car details
   - Dates and times
   - Total amount paid
   - Owner contact information
2. **Download receipt** (if available)

---

## 📱 **SMS VERIFICATION TESTING**

### **Test SMS Functionality**
1. **Go to**: `http://localhost:5000/admin`
2. **Click**: "SMS Testing" tab
3. **Test different SMS types**:
   - **Test SMS**: Send to `+212634373195`
   - **Booking Confirmation**: Test booking confirmation SMS
   - **Booking Reminder**: Test reminder SMS
   - **Verification Code**: Test verification SMS

---

## 🤖 **AI AGENT TESTING**

### **Test AI Agents**
1. **Go to**: `http://localhost:5000/admin`
2. **Click**: "AI Agents" tab
3. **Test each agent**:
   - **Support Agent**: "I need help with my booking"
   - **Booking Agent**: "I want to book a car for this weekend"
   - **Host Agent**: "How do I optimize my car listing?"
   - **Technical Agent**: "I can't log into my account"

---

## 🔍 **VERIFICATION CHECKLIST**

### **Car Owner Verification**:
- ✅ Account created successfully
- ✅ Car added with all details
- ✅ Images uploaded and displayed
- ✅ Car appears in owner dashboard
- ✅ Pricing and features correct

### **Renter Verification**:
- ✅ Account created successfully
- ✅ Can browse available cars
- ✅ Car details display correctly
- ✅ Booking process works
- ✅ Payment processed successfully
- ✅ Confirmation received
- ✅ Receipt generated

### **System Verification**:
- ✅ SMS notifications working
- ✅ AI agents responding
- ✅ Password reset with dual verification
- ✅ Social login redirects working
- ✅ All buttons functional
- ✅ Popup click-outside-to-close working

---

## 🎯 **EXPECTED RESULTS**

### **Car Owner Dashboard**:
- Shows "1 car listed"
- Car status: "Available"
- Earnings: £0 (no bookings yet)
- Next steps: "Share your listing"

### **Renter Dashboard**:
- Shows "1 active booking"
- Booking status: "Confirmed"
- Car: BMW 3 Series
- Dates: Next weekend
- Total paid: £202

### **Admin Dashboard**:
- Shows 2 users (owner + renter)
- Shows 1 car listing
- Shows 1 booking
- SMS testing functional
- AI agents responding

---

## 🚀 **NEXT STEPS AFTER TESTING**

1. **Verify all functionality works**
2. **Check for any errors or issues**
3. **Test edge cases** (invalid data, network errors)
4. **Verify responsive design** on mobile
5. **Test performance** with multiple users

---

## 📞 **SUPPORT CONTACTS**

- **Technical Issues**: Use AI Agent Technical Support
- **Booking Help**: Use AI Agent Booking Support
- **General Support**: Use AI Agent Support
- **SMS Issues**: Test via Admin SMS Panel

**Happy Testing! 🎉**






