import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, CircularProgress,
  LinearProgress, Avatar, IconButton, Tooltip, Badge
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { toast } from 'react-toastify';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TaskIcon from '@mui/icons-material/Task';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { format, isAfter } from 'date-fns';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444'];

const aiTips = [
  '💡 Book vendors at least 3 months in advance for best availability and pricing.',
  '🎯 Create a detailed checklist 6 weeks before your event for smooth execution.',
  '👗 Send invitations 6-8 weeks before the event to give guests enough notice.',
  '💰 Allocate 10-15% of your budget as a contingency fund for unexpected expenses.',
  '📸 Confirm with your photographer/videographer 1 week before the event.',
  '🍽️ Collect meal preferences from guests when sending RSVPs.',
  '🎵 Create a detailed timeline with your entertainment team 2 weeks before.',
];

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, planning: 0 });
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [chartData] = useState([
    { month: 'Jan', events: 2 }, { month: 'Feb', events: 4 }, { month: 'Mar', events: 3 },
    { month: 'Apr', events: 6 }, { month: 'May', events: 5 }, { month: 'Jun', events: 8 },
  ]);

  useEffect(() => {
    fetchData();
    const tipInterval = setInterval(() => setCurrentTip(t => (t + 1) % aiTips.length), 6000);
    return () => clearInterval(tipInterval);
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [eventsRes, tasksRes, bookingsRes] = await Promise.allSettled([
        api.get('/events'),
        api.get('/tasks?status=pending'),
        api.get('/bookings'),
      ]);

      const eventsData = eventsRes.status === 'fulfilled' && eventsRes.value.success ? eventsRes.value.data : [];
      const tasksData = tasksRes.status === 'fulfilled' && tasksRes.value.success ? tasksRes.value.data : [];
      const bookingsData = bookingsRes.status === 'fulfilled' && bookingsRes.value.success ? bookingsRes.value.data : [];

      const now = new Date();
      const upcoming = eventsData.filter(e => e.startDate && isAfter(new Date(e.startDate), now) && e.status !== 'cancelled');
      const completed = eventsData.filter(e => e.status === 'completed');
      const planning = eventsData.filter(e => e.status === 'planning');

      setStats({ total: eventsData.length, upcoming: upcoming.length, completed: completed.length, planning: planning.length });
      setEvents(upcoming.slice(0, 5));
      setTasks(tasksData.slice(0, 5));
      setBookings(bookingsData.slice(0, 3));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'planning': return '#f59e0b';
      case 'completed': return '#6366f1';
      case 'cancelled': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#6366f1';
      case 'low': return '#10b981';
      default: return '#94a3b8';
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '80vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#6366f1', mb: 2 }} size={60} />
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Loading your dashboard...</Typography>
        </Box>
      </Box>
    );
  }

  const statCards = [
    { title: 'Total Events', value: stats.total, icon: <EventIcon />, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', path: '/events' },
    { title: 'Upcoming', value: stats.upcoming, icon: <CalendarTodayIcon />, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', path: '/events' },
    { title: 'Completed', value: stats.completed, icon: <CheckCircleIcon />, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', path: '/events' },
    { title: 'Pending Tasks', value: tasks.length, icon: <TaskIcon />, color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', path: '/dashboard/user' },
  ];

  const pieData = [
    { name: 'Upcoming', value: stats.upcoming || 0 },
    { name: 'Planning', value: stats.planning || 0 },
    { name: 'Completed', value: stats.completed || 0 },
    { name: 'Active', value: Math.max(0, stats.total - stats.upcoming - stats.planning - stats.completed) },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      p: { xs: 2, sm: 3, md: 4 },
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Inter", "Roboto", sans-serif',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Animated background orbs */}
      {[...Array(5)].map((_, i) => (
        <Box key={i} sx={{
          position: 'absolute',
          borderRadius: '50%',
          background: ['rgba(99,102,241,0.15)', 'rgba(168,85,247,0.12)', 'rgba(236,72,153,0.10)', 'rgba(16,185,129,0.10)', 'rgba(245,158,11,0.10)'][i],
          width: `${200 + i * 100}px`,
          height: `${200 + i * 100}px`,
          top: `${[10, 60, 20, 70, 40][i]}%`,
          left: `${[5, 70, 45, 20, 80][i]}%`,
          filter: 'blur(40px)',
          animation: `pulse${i} ${8 + i * 2}s ease-in-out infinite`,
          [`@keyframes pulse${i}`]: {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.7 },
            '50%': { transform: 'scale(1.2)', opacity: 1 },
          },
          pointerEvents: 'none',
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
          <Box>
            <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.75rem' }}>
              Event Organizer
            </Typography>
            <Typography variant="h4" sx={{
              color: 'white', fontWeight: 800, mt: 0.5,
              background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
              backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Welcome, {user?.firstName || user?.email?.split('@')[0] || 'Planner'}! 👋
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/events')}
              sx={{
                color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.2)',
                borderRadius: 3, px: 3, fontWeight: 600, backdropFilter: 'blur(10px)',
                '&:hover': { borderColor: '#6366f1', color: 'white', background: 'rgba(99,102,241,0.1)' }
              }}
            >
              Browse Events
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/events/create')}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: 3, px: 3, fontWeight: 700, boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(99,102,241,0.5)' },
                transition: 'all 0.2s ease'
              }}
            >
              New Event
            </Button>
          </Box>
        </Box>

        {/* AI Tip Banner */}
        <Card sx={{
          mb: 4, borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.15) 100%)',
          border: '1px solid rgba(99,102,241,0.3)',
          backdropFilter: 'blur(20px)',
          animation: 'fadeIn 0.6s ease-out 0.1s both',
          '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
        }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <SmartToyIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: '#a5b4fc', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                AI Planning Tip
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500, transition: 'all 0.5s ease' }}>
                {aiTips[currentTip]}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {aiTips.map((_, i) => (
                <Box key={i} sx={{
                  width: i === currentTip ? 20 : 6, height: 6, borderRadius: 3,
                  background: i === currentTip ? '#6366f1' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease', cursor: 'pointer'
                }} onClick={() => setCurrentTip(i)} />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
          {statCards.map((stat, index) => (
            <Grid item xs={6} sm={6} md={3} key={stat.title}>
              <Card
                onClick={() => navigate(stat.path)}
                sx={{
                  borderRadius: 4, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
                  '@keyframes slideUp': { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 60px ${stat.color}40`,
                    border: `1px solid ${stat.color}40`,
                    background: 'rgba(255,255,255,0.08)',
                  },
                  position: 'relative', overflow: 'hidden',
                  '&::before': {
                    content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: stat.gradient,
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{
                      width: 48, height: 48, borderRadius: 2.5, background: stat.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                      boxShadow: `0 8px 20px ${stat.color}40`,
                      '& .MuiSvgIcon-root': { fontSize: 24 }
                    }}>
                      {stat.icon}
                    </Box>
                    <TrendingUpIcon sx={{ color: stat.color, fontSize: 20, opacity: 0.7 }} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Upcoming Events */}
          <Grid item xs={12} md={6} lg={5}>
            <Card sx={{
              borderRadius: 4, height: '100%',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              animation: 'slideUp 0.6s ease-out 0.4s both',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>Upcoming Events</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{events.length} events scheduled</Typography>
                  </Box>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/events/create')}
                    sx={{ color: '#6366f1', fontWeight: 600, '&:hover': { background: 'rgba(99,102,241,0.1)' } }}
                  >
                    Add Event
                  </Button>
                </Box>

                {events.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <EventIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', mb: 2 }}>No upcoming events</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/events/create')}
                      sx={{ borderColor: '#6366f1', color: '#6366f1', '&:hover': { background: 'rgba(99,102,241,0.1)' } }}
                    >
                      Create your first event
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 380, overflow: 'auto',
                    '&::-webkit-scrollbar': { width: 4 },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { background: 'rgba(99,102,241,0.4)', borderRadius: 2 },
                  }}>
                    {events.map((event, idx) => (
                      <Box
                        key={event._id || idx}
                        onClick={() => navigate(`/events/${event._id}`)}
                        sx={{
                          p: 2, borderRadius: 3, cursor: 'pointer',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          transition: 'all 0.2s ease',
                          '&:hover': { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', transform: 'translateX(4px)' },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', flex: 1, mr: 1 }} noWrap>
                            {event.title}
                          </Typography>
                          <Chip
                            label={event.status || 'planning'}
                            size="small"
                            sx={{
                              background: `${getStatusColor(event.status)}20`,
                              color: getStatusColor(event.status),
                              borderRadius: 1.5, fontWeight: 600, fontSize: '0.7rem',
                              border: `1px solid ${getStatusColor(event.status)}40`,
                              flexShrink: 0
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarTodayIcon sx={{ fontSize: 12 }} />
                            {event.startDate ? format(new Date(event.startDate), 'MMM dd, yyyy') : 'TBD'}
                          </Typography>
                          {event.estimatedGuests > 0 && (
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PeopleIcon sx={{ fontSize: 12 }} />
                              {event.estimatedGuests} guests
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Analytics Chart */}
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{
              borderRadius: 4, height: '100%',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              animation: 'slideUp 0.6s ease-out 0.5s both',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>Event Analytics</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 3 }}>Monthly overview</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <ReTooltip contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: 'white' }} />
                    <Area type="monotone" dataKey="events" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorEvents)" />
                  </AreaChart>
                </ResponsiveContainer>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 2 }}>Event Status</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[
                      { label: 'Upcoming', value: stats.upcoming, total: Math.max(stats.total, 1), color: '#6366f1' },
                      { label: 'Completed', value: stats.completed, total: Math.max(stats.total, 1), color: '#10b981' },
                      { label: 'Planning', value: stats.planning, total: Math.max(stats.total, 1), color: '#f59e0b' },
                    ].map(item => (
                      <Box key={item.label}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{item.label}</Typography>
                          <Typography variant="caption" sx={{ color: item.color, fontWeight: 700 }}>{item.value}</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(item.value / item.total) * 100}
                          sx={{
                            height: 4, borderRadius: 2,
                            background: 'rgba(255,255,255,0.08)',
                            '& .MuiLinearProgress-bar': { background: item.color, borderRadius: 2 }
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions + Tasks */}
          <Grid item xs={12} md={12} lg={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
              {/* Quick Actions */}
              <Card sx={{
                borderRadius: 4,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                animation: 'slideUp 0.6s ease-out 0.6s both',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 2.5 }}>Quick Actions</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[
                      { label: 'Create Event', icon: '🎉', path: '/events/create', color: '#6366f1' },
                      { label: 'Search Vendors', icon: '🔍', path: '/vendors/search', color: '#f59e0b' },
                      { label: 'My Bookings', icon: '📋', path: '/user/bookings', color: '#10b981' },
                      { label: 'Browse Vendors', icon: '🏪', path: '/vendors', color: '#ec4899' },
                    ].map(action => (
                      <Box
                        key={action.label}
                        onClick={() => navigate(action.path)}
                        sx={{
                          p: 1.5, borderRadius: 2.5, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 2,
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          transition: 'all 0.2s ease',
                          '&:hover': { background: `${action.color}15`, border: `1px solid ${action.color}40`, transform: 'translateX(4px)' },
                        }}
                      >
                        <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>{action.icon}</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.85rem' }}>{action.label}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Pending Tasks */}
              <Card sx={{
                borderRadius: 4, flex: 1,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                animation: 'slideUp 0.6s ease-out 0.7s both',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>Pending Tasks</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 2 }}>{tasks.length} tasks need attention</Typography>

                  {tasks.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>All caught up! 🎉</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {tasks.slice(0, 4).map((task, idx) => (
                        <Box key={task._id || idx} sx={{
                          display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2,
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: getPriorityColor(task.priority), flexShrink: 0 }} />
                          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 500, flex: 1 }} noWrap>
                            {task.title}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Recent Bookings */}
          {bookings.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{
                borderRadius: 4,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                animation: 'slideUp 0.6s ease-out 0.8s both',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>Recent Bookings</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Your vendor bookings</Typography>
                    </Box>
                    <Button size="small" onClick={() => navigate('/user/bookings')} sx={{ color: '#6366f1', fontWeight: 600 }}>
                      View All
                    </Button>
                  </Box>
                  <Grid container spacing={2}>
                    {bookings.map((booking, idx) => (
                      <Grid item xs={12} md={4} key={booking._id || idx}>
                        <Box sx={{
                          p: 2.5, borderRadius: 3,
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                              {booking.vendorId?.companyName || 'Vendor'}
                            </Typography>
                            <Chip
                              label={booking.status}
                              size="small"
                              sx={{
                                background: `${getStatusColor(booking.status)}20`,
                                color: getStatusColor(booking.status),
                                fontWeight: 600, fontSize: '0.65rem', borderRadius: 1.5,
                              }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            {booking.eventId?.title || 'Event'} • ${booking.amount?.toLocaleString() || '0'}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default UserDashboard;
