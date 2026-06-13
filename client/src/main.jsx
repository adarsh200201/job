import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import { initAnalytics } from './services/analytics/index.js';

// Render the app immediately — no analytics blocking the first paint.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Initialize Mixpanel AFTER the browser finishes the first render + paint.
// requestIdleCallback defers until the main thread is free (up to 3s max).
// This keeps the 430KB Mixpanel chunk from blocking TTI / TBT.
if (typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(initAnalytics, { timeout: 3000 });
} else {
  setTimeout(initAnalytics, 2000);
}
