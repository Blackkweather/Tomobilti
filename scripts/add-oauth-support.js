import Database from 'better-sqlite3';

const db = new Database('tomobilti.db');

console.log('🔄 Adding OAuth support to users table...');

try {
  // Add OAuth provider columns
  const migrations = [
    "ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0",
    "ALTER TABLE users ADD COLUMN google_id TEXT",
    "ALTER TABLE users ADD COLUMN facebook_id TEXT", 
    "ALTER TABLE users ADD COLUMN apple_id TEXT",
    "ALTER TABLE users ADD COLUMN github_id TEXT",
    "ALTER TABLE users ADD COLUMN updated_at TEXT DEFAULT CURRENT_TIMESTAMP"
  ];

  for (const migration of migrations) {
    try {
      db.exec(migration);
      console.log(`✅ Executed: ${migration}`);
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log(`⚠️  Column already exists: ${migration}`);
      } else {
        console.error(`❌ Error: ${migration}`, error.message);
      }
    }
  }

  // Create indexes for OAuth providers
  const indexes = [
    "CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)",
    "CREATE INDEX IF NOT EXISTS idx_users_facebook_id ON users(facebook_id)",
    "CREATE INDEX IF NOT EXISTS idx_users_apple_id ON users(apple_id)",
    "CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id)"
  ];

  for (const index of indexes) {
    try {
      db.exec(index);
      console.log(`✅ Created index: ${index}`);
    } catch (error) {
      console.error(`❌ Index error: ${index}`, error.message);
    }
  }

  // Update existing users to have is_verified = true
  const updateResult = db.prepare(`
    UPDATE users 
    SET is_verified = 1, updated_at = CURRENT_TIMESTAMP 
    WHERE is_verified IS NULL OR is_verified = 0
  `).run();

  console.log(`✅ Updated ${updateResult.changes} users to verified status`);

  // Verify the schema
  const schema = db.prepare("PRAGMA table_info(users)").all();
  console.log('📋 Updated users table schema:');
  schema.forEach((column) => {
    console.log(`  - ${column.name}: ${column.type} ${column.notnull ? 'NOT NULL' : ''} ${column.dflt_value ? `DEFAULT ${column.dflt_value}` : ''}`);
  });

  console.log('🎉 OAuth migration completed successfully!');

} catch (error) {
  console.error('❌ Migration failed:', error);
} finally {
  db.close();
}
