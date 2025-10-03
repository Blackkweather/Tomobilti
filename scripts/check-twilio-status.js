import twilio from 'twilio';

async function checkTwilioStatus() {
  const config = {
    accountSid: 'ACd605e7802eaa975f4f1c2ba59b4b1f6c',
    authToken: '9e828ebb528c84ee0ba95225f3d23ef0'
  };

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
