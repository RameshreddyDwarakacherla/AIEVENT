import { useState, useEffect } from 'react';
import { 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  Divider, 
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Avatar,
  Tooltip,
  Fade,
  Slide,
  Zoom
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import TaskIcon from '@mui/icons-material/Task';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationsMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, unreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const navigate = useNavigate();
  
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationClick = (notification) => {
    // Mark as read
    markNotificationAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.entity_id) {
      switch (notification.type) {
        case 'event':
          navigate(`/events/${notification.entity_id}`);
          break;
        case 'task':
          navigate(`/tasks/${notification.entity_id}`);
          break;
        case 'booking':
          navigate(`/bookings/${notification.entity_id}`);
          break;
        case 'message':
          navigate(`/messages/${notification.entity_id}`);
          break;
        case 'user':
          navigate(`/users/${notification.entity_id}`);
          break;
        default:
          // No navigation
      }
    }
    
    handleClose();
  };
  
  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };
  
  const getNotificationIcon = (type, priority) => {
    const iconProps = { fontSize: 'small' };
    switch (type) {
      case 'event':
        return <EventIcon {...iconProps} sx={{ color: '#8B5CF6' }} />;
      case 'task':
        return <TaskIcon {...iconProps} sx={{ color: '#EC4899' }} />;
      case 'booking':
        return <EventIcon {...iconProps} sx={{ color: '#10B981' }} />;
      case 'message':
        return <MessageIcon {...iconProps} sx={{ color: '#3B82F6' }} />;
      case 'user':
        return <PersonIcon {...iconProps} sx={{ color: '#F59E0B' }} />;
      case 'system':
        if (priority === 'high') {
          return <WarningIcon {...iconProps} sx={{ color: '#EF4444' }} />;
        } else if (priority === 'medium') {
          return <InfoIcon {...iconProps} sx={{ color: '#F59E0B' }} />;
        } else {
          return <InfoIcon {...iconProps} sx={{ color: '#6B7280' }} />;
        }
      default:
        return <InfoIcon {...iconProps} sx={{ color: '#6B7280' }} />;
    }
  };
  
  const getNotificationColor = (type) => {
    switch (type) {
      case 'event': return '#8B5CF6';
      case 'task': return '#EC4899';
      case 'booking': return '#10B981';
      case 'message': return '#3B82F6';
      case 'user': return '#F59E0B';
      default: return '#6B7280';
    }
  };
  
  return (
    <>
      <Tooltip title="Notifications" arrow>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconButton 
            color="inherit" 
            onClick={handleOpen}
            aria-label={`${unreadNotificationsCount} unread notifications`}
            sx={{
              position: 'relative',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }
            }}
          >
            <Badge 
              badgeContent={unreadNotificationsCount} 
              sx={{
                '& .MuiBadge-badge': {
                  background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  minWidth: 20,
                  height: 20,
                  animation: unreadNotificationsCount > 0 ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                    '100%': { transform: 'scale(1)', opacity: 1 }
                  }
                }
              }}
            >
              <NotificationsIcon sx={{ color: 'white' }} />
            </Badge>
          </IconButton>
        </motion.div>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #10B981, #3B82F6)',
              animation: 'shimmer 3s ease-in-out infinite',
              '@keyframes shimmer': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' }
              }
            }
          }
        }}
        MenuListProps={{
          sx: { p: 0 }
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ 
            px: 3, 
            py: 2.5, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}>
                <NotificationsIcon sx={{ color: 'white', fontSize: 18 }} />
              </Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 800, 
                color: '#1F2937',
                fontSize: '1.1rem'
              }}>
                Notifications
              </Typography>
            </Box>
            {unreadNotificationsCount > 0 && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="small" 
                  onClick={handleMarkAllAsRead}
                  startIcon={<MarkEmailReadIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                    color: '#10B981',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    borderRadius: '12px',
                    px: 2,
                    py: 0.5,
                    textTransform: 'none',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                    }
                  }}
                >
                  Mark all read
                </Button>
              </motion.div>
            )}
          </Box>
        </motion.div>
        
        {/* Content */}
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Box sx={{ 
              p: 6, 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <NotificationsNoneIcon sx={{ fontSize: 40, color: '#9CA3AF' }} />
                </Box>
              </motion.div>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#6B7280', 
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                No notifications
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#9CA3AF',
                  fontSize: '0.9rem',
                  maxWidth: 200,
                  lineHeight: 1.5
                }}
              >
                You're all caught up! New notifications will appear here.
              </Typography>
            </Box>
          </motion.div>
        ) : (
          <List sx={{ p: 0, maxHeight: 320, overflow: 'auto' }}>
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ListItem 
                    disablePadding
                    sx={{
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        background: notification.is_read 
                          ? 'transparent' 
                          : `linear-gradient(180deg, ${getNotificationColor(notification.type)}, ${getNotificationColor(notification.type)}80)`,
                        borderRadius: '0 4px 4px 0'
                      }
                    }}
                  >
                    <ListItemButton 
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        py: 2,
                        px: 3,
                        background: notification.is_read 
                          ? 'transparent' 
                          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.02))',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))',
                          transform: 'translateX(4px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 48 }}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Box sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            background: `linear-gradient(135deg, ${getNotificationColor(notification.type)}20, ${getNotificationColor(notification.type)}10)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${getNotificationColor(notification.type)}30`
                          }}>
                            {getNotificationIcon(notification.type, notification.priority)}
                          </Box>
                        </motion.div>
                      </ListItemIcon>
                      <ListItemText 
                        primary={notification.message}
                        secondary={formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: notification.is_read ? 500 : 700,
                          color: '#1F2937',
                          fontSize: '0.9rem',
                          lineHeight: 1.4
                        }}
                        secondaryTypographyProps={{
                          color: '#6B7280',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}
                      />
                      {!notification.is_read && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: getNotificationColor(notification.type),
                            ml: 1,
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%': { opacity: 1 },
                              '50%': { opacity: 0.5 },
                              '100%': { opacity: 1 }
                            }
                          }} />
                        </motion.div>
                      )}
                    </ListItemButton>
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        )}
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Box sx={{ 
            p: 2,
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.02))'
          }}>
            <Button 
              fullWidth 
              onClick={() => {
                navigate('/notifications');
                handleClose();
              }}
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                color: 'white',
                fontWeight: 700,
                borderRadius: '14px',
                py: 1.2,
                textTransform: 'none',
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED, #DB2777)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)'
                }
              }}
            >
              View All Notifications
            </Button>
          </Box>
        </motion.div>
      </Menu>
    </>
  );
};

export default NotificationsMenu;
