
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SyncService from './services/SyncService';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SyncService /> {/* 👈 Lo agregas aquí para que funcione en toda la app */}
    <App />
  </React.StrictMode>
);