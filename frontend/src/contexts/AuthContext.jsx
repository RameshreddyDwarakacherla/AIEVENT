import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Helper to extract a user-friendly error from backend response
const extractErrorMessage = (error) => {
  // Handle suspended account specifically — makes it obvious to the user
  if (error?.code === 'ACCOUNT_SUSPENDED' || error?.status === 403) {
    return 'Your account has been suspended. Please contact support for assistance.';
  }
  return error?.message || error || 'Something went wrong. Please try again.';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const clearSession = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  };

  const checkSession = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        clearSession();
        setLoading(false);
        return;
      }

      const { data: { user: currentUser }, error } = await api.auth.getUser();

      if (error?.status === 403) {
        // Account suspended — force logout, clear token
        clearSession();
        setLoading(false);
        return;
      }

      if (currentUser) {
        setUser(currentUser);
        const role = currentUser.role || 'user';
        setUserRole(role);
        localStorage.setItem('userRole', role);
      } else {
        // Token invalid or expired
        clearSession();
      }
    } catch (error) {
      // If the error is 403 (suspended), clear session silently
      if (error?.status === 403 || error?.response?.status === 403) {
        clearSession();
      } else {
        console.error('Session check failed:', error);
        clearSession();
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, error: 'Email and password are required.' };
      }

      const { data, error } = await api.auth.signInWithPassword({ email, password });

      if (error) {
        // Detect suspended account via error code or HTTP 403
        if (
          error.code === 'ACCOUNT_SUSPENDED' ||
          error.status === 403 ||
          error.message?.toLowerCase().includes('suspended')
        ) {
          return {
            success: false,
            error: 'Your account has been suspended. Please contact support for assistance.',
            code: 'ACCOUNT_SUSPENDED',
          };
        }
        return { success: false, error: error.message || 'Invalid email or password' };
      }

      if (data?.user) {
        setUser(data.user);
        const role = data.user.role || 'user';
        setUserRole(role);
        localStorage.setItem('userRole', role);
        return { success: true, data: { user: data.user } };
      }

      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: extractErrorMessage(error) };
    }
  };

  const signInWithGoogle = async (accessToken, role = 'user') => {
    try {
      if (!accessToken) {
        return { success: false, error: 'Google authentication failed. Please try again.' };
      }

      const response = await api.post('/auth/google', { access_token: accessToken, role });

      if (!response?.success) {
        // Detect suspended account
        if (
          response?.code === 'ACCOUNT_SUSPENDED' ||
          response?.message?.toLowerCase().includes('suspended')
        ) {
          return {
            success: false,
            error: 'Your account has been suspended. Please contact support for assistance.',
            code: 'ACCOUNT_SUSPENDED',
          };
        }
        return {
          success: false,
          error: response?.message || 'Google authentication failed.',
        };
      }

      const { user: googleUser, token } = response.data;

      // Store JWT
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', googleUser.role || role);
      setUser(googleUser);
      setUserRole(googleUser.role || role);

      return { success: true, data: { user: googleUser } };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: extractErrorMessage(error) };
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      let firstName, lastName, role;

      if (typeof userData === 'object' && userData !== null) {
        firstName = userData.firstName || '';
        lastName = userData.lastName || '';
        role = userData.role || 'user';
      } else {
        role = userData || 'user';
        firstName = '';
        lastName = '';
      }

      if (!email || !password) {
        return { success: false, error: 'Email and password are required.' };
      }
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }
      if (!firstName || !lastName) {
        return { success: false, error: 'First name and last name are required.' };
      }

      const response = await api.auth.signUp({ email, password, firstName, lastName, role });

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Registration successful! Please sign in with your credentials.',
        };
      } else {
        return {
          success: false,
          error: response.message || response.error || 'Registration failed. Please try again.',
        };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: extractErrorMessage(error) };
    }
  };

  const signOut = async () => {
    try {
      await api.auth.signOut();
      clearSession();
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      clearSession(); // Force clear even if API fails
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        message: 'If an account exists for this email, a password reset link has been sent.',
      };
    } catch (error) {
      return { success: false, error: extractErrorMessage(error) };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      await api.put('/users/me', { password: newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, error: extractErrorMessage(error) };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await api.put('/users/me', updates);
      if (response.success) {
        setUser((prev) => ({ ...prev, ...response.data }));
        return { success: true, data: response.data };
      }
      return { success: false, error: 'Update failed' };
    } catch (error) {
      return { success: false, error: extractErrorMessage(error) };
    }
  };

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshSession: checkSession,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};