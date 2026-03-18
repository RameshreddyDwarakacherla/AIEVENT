import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const PageContainer = ({ 
  title, 
  subtitle, 
  badge, 
  children, 
  actions,
  ...props 
}) => {
  const { userRole } = useAuth();
  
  // Different background gradients based on user role
  const getBackgroundGradient = () => {
    if (userRole === 'admin') {
      return `
        linear-gradient(135deg, rgba(135, 206, 250, 0.3) 0%, rgba(173, 216, 230, 0.3) 25%, rgba(176, 224, 230, 0.3) 50%, rgba(135, 206, 250, 0.2) 75%, rgba(173, 216, 230, 0.2) 100%),
        linear-gradient(45deg, #E0F7FF 0%, #B3E5FC 100%)
      `;
    }
    if (userRole === 'vendor') {
      return `
        linear-gradient(135deg, rgba(22, 101, 52, 0.05) 0%, rgba(34, 197, 94, 0.05) 25%, rgba(74, 222, 128, 0.05) 50%, rgba(134, 239, 172, 0.05) 75%, rgba(187, 247, 208, 0.03) 100%),
        linear-gradient(45deg, #F0FDF4 0%, #DCFCE7 100%)
      `;
    }
    return `
      linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 25%, rgba(16, 185, 129, 0.05) 50%, rgba(245, 158, 11, 0.05) 75%, rgba(236, 72, 153, 0.05) 100%),
      linear-gradient(45deg, #f8fafc 0%, #f1f5f9 100%)
    `;
  };

  const getRadialGradients = () => {
    if (userRole === 'admin') {
      return `
        radial-gradient(circle at 20% 80%, rgba(30, 144, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(65, 105, 225, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(135, 206, 250, 0.12) 0%, transparent 50%)
      `;
    }
    if (userRole === 'vendor') {
      return `
        radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(74, 222, 128, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(134, 239, 172, 0.08) 0%, transparent 50%)
      `;
    }
    return `
      radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.06) 0%, transparent 50%)
    `;
  };

  const getTitleGradient = () => {
    if (userRole === 'admin') {
      return 'linear-gradient(135deg, #1E90FF 0%, #4169E1 100%)';
    }
    if (userRole === 'vendor') {
      return 'linear-gradient(135deg, #166534 0%, #22C55E 100%)';
    }
    return 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)';
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={userRole === 'admin' ? 'admin-page' : ''}
      sx={{ 
        p: { xs: 2, md: 4 }, 
        background: getBackgroundGradient(),
        minHeight: 'calc(100vh - 64px)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: getRadialGradients(),
          pointerEvents: 'none',
          zIndex: 0,
        },
        ...props.sx 
      }}
      {...props}
    >
      {/* Page Header */}
      {(title || badge || actions) && (
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
          position: 'relative',
          zIndex: 1
        }}>
          <Box>
            {title && (
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  background: getTitleGradient(),
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: subtitle ? 1 : 0,
                  fontSize: { xs: '1.75rem', md: '2.125rem' }
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '1.1rem',
                  fontWeight: 500
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {badge && (
              <Chip 
                label={badge} 
                variant="outlined" 
                sx={{ 
                  color: userRole === 'admin' ? '#1E40AF' : 'primary.main',
                  borderColor: userRole === 'admin' ? '#3B82F6' : 'primary.main',
                  fontWeight: 600,
                  background: userRole === 'admin' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(139, 92, 246, 0.08)'
                }} 
              />
            )}
            {actions}
          </Box>
        </Box>
      )}
      
      {/* Page Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default PageContainer;