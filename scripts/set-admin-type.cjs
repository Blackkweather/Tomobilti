const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

try {
  const result = db.prepare('UPDATE users SET user_type = ? WHERE email = ?').run('admin', 'admin@sharewheelz.uk');
  console.log('✅ Updated', result.changes, 'user(s) to admin type');
  
  const verify = db.prepare('SELECT email, user_type FROM users WHERE email = ?').get('admin@sharewheelz.uk');
  console.log('Verification:', verify);
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}


