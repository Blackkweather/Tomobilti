const { DatabaseStorage } = require('../server/db_sqlite_simple.ts');

const storage = new DatabaseStorage();

async function getUsers() {
  try {
    const users = await storage.getAllUsers();
    console.log('=== USERS IN DATABASE ===');
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   User Type: ${user.userType}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('   ---');
      });
    }
  } catch (error) {
    console.error('Error getting users:', error.message);
  }
}

getUsers();
