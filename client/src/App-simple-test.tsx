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
          🚗 Tomobilti - Test Simple
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
            ✅ Site fonctionnel !
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            Si vous voyez ce message, votre plateforme Tomobilti fonctionne correctement.
          </p>
          
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: '#e8f5e8', 
            borderRadius: '4px',
            border: '1px solid #2d5a27'
          }}>
            <h3 style={{ color: '#2d5a27', marginTop: 0 }}>🚀 Prochaines étapes :</h3>
            <ul style={{ color: '#333' }}>
              <li>Le serveur fonctionne sur le port 5000</li>
              <li>La base de données SQLite est opérationnelle</li>
              <li>L'API retourne les données correctement</li>
              <li>Le design responsive est en place</li>
            </ul>
          </div>
          
          <div style={{ 
            marginTop: '1rem', 
            textAlign: 'center' 
          }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                backgroundColor: '#2d5a27',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              🔄 Rafraîchir la page
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;


