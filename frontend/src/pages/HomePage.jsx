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

// Black and white theme
const blackWhiteTheme = {
  primary: '#000000',
  secondary: '#333333',
  features: {
    ai: '#000000',
    vendor: '#333333',
    guest: '#000000',
    budget: '#333333',
    timeline: '#000000',
    collaboration: '#333333',
  },
  bgGradients: [
    'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)',
  ]
};

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
      color: blackWhiteTheme.primary
    },
    { 
      number: '50,000+', 
      label: 'Happy Users', 
      icon: <PeopleIcon sx={{ fontSize: 48 }} />, 
      color: blackWhiteTheme.secondary
    },
    { 
      number: '1,000+', 
      label: 'Trusted Vendors', 
      icon: <StorefrontIcon sx={{ fontSize: 48 }} />, 
      color: blackWhiteTheme.features.vendor
    },
    { 
      number: '98%', 
      label: 'Success Rate', 
      icon: <TrendingUpIcon sx={{ fontSize: 48 }} />, 
      color: blackWhiteTheme.features.budget
    },
  ];

  const features = [
    {
      title: 'AI-Powered Planning',
      description: 'Get intelligent recommendations for venues, vendors, and timelines based on your event type, budget, and preferences.',
      icon: <AutoAwesomeIcon sx={{ fontSize: 64 }} />,
      color: blackWhiteTheme.features.ai,
      bgGradient: blackWhiteTheme.bgGradients[0],
    },
    {
      title: 'Vendor Marketplace',
      description: 'Discover and connect with verified vendors. Compare services, read reviews, and book with confidence.',
      icon: <StorefrontIcon sx={{ fontSize: 64 }} />,
      color: blackWhiteTheme.features.vendor,
      bgGradient: blackWhiteTheme.bgGradients[1],
    },
    {
      title: 'Guest Management',
      description: 'Send digital invitations, track RSVPs in real-time, and manage your guest list effortlessly.',
      icon: <PeopleIcon sx={{ fontSize: 64 }} />,
      color: blackWhiteTheme.features.guest,
      bgGradient: blackWhiteTheme.bgGradients[0],
    },
    {
      title: 'Budget Tracking',
      description: 'Keep your event finances organized with smart budget tools and expense tracking.',
      icon: <MoneyIcon sx={{ fontSize: 64 }} />,
      color: blackWhiteTheme.features.budget,
      bgGradient: blackWhiteTheme.bgGradients[1],
    },
    {
      title: 'Timeline Planning',
      description: 'Create detailed timelines and schedules to ensure everything runs smoothly.',
      icon: <CalendarIcon sx={{ fontSize: 64 }} />,
      color: blackWhiteTheme.features.timeline,
      bgGradient: blackWhiteTheme.bgGradients[0],
    },
    {
      title: 'Team Collaboration',
      description: 'Work together with your team and vendors in one centralized platform.',
      icon: <GroupsIcon sx={{ fontSize: 64 }} />,
      color: blackWhiteTheme.features.collaboration,
      bgGradient: blackWhiteTheme.bgGradients[1],
    }
  ];

  const benefits = [
    {
      icon: <TouchAppIcon sx={{ fontSize: 56 }} />,
      title: 'Easy to Use',
      description: 'Intuitive interface designed for everyone. Get started in minutes with our simple setup process.',
      color: blackWhiteTheme.primary,
    },
    {
      icon: <AllInclusiveIcon sx={{ fontSize: 56 }} />,
      title: 'All-in-One Platform',
      description: 'Everything you need in one place. No more juggling multiple tools and spreadsheets.',
      color: blackWhiteTheme.secondary,
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 56 }} />,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security. We take privacy seriously.',
      color: blackWhiteTheme.features.vendor,
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 56 }} />,
      title: 'Proven Results',
      description: 'Join thousands of successful events. Our platform has a 98% satisfaction rate.',
      color: blackWhiteTheme.features.budget,
    }
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)', 
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
            width: `${120 + i * 40}px`,
            height: `${120 + i * 40}px`,
            borderRadius: '50%',
            background: `rgba(0, 0, 0, ${0.03 + i * 0.01})`,
            top: `${5 + i * 12}%`,
            left: `${3 + i * 11}%`,
            filter: 'blur(60px)',
            zIndex: 0,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            width: `${4 + i * 2}px`,
            height: `${4 + i * 2}px`,
            borderRadius: '50%',
            background: i % 2 === 0 
              ? 'rgba(0, 0, 0, 0.4)' 
              : 'rgba(0, 0, 0, 0.3)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 0,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
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
                  background: 'linear-gradient(135deg, #000000, #374151)',
                  color: '#FFFFFF',
                  borderRadius: 50,
                  mb: 4,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
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
                  background: 'linear-gradient(135deg, #000000, #374151, #6b7280)',
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
                  color: '#4b5563',
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
                          background: 'linear-gradient(135deg, #000000, #374151)',
                          color: '#FFFFFF',
                          px: 4,
                          py: 1.8,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontFamily: '"Inter", sans-serif',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1f2937, #000000)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                            transform: 'translateY(-2px)',
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
                          borderColor: '#374151',
                          color: '#1f2937',
                          px: 4,
                          py: 1.8,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: 2,
                          borderWidth: 2,
                          textTransform: 'none',
                          fontFamily: '"Inter", sans-serif',
                          bgcolor: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(10px)',
                          '&:hover': {
                            borderColor: '#000000',
                            borderWidth: 2,
                            bgcolor: 'rgba(255,255,255,1)',
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
                        background: 'linear-gradient(135deg, #000000, #374151)',
                        color: '#FFFFFF',
                        px: 4,
                        py: 1.8,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontFamily: '"Inter", sans-serif',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1f2937, #000000)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                          transform: 'translateY(-2px)',
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
                      <CheckCircleIcon sx={{ fontSize: 20, color: '#374151' }} />
                      <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
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
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                        background: 'rgba(255,255,255,1)',
                        border: '1px solid rgba(0,0,0,0.15)',
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Box sx={{ color: '#374151', mb: 2 }}>
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
                          background: 'linear-gradient(135deg, #000000, #374151)',
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
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#1f2937', fontFamily: '"Inter", sans-serif' }}>
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
                color: '#000000',
                letterSpacing: '-0.02em',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Powerful Features for Every Event
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#4b5563', 
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
                    border: '1px solid rgba(0,0,0,0.1)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      background: 'rgba(255,255,255,1)',
                      border: '1px solid rgba(0,0,0,0.2)',
                      '& .feature-icon': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  <Box 
                    className="feature-icon"
                    sx={{ 
                      color: '#374151', 
                      mb: 2,
                      width: 80,
                      height: 80,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.05)',
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
                      color: '#000000',
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
                      color: '#4b5563',
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
                color: '#000000',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Why Choose EventMaster?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#4b5563', 
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
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      background: 'rgba(255,255,255,1)',
                      border: '1px solid rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.05)',
                      border: '2px solid #374151',
                      color: '#374151',
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

                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#000000', fontFamily: '"Poppins", sans-serif' }}>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#4b5563', fontWeight: 500, fontFamily: '"Inter", sans-serif' }}>
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
          <Typography variant="h2" sx={{ mb: 3, fontWeight: 900, color: '#000000', fontSize: { xs: '2rem', md: '3rem' }, fontFamily: '"Poppins", sans-serif' }}>
            Ready to Create Amazing Events?
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 5, color: '#4b5563', lineHeight: 1.7, fontSize: '1.2rem', fontWeight: 500, fontFamily: '"Inter", sans-serif' }}>
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
                  background: 'linear-gradient(135deg, #000000, #374151)',
                  color: '#FFFFFF',
                  px: 5,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontFamily: '"Inter", sans-serif',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1f2937, #000000)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                    transform: 'translateY(-2px)',
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
                  background: 'linear-gradient(135deg, #000000, #374151)',
                  color: '#FFFFFF',
                  px: 5,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontFamily: '"Inter", sans-serif',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1f2937, #000000)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                    transform: 'translateY(-2px)',
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
                <CheckCircleIcon sx={{ fontSize: 20, color: '#374151' }} />
                <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
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
          <Divider sx={{ mb: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" sx={{ color: '#1f2937', fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
              © 2024 EventMaster. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link to="/privacy" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 600, fontFamily: '"Inter", sans-serif', '&:hover': { color: '#000000' } }}>
                  Privacy Policy
                </Typography>
              </Link>
              <Link to="/terms" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 600, fontFamily: '"Inter", sans-serif', '&:hover': { color: '#000000' } }}>
                  Terms of Service
                </Typography>
              </Link>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 600, fontFamily: '"Inter", sans-serif', '&:hover': { color: '#000000' } }}>
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
