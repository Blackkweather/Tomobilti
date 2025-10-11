import React from 'react';
import { Switch, Route } from "wouter";

// Minimal test App to isolate the issue
function App() {
  console.log('🚀 Minimal App rendering...');
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>🚗 ShareWheelz - Minimal Test</h1>
      <p>If you can see this, React is working!</p>
      <p>Time: {new Date().toLocaleString()}</p>
      
      <Switch>
        <Route path="/" component={() => (
          <div>
            <h2>Home Page</h2>
            <p>Welcome to ShareWheelz!</p>
            <p>This is a minimal test to verify React is working.</p>
            <a href="/test" style={{ color: 'white', textDecoration: 'underline' }}>
              Go to Test Page
            </a>
          </div>
        )} />
        <Route path="/test" component={() => (
          <div>
            <h2>Test Page</h2>
            <p>This is a test page to verify routing works.</p>
            <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>
              Go Back Home
            </a>
          </div>
        )} />
        <Route component={() => (
          <div>
            <h2>404 - Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>
              Go Home
            </a>
          </div>
        )} />
      </Switch>
      
      <div style={{ marginTop: '50px', fontSize: '0.9em', opacity: 0.8 }}>
        <p>✅ React is working</p>
        <p>✅ Routing is working</p>
        <p>✅ Server is responding</p>
        <p>✅ Assets are loading</p>
      </div>
    </div>
  );
}

export default App;