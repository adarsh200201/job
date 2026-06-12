import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import { initMixpanel } from './utils/analytics.js';
import { initAnalytics } from './services/analytics/index.js';

// Initialize Mixpanel + register global super-properties
initAnalytics();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
