import React from 'react';
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

console.log('🔍 ShareWheelz app starting...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
root.render(<App />);

console.log('✅ ShareWheelz app rendered successfully!');