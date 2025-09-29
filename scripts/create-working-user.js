// Create a new user account with different email
import { storage } from '../server/storage.ts';
import bcrypt from 'bcrypt';

async function createWorkingUser() {
  try {
    const email = 'admin@sharewheelz.uk';
    const password = 'password123';
    const firstName = 'Admin';
    const lastName = 'User';
    const phone = '+44 123 456 7890';
    
    console.log('=== CREATING WORKING USER ACCOUNT ===');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('1. Password hashed successfully');
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('2. Hash verification test:', isValid);
    
    if (!isValid) {
      console.log('❌ Password hashing failed');
      return;
    }
    
    // Create new user
    console.log('3. Creating new user account...');
    const newUser = await storage.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      userType: 'both'
    });
    
    console.log('4. User created successfully!');
    console.log('   ID:', newUser.id);
    console.log('   Email:', newUser.email);
    console.log('   UserType:', newUser.userType);
    
    // Verify the user can be retrieved and password works
    const retrievedUser = await storage.getUser(newUser.id);
    if (retrievedUser) {
      const passwordValid = await bcrypt.compare(password, retrievedUser.password);
      console.log('5. Password verification:', passwordValid);
      
      if (passwordValid) {
        console.log('\n✅ SUCCESS! New account created and working.');
        console.log('\n=== LOGIN CREDENTIALS ===');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('User Type:', retrievedUser.userType);
        console.log('\nYou can now log in with these credentials!');
      } else {
        console.log('\n❌ Password verification failed');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createWorkingUser();



