import twilio from 'twilio';

// Test Twilio SMS Service
async function testTwilioSMS() {
  console.log('🧪 Testing Twilio SMS Service...\n');

  // Configuration from environment variables
  const config = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  };

  // Test phone number (US number for trial testing)
  const testPhoneNumber = '+13213620855'; // Your cousin's number

  try {
    console.log('🔗 Initializing Twilio client...');
    const client = twilio(config.accountSid, config.authToken);

    console.log('📤 Sending test SMS...');
    console.log(`📱 To: ${testPhoneNumber}`);
    console.log(`📱 From: ${config.phoneNumber}`);
    
    const message = `🔐 ShareWheelz Verification Code\n\nYour verification code is: 130013\n\nThis code expires in 10 minutes.\nDo not share this code with anyone.`;
    console.log(`📝 Message: ${message}\n`);

    const result = await client.messages.create({
      body: message,
      from: config.phoneNumber,
      to: testPhoneNumber
    });

    console.log('✅ SMS sent successfully!');
    console.log('📊 Response:', JSON.stringify({
      messageId: result.sid,
      status: result.status,
      price: result.price,
      priceUnit: result.priceUnit,
      dateCreated: result.dateCreated
    }, null, 2));

    console.log(`\n📋 Message Details:`);
    console.log(`   Message ID: ${result.sid}`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Price: ${result.price} ${result.priceUnit}`);
    console.log(`   Created: ${result.dateCreated}`);

  } catch (error) {
    console.error('❌ SMS test failed!');
    
    if (error.code) {
      console.error(`🔢 Error Code: ${error.code}`);
    }
    
    if (error.message) {
      console.error(`💥 Error Message: ${error.message}`);
    }
    
    if (error.moreInfo) {
      console.error(`ℹ️  More Info: ${error.moreInfo}`);
    }
  }
}

// Test account balance
async function testTwilioAccount() {
  console.log('🔗 Testing Twilio Account...\n');

  const config = {
    accountSid: 'ACd605e7802eaa975f4f1c2ba59b4b1f6c', // Your actual Account SID
    authToken: '9e828ebb528c84ee0ba95225f3d23ef0'     // Your actual Auth Token
  };

  try {
    const client = twilio(config.accountSid, config.authToken);
    
    console.log('💰 Fetching account information...');
    const account = await client.api.accounts(config.accountSid).fetch();
    
    console.log('✅ Account information retrieved!');
    console.log('📊 Account Details:', JSON.stringify({
      friendlyName: account.friendlyName,
      status: account.status,
      type: account.type,
      dateCreated: account.dateCreated
    }, null, 2));

  } catch (error) {
    console.error('❌ Account test failed!');
    
    if (error.code) {
      console.error(`🔢 Error Code: ${error.code}`);
    }
    
    if (error.message) {
      console.error(`💥 Error Message: ${error.message}`);
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Twilio SMS Tests\n');
  console.log('=' .repeat(50));
  
  await testTwilioAccount();
  
  console.log('\n' + '=' .repeat(50));
  
  await testTwilioSMS();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Tests completed!');
  console.log('\n✅ Using environment variables for Twilio credentials');
}

// Load environment variables
import 'dotenv/config';

// Validate environment variables
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  console.error('💥 Missing Twilio credentials in environment variables!');
  console.error('Make sure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER are set in your .env file.');
  process.exit(1);
}

runTests().catch(console.error);
