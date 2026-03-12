import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider
} from '@mui/material';
import {
  Event as EventIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Storefront as StorefrontIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  TouchApp as TouchAppIcon,
  AllInclusive as AllInclusiveIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarMonth as CalendarIcon,
  Groups as GroupsIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const HomePage = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const stats = [
    { number: '10,000+', label: 'Events Created', icon: <EventIcon sx={{ fontSize: 48 }} />, color: '#6366F1' },
    { number: '50,000+', label: 'Happy Users', icon: <PeopleIcon sx={{ fontSize: 48 }} />, color: '#EC4899' },
    { number: '1,000+', label: 'Trusted Vendors', icon: <StorefrontIcon sx={{ fontSize: 48 }} />, color: '#8B5CF6' },
    { number: '98%', label: 'Success Rate', icon: <TrendingUpIcon sx={{ fontSize: 48 }} />, color: '#10B981' },
  ];

  const features = [
    {
      title: 'AI-Powered Planning',
      description: 'Get intelligent recommendations for venues, vendors, and timelines based on your event type, budget, and preferences.',
      icon: <AutoAwesomeIcon sx={{ fontSize: 64 }} />,
      color: '#6366F1',
      bgGradient: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
    },
    {
      title: 'Vendor Marketplace',
      description: 'Discover and connect with verified vendors. Compare services, read reviews, and book with confidence.',
      icon: <StorefrontIcon sx={{ fontSize: 64 }} />,
      color: '#8B5CF6',
      bgGradient: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
    },
    {
      title: 'Guest Management',
      description: 'Send digital invitations, track RSVPs in real-time, and manage your guest list effortlessly.',
      icon: <PeopleIcon sx={{ fontSize: 64 }} />,
      color: '#DB2777',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    },
    {
      title: 'Budget Tracking',
      description: 'Keep your event finances organized with smart budget tools and expense tracking.',
      icon: <MoneyIcon sx={{ fontSize: 64 }} />,
      color: '#10B981',
      bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    },
    {
      title: 'Timeline Planning',
      description: 'Create detailed timelines and schedules to ensure everything runs smoothly.',
      icon: <CalendarIcon sx={{ fontSize: 64 }} />,
      color: '#F59E0B',
      bgGradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    },
    {
      title: 'Team Collaboration',
      description: 'Work together with your team and vendors in one centralized platform.',
      icon: <GroupsIcon sx={{ fontSize: 64 }} />,
      color: '#3B82F6',
      bgGradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    }
  ];

  const benefits = [
    {
      icon: <TouchAppIcon sx={{ fontSize: 56 }} />,
      title: 'Easy to Use',
      description: 'Intuitive interface designed for everyone. Get started in minutes with our simple setup process.',
      color: '#6366F1',
      bgColor: '#EEF2FF',
    },
    {
      icon: <AllInclusiveIcon sx={{ fontSize: 56 }} />,
      title: 'All-in-One Solution',
      description: 'Everything you need for event planning in one comprehensive platform.',
      color: '#8B5CF6',
      bgColor: '#FAF5FF',
    },
    {
      icon: <StorefrontIcon sx={{ fontSize: 56 }} />,
      title: 'Verified Vendors',
      description: 'Connect with trusted, verified vendors who can bring your vision to life.',
      color: '#EC4899',
      bgColor: '#FDF2F8',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 56 }} />,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security and 99.9% uptime.',
      color: '#10B981',
      bgColor: '#ECFDF5',
    }
  ];

  return (
    <Box sx={{ width: '100%', background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
            {/* Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 3,
                py: 1,
                background: '#2E7D32',
                color: '#FFFFFF',
                borderRadius: 50,
                mb: 4,
                fontSize: '0.9rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(46,125,50,0.3)',
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 20 }} />
              AI-Powered Event Planning Platform
            </Box>

            {/* Main Heading */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                fontWeight: 900,
                mb: 3,
                lineHeight: 1.2,
                color: '#1B5E20',
                letterSpacing: '-0.02em',
                fontFamily: '"Poppins", "Roboto", sans-serif',
              }}
            >
              Plan Perfect Events
              <br />
              with Confidence
            </Typography>

            {/* Subheading */}
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                mb: 5,
                color: '#2E7D32',
                lineHeight: 1.7,
                fontWeight: 500,
                maxWidth: '700px',
                mx: 'auto',
                fontFamily: '"Inter", "Roboto", sans-serif',
              }}
            >
              Transform your event planning experience with intelligent tools, 
              seamless vendor connections, and automated management features.
            </Typography>

            {/* CTA Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              sx={{ mb: 4 }}
            >
              {!user ? (
                <>
                  <Button
                    onClick={handleGetStarted}
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: '#2E7D32',
                      color: '#FFFFFF',
                      px: 4,
                      py: 1.8,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontFamily: '"Inter", sans-serif',
                      boxShadow: '0 4px 14px rgba(46,125,50,0.4)',
                      '&:hover': {
                        background: '#1B5E20',
                        boxShadow: '0 6px 20px rgba(46,125,50,0.5)',
                      },
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    onClick={handleSignIn}
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: '#2E7D32',
                      color: '#2E7D32',
                      px: 4,
                      py: 1.8,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 2,
                      borderWidth: 2,
                      textTransform: 'none',
                      fontFamily: '"Inter", sans-serif',
                      bgcolor: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        borderColor: '#1B5E20',
                        borderWidth: 2,
                        bgcolor: 'rgba(255,255,255,0.9)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <Button
                  component={Link}
                  to={`/dashboard/${localStorage.getItem('userRole') || userRole || 'user'}`}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: '#2E7D32',
                    color: '#FFFFFF',
                    px: 4,
                    py: 1.8,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontFamily: '"Inter", sans-serif',
                    boxShadow: '0 4px 14px rgba(46,125,50,0.4)',
                    '&:hover': {
                      background: '#1B5E20',
                      boxShadow: '0 6px 20px rgba(46,125,50,0.5)',
                    },
                  }}
                >
                  Go to Dashboard
                </Button>
              )}
            </Stack>

            {/* Trust Indicators */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              justifyContent="center"
              flexWrap="wrap"
              gap={2}
            >
              {['No credit card required', 'Free forever plan', 'Cancel anytime'].map((text, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 20, color: '#2E7D32' }} />
                  <Typography variant="body2" sx={{ color: '#1B5E20', fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                    {text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ 
        py: 8 
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '3px solid #2E7D32',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(46,125,50,0.3)',
                      background: 'rgba(255,255,255,0.95)',
                    },
                  }}
                >
                  <Box sx={{ color: '#2E7D32', mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{ 
                      mb: 1, 
                      fontWeight: 900, 
                      color: '#1B5E20',
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#2E7D32', fontFamily: '"Inter", sans-serif' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        py: 10 
      }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 8 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 2, 
                fontWeight: 900,
                fontSize: { xs: '2rem', md: '3rem' },
                color: '#1B5E20',
                letterSpacing: '-0.02em',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Powerful Features for Every Event
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2E7D32', 
                maxWidth: '700px', 
                mx: 'auto', 
                lineHeight: 1.7,
                fontSize: '1.1rem',
                fontWeight: 500,
                fontFamily: '"Inter", sans-serif'
              }}
            >
              Everything you need to plan, manage, and execute successful events
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    borderRadius: 3,
                    border: '3px solid #2E7D32',
                    background: 'rgba(255,255,255,0.8)',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(46,125,50,0.3)',
                      '& .feature-icon': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  <Box 
                    className="feature-icon"
                    sx={{ 
                      color: '#2E7D32', 
                      mb: 2,
                      width: 80,
                      height: 80,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(46,125,50,0.1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 800, 
                      mb: 1.5, 
                      color: '#1B5E20',
                      fontSize: '1.2rem',
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      lineHeight: 1.7,
                      color: '#2E7D32',
                      fontWeight: 500,
                      fontFamily: '"Inter", sans-serif'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ 
        py: 10 
      }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 8 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 2, 
                fontWeight: 900,
                fontSize: { xs: '2rem', md: '3rem' },
                color: '#1B5E20',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Why Choose EventMaster?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2E7D32', 
                maxWidth: '700px', 
                mx: 'auto',
                fontSize: '1.1rem',
                fontWeight: 500,
                fontFamily: '"Inter", sans-serif'
              }}
            >
              Join thousands of event planners who trust our platform
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {benefits.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.8)',
                    border: '3px solid #2E7D32',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(46,125,50,0.3)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'rgba(46,125,50,0.1)',
                      border: '4px solid #2E7D32',
                      color: '#2E7D32',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      mx: 'auto',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#1B5E20', fontFamily: '"Poppins", sans-serif' }}>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#2E7D32', fontWeight: 500, fontFamily: '"Inter", sans-serif' }}>
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          position: 'relative',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" sx={{ mb: 3, fontWeight: 900, color: '#1B5E20', fontSize: { xs: '2rem', md: '3rem' }, fontFamily: '"Poppins", sans-serif' }}>
            Ready to Create Amazing Events?
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 5, color: '#2E7D32', lineHeight: 1.7, fontSize: '1.2rem', fontWeight: 500, fontFamily: '"Inter", sans-serif' }}>
            Join thousands of event planners who trust EventMaster to bring their visions to life
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            {!user ? (
              <Button
                onClick={handleGetStarted}
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: '#2E7D32',
                  color: '#FFFFFF',
                  px: 5,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontFamily: '"Inter", sans-serif',
                  boxShadow: '0 4px 14px rgba(46,125,50,0.4)',
                  '&:hover': {
                    background: '#1B5E20',
                    boxShadow: '0 6px 20px rgba(46,125,50,0.5)',
                  },
                }}
              >
                Start Free Trial
              </Button>
            ) : (
              <Button
                component={Link}
                to={`/dashboard/${localStorage.getItem('userRole') || userRole || 'user'}`}
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: '#2E7D32',
                  color: '#FFFFFF',
                  px: 5,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontFamily: '"Inter", sans-serif',
                  boxShadow: '0 4px 14px rgba(46,125,50,0.4)',
                  '&:hover': {
                    background: '#1B5E20',
                    boxShadow: '0 6px 20px rgba(46,125,50,0.5)',
                  },
                }}
              >
                Go to Dashboard
              </Button>
            )}
          </Stack>

          <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap" gap={2} sx={{ mt: 5 }}>
            {['No credit card required', 'Free forever plan', 'Cancel anytime'].map((text, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: '#2E7D32' }} />
                <Typography variant="body2" sx={{ color: '#1B5E20', fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                  {text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        py: 4 
      }}>
        <Container maxWidth="lg">
          <Divider sx={{ mb: 3, borderColor: '#2E7D32' }} />
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" sx={{ color: '#1B5E20', fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
              © 2024 EventMaster. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link to="/privacy" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600, fontFamily: '"Inter", sans-serif', '&:hover': { color: '#1B5E20' } }}>
                  Privacy Policy
                </Typography>
              </Link>
              <Link to="/terms" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600, fontFamily: '"Inter", sans-serif', '&:hover': { color: '#1B5E20' } }}>
                  Terms of Service
                </Typography>
              </Link>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600, fontFamily: '"Inter", sans-serif', '&:hover': { color: '#1B5E20' } }}>
                  Contact
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
