const bcrypt = require('bcrypt');

async function testPassword() {
  const password = 'Admin123!';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log('Generated hash:', hashedPassword);
  
  // Test that it works
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('Password matches hash:', isValid);
  
  // Test with the hash we provided earlier
  const providedHash = '$2b$10$oO.SVtK0woN8.BYG5uRdiemRtx9QbPDQVUUBxl3wUMT.VZO4OGEty';
  const isValidProvided = await bcrypt.compare(password, providedHash);
  console.log('Password matches provided hash:', isValidProvided);
}

testPassword().catch(console.error);

