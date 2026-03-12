import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Rocket as RocketIcon,
  People as PeopleIcon,
  EmojiEvents as TrophyIcon,
  Favorite as HeartIcon,
  Lightbulb as LightbulbIcon,
  Security as SecurityIcon,
  Groups as GroupsIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const AboutPage = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <PeopleIcon sx={{ fontSize: 48 }} />,
      title: 'User-Centered Design',
      description: 'We put our users at the center of everything we do, creating intuitive and accessible experiences that meet their needs.',
      color: '#8B5CF6'
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 48 }} />,
      title: 'Innovation',
      description: 'We\'re constantly exploring new ideas and technologies to improve our platform and provide innovative solutions.',
      color: '#EC4899'
    },
    {
      icon: <TrophyIcon sx={{ fontSize: 48 }} />,
      title: 'Quality',
      description: 'We\'re committed to delivering a high-quality product that meets the highest standards of reliability and performance.',
      color: '#F59E0B'
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 48 }} />,
      title: 'Community',
      description: 'We believe in the power of community and strive to foster connections between event planners and vendors.',
      color: '#10B981'
    }
  ];

  const stats = [
    { number: '2023', label: 'Founded', icon: <RocketIcon /> },
    { number: '50K+', label: 'Happy Users', icon: <PeopleIcon /> },
    { number: '1000+', label: 'Vendors', icon: <StarIcon /> },
    { number: '98%', label: 'Success Rate', icon: <TrendingUpIcon /> }
  ];

  const features = [
    'Comprehensive event management',
    'AI-powered recommendations',
    'Vendor marketplace',
    'Budget tracking',
    'Guest management',
    'Real-time analytics'
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
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
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      }}
    >
      {/* Animated Background Circles */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            background: `rgba(255,255,255,${0.03 + i * 0.01})`,
            animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            ...(i === 0 && { top: '5%', left: '5%', width: 250, height: 250 }),
            ...(i === 1 && { top: '15%', right: '10%', width: 180, height: 180 }),
            ...(i === 2 && { bottom: '10%', left: '15%', width: 150, height: 150 }),
            ...(i === 3 && { top: '40%', right: '20%', width: 120, height: 120 }),
            ...(i === 4 && { bottom: '30%', right: '35%', width: 100, height: 100 }),
            ...(i === 5 && { top: '60%', left: '35%', width: 80, height: 80 }),
            ...(i === 6 && { top: '25%', left: '45%', width: 60, height: 60 }),
            ...(i === 7 && { bottom: '50%', right: '50%', width: 40, height: 40 }),
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 8,
            animation: 'fadeInUp 0.8s ease-out',
            '@keyframes fadeInUp': {
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
          <Chip
            icon={<HeartIcon />}
            label="About Us"
            sx={{
              mb: 3,
              bgcolor: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              fontSize: '1.1rem',
              py: 3.5,
              px: 2,
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 3,
              color: 'white',
              textShadow: '0 4px 20px rgba(0,0,0,0.2)',
              fontSize: { xs: '2.5rem', md: '4rem' },
            }}
          >
            About EventMaster
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.95)',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.7,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
            }}
          >
            Making event planning smarter, easier, and more personalized with AI-powered recommendations and professional tools.
          </Typography>
        </Box>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={8}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.4s ease',
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
                    transform: 'translateY(-12px) scale(1.03)',
                    boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4)',
                  },
                }}
              >
                <Box sx={{ color: '#8B5CF6', mb: 2 }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 40 } })}
                </Box>
                <Typography variant="h3" fontWeight="900" color="#8B5CF6" mb={1}>
                  {stat.number}
                </Typography>
                <Typography variant="body1" fontWeight="700" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Mission Section */}
        <Paper
          elevation={24}
          sx={{
            p: { xs: 4, md: 6 },
            mb: 6,
            borderRadius: 5,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: 'slideUp 0.8s ease-out',
          }}
        >
          <Typography
            variant="h3"
            fontWeight="900"
            mb={3}
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569' }}>
            At EventMaster, our mission is to simplify the event planning process by providing a comprehensive platform that connects event organizers with vendors and offers powerful tools to manage every aspect of your event.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569' }}>
            We believe that everyone should be able to create memorable events without the stress and complexity that often comes with planning. Our platform is designed to make event planning accessible, efficient, and enjoyable.
          </Typography>

          <Grid container spacing={2} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#10B981', fontSize: 24 }} />
                  <Typography variant="body1" fontWeight="600" color="#475569">
                    {feature}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Story Section */}
        <Paper
          elevation={24}
          sx={{
            p: { xs: 4, md: 6 },
            mb: 6,
            borderRadius: 5,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: 'slideUp 1s ease-out',
          }}
        >
          <Typography
            variant="h3"
            fontWeight="900"
            mb={3}
            sx={{
              background: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Our Story
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569' }}>
            EventMaster was founded in 2023 by a team of event planning professionals who recognized the need for a better way to organize events. After years of experiencing the challenges of event planning firsthand, our founders set out to create a solution that would address the pain points they had encountered.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569' }}>
            What started as a simple tool for managing guest lists has evolved into a comprehensive platform that handles everything from vendor selection to budget management. Today, EventMaster is trusted by thousands of event planners worldwide.
          </Typography>
        </Paper>

        {/* Values Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            fontWeight="900"
            mb={5}
            textAlign="center"
            sx={{
              color: 'white',
              textShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            Our Values
          </Typography>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    minHeight: 380,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    border: '3px solid transparent',
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.4s ease',
                    animation: `slideUp 0.6s ease-out ${index * 0.15}s both`,
                    '&:hover': {
                      transform: 'translateY(-16px) scale(1.02)',
                      borderColor: value.color,
                      boxShadow: `0 25px 70px ${value.color}40`,
                      '& .value-icon': {
                        transform: 'scale(1.2) rotate(12deg)',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      className="value-icon"
                      sx={{
                        width: 90,
                        height: 90,
                        borderRadius: '22px',
                        background: `${value.color}15`,
                        color: value.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        mx: 'auto',
                        transition: 'all 0.4s ease',
                        boxShadow: `0 8px 24px ${value.color}25`,
                      }}
                    >
                      {value.icon}
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight="800"
                      mb={2}
                      textAlign="center"
                      color="#1E293B"
                    >
                      {value.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      textAlign="center"
                      lineHeight={1.7}
                      color="#64748B"
                      flexGrow={1}
                    >
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        <Paper
          elevation={24}
          sx={{
            p: { xs: 4, md: 6 },
            mb: 6,
            borderRadius: 5,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: 'slideUp 1.2s ease-out',
          }}
        >
          <Typography
            variant="h3"
            fontWeight="900"
            mb={3}
            sx={{
              background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Our Team
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569' }}>
            Behind EventMaster is a dedicated team of professionals with diverse backgrounds in event planning, technology, and customer service. We're united by our passion for creating exceptional user experiences and our commitment to helping our customers succeed.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569' }}>
            Our team is constantly working to improve our platform, adding new features and refining existing ones based on user feedback. We believe in the power of collaboration and are always open to suggestions from our community.
          </Typography>
        </Paper>

        {/* CTA Section */}
        <Paper
          elevation={24}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 5,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(236, 72, 153, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: 'slideUp 1.4s ease-out',
          }}
        >
          <Typography variant="h3" fontWeight="900" mb={2} color="white">
            Join Us on Our Journey
          </Typography>
          <Typography variant="h6" mb={4} color="rgba(255,255,255,0.95)" sx={{ maxWidth: '700px', mx: 'auto' }}>
            We're just getting started, and we're excited about the future of EventMaster. Whether you're an event planner, a vendor, or an attendee, we invite you to join us.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/contact')}
            sx={{
              py: 2,
              px: 6,
              borderRadius: 3,
              fontSize: '1.2rem',
              fontWeight: 700,
              bgcolor: 'white',
              color: '#8B5CF6',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              '&:hover': {
                bgcolor: '#F9FAFB',
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Get in Touch
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;
