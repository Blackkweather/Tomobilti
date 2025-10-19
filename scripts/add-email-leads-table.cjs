const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('Adding email_leads table...');

try {
  // Create email_leads table
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_leads (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      email TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL CHECK(source IN ('welcome_popup', 'pricing_access', 'brochure_download')),
      discount_code TEXT,
      is_used INTEGER NOT NULL DEFAULT 0,
      used_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_email_leads_email ON email_leads(email);
    CREATE INDEX IF NOT EXISTS idx_email_leads_source ON email_leads(source);
    CREATE INDEX IF NOT EXISTS idx_email_leads_created_at ON email_leads(created_at);
  `);

  console.log('✅ Email leads table created successfully!');
  
  // Verify table exists
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='email_leads'").all();
  console.log('Tables found:', tables);
  
} catch (error) {
  console.error('❌ Error creating email_leads table:', error.message);
  process.exit(1);
} finally {
  db.close();
}
