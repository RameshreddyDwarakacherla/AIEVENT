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
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  FormControl, 
  FormLabel,
  InputAdornment,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as RegisterIcon,
  Business as VendorIcon,
  Event as EventIcon
} from '@mui/icons-material';

import { useGoogleAuth } from '../../hooks/useGoogleAuth';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const googleSignUp = useGoogleAuth({ mode: 'register', role: formData.role });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword ||
        !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (isSubmitting || loading) {
      return;
    }

    setError('');
    setLoading(true);
    setIsSubmitting(true);

    try {
      const { success, error, data } = await signUp(
        formData.email,
        formData.password,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role
        }
      );

      if (success) {
        toast.success(`🎉 Account created! Please sign in with your ${formData.role} credentials.`);
        navigate('/login', { 
          state: { 
            registeredAs: formData.role,
            message: 'Registration successful! Please sign in with your credentials.' 
          } 
        });
      } else {
        setError(error || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
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
              <RegisterIcon sx={{ fontSize: 40, color: 'white' }} />
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
              Create Account
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Join thousands of event planners today
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#8B5CF6' }} />
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#8B5CF6' }} />
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#8B5CF6' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }}>
              <Chip 
                label="SELECT YOUR ROLE" 
                sx={{ 
                  bgcolor: '#8B5CF620',
                  color: '#8B5CF6',
                  fontWeight: 700,
                  border: '2px solid #8B5CF640',
                }}
              />
            </Divider>

            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <RadioGroup
                row
                name="role"
                value={formData.role}
                onChange={handleChange}
                sx={{ 
                  display: 'flex', 
                  gap: 2,
                  justifyContent: 'center',
                }}
              >
                <Paper
                  elevation={formData.role === 'user' ? 8 : 2}
                  sx={{
                    p: 3,
                    flex: 1,
                    borderRadius: 3,
                    border: '3px solid',
                    borderColor: formData.role === 'user' ? '#8B5CF6' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#8B5CF6',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                    },
                  }}
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <EventIcon sx={{ fontSize: 48, color: '#8B5CF6', mb: 1 }} />
                    <FormControlLabel
                      value="user"
                      control={<Radio sx={{ display: 'none' }} />}
                      label={
                        <Box>
                          <Typography variant="h6" fontWeight="700">Event Organizer</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Plan and manage events
                          </Typography>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </Box>
                </Paper>

                <Paper
                  elevation={formData.role === 'vendor' ? 8 : 2}
                  sx={{
                    p: 3,
                    flex: 1,
                    borderRadius: 3,
                    border: '3px solid',
                    borderColor: formData.role === 'vendor' ? '#EC4899' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#EC4899',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)',
                    },
                  }}
                  onClick={() => setFormData({ ...formData, role: 'vendor' })}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <VendorIcon sx={{ fontSize: 48, color: '#EC4899', mb: 1 }} />
                    <FormControlLabel
                      value="vendor"
                      control={<Radio sx={{ display: 'none' }} />}
                      label={
                        <Box>
                          <Typography variant="h6" fontWeight="700">Vendor</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Offer event services
                          </Typography>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </Box>
                </Paper>
              </RadioGroup>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || isSubmitting}
              sx={{
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
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Chip 
                label="OR SIGN UP WITH" 
                sx={{ 
                  bgcolor: '#F3F4F6',
                  color: '#6B7280',
                  fontWeight: 600,
                }}
              />
            </Divider>

            {/* Social Sign Up Button */}
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
                mb: 3,
                '&:hover': {
                  borderColor: '#8B5CF6',
                  bgcolor: '#8B5CF608',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => googleSignUp()}
            >
              Continue with Google
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: '#8B5CF6',
                    fontWeight: 700,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>

            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ display: 'block', mt: 2, textAlign: 'center' }}
            >
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
