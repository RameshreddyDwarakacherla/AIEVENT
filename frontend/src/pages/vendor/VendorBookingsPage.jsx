import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Chip, Tabs, Tab, 
  Avatar, Button, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, LinearProgress, Divider, Tooltip
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import MessageIcon from '@mui/icons-material/Message';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { toast } from 'react-toastify';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

/* ── shared glass card style ── */
const glass = {
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
};

const VendorBookingsPage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookings, setBookings] = useState([]);

  // Load bookings from API on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/vendor');
      if (res.success) {
        const formattedBookings = res.data.map(booking => ({
          id: booking._id,
          eventName: booking.eventName || booking.eventId?.title || 'Event',
          clientName: booking.userId?.firstName ? `${booking.userId.firstName} ${booking.userId.lastName || ''}` : 'Client',
          clientEmail: booking.userId?.email || '',
          clientId: booking.userId?._id || booking.userId,
          service: booking.serviceType || 'Service',
          date: booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : 'TBD',
          time: '6:00 PM', // Might need real time if added to backend
          guests: booking.guestCount || 0,
          amount: booking.amount || 0,
          status: booking.status,
          notes: booking.notes || 'No special notes'
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
      case 'cancelled': 
      case 'rejected': return '#EF4444';
      default: return 'rgba(255,255,255,0.4)';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return booking.status === 'pending';
    if (tabValue === 2) return booking.status === 'confirmed';
    if (tabValue === 3) return ['completed', 'cancelled', 'rejected'].includes(booking.status);
    return true;
  });

  const handleAcceptBooking = async (bookingId) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: 'confirmed' });
      if (res.success) {
        const updatedBookings = bookings.map(b => 
          b.id === bookingId ? { ...b, status: 'confirmed' } : b
        );
        setBookings(updatedBookings);
        toast.success('Booking accepted successfully');
        setDetailsOpen(false);
      } else {
        toast.error('Failed to accept booking');
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast.error('An error occurred');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: 'rejected' });
      if (res.success) {
        const updatedBookings = bookings.map(b => 
          b.id === bookingId ? { ...b, status: 'rejected' } : b
        );
        setBookings(updatedBookings);
        toast.info('Booking rejected');
        setDetailsOpen(false);
      } else {
        toast.error('Failed to reject booking');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('An error occurred');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleContactClient = (booking) => {
    navigate('/messages', { 
      state: { 
        preselectUserId: booking.clientId, 
        preselectUserName: booking.clientName 
      } 
    });
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
      {/* Mesh and Glow Orbs */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none', zIndex: 0
      }} />
      {[
        { w: 600, h: 600, t: -200, l: -100, c: 'rgba(139, 92, 246, 0.1)' },
        { w: 400, h: 400, b: -50, r: -50, c: 'rgba(236, 72, 153, 0.08)' },
      ].map((o, i) => (
        <Box key={i} sx={{
          position: 'absolute', width: o.w, height: o.h, top: o.t, left: o.l, right: o.r, bottom: o.b,
          background: o.c, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
        }} />
      ))}

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ 
          mb: 6,
          animation: 'fadeInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes fadeInDown': {
            from: { opacity: 0, transform: 'translateY(-20px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 900, mb: 1.5, letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}
          >
            Bookings Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              {stats.total} lifecycle requests
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', height: 20, mt: 1 }} />
            <Chip 
              icon={<AccessTimeIcon sx={{ fontSize: '14px !important', color: '#F59E0B !important' }} />}
              label={`${stats.pending} pending priorities`} 
              size="small"
              sx={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontWeight: 700, border: '1px solid rgba(245, 158, 11, 0.2)' }} 
            />
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { title: 'Total Vol.', value: stats.total, color: '#8B5CF6' },
            { title: 'In Queue', value: stats.pending, color: '#F59E0B' },
            { title: 'Secured', value: stats.confirmed, color: '#10B981' },
            { title: 'Completed', value: stats.completed, color: '#3B82F6' }
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box
                sx={{
                  ...glass, p: 3, 
                  transition: 'all 0.3s ease',
                  animation: `zoomIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`,
                  '@keyframes zoomIn': { from: { opacity: 0, transform: 'scale(0.9)' }, to: { opacity: 1, transform: 'scale(1)' } },
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    background: 'rgba(255, 255, 255, 0.07)',
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: stat.color }}>
                  {stat.value}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(stat.value/40)*100} 
                  sx={{ 
                    mt: 2, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)',
                    '& .MuiLinearProgress-bar': { background: stat.color }
                  }} 
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Tabs and Content Container */}
        <Box sx={{ ...glass, overflow: 'hidden', mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            sx={{
              background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)',
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'none', minHeight: 64 },
              '& .Mui-selected': { color: '#8B5CF6 !important' },
              '& .MuiTabs-indicator': { height: 3, background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }
            }}
          >
            <Tab label="Everything" />
            <Tab label="Needs Review" />
            <Tab label="Scheduled" />
            <Tab label="Archived" />
          </Tabs>

          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {filteredBookings.length > 0 ? (
              <Grid container spacing={3}>
                {filteredBookings.map((booking, index) => (
                  <Grid item xs={12} md={6} key={booking.id}>
                    <Box
                      sx={{
                        ...glass, background: 'rgba(255,255,255,0.02)', p: 3,
                        transition: 'all 0.3s ease',
                        animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both',
                        '@keyframes fadeInUp': { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                        '&:hover': { background: 'rgba(255,255,255,0.04)', borderColor: '#8B5CF650' }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', mb: 0.5 }}>{booking.eventName}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{booking.service}</Typography>
                        </Box>
                        <Chip 
                          label={booking.status} 
                          size="small"
                          sx={{ 
                            background: `${getStatusColor(booking.status)}15`, 
                            color: getStatusColor(booking.status),
                            fontWeight: 800, border: `1px solid ${getStatusColor(booking.status)}25`,
                            textTransform: 'uppercase', fontSize: '10px'
                          }} 
                        />
                      </Box>

                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{booking.clientName}</Typography>
                              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Organizer</Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <AttachMoneyIcon fontSize="small" />
                            </Box>
                            <Box>
                              <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>${booking.amount.toLocaleString()}</Typography>
                              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Estimate</Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ p: 2, background: 'rgba(255,255,255,0.02)', borderRadius: '16px', display: 'flex', gap: 3, mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <EventIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }} />
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{booking.date}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <GroupIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }} />
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{booking.guests} Guests</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Button 
                          fullWidth 
                          onClick={() => handleViewDetails(booking)}
                          sx={{ 
                            ...glass, background: 'rgba(255,255,255,0.05)', color: 'white', 
                            textTransform: 'none', fontWeight: 700, borderRadius: '12px', py: 1.2
                          }}
                        >
                          Overview
                        </Button>
                        {booking.status === 'pending' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              onClick={() => handleAcceptBooking(booking.id)}
                              sx={{ background: '#10B98120', color: '#10B981', '&:hover': { background: '#10B981' } }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleRejectBooking(booking.id)}
                              sx={{ background: '#EF444420', color: '#EF4444', '&:hover': { background: '#EF4444' } }}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <Box sx={{ 
                  width: 140, height: 140, borderRadius: '40px', background: 'rgba(139, 92, 246, 0.05)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 4,
                  animation: 'pulse 3s infinite',
                  '@keyframes pulse': { '0%, 100%': { transform: 'scale(1)', opacity: 0.5 }, '50%': { transform: 'scale(1.05)', opacity: 1 } }
                }}>
                  <EventIcon sx={{ fontSize: 60, color: '#8B5CF6' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>No Active Assignments</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', maxWidth: 500, mx: 'auto', mb: 4, lineHeight: 1.7 }}>
                  We couldn't find any bookings matching this category. If you're looking for new leads, check your global marketplace or update your service catalog.
                </Typography>
                <Button 
                  endIcon={<ArrowRightAltIcon />}
                  sx={{ color: '#8B5CF6', fontWeight: 800, textTransform: 'none', '&:hover': { letterSpacing: '0.1em' }, transition: 'all 0.4s' }}
                >
                  Discover Marketplace Opportunities
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Booking Details Dialog - Dark Theme */}
      <Dialog 
        open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { ...glass, background: '#111', color: 'white', p: 2 } }}
      >
        {selectedBooking && (
          <>
            <DialogTitle sx={{ fontWeight: 900, fontSize: '1.8rem', pb: 1 }}>
              Booking Intelligence
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                   <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', mb: 1, letterSpacing: '0.1em' }}>Target Event</Typography>
                   <Typography variant="h5" sx={{ fontWeight: 700 }}>{selectedBooking.eventName}</Typography>
                   <Typography sx={{ color: '#8B5CF6', fontWeight: 600 }}>{selectedBooking.service}</Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 800, mb: 1 }}>CLIENT INFO</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{selectedBooking.clientName}</Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                       <MessageIcon sx={{ fontSize: 14, color: '#3B82F6' }} />
                       <Typography onClick={() => handleContactClient(selectedBooking)} sx={{ fontSize: '0.75rem', color: '#3B82F6', fontWeight: 700, cursor: 'pointer' }}>Contact Client</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 800, mb: 1 }}>SCHEDULING</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{selectedBooking.date}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{selectedBooking.time}</Typography>
                  </Grid>
                </Grid>
                <Box sx={{ p: 2, background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 800, mb: 1 }}>SPECIAL NOTES</Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{selectedBooking.notes}</Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 4, gap: 1 }}>
              <Button onClick={() => setDetailsOpen(false)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none', fontWeight: 700 }}>Dismiss</Button>
              {selectedBooking.status === 'pending' ? (
                <>
                  <Button variant="outlined" color="error" onClick={() => handleRejectBooking(selectedBooking.id)} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>Reject</Button>
                  <Button variant="contained" onClick={() => handleAcceptBooking(selectedBooking.id)} sx={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3 }}>Approve Request</Button>
                </>
              ) : (
                <Button variant="outlined" color="error" onClick={() => handleRejectBooking(selectedBooking.id)} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>Cancel Booking</Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default VendorBookingsPage;
