import { useState } from 'react';
import {
  Box, Typography, Grid, IconButton, TextField, Button, Divider, Chip, Stack
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Event as EventIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  ArrowForward as ArrowIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

// ─── Reusable footer link ────────────────────────────────────────────────────
const FooterLink = ({ to, children }) => (
  <Box
    component={RouterLink}
    to={to}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.8,
      color: 'rgba(255,255,255,0.55)',
      textDecoration: 'none',
      fontSize: '0.88rem',
      fontWeight: 500,
      py: 0.5,
      transition: 'all 0.2s ease',
      position: 'relative',
      width: 'fit-content',
      '&:hover': {
        color: '#A78BFA',
        transform: 'translateX(6px)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        left: -12,
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: '#8B5CF6',
        opacity: 0,
        transition: 'opacity 0.2s ease',
      },
      '&:hover::before': {
        opacity: 1,
      }
    }}
  >
    {children}
  </Box>
);

// ─── Social button ───────────────────────────────────────────────────────────
const SocialBtn = ({ children, href, label, color }) => (
  <IconButton
    href={href || '#'}
    aria-label={label}
    size="small"
    sx={{
      color: 'rgba(255,255,255,0.55)',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      width: 38,
      height: 38,
      transition: 'all 0.25s ease',
      '&:hover': {
        color: 'white',
        background: `${color}25`,
        border: `1px solid ${color}60`,
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 20px ${color}30`,
      },
    }}
  >
    {children}
  </IconButton>
);

// ─── Trust badge ─────────────────────────────────────────────────────────────
const TrustBadge = ({ icon, label }) => (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    px: 1.5,
    py: 0.8,
    borderRadius: '8px',
    background: 'rgba(139,92,246,0.08)',
    border: '1px solid rgba(139,92,246,0.15)',
  }}>
    <Box sx={{ color: '#A78BFA', display: 'flex', fontSize: 16 }}>{icon}</Box>
    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600 }}>
      {label}
    </Typography>
  </Box>
);

// ─── Main Footer ─────────────────────────────────────────────────────────────
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const sections = [
    {
      title: 'Platform',
      links: [
        { label: 'Home', to: '/' },
        { label: 'Browse Events', to: '/events' },
        { label: 'Find Vendors', to: '/vendors' },
        { label: 'About Us', to: '/about' },
        { label: 'Contact', to: '/contact' },
      ],
    },
    {
      title: 'For Organizers',
      links: [
        { label: 'Create Event', to: '/events/create' },
        { label: 'My Dashboard', to: '/dashboard/user' },
        { label: 'Guest Management', to: '/events' },
        { label: 'Budget Planner', to: '/events' },
        { label: 'AI Assistant', to: '/dashboard/user' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', to: '/faq' },
        { label: 'FAQ', to: '/faq' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Contact Us', to: '/contact' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(180deg, #0B0918 0%, #0F0C29 40%, #09071A 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        mt: 'auto',
        fontFamily: '"Inter", "Roboto", sans-serif',
      }}
    >
      {/* ── Top glowing border ── */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(236,72,153,0.5), transparent)',
      }} />

      {/* ── Decorative orbs ── */}
      {[
        { size: 400, top: -150, left: -100, color: 'rgba(139,92,246,0.06)' },
        { size: 300, bottom: -100, right: -50, color: 'rgba(236,72,153,0.05)' },
        { size: 200, top: '40%', left: '50%', color: 'rgba(16,185,129,0.04)' },
      ].map((orb, i) => (
        <Box key={i} sx={{
          position: 'absolute',
          width: orb.size,
          height: orb.size,
          borderRadius: '50%',
          background: orb.color,
          top: orb.top,
          left: orb.left,
          right: orb.right,
          bottom: orb.bottom,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
      ))}

      {/* ─────────────────── Newsletter Banner ─────────────────── */}
      <Box sx={{
        position: 'relative', zIndex: 1,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(236,72,153,0.07) 100%)',
        py: { xs: 4, md: 5 },
        px: { xs: 3, md: 6 },
      }}>
        <Box sx={{
          maxWidth: 1200, mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          flexWrap: 'wrap',
        }}>
          <Box>
            <Typography sx={{
              fontWeight: 800,
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              background: 'linear-gradient(135deg, #E9D5FF 0%, #F9A8D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 0.5,
            }}>
              Stay ahead of every event
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
              Get AI tips, new features & exclusive vendor deals delivered to your inbox.
            </Typography>
          </Box>

          {subscribed ? (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              px: 3, py: 1.5, borderRadius: '14px',
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.25)',
            }}>
              <VerifiedIcon sx={{ color: '#10b981', fontSize: 20 }} />
              <Typography sx={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                You're subscribed! 🎉
              </Typography>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
            >
              <TextField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                sx={{
                  minWidth: { xs: '100%', sm: 260 },
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)',
                    '& fieldset': { borderColor: 'rgba(139,92,246,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(139,92,246,0.6)' },
                    '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                  },
                  '& input::placeholder': { color: 'rgba(255,255,255,0.35)' },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon sx={{ fontSize: '1rem !important' }} />}
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  borderRadius: '12px',
                  fontWeight: 700,
                  px: 3,
                  boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 28px rgba(139,92,246,0.5)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Subscribe
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* ─────────────────── Main Footer Body ─────────────────── */}
      <Box sx={{
        maxWidth: 1200, mx: 'auto',
        px: { xs: 3, md: 6 },
        py: { xs: 5, md: 7 },
        position: 'relative', zIndex: 1,
      }}>
        <Grid container spacing={{ xs: 4, md: 5 }}>

          {/* ── Brand column ── */}
          <Grid item xs={12} md={4}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: '14px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(139,92,246,0.4)',
              }}>
                <EventIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography sx={{
                  fontWeight: 900, fontSize: '1.3rem', letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #E9D5FF 0%, #F9A8D4 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  EventMaster
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  AI-Powered Planning
                </Typography>
              </Box>
            </Box>

            <Typography sx={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '0.88rem',
              lineHeight: 1.75,
              mb: 3.5,
              maxWidth: 300,
            }}>
              The smartest way to plan, coordinate, and execute unforgettable events — powered by AI recommendations and a curated vendor network.
            </Typography>

            {/* Social Row */}
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1.5 }}>
              Follow Us
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
              <SocialBtn label="Facebook" color="#1877F2"><FacebookIcon fontSize="small" /></SocialBtn>
              <SocialBtn label="Twitter" color="#1DA1F2"><TwitterIcon fontSize="small" /></SocialBtn>
              <SocialBtn label="LinkedIn" color="#0A66C2"><LinkedInIcon fontSize="small" /></SocialBtn>
              <SocialBtn label="Instagram" color="#E1306C"><InstagramIcon fontSize="small" /></SocialBtn>
              <SocialBtn label="YouTube" color="#FF0000"><YouTubeIcon fontSize="small" /></SocialBtn>
            </Stack>

            {/* Trust badges */}
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <TrustBadge icon={<StarIcon sx={{ fontSize: 14 }} />} label="4.9 Rated" />
              <TrustBadge icon={<SecurityIcon sx={{ fontSize: 14 }} />} label="SSL Secured" />
              <TrustBadge icon={<SpeedIcon sx={{ fontSize: 14 }} />} label="99.9% Uptime" />
            </Stack>
          </Grid>

          {/* ── Nav columns ── */}
          {sections.map((section) => (
            <Grid item xs={6} sm={4} md={2.2} key={section.title}>
              <Typography sx={{
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                mb: 2.5,
              }}>
                {section.title}
              </Typography>
              <Stack spacing={0.5}>
                {section.links.map((link) => (
                  <FooterLink key={link.label} to={link.to}>
                    {link.label}
                  </FooterLink>
                ))}
              </Stack>
            </Grid>
          ))}

          {/* ── Contact column ── */}
          <Grid item xs={12} sm={6} md={3.1}>
            <Typography sx={{
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              mb: 2.5,
            }}>
              Get In Touch
            </Typography>
            <Stack spacing={2.5}>
              {[
                {
                  icon: <EmailIcon sx={{ fontSize: 16 }} />,
                  label: 'Email',
                  value: 'support@eventmaster.com',
                  sub: 'We reply within 24 hours',
                  color: '#8B5CF6',
                },
                {
                  icon: <PhoneIcon sx={{ fontSize: 16 }} />,
                  label: 'Phone',
                  value: '+1 (555) 123-4567',
                  sub: 'Mon–Fri, 9am–6pm EST',
                  color: '#10b981',
                },
                {
                  icon: <LocationIcon sx={{ fontSize: 16 }} />,
                  label: 'Office',
                  value: '123 Event Street',
                  sub: 'Planning City, PC 12345',
                  color: '#EC4899',
                },
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Box sx={{
                    width: 34, height: 34, borderRadius: '10px', flexShrink: 0,
                    background: `${item.color}18`,
                    border: `1px solid ${item.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color, mt: 0.3,
                  }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.87rem', fontWeight: 600 }}>
                      {item.value}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.74rem' }}>
                      {item.sub}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* ─────────────────── Bottom Bar ─────────────────── */}
      <Box sx={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', zIndex: 1,
      }}>
        <Box sx={{
          maxWidth: 1200, mx: 'auto',
          px: { xs: 3, md: 6 },
          py: { xs: 2.5, md: 3 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
            © {currentYear} EventMaster, Inc. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center" gap={0.5}>
            {['Privacy', 'Terms', 'Cookies', 'Sitemap'].map((item, i, arr) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component={RouterLink}
                  to={`/${item.toLowerCase()}`}
                  sx={{
                    color: 'rgba(255,255,255,0.3)',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    px: 0.5,
                    transition: 'color 0.2s',
                    '&:hover': { color: '#A78BFA' },
                  }}
                >
                  {item}
                </Box>
                {i < arr.length - 1 && (
                  <Typography sx={{ color: 'rgba(255,255,255,0.12)', mx: 0.5 }}>·</Typography>
                )}
              </Box>
            ))}
          </Stack>

          <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>
            Made with{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontWeight: 800,
            }}>♥</Box>
            {' '}for event planners worldwide
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;