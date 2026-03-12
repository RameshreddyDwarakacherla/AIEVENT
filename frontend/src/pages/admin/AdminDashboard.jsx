import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, MenuItem, IconButton, Tooltip, Avatar, LinearProgress, Tab, Tabs,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { toast } from 'react-toastify';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import WarningIcon from '@mui/icons-material/Warning';
import AssessmentIcon from '@mui/icons-material/Assessment';
import StorageIcon from '@mui/icons-material/Storage';
import NotificationsIcon from '@mui/icons-material/Notifications';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0, totalVendors: 0, totalEvents: 0,
    pendingVendors: 0, activeEvents: 0, revenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    uptime: '100%', responseTime: '0ms', cpuUsage: '0%', memoryUsage: '0%'
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [broadcastDialogOpen, setBroadcastDialogOpen] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', type: 'info' });
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState('summary');

  const monthlyData = [
    { month: 'Jan', users: 18, events: 12, revenue: 4200 },
    { month: 'Feb', users: 25, events: 18, revenue: 6800 },
    { month: 'Mar', users: 32, events: 22, revenue: 8900 },
    { month: 'Apr', users: 45, events: 35, revenue: 12400 },
    { month: 'May', users: 52, events: 42, revenue: 15600 },
    { month: 'Jun', users: 68, events: 58, revenue: 21000 },
  ];

  const eventTypeData = [
    { name: 'Wedding', value: 35 },
    { name: 'Corporate', value: 28 },
    { name: 'Birthday', value: 20 },
    { name: 'Other', value: 17 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, vendorStatsRes, eventStatsRes, pendingVendorsRes, recentEventsRes] = await Promise.allSettled([
        api.get('/users/stats'),
        api.get('/vendors/admin-stats'),
        api.get('/events/admin-stats'),
        api.get('/vendors/pending'),
        api.get('/events/all'),
      ]);

      const userStats = usersRes.status === 'fulfilled' && usersRes.value.success ? usersRes.value.data : {};
      const vendorStats = vendorStatsRes.status === 'fulfilled' && vendorStatsRes.value.success ? vendorStatsRes.value.data : {};
      const eventStats = eventStatsRes.status === 'fulfilled' && eventStatsRes.value.success ? eventStatsRes.value.data : {};
      const pendingVs = pendingVendorsRes.status === 'fulfilled' && pendingVendorsRes.value.success ? pendingVendorsRes.value.data : [];
      const events = recentEventsRes.status === 'fulfilled' && recentEventsRes.value.success ? recentEventsRes.value.data : [];

      setStats({
        totalUsers: userStats.total || 0,
        totalVendors: vendorStats.total || 0,
        totalEvents: eventStats.total || 0,
        pendingVendors: vendorStats.pending || 0,
        activeEvents: eventStats.active || 0,
        revenue: 125000 // mock revenue for display
      });

      setPendingVendors(pendingVs.slice(0, 5));
      setRecentEvents(events.slice(0, 6));

      // Mock additional features requested: System Health & Activity
      setRecentActivity([
        { id: 1, type: 'user_reg', text: 'New user registration: Sarah Johnson', time: '5m ago' },
        { id: 2, type: 'vendor_verify', text: "Elite Catering submitted verification", time: '12m ago' },
        { id: 3, type: 'event_create', text: 'New corporate event: Tech Summit 2026', time: '1h ago' },
        { id: 4, type: 'review_mod', text: 'Review reported for moderation', time: '2h ago' },
      ]);

      setSystemHealth({
        uptime: '99.98%',
        responseTime: '124ms',
        cpuUsage: '14%',
        memoryUsage: '42%'
      });

      // Fetch recent users
      const usersListRes = await api.get('/users');
      if (usersListRes.success) {
        setRecentUsers(usersListRes.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVendor = async (vendorId, approve) => {
    try {
      const res = await api.put(`/vendors/${vendorId}/verify`, { isVerified: approve });
      if (res.success) {
        toast.success(approve ? '✅ Vendor approved!' : '❌ Vendor rejected');
        fetchDashboardData();
      }
    } catch (err) {
      toast.error('Failed to update vendor status');
    }
  };

  const handleToggleUser = async (userId, currentStatus) => {
    try {
      const res = await api.put(`/users/${userId}`, { isActive: !currentStatus });
      if (res.success) {
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
        fetchDashboardData();
      }
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  // Administrative Actions
  const handleAuditTrail = async () => {
    try {
      setActionLoading(true);
      const res = await api.get('/admin/audit-trail');
      if (res.success) {
        toast.success('✅ Audit trail loaded');
        console.log('Audit Trail:', res.data);
        // You could open a modal to display the audit trail
      }
    } catch (err) {
      toast.error('Failed to load audit trail');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDatabaseBackup = async () => {
    try {
      setActionLoading(true);
      toast.info('🔄 Starting database backup...');
      const res = await api.post('/admin/db-backup');
      if (res.success) {
        toast.success(`✅ ${res.message}\n📦 Size: ${res.data.size} | Duration: ${res.data.duration}`);
        fetchDashboardData(); // Refresh to update "last backup" time
      }
    } catch (err) {
      toast.error('Failed to backup database');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setActionLoading(true);
      toast.info('🔄 Clearing cache...');
      const res = await api.post('/admin/clear-cache');
      if (res.success) {
        toast.success(`✅ ${res.message}\n🗑️ Cleared ${res.data.itemsCleared} items | Freed ${res.data.memoryFreed}`);
      }
    } catch (err) {
      toast.error('Failed to clear cache');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBroadcast = () => {
    setBroadcastDialogOpen(true);
  };

  const handleSendBroadcast = async () => {
    try {
      if (!broadcastForm.title || !broadcastForm.message) {
        toast.error('Title and message are required');
        return;
      }
      setActionLoading(true);
      const res = await api.post('/admin/broadcast', broadcastForm);
      if (res.success) {
        toast.success(`✅ ${res.message}`);
        setBroadcastDialogOpen(false);
        setBroadcastForm({ title: '', message: '', type: 'info' });
      }
    } catch (err) {
      toast.error('Failed to send broadcast');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSecurityCheck = async () => {
    try {
      setActionLoading(true);
      toast.info('🔒 Running security audit...');
      const res = await api.get('/admin/security-check');
      if (res.success) {
        toast.success(`✅ Security Score: ${res.data.overallScore}/100\n✓ ${res.data.checks.length} checks passed`);
        console.log('Security Report:', res.data);
      }
    } catch (err) {
      toast.error('Failed to run security check');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateReport = () => {
    setReportDialogOpen(true);
  };

  const handleCreateReport = async () => {
    try {
      setActionLoading(true);
      toast.info('📊 Generating report...');
      const res = await api.post('/admin/generate-report', { reportType });
      if (res.success) {
        toast.success(`✅ ${res.message}\n📄 Report ready for download`);
        console.log('Report:', res.data);
        setReportDialogOpen(false);
      }
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setActionLoading(false);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      const res = await api.get('/admin/system-health');
      if (res.success) {
        setSystemHealth(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch system health:', err);
    }
  };

  // Refresh system health every 30 seconds
  useEffect(() => {
    if (!loading) {
      fetchSystemHealth();
      const interval = setInterval(fetchSystemHealth, 30000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const getStatusChip = (status) => {
    const configs = {
      active: { color: '#10b981', bg: '#10b98115', label: 'Active' },
      confirmed: { color: '#10b981', bg: '#10b98115', label: 'Confirmed' },
      planning: { color: '#f59e0b', bg: '#f59e0b15', label: 'Planning' },
      pending: { color: '#f59e0b', bg: '#f59e0b15', label: 'Pending' },
      completed: { color: '#6366f1', bg: '#6366f115', label: 'Completed' },
      cancelled: { color: '#ef4444', bg: '#ef444415', label: 'Cancelled' },
    };
    const config = configs[status] || { color: '#94a3b8', bg: '#94a3b815', label: status };
    return (
      <Chip label={config.label} size="small" sx={{
        background: config.bg, color: config.color,
        fontWeight: 700, borderRadius: 1.5, fontSize: '0.7rem',
        border: `1px solid ${config.color}30`
      }} />
    );
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '80vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#f59e0b', mb: 2 }} size={60} />
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Loading admin dashboard...</Typography>
        </Box>
      </Box>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: <PeopleIcon />, color: '#6366f1', change: '+12%', path: '/admin/users' },
    { title: 'Total Vendors', value: stats.totalVendors, icon: <StorefrontIcon />, color: '#f59e0b', change: '+8%', path: '/admin/vendors' },
    { title: 'Total Events', value: stats.totalEvents, icon: <EventIcon />, color: '#10b981', change: '+15%', path: '/admin/events' },
    { title: 'Pending Approvals', value: stats.pendingVendors, icon: <VerifiedUserIcon />, color: '#ef4444', change: 'Needs review', path: '/admin/vendors' },
    { title: 'Active Events', value: stats.activeEvents, icon: <TrendingUpIcon />, color: '#8b5cf6', change: 'Live', path: '/admin/events' },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'transparent', // Using Layout background
      p: { xs: 2, sm: 3, md: 4 },
      fontFamily: '"Inter", "Roboto", sans-serif',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Background orbs */}
      {[...Array(4)].map((_, i) => (
        <Box key={i} sx={{
          position: 'fixed',
          borderRadius: '50%',
          background: ['rgba(245,158,11,0.08)', 'rgba(99,102,241,0.10)', 'rgba(16,185,129,0.08)', 'rgba(236,72,153,0.07)'][i],
          width: `${300 + i * 150}px`,
          height: `${300 + i * 150}px`,
          top: `${[5, 50, 70, 20][i]}%`,
          left: `${[5, 60, 10, 75][i]}%`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}

      <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* Header */}
        <Box sx={{
          display: 'flex', justifyContent: 'space-between', alignItems: { xs:'flex-start', sm:'center' },
          mb: { xs: 3, md: 4 }, flexWrap: 'wrap', gap: 2,
          animation: 'slideDown 0.5s ease-out',
          '@keyframes slideDown': { from: { opacity: 0, transform: 'translateY(-20px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
        }}>
          <Box 
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
          >
            <Box sx={{
              width: 52, height: 52, borderRadius: 3,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(245,158,11,0.3)'
            }}>
              <AdminPanelSettingsIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                System Administrator
              </Typography>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.2 }}>
                Admin Dashboard
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'Admin'}
              </Typography>
            </Box>
          </Box>
          <Box 
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{ display: 'flex', gap: 2 }}
          >
            <Tooltip title="Refresh platform metrics">
              <IconButton 
                onClick={fetchDashboardData} 
                sx={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  width: 44, height: 44,
                  '&:hover': { color: 'white', borderColor: '#f59e0b', background: 'rgba(245,158,11,0.1)' } 
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<AnalyticsIcon />}
              onClick={() => navigate('/admin/analytics')}
              sx={{
                borderColor: 'rgba(245,158,11,0.3)', color: '#f59e0b',
                borderRadius: 3, fontWeight: 700, px: 3,
                '&:hover': { borderColor: '#f59e0b', background: 'rgba(245,158,11,0.1)' },
                transition: 'all 0.2s ease'
              }}
            >
              Intelligence
            </Button>
            <Button
              variant="contained"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={() => navigate('/admin/settings')}
              sx={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: 3, fontWeight: 700, px: 3,
                boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(245,158,11,0.4)', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
                transition: 'all 0.2s ease'
              }}
            >
              Settings
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid 
          container 
          spacing={{ xs: 2, md: 3 }} 
          sx={{ mb: { xs: 3, md: 4 } }}
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {statCards.map((stat, index) => (
            <Grid item xs={6} sm={4} md={4} lg={2} key={stat.title}>
              <Card
                component={motion.div}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => navigate(stat.path)}
                sx={{
                  borderRadius: 3, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: `1px solid ${stat.color}40`,
                    boxShadow: `0 16px 40px ${stat.color}25`,
                    background: 'rgba(255,255,255,0.07)',
                  },
                  position: 'relative', overflow: 'hidden',
                  '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${stat.color}, transparent)` }
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: 2, mb: 2,
                    background: `${stat.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    '& .MuiSvgIcon-root': { fontSize: 20, color: stat.color }
                  }}>
                    {stat.icon}
                  </Box>
                  <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.6rem', lineHeight: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, display: 'block', mt: 0.5 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: stat.color, fontWeight: 600, fontSize: '0.7rem' }}>
                    ↑ {stat.change}
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
              '& .MuiTabs-indicator': { background: '#f59e0b', height: 3, borderRadius: 2 },
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'none', '&.Mui-selected': { color: '#f59e0b' } }
            }}
          >
            <Tab label="📊 Overview" />
            <Tab label="👥 Users" />
            <Tab label="🏪 Vendors" />
            <Tab label="🎉 Events" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        {tab === 0 && (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {/* Growth Chart */}
            <Grid item xs={12} md={12} lg={8}>
              <Card sx={{
                borderRadius: 4,
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>Platform Growth</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 3 }}>Monthly users, events & revenue trends</Typography>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                      <defs>
                        {[['users', '#6366f1'], ['events', '#10b981'], ['revenue', '#f59e0b']].map(([key, color]) => (
                          <linearGradient key={key} id={`grad_${key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: 'white' }} />
                      <Legend formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{value}</span>} />
                      <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} fill="url(#grad_users)" name="Users" />
                      <Area type="monotone" dataKey="events" stroke="#10b981" strokeWidth={2} fill="url(#grad_events)" name="Events" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Event Types Pie */}
            <Grid item xs={12} lg={4}>
              <Card sx={{
                borderRadius: 4, height: '100%',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>Event Types</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 2 }}>Distribution by category</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={eventTypeData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                        {eventTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ReTooltip contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: 'white' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    {eventTypeData.map((entry, idx) => (
                      <Box key={entry.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[idx] }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>{entry.name}</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: COLORS[idx], fontWeight: 700 }}>{entry.value}%</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Pending Vendor Approvals */}
            <Grid item xs={12} lg={6}>
              <Card sx={{
                borderRadius: 4,
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: pendingVendors.length > 0 ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.08)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {pendingVendors.length > 0 && <WarningIcon sx={{ color: '#f59e0b', fontSize: 20 }} />}
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>Pending Vendor Approvals</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                          {pendingVendors.length} {pendingVendors.length === 1 ? 'vendor' : 'vendors'} waiting for review
                        </Typography>
                      </Box>
                    </Box>
                    <Button size="small" onClick={() => navigate('/admin/vendors')} sx={{ color: '#f59e0b', fontWeight: 600 }}>
                      View All
                    </Button>
                  </Box>

                  {pendingVendors.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <CheckCircleIcon sx={{ fontSize: 56, color: '#10b981', mb: 1.5 }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>All vendors reviewed!</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {pendingVendors.map((vendor, idx) => (
                        <Box key={vendor._id || idx} sx={{
                          p: 2.5, borderRadius: 3,
                          background: 'rgba(245,158,11,0.06)',
                          border: '1px solid rgba(245,158,11,0.15)',
                          display: 'flex', alignItems: 'center', gap: 2,
                        }}>
                          <Avatar sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', width: 42, height: 42, fontSize: '1rem', fontWeight: 700 }}>
                            {vendor.companyName?.[0] || 'V'}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{vendor.companyName}</Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
                              {vendor.vendorType} • {vendor.city || 'Location N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                onClick={() => handleVerifyVendor(vendor._id, true)}
                                sx={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', '&:hover': { background: 'rgba(16,185,129,0.3)' } }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                onClick={() => handleVerifyVendor(vendor._id, false)}
                                sx={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', '&:hover': { background: 'rgba(239,68,68,0.3)' } }}
                              >
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => navigate('/admin/vendors')}
                                sx={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Events */}
            <Grid item xs={12} lg={6}>
              <Card sx={{
                borderRadius: 4,
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>Recent Events</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Latest platform activity</Typography>
                    </Box>
                    <Button size="small" onClick={() => navigate('/admin/events')} sx={{ color: '#6366f1', fontWeight: 600 }}>View All</Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentEvents.slice(0, 4).map((event, idx) => (
                      <Box key={event._id || idx} sx={{
                        p: 2, borderRadius: 3,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', gap: 2,
                      }}>
                        <Avatar sx={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', width: 36, height: 36, fontSize: '0.85rem', fontWeight: 700 }}>
                          {event.eventType?.[0] || 'E'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.88rem' }} noWrap>{event.title}</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            {event.userId?.firstName || 'User'} • {event.eventType}
                          </Typography>
                        </Box>
                        {getStatusChip(event.status)}
                      </Box>
                    ))}
                    {recentEvents.length === 0 && (
                      <Typography sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', py: 4 }}>No events yet</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* System Health Section */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ 
                borderRadius: 4, height: '100%',
                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>System Health</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 3 }}>Live infrastructure metrics</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {[
                      { label: 'Platform Uptime', value: systemHealth.uptime, color: '#10b981', percent: parseFloat(systemHealth.uptimePercent) || 99 },
                      { label: 'API Latency', value: systemHealth.responseTime, color: '#6366f1', percent: Math.max(0, 100 - parseInt(systemHealth.responseTime)) },
                      { label: 'Server Load', value: systemHealth.cpuUsage, color: '#f59e0b', percent: parseFloat(systemHealth.cpuUsage) || 14 },
                      { label: 'Storage Usage', value: systemHealth.memoryUsage, color: '#ef4444', percent: parseFloat(systemHealth.memoryUsage) || 42 }
                    ].map((item, i) => (
                      <Box key={i}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{item.label}</Typography>
                          <Typography variant="caption" sx={{ color: item.color, fontWeight: 700 }}>{item.value}</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={item.percent} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 3 } }} />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity Feed */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ 
                borderRadius: 4, height: '100%',
                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>Recent Activity</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 3 }}>System-wide events timeline</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {recentActivity.map((act) => (
                      <Box key={act.id} sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ 
                          width: 8, height: 8, borderRadius: '50%', mt: 0.8,
                          background: act.type === 'user_reg' ? '#6366f1' : act.type === 'vendor_verify' ? '#f59e0b' : '#10b981',
                          boxShadow: `0 0 8px ${act.type === 'user_reg' ? '#6366f1' : act.type === 'vendor_verify' ? '#f59e0b' : '#10b981'}80`
                        }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 500 }}>{act.text}</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{act.time}</Typography>
                        </Box>
                      </Box>
                    ))}
                    <Button fullWidth size="small" variant="text" sx={{ mt: 1, color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>View System Logs</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions Card */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ 
                borderRadius: 4, height: '100%',
                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>Administrative Actions</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 3 }}>Quick platform management</Typography>
                  <Grid container spacing={2}>
                    {[
                      { label: 'Audit Trail', icon: <AssessmentIcon />, color: '#6366f1', action: handleAuditTrail },
                      { label: 'DB Backup', icon: <StorageIcon />, color: '#10b981', action: handleDatabaseBackup },
                      { label: 'Clear Cache', icon: <RefreshIcon />, color: '#f59e0b', action: handleClearCache },
                      { label: 'Broadcast', icon: <NotificationsIcon />, color: '#ec4899', action: handleBroadcast },
                      { label: 'Security', icon: <VerifiedUserIcon />, color: '#8b5cf6', action: handleSecurityCheck },
                      { label: 'Reports', icon: <AnalyticsIcon />, color: '#0ea5e9', action: handleGenerateReport }
                    ].map((btn, i) => (
                      <Grid item xs={4} key={i}>
                        <Box 
                          onClick={actionLoading ? undefined : btn.action}
                          sx={{ 
                            p: 1.5, borderRadius: 2, textAlign: 'center', cursor: actionLoading ? 'not-allowed' : 'pointer',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                            transition: 'all 0.2s ease',
                            opacity: actionLoading ? 0.6 : 1,
                            '&:hover': actionLoading ? {} : { background: 'rgba(255,255,255,0.08)', transform: 'translateY(-2px)', borderColor: btn.color },
                            '&:active': { transform: 'translateY(0)' }
                          }}
                        >
                          <Box sx={{ color: btn.color, mb: 0.5 }}>
                            {actionLoading ? <CircularProgress size={20} sx={{ color: btn.color }} /> : btn.icon}
                          </Box>
                          <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '0.65rem' }}>{btn.label}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ mt: 3, p: 2, borderRadius: 2, background: 'rgba(245,158,11,0.05)', border: '1px dashed rgba(245,158,11,0.3)' }}>
                    <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700, display: 'block' }}>System Advisor</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                      {systemHealth.activeConnections ? `${systemHealth.activeConnections} active connections` : 'Database optimization recommended'}. 
                      {systemHealth.requestsPerMinute ? ` ${systemHealth.requestsPerMinute} req/min` : ' Last backup: 2h ago'}.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tab === 1 && (
          <Card sx={{
            borderRadius: 4,
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>User Management</Typography>
                <Button variant="outlined" onClick={() => navigate('/admin/users')} sx={{ color: '#6366f1', borderColor: '#6366f130', '&:hover': { borderColor: '#6366f1', background: 'rgba(99,102,241,0.1)' } }}>
                  Manage All Users
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                        <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentUsers.map((u, idx) => (
                      <TableRow key={u._id || idx} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: '0.8rem' }}>
                              {u.firstName?.[0] || 'U'}
                            </Avatar>
                            <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{u.firstName} {u.lastName}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.85rem' }}>{u.email}</TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <Chip label={u.role} size="small" sx={{
                            background: u.role === 'admin' ? '#ef444415' : u.role === 'vendor' ? '#f59e0b15' : '#6366f115',
                            color: u.role === 'admin' ? '#ef4444' : u.role === 'vendor' ? '#f59e0b' : '#6366f1',
                            fontWeight: 700, fontSize: '0.7rem', borderRadius: 1.5
                          }} />
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          {getStatusChip(u.isActive ? 'active' : 'cancelled')}
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.8rem' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title={u.isActive ? 'Deactivate' : 'Activate'}>
                              <IconButton size="small"
                                onClick={() => handleToggleUser(u._id, u.isActive)}
                                sx={{ color: u.isActive ? '#f59e0b' : '#10b981', '&:hover': { background: u.isActive ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)' } }}
                              >
                                {u.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {tab === 2 && (
          <AnimatePresence mode="wait">
            <Box
              key="vendor-tab"
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>Vendor Management</Typography>
                    <Button variant="outlined" onClick={() => navigate('/admin/vendors')} sx={{ color: '#f59e0b', borderColor: '#f59e0b30', '&:hover': { borderColor: '#f59e0b', background: 'rgba(245,158,11,0.1)' } }}>
                      Manage All Vendors
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {pendingVendors.map((vendor, idx) => (
                      <Box key={vendor._id || idx} 
                        component={motion.div}
                        whileHover={{ scale: 1.01 }}
                        sx={{
                          p: 2.5, borderRadius: 3,
                          background: 'rgba(245,158,11,0.06)',
                          border: '1px solid rgba(245,158,11,0.15)',
                          display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
                        }}
                      >
                        <Avatar sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', fontWeight: 700 }}>
                          {vendor.companyName?.[0]}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ color: 'white', fontWeight: 700 }}>{vendor.companyName}</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
                            {vendor.vendorType} • Owner: {vendor.userId?.firstName} {vendor.userId?.lastName}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>Email: {vendor.userId?.email}</Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>Joined: {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A'}</Typography>
                          </Box>
                        </Box>
                        <Chip label="Pending Review" size="small" sx={{ background: '#f59e0b15', color: '#f59e0b', fontWeight: 700, fontSize: '0.7rem', borderRadius: 1.5 }} />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" onClick={() => handleVerifyVendor(vendor._id, true)}
                            sx={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: 2, fontWeight: 600, fontSize: '0.75rem' }}>
                            Approve
                          </Button>
                          <Button size="small" variant="outlined" onClick={() => handleVerifyVendor(vendor._id, false)}
                            sx={{ borderColor: '#ef444440', color: '#ef4444', borderRadius: 2, fontWeight: 600, fontSize: '0.75rem', '&:hover': { borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' } }}>
                            Reject
                          </Button>
                        </Box>
                      </Box>
                    ))}
                    {pendingVendors.length === 0 && (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <CheckCircleIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No pending vendor approvals!</Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </AnimatePresence>
        )}

        {tab === 3 && (
          <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>Event Management</Typography>
                <Button variant="outlined" onClick={() => navigate('/admin/events')} sx={{ color: '#10b981', borderColor: '#10b98130', '&:hover': { borderColor: '#10b981', background: 'rgba(16,185,129,0.1)' } }}>
                  Manage All Events
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentEvents.map((event, idx) => (
                  <Box key={event._id || idx} sx={{
                    p: 2.5, borderRadius: 3,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
                  }}>
                    <Avatar sx={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontWeight: 700 }}>
                      {event.eventType?.[0] || 'E'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: 'white', fontWeight: 700 }}>{event.title}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
                        {event.eventType} • {event.userId?.firstName} {event.userId?.lastName}
                        {event.estimatedGuests ? ` • ${event.estimatedGuests} guests` : ''}
                      </Typography>
                    </Box>
                    {getStatusChip(event.status)}
                  </Box>
                ))}
                {recentEvents.length === 0 && (
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 6 }}>No events yet</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Broadcast Dialog */}
      <Dialog open={broadcastDialogOpen} onClose={() => setBroadcastDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #ec4899, #be185d)', color: 'white' }}>
          📢 Send Platform Broadcast
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Broadcast Title"
            value={broadcastForm.title}
            onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            value={broadcastForm.message}
            onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Message Type"
            value={broadcastForm.type}
            onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
          >
            <MenuItem value="info">📘 Information</MenuItem>
            <MenuItem value="warning">⚠️ Warning</MenuItem>
            <MenuItem value="success">✅ Success</MenuItem>
            <MenuItem value="error">❌ Error</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBroadcastDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSendBroadcast} 
            variant="contained" 
            disabled={actionLoading}
            sx={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Send Broadcast'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white' }}>
          📊 Generate Platform Report
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            select
            fullWidth
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="summary">📋 Platform Summary</MenuItem>
            <MenuItem value="users">👥 User Analytics</MenuItem>
            <MenuItem value="events">🎉 Event Statistics</MenuItem>
            <MenuItem value="vendors">🏪 Vendor Performance</MenuItem>
            <MenuItem value="financial">💰 Financial Report</MenuItem>
          </TextField>
          <Box sx={{ p: 2, background: 'rgba(14,165,233,0.1)', borderRadius: 2, border: '1px solid rgba(14,165,233,0.2)' }}>
            <Typography variant="body2" sx={{ color: '#0ea5e9', fontWeight: 600, mb: 1 }}>Report Preview</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              This report will include data from the last 30 days and will be available for download as PDF.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateReport} 
            variant="contained" 
            disabled={actionLoading}
            sx={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Generate Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
