# 📧 Email Leads Storage Guide

## Where Are Emails Stored?

### Database Location
- **File**: `tomobilti.db` (SQLite database in project root)
- **Table**: `email_leads`

### Table Structure
```sql
CREATE TABLE email_leads (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,
  discount_code TEXT,
  is_used INTEGER DEFAULT 0,
  used_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## How to View Captured Emails

### Method 1: Run the View Script
```bash
node scripts/view-email-leads.cjs
```

This will show:
- All captured emails
- Their discount codes
- Source (welcome_popup, pricing_access, brochure_download)
- Whether discount was used
- Capture date/time

### Method 2: Direct Database Query
```bash
# Using SQLite command line
sqlite3 tomobilti.db "SELECT * FROM email_leads;"

# Or with better formatting
sqlite3 tomobilti.db -header -column "SELECT email, discount_code, source, created_at FROM email_leads ORDER BY created_at DESC;"
```

### Method 3: Database Browser
Use a SQLite browser tool like:
- DB Browser for SQLite (https://sqlitebrowser.org/)
- Open `tomobilti.db` file
- Navigate to `email_leads` table

## Export Emails for Marketing

### Export to CSV
```bash
sqlite3 tomobilti.db -header -csv "SELECT email, discount_code, source, created_at FROM email_leads;" > email_leads.csv
```

### Export to JSON
```bash
sqlite3 tomobilti.db -json "SELECT * FROM email_leads;" > email_leads.json
```

## API Endpoint

### Capture Email
```
POST /api/email-leads
Content-Type: application/json

{
  "email": "user@example.com",
  "source": "welcome_popup"
}

Response:
{
  "message": "Email captured successfully",
  "discountCode": "WELCOMEABC123"
}
```

## Data Fields Explained

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (UUID) |
| `email` | User's email address (unique) |
| `source` | Where email was captured (welcome_popup, pricing_access, brochure_download) |
| `discount_code` | Generated 10% discount code (e.g., WELCOMEABC123) |
| `is_used` | Whether discount code was used (0 = no, 1 = yes) |
| `used_at` | Timestamp when discount was used |
| `created_at` | When email was captured |

## Marketing Use Cases

### 1. Email Campaigns
- Export emails to CSV
- Import to Mailchimp, SendGrid, etc.
- Send targeted campaigns

### 2. Retargeting
- Segment by source
- Track discount usage
- Follow up with non-converters

### 3. Analytics
- Track conversion rates
- Measure popup effectiveness
- A/B test different sources

## Privacy & GDPR Compliance

⚠️ **Important**: 
- Users consent to marketing emails when submitting
- Include unsubscribe option in all emails
- Honor unsubscribe requests immediately
- Delete data upon request
- Comply with GDPR/UK data protection laws

## Troubleshooting

### No emails showing up?
1. Check if table exists: `node scripts/view-email-leads.cjs`
2. Check server logs for errors
3. Verify API endpoint is working: `curl -X POST http://localhost:5000/api/email-leads -H "Content-Type: application/json" -d '{"email":"test@test.com","source":"welcome_popup"}'`

### Duplicate email error?
- Email addresses are unique
- Same email can't be captured twice
- This prevents spam and duplicate entries
