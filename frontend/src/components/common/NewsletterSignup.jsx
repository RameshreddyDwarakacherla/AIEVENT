import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Snackbar,
  Grid,
  Fade,
  Slide
} from '@mui/material';
import {
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      setShowSnackbar(true);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setShowSnackbar(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      setTimeout(() => {
        setSuccess(true);
        setEmail('');
        setShowSnackbar(true);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setShowSnackbar(true);
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    if (success) {
      setSuccess(false);
    }
  };

  return (
    <Box
      sx={{
        background: '#1A1025', // Dark purple background matching screenshot
        py: { xs: 6, md: 8 },
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        fontFamily: '"Inter", sans-serif'
      }}
    >
      {/* Subtle background glow */}
      <Box sx={{
        position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)',
        width: 300, height: 300, background: 'rgba(236, 72, 153, 0.15)', 
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none'
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center" justifyContent="space-between">
          
          <Grid item xs={12} md={6}>
            <Slide direction="right" in timeout={800}>
              <Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 800, 
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    color: '#E9D5FF', // Light purple text color
                    letterSpacing: '-0.01em'
                  }}
                >
                  Stay ahead of every event
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#9CA3AF', // Grayish text
                    fontWeight: 400, 
                    fontSize: '1rem',
                  }}
                >
                  Get AI tips, new features & exclusive vendor deals delivered to your inbox.
                </Typography>
              </Box>
            </Slide>
          </Grid>

          <Grid item xs={12} md={6}>
            <Fade in timeout={1200}>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: 'flex', gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: { xs: 'flex-start', md: 'flex-end' }
                }}
              >
                <TextField
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={loading}
                  sx={{
                    flexGrow: 1,
                    maxWidth: { sm: '350px' },
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      '& fieldset': { border: 'none' },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(139, 92, 246, 0.4)'
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid #8B5CF6',
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)'
                      }
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: '12.5px 16px',
                      '&::placeholder': {
                        color: 'rgba(255,255,255,0.4)',
                        opacity: 1
                      }
                    }
                  }}
                />
                
                <Button
                  type="submit" 
                  variant="contained" 
                  disabled={loading} 
                  endIcon={!loading && <SendIcon sx={{ fontSize: '1.2rem', ml: 0.5 }} />}
                  sx={{
                    px: 3, 
                    py: 1.5, 
                    borderRadius: '12px', 
                    fontWeight: 700, 
                    textTransform: 'none',
                    fontSize: '1rem',
                    background: 'linear-gradient(90deg, #A855F7 0%, #EC4899 100%)', 
                    minWidth: { xs: 'auto', sm: '140px' },
                    boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    '&:hover': { 
                      transform: 'translateY(-2px)', 
                      boxShadow: '0 6px 20px rgba(236, 72, 153, 0.5)',
                      background: 'linear-gradient(90deg, #9333EA 0%, #DB2777 100%)', 
                    },
                    '&:disabled': { 
                      background: 'rgba(255,255,255,0.1)', 
                      color: 'rgba(255,255,255,0.3)' 
                    }
                  }}
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </Box>
            </Fade>
          </Grid>

        </Grid>
      </Container>

      <Snackbar
        open={showSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar} severity={success ? 'success' : 'error'} variant="filled" icon={success ? <CheckCircleIcon /> : undefined}
          sx={{ width: '100%', background: success ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)', backdropFilter: 'blur(10px)', color: 'white', borderRadius: '12px' }}
        >
          {success ? 'Subscription confirmed! Welcome to the loop.' : error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewsletterSignup;
