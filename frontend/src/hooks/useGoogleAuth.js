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
      console.log('✅ Google OAuth Success - Token Response:', tokenResponse);
      const { access_token } = tokenResponse;

      if (!access_token) {
        throw new Error('No access token received from Google');
      }

      console.log('📤 Sending access token to backend...');
      const response = await api.post('/auth/google', { access_token, role });
      console.log('📥 Backend response:', response);

      if (response?.code === 'ACCOUNT_SUSPENDED' || response?.message?.toLowerCase().includes('suspended')) {
        toast.error('🚫 Your account has been suspended. Please contact support.', { 
          autoClose: 8000, 
          position: 'top-center' 
        });
        return;
      }

      if (response.success && response.data?.accessToken) {
        api.setToken(response.data.accessToken);
        localStorage.setItem('authToken', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        localStorage.setItem('userRole', response.data.user?.role || role);

        await refreshSession();

        toast.success(`✅ Successfully ${mode === 'login' ? 'logged in' : 'registered'} with Google!`);

        const userRole = response.data.user?.role || role;
        const dashboardPath =
          userRole === 'vendor' ? '/dashboard/vendor' :
          userRole === 'admin'  ? '/dashboard/admin'  :
          '/dashboard/user';

        console.log('🚀 Navigating to:', dashboardPath);
        navigate(dashboardPath, { replace: true });
      } else {
        console.error('❌ Backend response error:', response);
        toast.error(response?.message || 'Google authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Google Auth Error:', error);
      if (error?.message?.toLowerCase().includes('suspended')) {
        toast.error('🚫 Your account has been suspended. Please contact support.', { 
          autoClose: 8000, 
          position: 'top-center' 
        });
      } else {
        toast.error(error.message || 'Google authentication failed. Please try again.');
      }
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (error) => {
      console.error('❌ Google Login Error:', error);
      
      if (error?.error === 'popup_closed_by_user') {
        toast.info('Google sign-in was cancelled.');
        return;
      }
      
      if (error?.error === 'access_denied') {
        toast.error('Access denied. Please grant the required permissions.');
        return;
      }
      
      toast.error('Google login failed. Please try again.');
    },
  });

  return login;
};
