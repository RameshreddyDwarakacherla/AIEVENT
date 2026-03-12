import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'

const defaultClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '111111111111-placeholder.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={defaultClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
