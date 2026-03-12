import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Link, 
  Alert, 
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  AdminPanelSettings as AdminIcon,
  AutoAwesome as SparkleIcon
} from '@mui/icons-material';

import { useGoogleAuth } from '../../hooks/useGoogleAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const googleLogin = useGoogleAuth({ mode: 'login' });

  const from = location.state?.from?.pathname || '/';
  const registeredAs = location.state?.registeredAs || localStorage.getItem('pendingUserRole');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { success, error, data } = await signIn(email, password);

      if (success) {
        toast.success(`🎉 Welcome back!`);

        // Prioritize the role from the server response
        const role = data?.user?.role || localStorage.getItem('userRole') || 'user';
        localStorage.setItem('userRole', role);

        const dashboardPath =
          role === 'vendor' ? '/dashboard/vendor' :
          role === 'admin' ? '/dashboard/admin' :
          '/dashboard/user';

        navigate(dashboardPath, { replace: true });
      } else {
        setError(error || 'Failed to sign in. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setEmail('admin@ai.com');
    setPassword('Ramesh@143');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite',
        },
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      }}
    >
      {/* Animated Background Circles */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            background: `rgba(255,255,255,${0.03 + i * 0.01})`,
            animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            ...(i === 0 && { top: '10%', left: '10%', width: 200, height: 200 }),
            ...(i === 1 && { top: '20%', right: '15%', width: 150, height: 150 }),
            ...(i === 2 && { bottom: '15%', left: '20%', width: 120, height: 120 }),
            ...(i === 3 && { top: '50%', right: '25%', width: 100, height: 100 }),
            ...(i === 4 && { bottom: '25%', right: '30%', width: 80, height: 80 }),
            ...(i === 5 && { top: '70%', left: '40%', width: 60, height: 60 }),
          }}
        />
      ))}

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 5,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.6s ease-out',
            '@keyframes slideUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(40px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
                animation: 'bounce 2s ease-in-out infinite',
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
              }}
            >
              <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900, 
                mb: 1,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome Back
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Sign in to continue to your AI Event Planner
            </Typography>
          </Box>

          {location.state?.message && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                animation: 'slideIn 0.5s ease-out',
                '@keyframes slideIn': {
                  '0%': { opacity: 0, transform: 'translateY(-20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              {location.state.message}
            </Alert>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                animation: 'shake 0.5s',
                '@keyframes shake': {
                  '0%, 100%': { transform: 'translateX(0)' },
                  '25%': { transform: 'translateX(-10px)' },
                  '75%': { transform: 'translateX(10px)' },
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#8B5CF6' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                  },
                },
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#8B5CF6' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
                  },
                },
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.8,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(139, 92, 246, 0.5)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
            </Button>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Link 
                  component={RouterLink} 
                  to="/reset-password" 
                  variant="body2"
                  sx={{
                    color: '#8B5CF6',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Link 
                  component={RouterLink} 
                  to="/register" 
                  variant="body2"
                  sx={{
                    color: '#8B5CF6',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }}>
              <Chip 
                label="OR CONTINUE WITH" 
                sx={{ 
                  bgcolor: '#F3F4F6',
                  color: '#6B7280',
                  fontWeight: 600,
                }}
              />
            </Divider>

            {/* Social Login Buttons */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={
                    <Box
                      component="img"
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      sx={{ width: 20, height: 20 }}
                    />
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    borderColor: '#E5E7EB',
                    color: '#374151',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      borderColor: '#8B5CF6',
                      bgcolor: '#8B5CF608',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => googleLogin()}
                >
                  Continue with Google
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="text"
                  startIcon={<AdminIcon />}
                  onClick={handleAdminLogin}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    color: '#6B7280',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      color: '#8B5CF6',
                      bgcolor: 'rgba(139, 92, 246, 0.05)',
                    },
                  }}
                >
                  Admin Portal Access
                </Button>
              </Grid>
            </Grid>

            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ display: 'block', mt: 3, textAlign: 'center' }}
            >
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
