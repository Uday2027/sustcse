import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import './styles/global.css';

import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(13, 31, 60, 0.95)',
              color: '#f0f4f8',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            },
          }}
        />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
