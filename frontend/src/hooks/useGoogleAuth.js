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
      const { access_token } = tokenResponse;

      // Send the access_token to our backend to verify and get/create our own JWT
      const response = await api.post('/auth/google', { access_token, role });

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

      if (response.success && response.data?.token) {
        // Store JWT and update session
        api.setToken(response.data.token);
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

        navigate(dashboardPath, { replace: true });
      } else {
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
  });

  return login;
};
