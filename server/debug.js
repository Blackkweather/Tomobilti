// Debug script to check server binding
console.log('🔍 Debug Information:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('Host binding:', process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');

const port = parseInt(process.env.PORT || '5000', 10);
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';

console.log(`Server will bind to: ${host}:${port}`);
console.log('✅ Debug complete');
