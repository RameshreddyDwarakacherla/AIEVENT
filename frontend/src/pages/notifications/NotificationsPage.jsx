import { useState, useEffect } from 'react';
import {
  Box, Typography, IconButton, Chip, Avatar, Tooltip,
  CircularProgress, Divider, Tab, Tabs, Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import BookingIcon from '@mui/icons-material/EventAvailable';
import MessageIcon from '@mui/icons-material/ChatBubble';
import PaymentIcon from '@mui/icons-material/Payment';
import ReviewIcon from '@mui/icons-material/Star';
import RsvpIcon from '@mui/icons-material/People';
import InfoIcon from '@mui/icons-material/Info';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../lib/api';
import { toast } from 'react-toastify';

/* ── helpers ────────────────────────────────────────────── */
const timeAgo = (ts) => {
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return new Date(ts).toLocaleDateString();
};

const typeConfig = {
  booking_request:   { icon: BookingIcon,  color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', label: 'Booking' },
  booking_confirmed: { icon: CheckCircleIcon, color: '#10B981', bg: 'rgba(16,185,129,0.15)', label: 'Booking' },
  booking_cancelled: { icon: BookingIcon,  color: '#EF4444', bg: 'rgba(239,68,68,0.15)', label: 'Booking' },
  booking_rejected:  { icon: BookingIcon,  color: '#EF4444', bg: 'rgba(239,68,68,0.15)', label: 'Booking' },
  payment_received:  { icon: PaymentIcon,  color: '#10B981', bg: 'rgba(16,185,129,0.15)', label: 'Payment' },
  payment_failed:    { icon: PaymentIcon,  color: '#EF4444', bg: 'rgba(239,68,68,0.15)', label: 'Payment' },
  review_received:   { icon: ReviewIcon,   color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', label: 'Review' },
  message_received:  { icon: MessageIcon,  color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', label: 'Message' },
  guest_rsvp:        { icon: RsvpIcon,     color: '#06B6D4', bg: 'rgba(6,182,212,0.15)',  label: 'RSVP' },
  vendor_verified:   { icon: CheckCircleIcon, color: '#10B981', bg: 'rgba(16,185,129,0.15)', label: 'Vendor' },
  default:           { icon: InfoIcon,     color: '#94A3B8', bg: 'rgba(148,163,184,0.1)', label: 'Info' },
};

const getConfig = (type) => typeConfig[type] || typeConfig.default;

/* ── Component ──────────────────────────────────────────── */
const NotificationsPage = () => {
  const { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, unreadNotificationsCount } = useApp();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0); // 0=All, 1=Unread

  const fetchAll = async () => {
    try {
      const unreadOnly = tab === 1;
      const params = new URLSearchParams({ limit: 50 });
      if (unreadOnly) params.append('unreadOnly', 'true');
      const res = await api.get(`/notifications?${params}`);
      setNotifications(res?.data || []);
    } catch (e) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [tab]);

  const handleRead = async (id) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const handleReadAll = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const handleClearAll = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch { toast.error('Failed to clear notifications'); }
  };

  const glass = {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1117 0%, #1a0533 40%, #0d1117 100%)',
      p: { xs: 2, md: 4 },
      fontFamily: '"Inter","Roboto",sans-serif',
    }}>
      {/* Decorative orbs */}
      {[{sz:320,t:-80,l:-60,c:'rgba(139,92,246,0.12)'},{sz:250,b:-60,r:-40,c:'rgba(236,72,153,0.09)'}].map((o,i)=>(
        <Box key={i} sx={{
          position:'fixed', borderRadius:'50%', background:o.c, width:o.sz, height:o.sz,
          top:o.t, left:o.l, right:o.r, bottom:o.b, filter:'blur(60px)', pointerEvents:'none', zIndex:0,
        }}/>
      ))}

      <Box sx={{ position:'relative', zIndex:1, maxWidth: 720, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb: 3 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap: 1.5 }}>
            <Box sx={{
              p: 1.2, borderRadius:'14px',
              background:'linear-gradient(135deg,#8B5CF6,#EC4899)',
              display:'flex', boxShadow:'0 4px 20px rgba(139,92,246,0.4)',
            }}>
              <Badge badgeContent={unreadNotificationsCount} color="error" max={99}>
                <NotificationsIcon sx={{ color:'white', fontSize:26 }}/>
              </Badge>
            </Box>
            <Box>
              <Typography sx={{ fontWeight:800, fontSize:'1.5rem', color:'white', letterSpacing:'-0.02em' }}>
                Notifications
              </Typography>
              <Typography sx={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem' }}>
                {unreadNotificationsCount} unread · {notifications.length} total
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display:'flex', gap: 1 }}>
            <Tooltip title="Mark all read">
              <IconButton onClick={handleReadAll} sx={{ color:'rgba(255,255,255,0.5)', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', '&:hover':{ color:'white', background:'rgba(16,185,129,0.2)', borderColor:'#10B981' } }}>
                <DoneAllIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear all">
              <IconButton onClick={handleClearAll} sx={{ color:'rgba(255,255,255,0.5)', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', '&:hover':{ color:'white', background:'rgba(239,68,68,0.2)', borderColor:'#EF4444' } }}>
                <DeleteSweepIcon fontSize="small"/>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 2, ...glass, borderRadius: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              '& .MuiTab-root': { color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'none', py:1.5 },
              '& .Mui-selected': { color:'white !important' },
              '& .MuiTabs-indicator': { background:'linear-gradient(90deg,#8B5CF6,#EC4899)', height:3, borderRadius:2 },
            }}
          >
            <Tab label="All" />
            <Tab label={
              <Box sx={{ display:'flex', alignItems:'center', gap:0.8 }}>
                Unread
                {unreadNotificationsCount > 0 && (
                  <Box sx={{ background:'linear-gradient(135deg,#8B5CF6,#EC4899)', color:'white', fontSize:'0.65rem', fontWeight:700, borderRadius:8, px:0.9, py:0.2, minWidth:20, textAlign:'center' }}>
                    {unreadNotificationsCount}
                  </Box>
                )}
              </Box>
            } />
          </Tabs>
        </Box>

        {/* Notification List */}
        {loading ? (
          <Box sx={{ display:'flex', justifyContent:'center', py: 8 }}>
            <CircularProgress sx={{ color:'#8B5CF6' }}/>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ textAlign:'center', py: 10, ...glass, borderRadius: 3 }}>
            <NotificationsIcon sx={{ fontSize:56, color:'rgba(255,255,255,0.15)', mb:2 }}/>
            <Typography sx={{ color:'rgba(255,255,255,0.5)', fontSize:'1.1rem', fontWeight:600 }}>
              {tab === 1 ? 'All caught up! No unread notifications.' : 'No notifications yet'}
            </Typography>
            <Typography sx={{ color:'rgba(255,255,255,0.25)', fontSize:'0.85rem', mt:1 }}>
              You'll see booking updates, messages, and more here.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display:'flex', flexDirection:'column', gap: 1 }}>
            {notifications.map((notif, idx) => {
              const cfg = getConfig(notif.type);
              const Icon = cfg.icon;
              return (
                <Box
                  key={notif._id || idx}
                  sx={{
                    display:'flex', alignItems:'flex-start', gap: 1.5,
                    p: 2, borderRadius: 2,
                    background: notif.isRead ? 'rgba(255,255,255,0.03)' : 'rgba(139,92,246,0.08)',
                    border: `1px solid ${notif.isRead ? 'rgba(255,255,255,0.06)' : 'rgba(139,92,246,0.25)'}`,
                    transition: 'all 0.2s ease',
                    animation: `fadeInUp 0.3s ease-out ${idx * 0.04}s both`,
                    '@keyframes fadeInUp':{ from:{ opacity:0, transform:'translateY(10px)' }, to:{ opacity:1, transform:'translateY(0)' } },
                    '&:hover': { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' },
                  }}
                >
                  {/* Icon */}
                  <Avatar sx={{ width:40, height:40, background:cfg.bg, border:`1px solid ${cfg.color}30`, flexShrink:0 }}>
                    <Icon sx={{ fontSize:20, color:cfg.color }}/>
                  </Avatar>

                  {/* Content */}
                  <Box sx={{ flex:1, minWidth:0 }}>
                    <Box sx={{ display:'flex', alignItems:'center', gap:1, flexWrap:'wrap', mb:0.3 }}>
                      {notif.title && (
                        <Typography sx={{ fontWeight:700, fontSize:'0.9rem', color: notif.isRead ? 'rgba(255,255,255,0.7)' : 'white' }}>
                          {notif.title}
                        </Typography>
                      )}
                      <Chip label={cfg.label} size="small" sx={{
                        height:18, fontSize:'0.65rem', fontWeight:700,
                        background:cfg.bg, color:cfg.color,
                        '& .MuiChip-label':{ px:0.8 },
                      }}/>
                      {!notif.isRead && (
                        <Box sx={{ width:7, height:7, borderRadius:'50%', background:'#8B5CF6', flexShrink:0 }}/>
                      )}
                    </Box>
                    <Typography sx={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.55)', lineHeight:1.5 }}>
                      {notif.message}
                    </Typography>
                    <Typography sx={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.25)', mt:0.5 }}>
                      {timeAgo(notif.createdAt)}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display:'flex', gap:0.5, flexShrink:0 }}>
                    {!notif.isRead && (
                      <Tooltip title="Mark as read">
                        <IconButton size="small" onClick={() => handleRead(notif._id)} sx={{ color:'rgba(255,255,255,0.3)', '&:hover':{ color:'#10B981' } }}>
                          <CheckCircleIcon sx={{ fontSize:18 }}/>
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete(notif._id)} sx={{ color:'rgba(255,255,255,0.3)', '&:hover':{ color:'#EF4444' } }}>
                        <DeleteIcon sx={{ fontSize:18 }}/>
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NotificationsPage;
