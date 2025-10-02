# DNS Records Setup for ShareWheelz.uk

## 🎯 **Purpose**
Set up SPF, DKIM, and DMARC records to improve email deliverability and reduce spam filtering.

## 📋 **DNS Records to Add**

### **1. SPF Record (Sender Policy Framework)**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com include:mailgun.org ~all
TTL: 3600
```

### **2. DMARC Record (Domain-based Message Authentication)**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:admin@sharewheelz.uk; ruf=mailto:admin@sharewheelz.uk; fo=1
TTL: 3600
```

### **3. DKIM Record (DomainKeys Identified Mail)**
```
Type: TXT
Name: default._domainkey
Value: [Get this from your email provider - Google Workspace, etc.]
TTL: 3600
```

## 🔧 **Setup Instructions**

### **Step 1: Access DNS Management**
1. Log into your domain registrar (Namecheap, GoDaddy, etc.)
2. Go to Domain Management
3. Find "DNS Management" or "Advanced DNS"
4. Click "Add Record"

### **Step 2: Add SPF Record**
1. **Type**: TXT
2. **Name**: @ (or leave blank)
3. **Value**: `v=spf1 include:_spf.google.com include:mailgun.org ~all`
4. **TTL**: 3600
5. **Save**

### **Step 3: Add DMARC Record**
1. **Type**: TXT
2. **Name**: _dmarc
3. **Value**: `v=DMARC1; p=quarantine; rua=mailto:admin@sharewheelz.uk; ruf=mailto:admin@sharewheelz.uk; fo=1`
4. **TTL**: 3600
5. **Save**

### **Step 4: Add DKIM Record**
1. **Type**: TXT
2. **Name**: default._domainkey
3. **Value**: [Get from your email provider]
4. **TTL**: 3600
5. **Save**

## 📊 **What Each Record Does**

### **SPF Record**
- Tells receiving servers which servers are authorized to send emails for your domain
- Prevents email spoofing
- Improves deliverability

### **DMARC Record**
- Builds on SPF and DKIM
- Tells receiving servers what to do with emails that fail authentication
- Provides reporting on email authentication

### **DKIM Record**
- Adds a digital signature to your emails
- Verifies that emails haven't been tampered with
- Improves trust and deliverability

## ⏱️ **Timeline**
- **DNS Propagation**: 1-24 hours
- **Full Effect**: 24-48 hours
- **Spam Reduction**: 1-2 weeks

## 🧪 **Testing Your Records**

### **Online Tools**
1. **SPF Checker**: https://mxtoolbox.com/spf.aspx
2. **DMARC Checker**: https://mxtoolbox.com/dmarc.aspx
3. **DKIM Checker**: https://mxtoolbox.com/dkim.aspx

### **Command Line Testing**
```bash
# Check SPF
nslookup -type=TXT sharewheelz.uk

# Check DMARC
nslookup -type=TXT _dmarc.sharewheelz.uk

# Check DKIM
nslookup -type=TXT default._domainkey.sharewheelz.uk
```

## 🎯 **Expected Results**
- ✅ Emails go to inbox instead of spam
- ✅ Better email deliverability
- ✅ Reduced email spoofing
- ✅ Professional email reputation

## 📝 **Notes**
- Only add ONE SPF record per domain
- DMARC policy starts with "quarantine" (safe mode)
- DKIM key must be obtained from your email provider
- Monitor DMARC reports for any issues

## 🚨 **Important**
- Don't delete existing MX records
- Keep existing email forwarding rules
- Test with a few emails before going live
- Monitor spam folder for first few days
