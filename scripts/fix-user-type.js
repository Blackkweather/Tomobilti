// Quick script to check and update user type
import { storage } from '../server/storage.ts';

async function checkAndUpdateUser() {
  try {
    const userId = 'fec2e768-5c5a-4961-93f1-a43011afdedb';
    
    // Get current user
    const user = await storage.getUser(userId);
    console.log('Current user:', user);
    
    if (user) {
      // Update user type to 'both' so they can be both renter and owner
      const updatedUser = await storage.updateUser(userId, {
        ...user,
        userType: 'both'
      });
      
      console.log('Updated user:', updatedUser);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAndUpdateUser();
