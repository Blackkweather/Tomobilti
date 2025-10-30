const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const path = require('path');

async function updateAdmin() {
  const password = 'Admin123!';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('Hash generated:', hash);
  
  // Open SQLite database (same path as app uses)
  const dbPath = path.join(process.cwd(), 'tomobilti.db');
  console.log('Opening database:', dbPath);
  
  const db = new Database(dbPath);
  
  try {
    // Check if user exists
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@sharewheelz.uk');
    
    if (!user) {
      console.log('Admin user not found, creating...');
      const id = require('crypto').randomUUID();
      db.prepare(
        'INSERT INTO users (id, email, password, first_name, last_name, user_type) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(id, 'admin@sharewheelz.uk', hash, 'Admin', 'User', 'admin');
      console.log('✅ Admin user created!');
    } else {
      console.log('Found admin user:', user.email, user.user_type);
      console.log('Updating password...');
      
      db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hash, 'admin@sharewheelz.uk');
      
      console.log('✅ Password updated!');
      
      // Verify
      const updated = db.prepare('SELECT email, user_type, LENGTH(password) as pwd_len FROM users WHERE email = ?').get('admin@sharewheelz.uk');
      console.log('Verification:', updated);
      
      // Test hash
      const testResult = await bcrypt.compare(password, hash);
      console.log('Hash test:', testResult ? '✅ MATCHES' : '❌ FAILED');
    }
    
    console.log('\n✅ Complete!');
    console.log('Email: admin@sharewheelz.uk');
    console.log('Password: Admin123!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'SQLITE_CANTOPEN') {
      console.error('Database file not found. Make sure tomobilti.db exists in the project root.');
    }
  } finally {
    db.close();
  }
}

updateAdmin().catch(console.error);

