import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import {
  Event as EventIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Store as StoreIcon,
  CalendarToday as CalendarIcon,
  BookOnline as BookingIcon,
  Star as StarIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  KeyboardArrowRight as ArrowIcon,
  Home as HomeIcon,
  Info as AboutIcon,
  ContactMail as ContactIcon,
  ChevronLeft as CollapseIcon,
  ChevronRight as ExpandIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationsMenu from './NotificationsMenu';

const SIDEBAR_EXPANDED = 240;
const SIDEBAR_COLLAPSED = 72;

const Header = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, userRole, signOut } = useAuth();

  const isDashboardPage =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/events/create') ||
    location.pathname.startsWith('/vendor') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/user/bookings') ||
    location.pathname.startsWith('/messages') ||
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/notifications') ||
    location.pathname.startsWith('/settings');

  // Persist sidebar collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      try {
        setCollapsed(JSON.parse(saved));
      } catch (e) {
        setCollapsed(false);
      }
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(!prev));
      return !prev;
    });
  };

  const getGradient = () => {
    return 'linear-gradient(135deg, #000000 0%, #333333 100%)';
  };

  const getNavigationItems = () => {
    // If user is not logged in, show public routes
    if (!user) {
      return [
        { label: 'Home', path: '/', icon: <HomeIcon /> },
        { label: 'About', path: '/about', icon: <AboutIcon /> },
        { label: 'Contact', path: '/contact', icon: <ContactIcon /> },
      ];
    }
    
    // If user is logged in, ALWAYS show their role-specific dashboard routes
    if (userRole === 'vendor') {
      return [
        { label: 'Dashboard', path: '/dashboard/vendor', icon: <DashboardIcon /> },
        { label: 'Services', path: '/vendor/services', icon: <StoreIcon /> },
        { label: 'Bookings', path: '/vendor/bookings', icon: <BookingIcon /> },
        { label: 'Reviews', path: '/vendor/reviews', icon: <StarIcon /> },
        { label: 'Messages', path: '/messages', icon: <MessageIcon /> },
        { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
        { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
      ];
    }
    if (userRole === 'admin') {
      return [
        { label: 'Dashboard', path: '/dashboard/admin', icon: <DashboardIcon /> },
        { label: 'Users', path: '/admin/users', icon: <PeopleIcon /> },
        { label: 'Vendors', path: '/admin/vendors', icon: <BusinessIcon /> },
        { label: 'Events', path: '/admin/events', icon: <EventIcon /> },
        { label: 'Analytics', path: '/admin/analytics', icon: <AssessmentIcon /> },
        { label: 'System Settings', path: '/admin/settings', icon: <SettingsIcon /> },
      ];
    }
    
    // Default logged-in user (Organizer)
    return [
      { label: 'Dashboard', path: '/dashboard/user', icon: <DashboardIcon /> },
      { label: 'Create Event', path: '/events/create', icon: <EventIcon /> },
      { label: 'My Events', path: '/events', icon: <CalendarIcon /> },
      { label: 'Find Vendors', path: '/vendors', icon: <StoreIcon /> },
      { label: 'My Bookings', path: '/user/bookings', icon: <BookingIcon /> },
      { label: 'Messages', path: '/messages', icon: <MessageIcon /> },
      { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
    ];
  };

  const navigationItems = getNavigationItems();

  const handleSignOut = async () => {
    await signOut();
    setUserMenuAnchor(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // ─── SIDEBAR CONTENT (shared for both desktop + mobile drawer) ───────────
  const SidebarContent = ({ isMobile = false }) => {
    const getSidebarBackground = () => {
      return 'linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)';
    };

    const getSidebarOrbColors = () => {
      return {
        orb1: 'rgba(255, 255, 255, 0.1)',
        orb2: 'rgba(255, 255, 255, 0.08)',
      };
    };

    const orbColors = getSidebarOrbColors();

    return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: getSidebarBackground(),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background orbs */}
      <Box sx={{
        position: 'absolute', top: -60, right: -60,
        width: 180, height: 180,
        background: orbColors.orb1,
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'pulse 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: 100, left: -40,
        width: 140, height: 140,
        background: orbColors.orb2,
        borderRadius: '50%',
        filter: 'blur(35px)',
        animation: 'pulse 6s ease-in-out infinite 2s',
        pointerEvents: 'none',
      }} />

      {/* ── Logo + Collapse Button ── */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
        px: collapsed && !isMobile ? 1.5 : 2.5,
        py: 2.5,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {(!collapsed || isMobile) && (
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
            onClick={() => navigate(user
              ? (userRole === 'vendor' ? '/dashboard/vendor' : userRole === 'admin' ? '/dashboard/admin' : '/dashboard/user')
              : '/'
            )}
          >
            <Box sx={{
              width: 40, height: 40, borderRadius: '12px',
              background: getGradient(),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              flexShrink: 0,
              '&:hover': { transform: 'scale(1.08) rotate(-5deg)' },
            }}>
              <EventIcon sx={{ fontSize: 22, color: 'white' }} />
            </Box>
            <Box>
              <Typography sx={{
                fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em',
                background: getGradient(),
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                EventMaster
              </Typography>
              {user && isDashboardPage && (
                <Typography sx={{
                  color: 'rgba(255,255,255,0.45)',
                  fontWeight: 600, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  {userRole === 'vendor' ? 'Vendor Portal' : userRole === 'admin' ? 'Admin Panel' : 'Organizer'}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Collapsed logo only */}
        {collapsed && !isMobile && (
          <Box
            sx={{
              width: 40, height: 40, borderRadius: '12px',
              background: getGradient(),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'scale(1.08) rotate(-5deg)' },
            }}
            onClick={() => navigate('/')}
          >
            <EventIcon sx={{ fontSize: 22, color: 'white' }} />
          </Box>
        )}

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <IconButton
            onClick={toggleCollapsed}
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              ml: collapsed ? 0 : 1,
              mt: collapsed ? 1 : 0,
              display: { xs: 'none', md: 'flex' },
              '&:hover': { color: 'white', background: 'rgba(255,255,255,0.08)' },
              transition: 'all 0.2s ease',
            }}
          >
            {collapsed ? <ExpandIcon fontSize="small" /> : <CollapseIcon fontSize="small" />}
          </IconButton>
        )}

        {/* Mobile close button */}
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* ── Navigation Items ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1.5,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.15)', borderRadius: 4 },
      }}>
        {navigationItems.map((item, index) => {
          const active = isActive(item.path);
          
          // Dynamic colors based on user role
          const getActiveColors = () => {
            return {
              bg: 'rgba(255, 255, 255, 0.15)',
              border: 'rgba(255, 255, 255, 0.3)',
              shadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)',
              pill: 'rgba(255, 255, 255, 0.1)',
              accent: '#FFFFFF',
              iconColor: '#FFFFFF',
              glow: 'rgba(255, 255, 255, 0.6)',
            };
          };
          
          const colors = getActiveColors();
          
          return (
            <Tooltip
              key={item.path}
              title={collapsed && !isMobile ? item.label : ''}
              placement="right"
              arrow
            >
              <Box
                component={motion.div}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{
                  position: 'relative',
                  mx: 1.5, mb: 0.8,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                  gap: 1.5,
                  px: collapsed && !isMobile ? 1.5 : 2,
                  py: 1.4,
                  background: active 
                    ? colors.bg
                    : (hoveredItem === item.path ? 'rgba(255, 255, 255, 0.12)' : 'transparent'),
                  backdropFilter: active ? 'blur(10px)' : 'none',
                  border: active ? `1px solid ${colors.border}` : '1px solid transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: active ? colors.shadow : 'none',
                  overflow: 'hidden',
                  '&::before': active ? {
                    content: '""',
                    position: 'absolute',
                    left: 0, top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4, height: '50%',
                    background: colors.accent,
                    borderRadius: '0 4px 4px 0',
                    boxShadow: `0 0 10px ${colors.accent}`,
                  } : {},
                }}
              >
                {active && (
                  <Box
                    component={motion.div}
                    layoutId="active-pill"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: colors.pill,
                      borderRadius: 'inherit',
                      zIndex: -1,
                    }}
                  />
                )}
                <Box sx={{
                  color: active ? '#FFFFFF' : '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  transform: (hoveredItem === item.path || active) ? 'scale(1.1)' : 'scale(1)',
                  filter: active ? `drop-shadow(0 0 8px ${colors.glow})` : 'none',
                  opacity: active ? 1 : 0.8,
                  '& .MuiSvgIcon-root': { fontSize: 24 },
                }}>
                  {item.icon}
                </Box>
                {(!collapsed || isMobile) && (
                  <Typography sx={{
                    fontSize: '0.95rem',
                    fontWeight: active ? 700 : 600,
                    color: active ? '#FFFFFF' : '#FFFFFF',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    letterSpacing: active ? '0.01em' : '0',
                    opacity: active ? 1 : 0.9,
                  }}>
                    {item.label}
                  </Typography>
                )}
                {active && (!collapsed || isMobile) && (
                  <Box component={motion.div} 
                       initial={{ opacity: 0, x: -5 }}
                       animate={{ opacity: 1, x: 0 }}
                       sx={{ ml: 'auto' }}>
                    <ArrowIcon sx={{ color: colors.iconColor, fontSize: 18 }} />
                  </Box>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* ── User Section (bottom) ── */}
      {user && (
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', p: collapsed && !isMobile ? 1 : 2 }}>
          {isDashboardPage && (
            <Box sx={{
              mb: collapsed && !isMobile ? 0 : 1.5,
              display: 'flex',
              justifyContent: 'center',
            }}>
              <NotificationsMenu />
            </Box>
          )}

          <Box
            onClick={(e) => setUserMenuAnchor(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
              gap: 1.5,
              p: collapsed && !isMobile ? 1 : 1.5,
              borderRadius: '12px',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
              },
            }}
          >
            <Avatar sx={{
              width: 36, height: 36,
              background: getGradient(),
              fontSize: '0.95rem', fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              border: '2px solid rgba(255,255,255,0.15)',
              flexShrink: 0,
            }}>
              {user.email?.charAt(0).toUpperCase()}
            </Avatar>
            {(!collapsed || isMobile) && (
              <Box sx={{ overflow: 'hidden' }}>
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', noWrap: true }}>
                  {user.email?.split('@')[0]}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', textTransform: 'capitalize' }}>
                  {userRole || 'user'}
                </Typography>
              </Box>
            )}
          </Box>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={() => setUserMenuAnchor(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            PaperProps={{
              sx: {
                borderRadius: 3, minWidth: 220,
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                overflow: 'hidden',
              }
            }}
          >
            <Box sx={{ px: 2.5, py: 2, background: 'rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'white' }}>
                {user.email?.split('@')[0]}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                {user.email}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            {[
              { label: 'Profile', icon: <PersonIcon fontSize="small" />, path: '/profile' },
              { label: 'Notifications', icon: <NotificationsIcon fontSize="small" />, path: '/notifications' },
              { label: 'Settings', icon: <SettingsIcon fontSize="small" />, path: '/settings' },
            ].map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => { navigate(item.path); setUserMenuAnchor(null); }}
                sx={{
                  py: 1.5, px: 2.5, gap: 1.5, color: 'rgba(255,255,255,0.85)',
                  '&:hover': { 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    color: 'white' 
                  },
                }}
              >
                <Box sx={{ color: '#FFFFFF' }}>{item.icon}</Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.label}</Typography>
              </MenuItem>
            ))}
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <MenuItem
              onClick={handleSignOut}
              sx={{
                py: 1.5, px: 2.5, gap: 1.5, color: '#FCA5A5',
                '&:hover': { background: 'rgba(239,68,68,0.15)', color: '#FCA5A5' },
              }}
            >
              <LogoutIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      )}

      {/* Guest buttons at bottom */}
      {!user && (!collapsed || isMobile) && (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            fullWidth
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: 2, py: 1.2, fontWeight: 700,
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.15)',
              '&:hover': { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.3)' },
            }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate('/register')}
            sx={{
              borderRadius: 2, py: 1.2, fontWeight: 700,
              background: getGradient(),
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.5)' },
            }}
          >
            Get Started
          </Button>
        </Box>
      )}
    </Box>
  );
  };

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: sidebarWidth,
          zIndex: 1200,
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
          '@keyframes pulse': {
            '0%,100%': { transform: 'scale(1)', opacity: 0.8 },
            '50%': { transform: 'scale(1.2)', opacity: 1 },
          },
        }}
      >
        <SidebarContent />
      </Box>

      {/* ── Mobile Top Bar ── */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: 64,
          zIndex: 1200,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px',
            background: getGradient(),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}>
            <EventIcon sx={{ fontSize: 20, color: 'white' }} />
          </Box>
          <Typography sx={{
            fontWeight: 900, fontSize: '1rem',
            background: getGradient(),
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            EventMaster
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user && isDashboardPage && <NotificationsMenu />}
          <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'rgba(255,255,255,0.8)' }}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      {/* ── Mobile Drawer ── */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            border: 'none',
            background: 'transparent',
          }
        }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <SidebarContent isMobile />
      </Drawer>

      {/* ── Spacer so content doesn't go under sidebar ── */}
      {/* Desktop uses left margin via Layout, mobile uses top padding */}
    </>
  );
};

export default Header;
