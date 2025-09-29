const Database = require('better-sqlite3');
const db = new Database('tomobilti.db');

console.log('🚗 AVAILABLE CARS AND OWNERS:');
console.log('============================');

const cars = db.prepare('SELECT id, title, owner_id, isAvailable FROM cars').all();
cars.forEach((car, index) => {
  const owner = db.prepare('SELECT firstName, lastName, email FROM users WHERE id = ?').get(car.owner_id);
  console.log(`${index + 1}. ${car.title}`);
  console.log(`   Owner: ${owner?.firstName || 'N/A'} ${owner?.lastName || 'N/A'} (${owner?.email})`);
  console.log(`   Available: ${car.isAvailable ? 'Yes' : 'No'}`);
  console.log(`   Car ID: ${car.id}`);
  console.log('   ---');
});

console.log('\n👥 AVAILABLE USERS FOR TESTING:');
console.log('===============================');

const users = db.prepare('SELECT id, firstName, lastName, email FROM users').all();
users.forEach((user, index) => {
  console.log(`${index + 1}. ${user.firstName || 'N/A'} ${user.lastName || 'N/A'} (${user.email})`);
  console.log(`   User ID: ${user.id}`);
  console.log('   ---');
});

db.close();
