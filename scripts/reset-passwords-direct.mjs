import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to SQLite database
const dbPath = path.join(process.cwd(), 'tomobilti.db');
console.log('📂 Database path:', dbPath);

// Password mapping
const passwordMap = {
  // Owners
  'testowner@sharewheelz.uk': 'TestOwner123!',
  'owner@test.com': 'OwnerTest123!',
  'marcohemma5@gmail.com': 'MarcoOwner123!',
  
  // Renters
  'testrenter@sharewheelz.uk': 'TestRenter123!',
  'localtest@test.com': 'LocalTest123!',
  'test.user@example.com': 'TestUser123!',
  'test@example.com': 'TestUser123!',
  'test.user.demo+1@example.com': 'TestUser123!',
  'testuser@example.com': 'TestUser123!',
};

async function resetPasswords() {
  console.log('🔐 Resetting passwords directly in database...\n');
  
  const db = new Database(dbPath);
  
  try {
    const results = [];
    
    for (const [email, newPassword] of Object.entries(passwordMap)) {
      try {
        // Check if user exists
        const user = db.prepare('SELECT id, email, first_name, last_name, user_type FROM users WHERE email = ?').get(email);
        
        if (!user) {
          console.log(`⚠️  User not found: ${email}`);
          results.push({ email, status: 'NOT FOUND', password: newPassword });
          continue;
        }
        
        // Hash the new password
        const hash = await bcrypt.hash(newPassword, 10);
        
        // Update password
        const stmt = db.prepare('UPDATE users SET password = ? WHERE email = ?');
        stmt.run(hash, email);
        
        // Verify the update
        const updated = db.prepare('SELECT email, LENGTH(password) as pwd_len FROM users WHERE email = ?').get(email);
        
        // Test hash
        const testHash = db.prepare('SELECT password FROM users WHERE email = ?').get(email).password;
        const testResult = await bcrypt.compare(newPassword, testHash);
        
        if (testResult) {
          console.log(`✅ Reset password for: ${email} (${user.user_type}) → ${newPassword}`);
          results.push({
            email,
            name: `${user.first_name} ${user.last_name}`,
            type: user.user_type,
            password: newPassword,
            status: '✅ SUCCESS'
          });
        } else {
          console.log(`❌ Password hash verification failed for: ${email}`);
          results.push({ email, status: 'VERIFICATION FAILED', password: newPassword });
        }
      } catch (error) {
        console.log(`❌ Error resetting password for ${email}: ${error.message}`);
        results.push({ email, status: `❌ ERROR: ${error.message}`, password: newPassword });
      }
    }
    
    console.log('\n📋 SUMMARY:');
    console.log('='.repeat(70));
    results.forEach(r => {
      if (r.status === '✅ SUCCESS') {
        console.log(`✅ ${r.email} (${r.type}) → ${r.password}`);
      } else {
        console.log(`${r.status} ${r.email} → ${r.password}`);
      }
    });
    console.log('='.repeat(70));
    
    const successCount = results.filter(r => r.status === '✅ SUCCESS').length;
    console.log(`\n✅ Successfully reset ${successCount} out of ${results.length} passwords\n`);
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

resetPasswords().catch(console.error);

