// Debug and fix login issue
import { storage } from '../server/storage.ts';
import bcrypt from 'bcrypt';

async function debugAndFixLogin() {
  try {
    const userId = 'fec2e768-5c5a-4961-93f1-a43011afdedb';
    const email = 'test@example.com';
    const testPassword = 'password123';
    
    console.log('=== DEBUGGING LOGIN ISSUE ===');
    
    // 1. Check if user exists
    const user = await storage.getUser(userId);
    console.log('1. User found:', !!user);
    if (user) {
      console.log('   Email:', user.email);
      console.log('   UserType:', user.userType);
      console.log('   Password hash:', user.password.substring(0, 20) + '...');
    }
    
    // 2. Test password verification
    if (user) {
      const isValidPassword = await bcrypt.compare(testPassword, user.password);
      console.log('2. Password verification:', isValidPassword);
    }
    
    // 3. Create a fresh password hash
    console.log('3. Creating fresh password hash...');
    const freshHash = await bcrypt.hash(testPassword, 12);
    console.log('   Fresh hash:', freshHash.substring(0, 20) + '...');
    
    // 4. Test the fresh hash
    const freshHashValid = await bcrypt.compare(testPassword, freshHash);
    console.log('4. Fresh hash verification:', freshHashValid);
    
    // 5. Update user with fresh password
    if (user) {
      console.log('5. Updating user with fresh password...');
      const updatedUser = await storage.updateUser(userId, {
        ...user,
        password: freshHash,
        userType: 'both'
      });
      
      console.log('   Update successful!');
      console.log('   New password hash:', updatedUser.password.substring(0, 20) + '...');
      
      // 6. Test the updated password
      const updatedPasswordValid = await bcrypt.compare(testPassword, updatedUser.password);
      console.log('6. Updated password verification:', updatedPasswordValid);
      
      console.log('\n=== LOGIN CREDENTIALS ===');
      console.log('Email:', email);
      console.log('Password:', testPassword);
      console.log('User Type:', updatedUser.userType);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugAndFixLogin();


















