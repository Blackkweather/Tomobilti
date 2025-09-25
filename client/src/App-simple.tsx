import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#2d5a27', fontSize: '2rem', marginBottom: '20px' }}>
        🚗 Tomobilti - Location de Voitures au Maroc
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#333' }}>
        Bienvenue sur la plateforme de location de voitures entre particuliers au Maroc !
      </p>
      <div style={{ marginTop: '20px' }}>
        <button style={{ 
          backgroundColor: '#2d5a27', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '5px',
          marginRight: '10px',
          cursor: 'pointer'
        }}>
          Voir les Voitures
        </button>
        <button style={{ 
          backgroundColor: '#4a7c59', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Se Connecter
        </button>
      </div>
    </div>
  );
}

export default App;









