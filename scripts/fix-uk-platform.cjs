const postgres = require('postgres');

async function fixUKPlatform() {
  console.log('🇬🇧 FIXING PLATFORM FOR UK - Updating locations and user names...');

  const sql = postgres('postgresql://postgres:brams324brams@localhost:5432/tomobilti', {
    ssl: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  try {
    // Update car locations to UK cities
    console.log('1. Updating car locations to UK cities...');
    await sql`UPDATE cars SET location = 'London, Westminster', city = 'London' WHERE make = 'Porsche' AND model = '911 F'`;
    await sql`UPDATE cars SET location = 'Manchester, City Centre', city = 'Manchester' WHERE make = 'Jaguar' AND model = 'F-Type'`;
    await sql`UPDATE cars SET location = 'Edinburgh, New Town', city = 'Edinburgh' WHERE make = 'Tesla' AND model = 'Model X'`;
    await sql`UPDATE cars SET location = 'Birmingham, City Centre', city = 'Birmingham' WHERE make = 'Jaguar' AND model = 'F-Pace Sport'`;
    await sql`UPDATE cars SET location = 'Liverpool, City Centre', city = 'Liverpool' WHERE make = 'Range Rover' AND model = 'Evoque Sport'`;
    await sql`UPDATE cars SET location = 'London, Mayfair', city = 'London' WHERE make = 'Ferrari' AND model = 'La Ferrari'`;

    // Update user names to UK names
    console.log('2. Updating user names to UK names...');
    await sql`UPDATE users SET first_name = 'James', last_name = 'Smith' WHERE first_name = 'Ahmed' AND last_name = 'Bennani'`;
    await sql`UPDATE users SET first_name = 'Oliver', last_name = 'Johnson' WHERE first_name = 'Youssef' AND last_name = 'Alami'`;
    await sql`UPDATE users SET first_name = 'Emma', last_name = 'Williams' WHERE first_name = 'Sara' AND last_name = 'Idrissi'`;

    // Verify all updates
    console.log('\n📊 VERIFYING UK PLATFORM UPDATES:');
    const cars = await sql`SELECT title, make, model, location, city, currency FROM cars ORDER BY created_at`;
    
    console.log('🚗 CARS WITH UK LOCATIONS:');
    cars.forEach((car, i) => {
      console.log(`${i+1}. ${car.title} (${car.make} ${car.model})`);
      console.log(`   Location: ${car.location}`);
      console.log(`   Currency: ${car.currency}`);
      console.log('');
    });

    const users = await sql`SELECT first_name, last_name FROM users`;
    console.log('👥 USERS WITH UK NAMES:');
    users.forEach((user, i) => {
      console.log(`${i+1}. ${user.first_name} ${user.last_name}`);
    });

    console.log('\n🎉 UK PLATFORM FIXED!');

  } catch (error) {
    console.error('❌ Error fixing UK platform:', error.message);
  } finally {
    await sql.end();
  }
}

fixUKPlatform();


















