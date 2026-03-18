import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../lib/api';

export const useGoogleAuth = ({ mode = 'login', role = 'user' } = {}) => {
  const { refreshSession } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      console.log('Google OAuth Success:', tokenResponse);
      const { access_token } = tokenResponse;

      if (!access_token) {
        throw new Error('No access token received from Google');
      }

      // Send the access_token to our backend to verify and get/create our own JWT
      console.log('Sending request to backend...');
      const response = await api.post('/auth/google', { access_token, role });
      console.log('Backend response:', response);

      // ── Blocked / suspended account check ──────────────────────────────────
      if (
        response?.code === 'ACCOUNT_SUSPENDED' ||
        response?.message?.toLowerCase().includes('suspended')
      ) {
        toast.error(
          '🚫 Your account has been suspended. Please contact support for assistance.',
          { autoClose: 8000, position: 'top-center' }
        );
        return; // Stop — do NOT store token or navigate
      }

      if (response.success && response.data?.accessToken) {
        // Store JWT and refresh token
        api.setToken(response.data.accessToken);
        localStorage.setItem('authToken', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        localStorage.setItem('userRole', response.data.user?.role || role);

        await refreshSession();

        toast.success(
          `✅ Successfully ${mode === 'login' ? 'logged in' : 'registered'} with Google!`
        );

        // Navigate based on role
        const userRole = response.data.user?.role || role;
        const dashboardPath =
          userRole === 'vendor' ? '/dashboard/vendor' :
          userRole === 'admin'  ? '/dashboard/admin'  :
          '/dashboard/user';

        console.log('Navigating to:', dashboardPath);
        navigate(dashboardPath, { replace: true });
      } else {
        console.error('Backend response error:', response);
        toast.error(response?.message || 'Google authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Google Auth Error:', error);
      // Try to detect suspension in exception messages too
      if (error?.message?.toLowerCase().includes('suspended')) {
        toast.error(
          '🚫 Your account has been suspended. Please contact support for assistance.',
          { autoClose: 8000, position: 'top-center' }
        );
      } else {
        toast.error(error.message || 'Google authentication failed. Please try again.');
      }
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (error) => {
      console.error('Google Login Error:', error);
      toast.error('Google login was cancelled or failed. Please try again.');
    },
    flow: 'implicit', // Use implicit flow instead of authorization code flow
    scope: 'openid email profile',
    redirect_uri: window.location.origin, // Set redirect URI to current origin
  });

  return login;
};
