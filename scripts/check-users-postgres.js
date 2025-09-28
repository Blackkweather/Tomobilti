import 'dotenv/config';
import postgres from 'postgres';

async function getUsers() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:brams324brams@localhost:5432/tomobilti';
  
  try {
    const sql = postgres(connectionString);
    
    console.log('=== USERS IN DATABASE ===');
    
    // Get all users
    const users = await sql`
      SELECT id, email, first_name, last_name, user_type, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Name: ${user.first_name} ${user.last_name}`);
        console.log(`   User Type: ${user.user_type}`);
        console.log(`   Created: ${user.created_at}`);
        console.log('   ---');
      });
    }
    
    await sql.end();
  } catch (error) {
    console.error('Error getting users:', error.message);
  }
}

getUsers();
