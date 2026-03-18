import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  InputAdornment,
  Alert,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Send as SendIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import { motion, useInView } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please fill out all required fields.'
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <LocationIcon sx={{ fontSize: 40 }} />,
      title: 'Our Office',
      details: ['123 Event Street', 'Suite 456', 'New York, NY 10001'],
      color: '#8B5CF6'
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: 'Email Us',
      details: ['info@eventmaster.com', 'support@eventmaster.com'],
      color: '#EC4899'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      title: 'Call Us',
      details: ['(123) 456-7890', 'Mon-Fri, 9am-5pm EST'],
      color: '#F59E0B'
    }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, color: '#1877F2', label: 'Facebook' },
    { icon: <TwitterIcon />, color: '#1DA1F2', label: 'Twitter' },
    { icon: <InstagramIcon />, color: '#E4405F', label: 'Instagram' },
    { icon: <LinkedInIcon />, color: '#0A66C2', label: 'LinkedIn' }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
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
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite',
        },
      }}
    >
      {/* Animated Background Circles */}
      {[...Array(5)].map((_, i) => (
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
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 2,
              color: 'white',
              textShadow: '0 4px 20px rgba(0,0,0,0.2)',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.95)',
              maxWidth: '700px',
              mx: 'auto',
              fontSize: '1.2rem',
            }}
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Information Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    elevation={8}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.98)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
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
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 40px ${info.color}40`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '20px',
                        background: `${info.color}15`,
                        color: info.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: `0 8px 24px ${info.color}25`,
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="800" mb={2} color="#1E293B">
                      {info.title}
                    </Typography>
                    {info.details.map((detail, idx) => (
                      <Typography key={idx} variant="body1" color="text.secondary" mb={0.5}>
                        {detail}
                      </Typography>
                    ))}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12}>
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, sm: 5 },
                borderRadius: 5,
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                animation: 'slideUp 0.8s ease-out',
              }}
            >
              <Typography
                variant="h4"
                fontWeight="900"
                mb={1}
                textAlign="center"
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Send Us a Message
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
                Fill out the form below and we'll get back to you within 24 hours
              </Typography>

              {formStatus.submitted && (
                <Alert
                  severity={formStatus.success ? 'success' : 'error'}
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
                  onClose={() => setFormStatus({ ...formStatus, submitted: false })}
                >
                  {formStatus.message}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Your Name"
                      name="name"
                      value={formData.name}
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
                      fullWidth
                      required
                      type="email"
                      label="Your Email"
                      name="email"
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
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MessageIcon sx={{ color: '#8B5CF6' }} />
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
                      fullWidth
                      required
                      multiline
                      rows={5}
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
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
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      endIcon={<SendIcon />}
                      sx={{
                        py: 2,
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
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }}>
                <Chip label="FOLLOW US" sx={{ bgcolor: '#8B5CF620', color: '#8B5CF6', fontWeight: 700 }} />
              </Divider>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: `${social.color}15`,
                      color: social.color,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: social.color,
                        color: 'white',
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 24px ${social.color}40`,
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactPage;
