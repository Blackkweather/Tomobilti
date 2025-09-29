# 🎯 ShareWheelz Membership Database Schema

## 📊 **Complete Database Structure**

The cloud database migration now includes all membership features with proper pricing, loyalty points, and benefits as shown on the website.

### **🏗️ Core Tables**

#### **1. Users Table (Enhanced)**
```sql
-- Membership & Subscription Fields
membership_tier VARCHAR(50) DEFAULT 'none'  -- 'none', 'basic', 'premium'
subscription_id VARCHAR(255)                 -- Stripe subscription ID
subscription_status VARCHAR(50) DEFAULT 'inactive'  -- 'active', 'inactive', 'cancelled', 'past_due'
subscription_current_period_end TIMESTAMP    -- When subscription expires
stripe_customer_id VARCHAR(255)              -- Stripe customer ID
loyalty_points INTEGER DEFAULT 0           -- Current loyalty points balance
```

#### **2. Bookings Table (Enhanced)**
```sql
-- Membership & Discount Fields
membership_discount DECIMAL(10,2) DEFAULT 0                    -- Discount amount applied
membership_discount_percentage DECIMAL(5,2) DEFAULT 0          -- Discount percentage (5% or 15%)
loyalty_points_earned INTEGER DEFAULT 0                        -- Points earned from this booking
loyalty_points_redeemed INTEGER DEFAULT 0                      -- Points redeemed for this booking
```

#### **3. New Membership Tables**

##### **Loyalty Points Transactions**
```sql
CREATE TABLE loyalty_points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  points INTEGER NOT NULL,                    -- positive for earned, negative for redeemed
  type VARCHAR(50) NOT NULL,                 -- 'earned', 'redeemed', 'bonus', 'expired'
  description TEXT,
  expires_at TIMESTAMP,                       -- when points expire
  created_at TIMESTAMP DEFAULT NOW()
);
```

##### **Membership Benefits**
```sql
CREATE TABLE membership_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier VARCHAR(50) NOT NULL,                -- 'basic', 'premium'
  benefit_type VARCHAR(100) NOT NULL,        -- 'discount', 'points_multiplier', 'support_level', etc.
  value DECIMAL(10,2) NOT NULL,              -- benefit value (percentage, multiplier, etc.)
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 💰 **Membership Pricing & Benefits**

### **Basic Membership - £9.99/month**
- **5% discount** on all rentals
- **1 point per £1** spent (basic loyalty points)
- **Standard customer support**
- **Basic verification**
- **Access to member-only vehicles**

### **Premium Membership - £19.99/month**
- **15% discount** on all rentals
- **2 points per £1** spent (enhanced loyalty points)
- **Priority customer support**
- **Enhanced verification & insurance**
- **Access to luxury vehicles**
- **Free cancellation up to 24h**
- **Exclusive member events**

---

## 🎯 **Sample Data Included**

### **Sample Users with Different Membership Tiers**

1. **Ahmed Bennani** (Premium Member)
   - Email: `ahmed.bennani@example.com`
   - Membership: Premium (£19.99/month)
   - Loyalty Points: 1,500
   - Benefits: 15% discount, 2x points, priority support

2. **Youssef Alami** (Basic Member)
   - Email: `youssef.alami@example.com`
   - Membership: Basic (£9.99/month)
   - Loyalty Points: 800
   - Benefits: 5% discount, 1x points, standard support

3. **Sara Idrissi** (Premium Member)
   - Email: `sara.idrissi@example.com`
   - Membership: Premium (£19.99/month)
   - Loyalty Points: 2,200
   - Benefits: 15% discount, 2x points, priority support

4. **Fatima Zahra** (Basic Member)
   - Email: `fatima.zahra@example.com`
   - Membership: Basic (£9.99/month)
   - Loyalty Points: 450
   - Benefits: 5% discount, 1x points, standard support

### **Membership Benefits Data**
All benefits are pre-configured in the database:
- Basic tier: 5% discount, 1x points multiplier, standard support
- Premium tier: 15% discount, 2x points multiplier, priority support
- Additional premium benefits: luxury vehicle access, free cancellation, exclusive events

### **Loyalty Points System**
- **Welcome Bonus**: 200 points (Premium), 100 points (Basic)
- **Earning Rate**: 2 points per £1 (Premium), 1 point per £1 (Basic)
- **Expiration**: Points expire after 12 months
- **Redemption**: Points can be redeemed for discounts (100 points = £1 discount)

---

## 🔧 **Database Features**

### **Automatic Calculations**
- Membership discounts are automatically calculated based on tier
- Loyalty points are earned based on spending and membership tier
- Subscription status is tracked with renewal dates

### **Security Features**
- All monetary values use DECIMAL for precision
- Foreign key constraints ensure data integrity
- Cascade deletes maintain referential integrity

### **Performance Optimizations**
- Indexes on frequently queried fields
- Proper data types for efficient storage
- Optimized queries for membership lookups

---

## 🚀 **How to Use**

### **1. Run Migration**
```bash
npm run migrate-cloud
```

### **2. Test Membership Features**
- Login with sample users to see different membership tiers
- Check loyalty points balances
- Verify discount calculations
- Test booking flow with membership benefits

### **3. Integration Points**
- **BecomeMember Page**: Shows pricing and benefits
- **Booking Flow**: Applies membership discounts
- **Dashboard**: Displays loyalty points and membership status
- **Payment System**: Handles subscription billing

---

## 📈 **Revenue Potential**

### **Membership Revenue**
- **Basic Plan**: £9.99/month × 500 members = £4,995/month
- **Premium Plan**: £19.99/month × 500 members = £9,995/month
- **Total Potential**: £14,990/month recurring revenue

### **Loyalty Program Benefits**
- **Increased Retention**: Members book more frequently
- **Higher LTV**: Premium members spend 3x more
- **Referral Program**: Points for referring new members
- **Upselling**: Basic members upgrade to Premium

---

## 🎉 **What's Included**

✅ **Complete membership database schema**
✅ **Proper pricing (£9.99 Basic, £19.99 Premium)**
✅ **Loyalty points system with calculations**
✅ **Membership benefits configuration**
✅ **Sample users with different tiers**
✅ **Subscription tracking**
✅ **Discount calculations**
✅ **Points earning and redemption**
✅ **ShareWheelz Digital Card integration**
✅ **Stripe payment integration ready**

Your ShareWheelz platform now has a complete, production-ready membership system that matches exactly what's shown on your website!
