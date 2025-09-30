// Script to reset user password
import { storage } from '../server/storage.ts';
import bcrypt from 'bcrypt';

async function resetUserPassword() {
  try {
    const userId = 'fec2e768-5c5a-4961-93f1-a43011afdedb';
    const newPassword = 'password123'; // Simple password for testing
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Get current user
    const user = await storage.getUser(userId);
    console.log('Current user:', user);
    
    if (user) {
      // Update only the password, keeping everything else the same
      const updatedUser = await storage.updateUser(userId, {
        ...user,
        password: hashedPassword,
        userType: 'both' // Keep the userType as 'both'
      });
      
      console.log('Password reset successful!');
      console.log('New login credentials:');
      console.log('Email:', user.email);
      console.log('Password:', newPassword);
      console.log('User Type:', updatedUser.userType);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

resetUserPassword();






