import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, CircularProgress,
  Avatar, LinearProgress, IconButton, Tooltip, Tab, Tabs, Badge
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { toast } from 'react-toastify';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line
} from 'recharts';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format } from 'date-fns';

const VendorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);

  const revenueData = [
    { month: 'Jan', revenue: 2800 }, { month: 'Feb', revenue: 4200 }, { month: 'Mar', revenue: 3600 },
    { month: 'Apr', revenue: 5800 }, { month: 'May', revenue: 7100 }, { month: 'Jun', revenue: 9400 },
  ];

  const stats = {
    totalRevenue: bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.amount || 0), 0),
    activeBookings: bookings.filter(b => b.status === 'confirmed').length,
    pendingRequests: bookings.filter(b => b.status === 'pending').length,
    avgRating: vendorProfile?.avgRating || 0,
    totalReviews: vendorProfile?.totalReviews || reviews.length,
  };

  useEffect(() => {
    fetchVendorData();
  }, [user]);

  const fetchVendorData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [profileRes, bookingsRes, reviewsRes] = await Promise.allSettled([
        api.get('/vendors/profile/me'),
        api.get('/bookings/vendor'),
        api.get('/reviews/my-vendor-reviews'),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value.success) {
        setVendorProfile(profileRes.value.data);
      }
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.success) {
        const allBookings = bookingsRes.value.data || [];
        setBookings(allBookings);
        setPendingBookings(allBookings.filter(b => b.status === 'pending'));
      }
      if (reviewsRes.status === 'fulfilled' && reviewsRes.value.success) {
        setReviews(reviewsRes.value.data || []);
      }
    } catch (err) {
      console.error('Vendor dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: action });
      if (res.success) {
        toast.success(`Booking ${action}!`);
        fetchVendorData();
      }
    } catch (err) {
      toast.error('Failed to update booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'completed': return '#6366f1';
      case 'cancelled':
      case 'rejected': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '80vh',
        background: 'linear-gradient(135deg, #0d1117 0%, #1a0533 50%, #0d1117 100%)'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#8b5cf6', mb: 2 }} size={60} />
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Loading vendor dashboard...</Typography>
        </Box>
      </Box>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <AttachMoneyIcon />, color: '#10b981', change: '+12%' },
    { title: 'Active Bookings', value: stats.activeBookings, icon: <EventIcon />, color: '#6366f1', change: 'Current' },
    { title: 'Pending Requests', value: stats.pendingRequests, icon: <PendingIcon />, color: '#f59e0b', change: 'Needs action' },
    { title: 'Total Bookings', value: bookings.length, icon: <StorefrontIcon />, color: '#8b5cf6', change: 'All time' },
    { title: 'Average Rating', value: stats.avgRating.toFixed(1), icon: <StarIcon />, color: '#ec4899', change: `${stats.totalReviews} reviews` },
    { title: 'Profile Views', value: '1.2K', icon: <VisibilityIcon />, color: '#06b6d4', change: '+18% this week' },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1117 0%, #1a0533 50%, #0d1117 100%)',
      p: { xs: 2, sm: 3, md: 4 },
      fontFamily: '"Inter", "Roboto", sans-serif',
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Background orbs */}
      {[...Array(4)].map((_, i) => (
        <Box key={i} sx={{
          position: 'fixed',
          borderRadius: '50%',
          background: ['rgba(139,92,246,0.12)', 'rgba(236,72,153,0.09)', 'rgba(16,185,129,0.08)', 'rgba(99,102,241,0.10)'][i],
          width: `${200 + i * 120}px`,
          height: `${200 + i * 120}px`,
          top: `${[8, 55, 75, 25][i]}%`,
          left: `${[5, 65, 15, 80][i]}%`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}

      <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* Header */}
        <Box sx={{
          display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' },
          mb: { xs: 3, md: 4 }, flexWrap: 'wrap', gap: 2,
          animation: 'slideDown 0.5s ease-out',
          '@keyframes slideDown': { from: { opacity: 0, transform: 'translateY(-20px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              width: 56, height: 56, fontWeight: 800, fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              boxShadow: '0 8px 24px rgba(139,92,246,0.4)'
            }}>
              {vendorProfile?.companyName?.[0] || user?.firstName?.[0] || 'V'}
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: '#8b5cf6', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Vendor Portal
              </Typography>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.2 }}>
                {vendorProfile?.companyName || 'Your Business'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                  {vendorProfile?.vendorType || 'General'}
                </Typography>
                {vendorProfile?.isVerified && (
                  <Chip label="✓ Verified" size="small" sx={{ background: '#10b98120', color: '#10b981', fontWeight: 700, fontSize: '0.65rem', borderRadius: 1, height: 18 }} />
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchVendorData} sx={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { color: 'white', borderColor: '#8b5cf6' } }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              onClick={() => navigate('/vendor/profile')}
              sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: 3, '&:hover': { borderColor: '#8b5cf6', color: 'white', background: 'rgba(139,92,246,0.1)' } }}
            >
              Edit Profile
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/vendor/services/add')}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                borderRadius: 3, fontWeight: 700, boxShadow: '0 8px 24px rgba(139,92,246,0.4)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(139,92,246,0.5)' },
                transition: 'all 0.2s ease'
              }}
            >
              Add Service
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
          {statCards.map((stat, index) => (
            <Grid item xs={6} sm={4} md={4} lg={2} key={stat.title}>
              <Card sx={{
                borderRadius: 3, cursor: 'default',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'all 0.3s ease',
                animation: `slideUp 0.5s ease-out ${index * 0.07}s both`,
                '@keyframes slideUp': { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                '&:hover': {
                  transform: 'translateY(-6px)', border: `1px solid ${stat.color}35`,
                  boxShadow: `0 16px 40px ${stat.color}20`,
                },
                position: 'relative', overflow: 'hidden',
                '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: stat.color }
              }}>
                <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: 2, mb: 2,
                    background: `${stat.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    '& .MuiSvgIcon-root': { fontSize: 20, color: stat.color }
                  }}>
                    {stat.icon}
                  </Box>
                  <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, display: 'block', mt: 0.5, fontSize: '0.75rem' }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: stat.color, fontWeight: 700, fontSize: '0.68rem' }}>
                    {stat.change}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{
              '& .MuiTabs-indicator': { background: '#8b5cf6', height: 3, borderRadius: 2 },
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'none', '&.Mui-selected': { color: '#a78bfa' } }
            }}
          >
            <Tab label="📊 Overview" />
            <Tab label={
              <Badge badgeContent={pendingBookings.length} color="warning" sx={{ '& .MuiBadge-badge': { fontWeight: 700 } }}>
                <span style={{ paddingRight: pendingBookings.length > 0 ? 12 : 0 }}>📋 Bookings</span>
              </Badge>
            } />
            <Tab label="⭐ Reviews" />
          </Tabs>
        </Box>

        {tab === 0 && (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {/* Revenue Chart */}
            <Grid item xs={12} md={12} lg={8}>
              <Card sx={{
                borderRadius: 4,
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>Revenue Overview</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 3 }}>Monthly earnings trend</Typography>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                      <ReTooltip
                        contentStyle={{ background: '#1a0533', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, color: 'white' }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#revenueGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions + Stats */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2.5 }}>Quick Actions</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {[
                        { label: 'Manage Services', icon: '🛠️', path: '/vendor/services', color: '#8b5cf6' },
                        { label: 'View Bookings', icon: '📋', path: '/vendor/bookings', color: '#10b981' },
                        { label: 'Reviews & Ratings', icon: '⭐', path: '/vendor/reviews', color: '#f59e0b' },
                        { label: 'Update Profile', icon: '✏️', path: '/vendor/profile', color: '#ec4899' },
                      ].map(action => (
                        <Box key={action.label} onClick={() => navigate(action.path)} sx={{
                          p: 1.5, borderRadius: 2.5, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 2,
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          transition: 'all 0.2s ease',
                          '&:hover': { background: `${action.color}15`, border: `1px solid ${action.color}35`, transform: 'translateX(4px)' }
                        }}>
                          <Typography sx={{ fontSize: '1.2rem' }}>{action.icon}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.85rem' }}>{action.label}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Rating Overview */}
                <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>Rating Overview</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography sx={{ color: 'white', fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>
                        {stats.avgRating.toFixed(1)}
                      </Typography>
                      <Box>
                        <Box sx={{ display: 'flex', gap: 0.3, mb: 0.5 }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <StarIcon key={s} sx={{ fontSize: 18, color: s <= Math.round(stats.avgRating) ? '#f59e0b' : 'rgba(255,255,255,0.15)' }} />
                          ))}
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{stats.totalReviews} reviews</Typography>
                      </Box>
                    </Box>
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = reviews.filter(r => Math.round(r.rating) === star).length;
                      return (
                        <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                          <StarIcon sx={{ fontSize: 13, color: '#f59e0b' }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', width: 8 }}>{star}</Typography>
                          <LinearProgress variant="determinate" value={reviews.length > 0 ? (count / reviews.length) * 100 : 0}
                            sx={{ flex: 1, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { background: '#f59e0b', borderRadius: 3 } }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', width: 20, textAlign: 'right' }}>{count}</Typography>
                        </Box>
                      );
                    })}
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            {/* Pending Bookings */}
            {pendingBookings.length > 0 && (
              <Grid item xs={12}>
                <Card sx={{
                  borderRadius: 4,
                  background: 'rgba(245,158,11,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(245,158,11,0.2)',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                          ⏳ Pending Booking Requests ({pendingBookings.length})
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                          Respond to these requests to maintain your response rate
                        </Typography>
                      </Box>
                      <Button onClick={() => navigate('/vendor/bookings')} sx={{ color: '#f59e0b', fontWeight: 600 }}>View All</Button>
                    </Box>
                    <Grid container spacing={2}>
                      {pendingBookings.slice(0, 3).map((booking, idx) => (
                        <Grid item xs={12} md={4} key={booking._id || idx}>
                          <Box sx={{ p: 2.5, borderRadius: 3, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.15)' }}>
                            <Typography sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                              {booking.eventName || booking.eventId?.title || 'Event'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', display: 'block', mb: 1.5 }}>
                              Client: {booking.userId?.firstName} {booking.userId?.lastName}
                              {booking.amount ? ` • $${booking.amount.toLocaleString()}` : ''}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button size="small" variant="contained"
                                onClick={() => handleBookingAction(booking._id, 'confirmed')}
                                sx={{ flex: 1, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: 2, fontWeight: 600, fontSize: '0.75rem' }}>
                                Accept
                              </Button>
                              <Button size="small" variant="outlined"
                                onClick={() => handleBookingAction(booking._id, 'rejected')}
                                sx={{ borderColor: '#ef444440', color: '#ef4444', borderRadius: 2, fontWeight: 600, fontSize: '0.75rem', '&:hover': { borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' } }}>
                                Decline
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}

        {tab === 1 && (
          <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>All Bookings ({bookings.length})</Typography>
                <Button onClick={() => navigate('/vendor/bookings')} sx={{ color: '#8b5cf6', fontWeight: 600 }}>Full View</Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {bookings.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <EventIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', mb: 1 }}>No bookings yet</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)' }}>Bookings will appear here when clients book your services</Typography>
                  </Box>
                ) : (
                  bookings.map((b, idx) => (
                    <Box key={b._id || idx} sx={{
                      p: 2.5, borderRadius: 3,
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${getStatusColor(b.status)}25`,
                      display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
                    }}>
                      <Avatar sx={{ background: `${getStatusColor(b.status)}30`, color: getStatusColor(b.status), fontWeight: 800, width: 40, height: 40 }}>
                        {(b.userId?.firstName || 'U')[0]}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                          {b.eventName || b.eventId?.title || 'Event'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
                          {b.userId?.firstName} {b.userId?.lastName} • {b.serviceType || 'Service'}
                          {b.amount ? ` • $${b.amount.toLocaleString()}` : ''}
                        </Typography>
                      </Box>
                      <Chip label={b.status} size="small" sx={{
                        background: `${getStatusColor(b.status)}20`, color: getStatusColor(b.status),
                        fontWeight: 700, fontSize: '0.7rem', borderRadius: 1.5
                      }} />
                      {b.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" onClick={() => handleBookingAction(b._id, 'confirmed')} sx={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', '&:hover': { background: 'rgba(16,185,129,0.3)' } }}>
                            <ThumbUpIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleBookingAction(b._id, 'rejected')} sx={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', '&:hover': { background: 'rgba(239,68,68,0.3)' } }}>
                            <ThumbDownIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {tab === 2 && (
          <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>Customer Reviews ({reviews.length})</Typography>
                <Button onClick={() => navigate('/vendor/reviews')} sx={{ color: '#f59e0b', fontWeight: 600 }}>Manage Reviews</Button>
              </Box>
              {reviews.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <StarIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>No reviews yet</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', display: 'block', mt: 1 }}>Complete bookings to start receiving reviews!</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {reviews.map((review, idx) => (
                    <Box key={review._id || idx} sx={{
                      p: 3, borderRadius: 3,
                      background: 'rgba(245,158,11,0.04)',
                      border: '1px solid rgba(245,158,11,0.1)',
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', width: 36, height: 36, fontWeight: 700 }}>
                            {review.userId?.firstName?.[0] || 'U'}
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                              {review.userId?.firstName} {review.userId?.lastName}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.3 }}>
                              {[1, 2, 3, 4, 5].map(s => (
                                <StarIcon key={s} sx={{ fontSize: 13, color: s <= review.rating ? '#f59e0b' : 'rgba(255,255,255,0.15)' }} />
                              ))}
                            </Box>
                          </Box>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                          {review.createdAt ? format(new Date(review.createdAt), 'MMM dd, yyyy') : ''}
                        </Typography>
                      </Box>
                      {review.comment && (
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', lineHeight: 1.6 }}>
                          "{review.comment}"
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default VendorDashboard;
