import 'dotenv/config';
import { DatabaseStorage } from '../server/db.js';

const storage = new DatabaseStorage();

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    const testUser = await storage.createUser({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '+44 123 456 7890',
      userType: 'renter'
    });
    
    console.log('✅ Test user created successfully!');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('User ID:', testUser.id);
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  }
}

createTestUser();
