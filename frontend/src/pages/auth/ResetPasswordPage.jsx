import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  Email as EmailIcon,
  LockReset as LockResetIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Simulate sending reset email
      setTimeout(() => {
        setSubmitted(true);
        toast.success('Password reset email sent!');
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
      setLoading(false);
    }
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
          {!submitted ? (
            <>
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
                  <LockResetIcon sx={{ fontSize: 40, color: 'white' }} />
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
                  Reset Password
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                  Enter your email and we'll send you a reset link
                </Typography>
              </Box>

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
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Reset Link'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      color: '#8B5CF6',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#8B5CF608',
                      },
                    }}
                  >
                    Back to Login
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <>
              {/* Success State */}
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                    animation: 'scaleIn 0.5s ease-out',
                    '@keyframes scaleIn': {
                      '0%': {
                        opacity: 0,
                        transform: 'scale(0)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'scale(1)',
                      },
                    },
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 60, color: 'white' }} />
                </Box>
                
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 900, 
                    mb: 2,
                    color: '#10B981',
                  }}
                >
                  Email Sent!
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 1 }}>
                  We've sent a password reset link to
                </Typography>
                
                <Typography variant="h6" fontWeight="700" color="primary" paragraph>
                  {email}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  Please check your email and follow the instructions to reset your password.
                  If you don't see the email, check your spam folder.
                </Typography>

                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.8,
                    px: 5,
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
                  }}
                >
                  Return to Login
                </Button>

                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mt: 3 }}
                >
                  Didn't receive the email?{' '}
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setEmail('');
                    }}
                    sx={{
                      color: '#8B5CF6',
                      fontWeight: 600,
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Try again
                  </Button>
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPasswordPage;
