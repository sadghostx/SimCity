import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// THIS IS THE CRITICAL LINE: It tells the app to load all the styles from App.css
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);