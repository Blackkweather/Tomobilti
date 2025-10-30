const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function fixAdminLogin() {
  const password = 'Admin123!';
  
  // Generate fresh hash
  console.log('Generating password hash...');
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash generated:', hash.substring(0, 30) + '...');
  
  // Connect to database
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/Tomobilti'
  });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Get current user info
    const userResult = await client.query(
      'SELECT id, email, user_type, LENGTH(password) as pwd_len FROM users WHERE email = $1',
      ['admin@sharewheelz.uk']
    );
    
    if (userResult.rows.length === 0) {
      console.log('❌ Admin user not found! Creating one...');
      const insertResult = await client.query(`
        INSERT INTO users (email, password, first_name, last_name, user_type)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, user_type
      `, ['admin@sharewheelz.uk', hash, 'Admin', 'User', 'admin']);
      console.log('✅ Admin user created:', insertResult.rows[0]);
    } else {
      const user = userResult.rows[0];
      console.log('Found user:', {
        email: user.email,
        user_type: user.user_type,
        password_length: user.pwd_len
      });
      
      // Update password
      console.log('Updating password...');
      await client.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [hash, 'admin@sharewheelz.uk']
      );
      console.log('✅ Password updated!');
      
      // Verify the update
      const verifyResult = await client.query(
        'SELECT email, user_type, LENGTH(password) as pwd_len FROM users WHERE email = $1',
        ['admin@sharewheelz.uk']
      );
      console.log('Verification:', verifyResult.rows[0]);
      
      // Test the hash
      const testResult = await bcrypt.compare(password, hash);
      console.log('✅ Hash test result:', testResult ? 'MATCHES' : 'FAILED');
    }
    
    console.log('\n✅ Setup complete!');
    console.log('Email: admin@sharewheelz.uk');
    console.log('Password: Admin123!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Could not connect to database. Make sure PostgreSQL is running and DATABASE_URL is set.');
    }
  } finally {
    await client.end();
  }
}

fixAdminLogin().catch(console.error);

