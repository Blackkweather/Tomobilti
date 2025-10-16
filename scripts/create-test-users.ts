import { storage } from '../server/db';

async function createTestUsers() {
  console.log('🔧 Creating test users for login testing...\n');

  try {
    // Test credentials
    const testUsers = [
      {
        email: 'renter@test.com',
        password: 'Demo123!',
        firstName: 'Test',
        lastName: 'Renter',
        userType: 'renter' as const
      },
      {
        email: 'owner@test.com',
        password: 'Demo123!',
        firstName: 'Test',
        lastName: 'Owner',
        userType: 'owner' as const
      }
    ];

    for (const userData of testUsers) {
      try {
        // Check if user already exists
        const existing = await storage.getUserByEmail(userData.email);
        if (existing) {
          console.log(`✓ User ${userData.email} already exists (${userData.userType})`);
          continue;
        }

        // Create user
        const user = await storage.createUser(userData);
        console.log(`✅ Created ${userData.userType}: ${userData.email}`);
        console.log(`   Password: ${userData.password}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   ID: ${user.id}\n`);
      } catch (error: any) {
        console.error(`❌ Failed to create ${userData.email}:`, error.message);
      }
    }

    console.log('\n📋 Test Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Renter Account:');
    console.log('  Email: renter@test.com');
    console.log('  Password: Demo123!');
    console.log('  Expected redirect: /renter-dashboard');
    console.log('');
    console.log('Owner Account:');
    console.log('  Email: owner@test.com');
    console.log('  Password: Demo123!');
    console.log('  Expected redirect: /owner-dashboard');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestUsers();
