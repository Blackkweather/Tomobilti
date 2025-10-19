-- Add email_leads table for marketing and retargeting
CREATE TABLE IF NOT EXISTS email_leads (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL CHECK(source IN ('welcome_popup', 'pricing_access', 'brochure_download')),
  discount_code TEXT,
  is_used INTEGER NOT NULL DEFAULT 0,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_email_leads_email ON email_leads(email);
CREATE INDEX IF NOT EXISTS idx_email_leads_source ON email_leads(source);
CREATE INDEX IF NOT EXISTS idx_email_leads_created_at ON email_leads(created_at);
