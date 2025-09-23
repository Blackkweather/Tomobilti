import 'dotenv/config';
import postgres from 'postgres';

async function testConnection() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:brams324brams@localhost:5432/tomobilti';
  
  console.log('🔍 Testing database connection...');
  console.log('📊 Connection string:', connectionString.replace(/:[^:@]*@/, ':***@'));
  
  try {
    const sql = postgres(connectionString);
    
    // Test basic connection
    const result = await sql`SELECT version()`;
    console.log('✅ Database connection successful!');
    console.log('📋 PostgreSQL version:', result[0].version);
    
    // Test if database exists and is accessible
    const dbInfo = await sql`SELECT current_database(), current_user`;
    console.log('🗄️ Current database:', dbInfo[0].current_database);
    console.log('👤 Current user:', dbInfo[0].current_user);
    
    await sql.end();
    console.log('🎉 Connection test completed successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === '3D000') {
      console.log('💡 The database "tomobilti" does not exist. Please create it with:');
      console.log('   psql -U postgres -c "CREATE DATABASE tomobilti;"');
    } else if (error.code === '28P01') {
      console.log('💡 Authentication failed. Please check your username and password.');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('💡 Cannot connect to PostgreSQL server. Please check if:');
      console.log('   - PostgreSQL is running');
      console.log('   - The host and port are correct');
      console.log('   - Firewall is not blocking the connection');
    }
  }
}

testConnection();