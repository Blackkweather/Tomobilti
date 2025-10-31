import { config } from 'dotenv';
config();

const BASE_URL = 'https://sharewheelz.uk';

// Login as admin to get token
async function loginAdmin() {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@sharewheelz.uk',
      password: 'Admin123!'
    })
  });
  
  if (!response.ok) {
    throw new Error('Admin login failed');
  }
  
  const data = await response.json();
  return data.token;
}

// Get all users
async function getAllUsers(token) {
  const response = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return response.json();
}

// Reset user password
async function resetPassword(token, userId, newPassword) {
  const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/reset-password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ newPassword })
  });
  
  const text = await response.text();
  console.log(`   Response status: ${response.status}`);
  console.log(`   Response body: ${text.substring(0, 200)}`);
  
  if (!response.ok) {
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      error = { error: text.substring(0, 100) };
    }
    throw new Error(error.error || 'Failed to reset password');
  }
  
  return JSON.parse(text);
}

// Main function
async function main() {
  try {
    console.log('🔐 Resetting test account passwords...\n');
    
    // Login as admin
    console.log('1. Logging in as admin...');
    const token = await loginAdmin();
    console.log('✅ Admin login successful\n');
    
    // Get all users
    console.log('2. Fetching all users...');
    const users = await getAllUsers(token);
    console.log(`✅ Found ${users.length} users\n`);
    
    // Define password mapping
    const passwordMap = {
      // Owners
      'testowner@sharewheelz.uk': 'TestOwner123!',
      'owner@test.com': 'OwnerTest123!',
      'marcohemma5@gmail.com': 'MarcoOwner123!',
      
      // Renters
      'testrenter@sharewheelz.uk': 'TestRenter123!',
      'localtest@test.com': 'LocalTest123!',
      'test.user@example.com': 'TestUser123!',
      'test@example.com': 'TestUser123!',
      'test.user.demo+1@example.com': 'TestUser123!',
      'testuser@example.com': 'TestUser123!',
    };
    
    // Reset passwords
    const results = [];
    console.log('3. Resetting passwords...\n');
    
    for (const user of users) {
      if (passwordMap[user.email]) {
        const newPassword = passwordMap[user.email];
        try {
          await resetPassword(token, user.id, newPassword);
          results.push({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            type: user.userType,
            password: newPassword,
            status: '✅ SUCCESS'
          });
          console.log(`✅ Reset password for: ${user.email} → ${newPassword}`);
        } catch (error) {
          results.push({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            type: user.userType,
            password: newPassword,
            status: `❌ FAILED: ${error.message}`
          });
          console.log(`❌ Failed to reset password for: ${user.email} - ${error.message}`);
        }
      }
    }
    
    console.log('\n📋 SUMMARY:');
    console.log('='.repeat(60));
    results.forEach(r => {
      console.log(`${r.status} ${r.email} (${r.type}) → ${r.password}`);
    });
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

