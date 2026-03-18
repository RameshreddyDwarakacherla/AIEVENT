import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'

const defaultClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '111111111111-placeholder.apps.googleusercontent.com';

// Add meta tag for Cross-Origin-Opener-Policy
const meta = document.createElement('meta');
meta.httpEquiv = 'Cross-Origin-Opener-Policy';
meta.content = 'same-origin-allow-popups';
document.head.appendChild(meta);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider 
      clientId={defaultClientId}
      onScriptLoadError={() => console.error('Google OAuth script failed to load')}
      onScriptLoadSuccess={() => console.log('Google OAuth script loaded successfully')}
    >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
