import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Chip, Tabs, Tab, 
  Avatar, Button, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, Divider
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MessageIcon from '@mui/icons-material/Message';
import RateReviewIcon from '@mui/icons-material/RateReview';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';
import { api } from '../../lib/api';

/* ── shared glass card style ── */
const glass = {
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
};

const MyBookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;
    try {
      const res = await api.get('/bookings');
      if (res.success) {
        const formattedBookings = res.data.map(booking => ({
          id: booking._id,
          eventName: booking.eventName || booking.eventId?.title || 'Event',
          vendorName: booking.vendorId?.companyName || 'Vendor',
          vendorId: booking.vendorId?._id || booking.vendorId,
          vendorUserId: booking.vendorId?.userId?._id || booking.vendorId?.userId,
          service: booking.serviceType || 'Service',
          date: booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : 'TBD',
          guestCount: booking.guestCount || 0,
          budget: booking.amount || 0,
          status: booking.status,
          notes: booking.notes || 'No notes'
        }));
        setBookings(formattedBookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'completed': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return 'rgba(255,255,255,0.4)';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return booking.status === 'pending';
    if (tabValue === 2) return booking.status === 'confirmed';
    if (tabValue === 3) return booking.status === 'completed';
    return true;
  });

  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      if (res.success) {
        const updatedBookings = bookings.map(b => 
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        );
        setBookings(updatedBookings);
        toast.info('Booking cancelled');
        setDetailsOpen(false);
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('An error occurred');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleContactVendor = (booking) => {
    navigate('/messages', { 
      state: { 
        preselectUserId: booking.vendorUserId, 
        preselectUserName: booking.vendorName 
      } 
    });
  };

  const handleLeaveReview = (bookingId) => {
    toast.info('Review feature coming soon!');
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d1117 0%, #1a0533 55%, #0d1117 100%)',
      p: { xs: 2, md: 4, lg: 6 },
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* Background Effects */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none', zIndex: 0
      }} />
      {[
        { w: 500, h: 500, t: -100, l: -100, c: 'rgba(139, 92, 246, 0.08)' },
        { w: 300, h: 300, b: 50, r: 0, c: 'rgba(236, 72, 153, 0.06)' },
      ].map((o, i) => (
        <Box key={i} sx={{
          position: 'absolute', width: o.w, height: o.h, top: o.t, left: o.l, right: o.r, bottom: o.b,
          background: o.c, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
        }} />
      ))}

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 6, animation: 'fadeInDown 0.8s ease-out', '@keyframes fadeInDown': { from: { opacity: 0, transform: 'translateY(-20px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            My Bookings
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
            {stats.total} total reservations • {stats.confirmed} active events
          </Typography>
        </Box>

        {/* Stats Summary */}
        <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap' }}>
          {[
            { label: 'All', val: stats.total, color: '#8B5CF6' },
            { label: 'Pending', val: stats.pending, color: '#F59E0B' },
            { label: 'Confirmed', val: stats.confirmed, color: '#10B981' },
            { label: 'Past', val: stats.completed, color: '#3B82F6' },
          ].map((s, i) => (
            <Box key={i} sx={{ ...glass, px: 3, py: 2, flex: 1, minWidth: 150, borderLeft: `4px solid ${s.color}` }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', mb: 0.5 }}>{s.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>{s.val}</Typography>
            </Box>
          ))}
        </Box>

        {/* Tabs Control */}
        <Box sx={{ ...glass, background: 'rgba(255,255,255,0.02)', mb: 4, borderRadius: '20px' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            sx={{
              px: 2,
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'none', minHeight: 60, fontSize: '1rem' },
              '& .Mui-selected': { color: '#8B5CF6 !important' },
              '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', height: 3 }
            }}
          >
            <Tab label="Explore All" />
            <Tab label="Pending" />
            <Tab label="Upcoming" />
            <Tab label="History" />
          </Tabs>
        </Box>

        {/* Bookings Display */}
        {filteredBookings.length > 0 ? (
          <Grid container spacing={3}>
            {filteredBookings.map((booking, index) => (
              <Grid item xs={12} md={6} lg={4} key={booking.id}>
                <Card sx={{ 
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08))',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '28px',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`,
                  '@keyframes slideInUp': { 
                    from: { opacity: 0, transform: 'translateY(40px) scale(0.95)' }, 
                    to: { opacity: 1, transform: 'translateY(0) scale(1)' } 
                  },
                  '&:hover': { 
                    transform: 'translateY(-12px) scale(1.02)',
                    borderColor: 'rgba(139, 92, 246, 0.5)',
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.12))',
                    boxShadow: '0 25px 50px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.1)',
                    '& .status-glow': {
                      opacity: 1,
                      transform: 'scale(1.1)'
                    },
                    '& .card-content': {
                      transform: 'translateY(-2px)'
                    },
                    '& .action-buttons': {
                      transform: 'translateY(-4px)'
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: `linear-gradient(90deg, ${getStatusColor(booking.status)}, ${getStatusColor(booking.status)}80, ${getStatusColor(booking.status)}40)`,
                    borderRadius: '28px 28px 0 0'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    background: `linear-gradient(45deg, ${getStatusColor(booking.status)}20, transparent, ${getStatusColor(booking.status)}10)`,
                    borderRadius: '30px',
                    zIndex: -1,
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover::after': {
                    opacity: 1
                  }
                }}>
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header Section with Animation */}
                    <Box 
                      className="card-content"
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        mb: 3,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <Box sx={{ flex: 1, mr: 2 }}>
                        <Typography sx={{ 
                          fontWeight: 900, 
                          fontSize: '1.4rem', 
                          mb: 0.5,
                          background: 'linear-gradient(135deg, #ffffff, #e0e0e0)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {booking.eventName}
                        </Typography>
                        <Typography sx={{ 
                          color: '#8B5CF6', 
                          fontWeight: 700, 
                          fontSize: '0.95rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {booking.service}
                        </Typography>
                      </Box>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          className="status-glow"
                          sx={{
                            position: 'absolute',
                            inset: -8,
                            background: `radial-gradient(circle, ${getStatusColor(booking.status)}30, transparent)`,
                            borderRadius: '50%',
                            opacity: 0,
                            transition: 'all 0.3s ease',
                            zIndex: 0
                          }}
                        />
                        <Chip 
                          label={booking.status.toUpperCase()} 
                          size="small"
                          sx={{ 
                            background: `linear-gradient(135deg, ${getStatusColor(booking.status)}25, ${getStatusColor(booking.status)}15)`,
                            color: getStatusColor(booking.status),
                            fontWeight: 900, 
                            fontSize: '11px', 
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            border: `2px solid ${getStatusColor(booking.status)}40`,
                            px: 2,
                            py: 0.5,
                            position: 'relative',
                            zIndex: 1,
                            boxShadow: `0 4px 12px ${getStatusColor(booking.status)}30`,
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              inset: 0,
                              background: `linear-gradient(135deg, ${getStatusColor(booking.status)}10, transparent)`,
                              borderRadius: 'inherit',
                              animation: 'pulse 2s infinite'
                            },
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 0.5 },
                              '50%': { opacity: 1 }
                            }
                          }} 
                        />
                      </Box>
                    </Box>

                    {/* Enhanced Info Section */}
                    <Box sx={{ 
                      mb: 4, 
                      p: 3, 
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.15))',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '20px', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                      }
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        p: 1.5,
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.1)',
                          transform: 'translateX(4px)'
                        }
                      }}>
                        <Box sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                        }}>
                          <EventIcon sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ 
                            fontWeight: 800, 
                            fontSize: '1rem',
                            color: 'white',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}>
                            {booking.date}
                          </Typography>
                          <Typography sx={{ 
                            color: 'rgba(255,255,255,0.6)', 
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}>
                            Event Date
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        p: 1.5,
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.1)',
                          transform: 'translateX(4px)'
                        }
                      }}>
                        <Box sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}>
                          <PersonIcon sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ 
                            fontWeight: 800, 
                            fontSize: '1rem',
                            color: 'white',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}>
                            {booking.vendorName}
                          </Typography>
                          <Typography sx={{ 
                            color: 'rgba(255,255,255,0.6)', 
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}>
                            Service Provider
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        p: 1.5,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(16, 185, 129, 0.1))',
                          transform: 'translateX(4px)'
                        }
                      }}>
                        <Box sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                        }}>
                          <AttachMoneyIcon sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ 
                            fontWeight: 900, 
                            fontSize: '1.2rem',
                            color: '#10B981',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}>
                            ${booking.budget?.toLocaleString()}
                          </Typography>
                          <Typography sx={{ 
                            color: 'rgba(255,255,255,0.6)', 
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}>
                            Total Investment
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Enhanced Action Buttons */}
                    <Box 
                      className="action-buttons"
                      sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        mt: 'auto',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <Button 
                        fullWidth 
                        onClick={() => handleViewDetails(booking)}
                        sx={{ 
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'white', 
                          textTransform: 'none', 
                          fontWeight: 800, 
                          borderRadius: '16px', 
                          py: 1.5,
                          fontSize: '1rem',
                          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transition: 'left 0.5s ease'
                          },
                          '&:hover': {
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(255, 255, 255, 0.15)',
                            '&::before': {
                              left: '100%'
                            }
                          }
                        }}
                      >
                        View Details
                      </Button>
                      
                      <IconButton 
                        onClick={() => handleContactVendor(booking)} 
                        sx={{ 
                          background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                          color: 'white',
                          borderRadius: '16px',
                          width: 56,
                          height: 56,
                          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)',
                            transform: 'scale(1.1) rotate(5deg)',
                            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.6)'
                          }
                        }}
                      >
                        <MessageIcon />
                      </IconButton>
                      
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <IconButton 
                          onClick={() => handleCancelBooking(booking.id)} 
                          sx={{ 
                            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                            color: 'white',
                            borderRadius: '16px',
                            width: 56,
                            height: 56,
                            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                              transform: 'scale(1.1) rotate(-5deg)',
                              boxShadow: '0 8px 25px rgba(239, 68, 68, 0.6)'
                            }
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ ...glass, p: 8, textAlign: 'center', py: 12 }}>
            <Box sx={{ width: 120, height: 120, borderRadius: '40px', background: 'rgba(139, 92, 246, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 4 }}>
              <SearchIcon sx={{ fontSize: 50, color: 'rgba(255,255,255,0.2)' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Universe of emptiness here</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', maxWidth: 450, mx: 'auto', mb: 5, lineHeight: 1.7 }}>
              You don't have any bookings yet. Start your journey by finding the most elite vendors in our marketplace.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/vendors')}
              sx={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', borderRadius: '16px', py: 1.8, px: 5, fontWeight: 900, textTransform: 'none', boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)' }}
            >
              Discover Vendors
            </Button>
          </Box>
        )}
      </Box>

      {/* Detail Intelligence Dialog */}
      <Dialog 
        open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { ...glass, background: '#111', color: 'white', p: 1 } }}
      >
        {selectedBooking && (
          <>
            <DialogTitle sx={{ fontWeight: 900, fontSize: '1.8rem', pt: 3 }}>Booking Insight</DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                <Box>
                   <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', mb: 1 }}>Subject Event</Typography>
                   <Typography variant="h5" sx={{ fontWeight: 800 }}>{selectedBooking.eventName}</Typography>
                   <Typography sx={{ color: '#8B5CF6', fontWeight: 700 }}>{selectedBooking.service}</Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 800, mb: 1 }}>CHOSEN VENDOR</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{selectedBooking.vendorName}</Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                       <MessageIcon sx={{ fontSize: 14, color: '#3B82F6' }} />
                       <Typography onClick={() => handleContactVendor(selectedBooking)} sx={{ fontSize: '0.75rem', color: '#3B82F6', fontWeight: 700, cursor: 'pointer' }}>Contact</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 800, mb: 1 }}>DATE & SCALE</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{selectedBooking.date}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{selectedBooking.guestCount} Experts</Typography>
                  </Grid>
                </Grid>
                <Box sx={{ p: 2.5, background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 800, mb: 1 }}>FINANCIAL QUOTE</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#10B981' }}>${selectedBooking.budget?.toLocaleString()}</Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 4, gap: 1 }}>
              <Button onClick={() => setDetailsOpen(false)} sx={{ color: 'rgba(255,255,255,0.3)', textTransform: 'none', fontWeight: 700 }}>Back</Button>
              {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') && (
                <Button variant="outlined" color="error" onClick={() => handleCancelBooking(selectedBooking.id)} sx={{ border: '2px solid', borderRadius: '12px', textTransform: 'none', fontWeight: 900 }}>Cancel Request</Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MyBookingsPage;
