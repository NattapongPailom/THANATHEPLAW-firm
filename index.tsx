
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { backendService } from './src/services/backend';

// Expose backendService to window for debugging
(window as any).backendService = backendService;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
