// Quick test for email-leads endpoint
const testEmail = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/email-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        source: 'welcome_popup'
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', response.headers.get('content-type'));
    
    const text = await response.text();
    console.log('Response:', text);

    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = JSON.parse(text);
      console.log('✅ Success! Discount code:', data.discountCode);
    } else {
      console.log('❌ Error: Server returned HTML instead of JSON');
      console.log('This means the route is not registered.');
      console.log('\n🔧 Solution: Restart the server with: npm run dev');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testEmail();
