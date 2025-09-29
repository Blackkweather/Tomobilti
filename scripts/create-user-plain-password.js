// Create user with plain text password (let the system hash it)
import { storage } from '../server/storage.ts';

async function createUserWithPlainPassword() {
  try {
    const email = 'admin@sharewheelz.uk';
    const password = 'password123'; // Plain text password
    const firstName = 'Admin';
    const lastName = 'User';
    const phone = '+44 123 456 7890';
    
    console.log('=== CREATING USER WITH PLAIN TEXT PASSWORD ===');
    
    // Create new user with plain text password (let the system hash it)
    console.log('1. Creating user with plain text password...');
    const newUser = await storage.createUser({
      email,
      password, // Plain text - let the system hash it
      firstName,
      lastName,
      phone,
      userType: 'both'
    });
    
    console.log('2. User created successfully!');
    console.log('   ID:', newUser.id);
    console.log('   Email:', newUser.email);
    console.log('   UserType:', newUser.userType);
    console.log('   Password hash:', newUser.password.substring(0, 30) + '...');
    
    // Test login verification
    console.log('3. Testing password verification...');
    const loginTest = await storage.verifyPassword(email, password);
    
    if (loginTest) {
      console.log('4. ✅ Password verification SUCCESS!');
      console.log('\n=== LOGIN CREDENTIALS ===');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('User Type:', newUser.userType);
      console.log('\n🎉 You can now log in with these credentials!');
    } else {
      console.log('4. ❌ Password verification failed');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createUserWithPlainPassword();



