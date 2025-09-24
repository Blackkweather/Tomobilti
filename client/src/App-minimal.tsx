import React from 'react';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f8f0',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <nav style={{ 
        backgroundColor: '#2d5a27', 
        color: 'white', 
        padding: '1rem',
        marginBottom: '2rem',
        borderRadius: '8px'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          🚗 Tomobilti - Version Minimale
        </h1>
      </nav>
      
      <main>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#2d5a27', marginBottom: '1rem' }}>
            ✅ Version Minimale Fonctionnelle !
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            Cette version ne contient que le strict minimum pour identifier le problème.
          </p>
          
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: '#e8f5e8', 
            borderRadius: '4px',
            border: '1px solid #2d5a27'
          }}>
            <h3 style={{ color: '#2d5a27', marginTop: 0 }}>🔧 Diagnostic :</h3>
            <ul style={{ color: '#333' }}>
              <li>✅ React fonctionne</li>
              <li>✅ Serveur répond</li>
              <li>✅ HTML se charge</li>
              <li>❓ Problème dans les composants complexes</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

