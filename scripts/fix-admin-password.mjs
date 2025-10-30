import bcrypt from 'bcrypt';
import { DatabaseStorage } from '../server/db.ts';
import { config } from 'dotenv';

// Load env vars
config();

async function fixAdmin() {
  const password = 'Admin123!';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('Generated hash:', hash);
  
  const storage = new DatabaseStorage();
  
  // Get user
  const user = await storage.getUserByEmail('admin@sharewheelz.uk');
  
  if (!user) {
    console.log('Admin user not found, creating...');
    const newUser = await storage.createUser({
      email: 'admin@sharewheelz.uk',
      password: hash,
      firstName: 'Admin',
      lastName: 'User',
      userType: 'admin'
    });
    console.log('Created:', newUser.email, newUser.userType);
  } else {
    console.log('Found admin user:', user.email, user.userType);
    console.log('Updating password...');
    
    const updated = await storage.updateUser(user.id, {
      password: hash
    });
    
    console.log('Password updated!');
    
    // Test login
    const testLogin = await storage.verifyPassword('admin@sharewheelz.uk', password);
    console.log('Login test:', testLogin ? '✅ SUCCESS' : '❌ FAILED');
  }
  
  console.log('\n✅ Done!');
  console.log('Email: admin@sharewheelz.uk');
  console.log('Password: Admin123!');
  
  process.exit(0);
}

fixAdmin().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});


