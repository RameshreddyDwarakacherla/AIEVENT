import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../lib/api';

/**
 * Alternative Google Auth implementation using Google Identity Services directly
 * This bypasses the @react-oauth/google library to avoid redirect_uri issues
 */
export const useGoogleAuthDirect = ({ mode = 'login', role = 'user' } = {}) => {
  const { refreshSession } = useAuth();
  const navigate = useNavigate();

  const handleGoogleResponse = async (response) => {
    try {
      console.log('Google credential response:', response);
      
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      // Decode the JWT credential to get user info
      const credential = response.credential;
      
      // Send credential to backend
      console.log('Sending credential to backend...');
      const backendResponse = await api.post('/auth/google-credential', { 
        credential,
        role 
      });
      
      console.log('Backend response:', backendResponse);

      if (backendResponse.success && backendResponse.data?.accessToken) {
        // Store JWT and refresh token
        api.setToken(backendResponse.data.accessToken);
        localStorage.setItem('authToken', backendResponse.data.accessToken);
        if (backendResponse.data.refreshToken) {
          localStorage.setItem('refreshToken', backendResponse.data.refreshToken);
        }
        localStorage.setItem('userRole', backendResponse.data.user?.role || role);

        await refreshSession();

        toast.success(
          `✅ Successfully ${mode === 'login' ? 'logged in' : 'registered'} with Google!`
        );

        // Navigate based on role
        const userRole = backendResponse.data.user?.role || role;
        const dashboardPath =
          userRole === 'vendor' ? '/dashboard/vendor' :
          userRole === 'admin'  ? '/dashboard/admin'  :
          '/dashboard/user';

        console.log('Navigating to:', dashboardPath);
        navigate(dashboardPath, { replace: true });
      } else {
        console.error('Backend response error:', backendResponse);
        toast.error(backendResponse?.message || 'Google authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Google Auth Error:', error);
      toast.error(error.message || 'Google authentication failed. Please try again.');
    }
  };

  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  };

  const login = () => {
    if (!window.google) {
      toast.error('Google Sign-In not loaded. Please refresh the page.');
      return;
    }

    initializeGoogleSignIn();
    
    // Show the One Tap prompt
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback to button click if One Tap doesn't show
        console.log('One Tap not displayed, using button flow');
      }
    });
  };

  return login;
};

/**
 * Component to render Google Sign-In button
 */
export const GoogleSignInButton = ({ onSuccess, onError, text = 'signin_with', width = 400 }) => {
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: onSuccess,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        {
          theme: 'outline',
          size: 'large',
          text: text,
          width: width,
          logo_alignment: 'left',
        }
      );
    }
  }, [onSuccess, text, width]);

  return <div id="googleSignInButton"></div>;
};
