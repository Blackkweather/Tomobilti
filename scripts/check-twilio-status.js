import twilio from 'twilio';

async function checkTwilioStatus() {
  // Load environment variables
  import('dotenv/config');
  
  const config = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN
  };

  if (!config.accountSid || !config.authToken) {
    console.error('�<｜tool▁sep｜>err> Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN in environment variables');
    return;
  }

  try {
    const client = twilio(config.accountSid, config.authToken);
    
    console.log('🔍 Checking Twilio Account Status...\n');
    
    // Check account details
    const account = await client.api.accounts(config.accountSid).fetch();
    console.log('✅ Account Status:', {
      friendlyName: account.friendlyName,
      status: account.status,
      type: account.type,
      dateCreated: account.dateCreated
    });
    
    // Check phone numbers
    console.log('\n📱 Checking Phone Numbers...');
    const numbers = await client.incomingPhoneNumbers.list();
    console.log('✅ Phone Numbers:');
    numbers.forEach(num => {
      console.log(`   ${num.phoneNumber} - ${num.smsEnabled ? '✅ SMS' : '❌ No SMS'}`);
    });
    
    // Try to check messaging settings
    console.log('\n🔧 Checking Messaging Settings...');
    try {
      const services = await client.messaging.v1.services.list();
      console.log('✅ Messaging Services:', services.length);
    } catch (error) {
      console.log('⚠️  Messaging API access:', error.code || 'Limited');
    }
    
    console.log('\n💡 Recommendations:');
    console.log('1. Upgrade from Trial account');
    console.log('2. Enable SMS capabilities in Phone Numbers settings');
    console.log('3. Verify phone numbers if required');
    
  } catch (error) {
    console.error('❌ Error checking status:', error.message);
  }
}

checkTwilioStatus().catch(console.error);
