// Direct database password update
import { storage } from '../server/storage.ts';
import bcrypt from 'bcrypt';

async function directPasswordUpdate() {
  try {
    const userId = 'fec2e768-5c5a-4961-93f1-a43011afdedb';
    const email = 'test@example.com';
    const newPassword = 'password123';
    
    console.log('=== DIRECT PASSWORD UPDATE ===');
    
    // Create a fresh password hash
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log('1. Created fresh password hash:', hashedPassword.substring(0, 30) + '...');
    
    // Test the hash immediately
    const isValid = await bcrypt.compare(newPassword, hashedPassword);
    console.log('2. Hash verification test:', isValid);
    
    // Get the database instance and update directly
    const db = storage.db;
    if (db) {
      console.log('3. Updating password directly in database...');
      
      // Direct SQL update
      const result = await db.run(
        'UPDATE users SET password = ?, userType = ?, updatedAt = ? WHERE id = ?',
        [hashedPassword, 'both', new Date().toISOString(), userId]
      );
      
      console.log('4. Database update result:', result);
      
      // Verify the update
      const updatedUser = await storage.getUser(userId);
      if (updatedUser) {
        console.log('5. Verification - User found:', !!updatedUser);
        console.log('   Email:', updatedUser.email);
        console.log('   UserType:', updatedUser.userType);
        console.log('   Password hash:', updatedUser.password.substring(0, 30) + '...');
        
        // Test password verification
        const passwordValid = await bcrypt.compare(newPassword, updatedUser.password);
        console.log('6. Password verification:', passwordValid);
        
        if (passwordValid) {
          console.log('\n✅ SUCCESS! Login should work now.');
          console.log('\n=== LOGIN CREDENTIALS ===');
          console.log('Email:', email);
          console.log('Password:', newPassword);
        } else {
          console.log('\n❌ Password verification still failing');
        }
      }
    } else {
      console.log('❌ Database not available');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

directPasswordUpdate();























