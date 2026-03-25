import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
 <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="527520276679-u122prvp5mjtcp7h85kflce7g961hq9q.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
)
