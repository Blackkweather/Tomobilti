import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('Fetching all users from database...');

try {
  // Get all users
  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  
  console.log(`\nFound ${users.length} users:\n`);
  
  users.forEach((user, index) => {
    console.log(`${index + 1}. User ID: ${user.id}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Type: ${user.type || 'user'}`);
    console.log(`   Created: ${user.created_at || 'Unknown'}`);
    console.log(`   Verified: ${user.isVerified ? 'Yes' : 'No'}`);
    console.log('   ---');
  });
  
  // Summary
  console.log(`\nSummary:`);
  console.log(`- Total users: ${users.length}`);
  console.log(`- Verified users: ${users.filter(u => u.isVerified).length}`);
  console.log(`- Unverified users: ${users.filter(u => !u.isVerified).length}`);
  
} catch (error) {
  console.error('❌ Error fetching users:', error.message);
} finally {
  db.close();
}

console.log('\nUser list completed!');

