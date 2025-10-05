const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const db = new Database('tomobilti.db');

console.log('🔐 CREATING TEST USER WITH KNOWN PASSWORD');
console.log('=========================================');

const email = 'testuser@example.com';
const password = 'password123';
const firstName = 'Test';
const lastName = 'User';

// Check if user already exists
const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
if (existingUser) {
  console.log(`❌ User with email ${email} already exists!`);
  console.log('✅ You can use this email with password: password123');
} else {
  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 12);
  
  // Create user
  const userId = crypto.randomUUID();
  const insertUser = db.prepare(`
    INSERT INTO users (
      id, email, password, first_name, last_name, 
      phone, user_type, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  try {
    insertUser.run(
      userId,
      email,
      hashedPassword,
      firstName,
      lastName,
      '+44 123 456 7890',
      'user',
      new Date().toISOString(),
      new Date().toISOString()
    );
    
    console.log('✅ TEST USER CREATED SUCCESSFULLY!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`User ID: ${userId}`);
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
}

console.log('\n🎯 READY-TO-USE LOGIN CREDENTIALS:');
console.log('==================================');
console.log('Email: testuser@example.com');
console.log('Password: password123');

db.close();





















