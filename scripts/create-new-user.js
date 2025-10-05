// Create a new user account with working credentials
import { storage } from '../server/storage.ts';
import bcrypt from 'bcrypt';

async function createNewUser() {
  try {
    const email = 'test@example.com';
    const password = 'password123';
    const firstName = 'Test';
    const lastName = 'User';
    const phone = '+44 123 456 7890';
    
    console.log('=== CREATING NEW USER ACCOUNT ===');
    
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
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      console.log('3. User already exists, deleting old account...');
      await storage.deleteUser(existingUser.id);
    }
    
    // Create new user
    console.log('4. Creating new user account...');
    const newUser = await storage.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      userType: 'both'
    });
    
    console.log('5. User created successfully!');
    console.log('   ID:', newUser.id);
    console.log('   Email:', newUser.email);
    console.log('   UserType:', newUser.userType);
    
    // Verify the user can be retrieved and password works
    const retrievedUser = await storage.getUser(newUser.id);
    if (retrievedUser) {
      const passwordValid = await bcrypt.compare(password, retrievedUser.password);
      console.log('6. Password verification:', passwordValid);
      
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

createNewUser();























