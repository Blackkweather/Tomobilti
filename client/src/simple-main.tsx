// Minimal React test
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

console.log('Simple main starting...');

function SimpleApp() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{fontSize: '3rem', marginBottom: '2rem'}}>
        🚗 ShareWheelz Works!
      </h1>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '2rem',
        borderRadius: '1rem',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <h2>✅ React State Working</h2>
        <p style={{fontSize: '1.5rem'}}>Count: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            fontSize: '1.2rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Click Me! (+{count})
        </button>
        
        <div style={{marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem'}}>
          <h3>💰 Promotional Test</h3>
          <p>Earn up to £280/month from your car!</p>
          <p>Weekend rental = Insurance paid!</p>
        </div>
      </div>
    </div>
  );
}

console.log('Mounting simple app...');
const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  console.log('Rendering...');
  root.render(<SimpleApp />);
  console.log('Simple app rendered successfully!');
} else {
  console.error('Root element not found!');
  document.body.innerHTML += '<div style="background:red;color:white;padding:20px;">❌ Root element not found!</div>';
}
