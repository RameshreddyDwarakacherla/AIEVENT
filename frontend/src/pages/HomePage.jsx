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
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { greenTheme } from '../styles/theme';

const HomePage = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);
  
  const statsInView = useInView(statsRef, { once: true, threshold: 0.2 });
  const featuresInView = useInView(featuresRef, { once: true, threshold: 0.1 });
  const benefitsInView = useInView(benefitsRef, { once: true, threshold: 0.1 });

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const stats = [
    { 
      number: '10,000+', 
      label: 'Events Created', 
      icon: <EventIcon sx={{ fontSize: 48 }} />, 
      color: greenTheme.primary
    },
    { 
      number: '50,000+', 
      label: 'Happy Users', 
      icon: <PeopleIcon sx={{ fontSize: 48 }} />, 
      color: greenTheme.secondary
    },
    { 
      number: '1,000+', 
      label: 'Trusted Vendors', 
      icon: <StorefrontIcon sx={{ fontSize: 48 }} />, 
      color: greenTheme.features.vendor
    },
    { 
      number: '98%', 
      label: 'Success Rate', 
      icon: <TrendingUpIcon sx={{ fontSize: 48 }} />, 
      color: greenTheme.features.budget
    },
  ];

  const features = [
    {
      title: 'AI-Powered Planning',
      description: 'Get intelligent recommendations for venues, vendors, and timelines based on your event type, budget, and preferences.',
      icon: <AutoAwesomeIcon sx={{ fontSize: 64 }} />,
      color: greenTheme.features.ai,
      bgGradient: greenTheme.bgGradients[0],
    },
    {
      title: 'Vendor Marketplace',
      description: 'Discover and connect with verified vendors. Compare services, read reviews, and book with confidence.',
      icon: <StorefrontIcon sx={{ fontSize: 64 }} />,
      color: greenTheme.features.vendor,
      bgGradient: greenTheme.bgGradients[1],
    },
    {
      title: 'Guest Management',
      description: 'Send digital invitations, track RSVPs in real-time, and manage your guest list effortlessly.',
      icon: <PeopleIcon sx={{ fontSize: 64 }} />,
      color: greenTheme.features.guest,
      bgGradient: greenTheme.bgGradients[0],
    },
    {
      title: 'Budget Tracking',
      description: 'Keep your event finances organized with smart budget tools and expense tracking.',
      icon: <MoneyIcon sx={{ fontSize: 64 }} />,
      color: greenTheme.features.budget,
      bgGradient: greenTheme.bgGradients[1],
    },
    {
      title: 'Timeline Planning',
      description: 'Create detailed timelines and schedules to ensure everything runs smoothly.',
      icon: <CalendarIcon sx={{ fontSize: 64 }} />,
      color: greenTheme.features.timeline,
      bgGradient: greenTheme.bgGradients[0],
    },
    {
      title: 'Team Collaboration',
      description: 'Work together with your team and vendors in one centralized platform.',
      icon: <GroupsIcon sx={{ fontSize: 64 }} />,
      color: greenTheme.features.collaboration,
      bgGradient: greenTheme.bgGradients[1],
    }
  ];

  const benefits = [
    {
      icon: <TouchAppIcon sx={{ fontSize: 56 }} />,
      title: 'Easy to Use',
      description: 'Intuitive interface designed for everyone. Get started in minutes with our simple setup process.',
      color: greenTheme.primary,
    },
    {
      icon: <AllInclusiveIcon sx={{ fontSize: 56 }} />,
      title: 'All-in-One Platform',
      description: 'Everything you need in one place. No more juggling multiple tools and spreadsheets.',
      color: greenTheme.secondary,
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 56 }} />,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security. We take privacy seriously.',
      color: greenTheme.features.vendor,
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 56 }} />,
      title: 'Proven Results',
      description: 'Join thousands of successful events. Our platform has a 98% satisfaction rate.',
      color: greenTheme.features.budget,
    }
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)', 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            borderRadius: '50%',
            background: `rgba(46, 125, 50, ${0.05 + i * 0.02})`,
            top: `${10 + i * 15}%`,
            left: `${5 + i * 15}%`,
            filter: 'blur(40px)',
            zIndex: 0,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 3,
                  py: 1,
                  background: 'linear-gradient(135deg, #2E7D32, #388E3C)',
                  color: '#FFFFFF',
                  borderRadius: 50,
                  mb: 4,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  boxShadow: '0 8px 32px rgba(46,125,50,0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 20 }} />
                </motion.div>
                AI-Powered Event Planning Platform
              </Box>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 900,
                  mb: 3,
                  lineHeight: 1.2,
                  background: 'linear-gradient(135deg, #1B5E20, #2E7D32, #43A047)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  fontFamily: '"Poppins", "Roboto", sans-serif',
                }}
              >
                Plan Perfect Events
                <br />
                with Confidence
              </Typography>
            </motion.div>

            {/* Subheading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
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
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
                sx={{ mb: 4 }}
              >
                {!user ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleGetStarted}
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          background: 'linear-gradient(135deg, #2E7D32, #43A047)',
                          color: '#FFFFFF',
                          px: 4,
                          py: 1.8,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontFamily: '"Inter", sans-serif',
                          boxShadow: '0 8px 32px rgba(46,125,50,0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                            boxShadow: '0 12px 40px rgba(46,125,50,0.5)',
                          },
                        }}
                      >
                        Get Started Free
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
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
                          bgcolor: 'rgba(255,255,255,0.8)',
                          backdropFilter: 'blur(10px)',
                          '&:hover': {
                            borderColor: '#1B5E20',
                            borderWidth: 2,
                            bgcolor: 'rgba(255,255,255,0.95)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Sign In
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      component={Link}
                      to={`/user/dashboard`}
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, #2E7D32, #43A047)',
                        color: '#FFFFFF',
                        px: 4,
                        py: 1.8,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontFamily: '"Inter", sans-serif',
                        boxShadow: '0 8px 32px rgba(46,125,50,0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                          boxShadow: '0 12px 40px rgba(46,125,50,0.5)',
                        },
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  </motion.div>
                )}
              </Stack>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                justifyContent="center"
                flexWrap="wrap"
                gap={2}
              >
                {['No credit card required', 'Free forever plan', 'Cancel anytime'].map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 20, color: '#2E7D32' }} />
                      <Typography variant="body2" sx={{ color: '#1B5E20', fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                        {text}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8 }} ref={statsRef}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(46,125,50,0.2)',
                      boxShadow: '0 8px 32px rgba(46,125,50,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 16px 48px rgba(46,125,50,0.2)',
                        background: 'rgba(255,255,255,0.95)',
                        border: '2px solid rgba(46,125,50,0.3)',
                      },
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Box sx={{ color: '#2E7D32', mb: 2 }}>
                        {stat.icon}
                      </Box>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={statsInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      <Typography
                        variant="h3"
                        sx={{ 
                          mb: 1, 
                          fontWeight: 900, 
                          background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: { xs: '2rem', md: '2.5rem' },
                          fontFamily: '"Poppins", sans-serif'
                        }}
                      >
                        {stat.number}
                      </Typography>
                    </motion.div>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#2E7D32', fontFamily: '"Inter", sans-serif' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
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
