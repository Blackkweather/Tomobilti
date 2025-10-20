import React from 'react';
import { Switch, Route } from "wouter";

// Minimal test App to see if the issue is with routing
function App() {
  console.log('🚀 Minimal App starting...');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚗 ShareWheelz - Test Page</h1>
      <p>If you can see this, the React app is working!</p>
      <p>Time: {new Date().toLocaleString()}</p>
      
      <Switch>
        <Route path="/" component={() => (
          <div>
            <h2>Home Page</h2>
            <p>Welcome to ShareWheelz!</p>
            <a href="/test">Go to Test Page</a>
          </div>
        )} />
        <Route path="/test" component={() => (
          <div>
            <h2>Test Page</h2>
            <p>This is a test page to verify routing works.</p>
            <a href="/">Go Back Home</a>
          </div>
        )} />
        <Route component={() => (
          <div>
            <h2>404 - Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">Go Home</a>
          </div>
        )} />
      </Switch>
    </div>
  );
}

export default App;




