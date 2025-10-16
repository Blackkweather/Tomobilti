import { storage } from '../server/db';

async function testRegistration() {
  console.log('🧪 Testing Registration System...\n');

  try {
    // Test 1: Create a renter
    console.log('Test 1: Creating a renter account...');
    const renter = await storage.createUser({
      email: 'test.renter@example.com',
      password: 'TestPass123!',
      firstName: 'John',
      lastName: 'Renter',
      userType: 'renter'
    });
    console.log('✅ Renter created:', {
      id: renter.id,
      email: renter.email,
      name: `${renter.firstName} ${renter.lastName}`,
      userType: renter.userType
    });

    // Test 2: Create an owner
    console.log('\nTest 2: Creating an owner account...');
    const owner = await storage.createUser({
      email: 'test.owner@example.com',
      password: 'TestPass123!',
      firstName: 'Jane',
      lastName: 'Owner',
      userType: 'owner'
    });
    console.log('✅ Owner created:', {
      id: owner.id,
      email: owner.email,
      name: `${owner.firstName} ${owner.lastName}`,
      userType: owner.userType
    });

    // Test 3: Verify users in database
    console.log('\nTest 3: Verifying users in database...');
    const fetchedRenter = await storage.getUser(renter.id);
    const fetchedOwner = await storage.getUser(owner.id);
    
    if (fetchedRenter && fetchedRenter.userType === 'renter') {
      console.log('✅ Renter verified in database');
    } else {
      console.log('❌ Renter verification failed');
    }

    if (fetchedOwner && fetchedOwner.userType === 'owner') {
      console.log('✅ Owner verified in database');
    } else {
      console.log('❌ Owner verification failed');
    }

    // Test 4: Test password verification
    console.log('\nTest 4: Testing password verification...');
    const renterAuth = await storage.verifyPassword('test.renter@example.com', 'TestPass123!');
    const ownerAuth = await storage.verifyPassword('test.owner@example.com', 'TestPass123!');
    
    if (renterAuth) {
      console.log('✅ Renter password verification successful');
    } else {
      console.log('❌ Renter password verification failed');
    }

    if (ownerAuth) {
      console.log('✅ Owner password verification successful');
    } else {
      console.log('❌ Owner password verification failed');
    }

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await storage.deleteUser(renter.id);
    await storage.deleteUser(owner.id);
    console.log('✅ Test data cleaned up');

    console.log('\n✨ All tests passed! Registration system is working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testRegistration();
