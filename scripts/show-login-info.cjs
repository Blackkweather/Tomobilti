const Database = require('better-sqlite3');
const db = new Database('tomobilti.db');

console.log('🔐 LOGIN CREDENTIALS FOR TESTING');
console.log('===============================');

const users = db.prepare('SELECT email, password FROM users').all();
users.forEach((user, index) => {
  console.log(`${index + 1}. Email: ${user.email}`);
  console.log(`   Password: [Hashed - try common passwords]`);
  console.log('   ---');
});

console.log('\n💡 COMMON TEST PASSWORDS TO TRY:');
console.log('================================');
console.log('- password123');
console.log('- password');
console.log('- 123456');
console.log('- admin');
console.log('- test');

console.log('\n🎯 RECOMMENDED LOGIN COMBINATIONS:');
console.log('=================================');
console.log('1. Email: user@test.com');
console.log('   Password: password123 (most likely)');
console.log('');
console.log('2. Email: test@example.com');
console.log('   Password: password123 (most likely)');
console.log('');
console.log('3. Email: admin@sharewheelz.com');
console.log('   Password: password123 (most likely)');
console.log('');
console.log('4. Email: john.smith@example.com');
console.log('   Password: password123 (most likely)');

db.close();




















