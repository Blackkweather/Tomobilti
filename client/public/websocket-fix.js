// WebSocket Fix Script - Load this early to prevent undefined port connections
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  console.log('🔧 WebSocket Fix: Initializing global WebSocket override');
  
  // Store the original WebSocket constructor
  const OriginalWebSocket = window.WebSocket;
  
  // Override WebSocket constructor globally
  window.WebSocket = function(url, protocols) {
    const urlString = url.toString();
    
    console.log('🔌 WebSocket Fix: Connection attempt to:', urlString);
    
    // Check for undefined port in URL
    if (urlString.includes('undefined')) {
      console.warn('🚫 WebSocket Fix: Blocking connection with undefined port:', urlString);
      // Create a mock WebSocket that immediately closes
      const mockSocket = new OriginalWebSocket('ws://localhost:5000', protocols);
      setTimeout(() => mockSocket.close(), 0);
      return mockSocket;
    }
    
    // Allow valid connections
    console.log('✅ WebSocket Fix: Allowing valid connection:', urlString);
    return new OriginalWebSocket(url, protocols);
  };
  
  // Copy static properties from original WebSocket
  Object.setPrototypeOf(window.WebSocket, OriginalWebSocket);
  Object.setPrototypeOf(window.WebSocket.prototype, OriginalWebSocket.prototype);
  
  // Copy static properties
  Object.defineProperty(window.WebSocket, 'CONNECTING', {
    value: OriginalWebSocket.CONNECTING,
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  Object.defineProperty(window.WebSocket, 'OPEN', {
    value: OriginalWebSocket.OPEN,
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  Object.defineProperty(window.WebSocket, 'CLOSING', {
    value: OriginalWebSocket.CLOSING,
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  Object.defineProperty(window.WebSocket, 'CLOSED', {
    value: OriginalWebSocket.CLOSED,
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  console.log('✅ WebSocket Fix: Global override installed successfully');
})();