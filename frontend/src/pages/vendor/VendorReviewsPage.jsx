import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import ReviewSystem from '../../components/common/ReviewSystem';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

const VendorReviewsPage = () => {
  const { user } = useAuth();
  const [vendorInfo, setVendorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorInfo();
  }, []);

  const fetchVendorInfo = async () => {
    try {
      if (!user) return;
      
      // Get vendor profile to get vendor ID and name
      const response = await api.get('/vendors/profile');
      if (response.success && response.data) {
        setVendorInfo({
          id: response.data._id,
          name: response.data.businessName || `${user.firstName} ${user.lastName}`,
          userId: response.data.userId
        });
      }
    } catch (error) {
      console.error('Error fetching vendor info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0d1117 0%, #1a0533 55%, #0d1117 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress sx={{ color: '#8B5CF6' }} />
      </Box>
    );
  }

  if (!vendorInfo) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0d1117 0%, #1a0533 55%, #0d1117 100%)',
        p: { xs: 2, md: 4, lg: 6 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <Typography variant="h5">
          No vendor profile found. Please complete your vendor registration.
        </Typography>
      </Box>
    );
  }

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

      {/* Decorative Orbs */}
      {[
        { w: 500, h: 500, t: -150, l: -100, c: 'rgba(139, 92, 246, 0.08)' },
        { w: 350, h: 350, b: 0, r: -50, c: 'rgba(236, 72, 153, 0.06)' },
        { w: 250, h: 250, t: '40%', l: '30%', c: 'rgba(59, 130, 246, 0.05)' },
      ].map((o, i) => (
        <Box key={i} sx={{
          position: 'absolute', width: o.w, height: o.h, top: o.t, left: o.l, right: o.r, bottom: o.b,
          background: o.c, borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
        }} />
      ))}

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <ReviewSystem 
          vendorId={vendorInfo.id} 
          vendorName={vendorInfo.name}
        />
      </Box>
    </Box>
  );
};

export default VendorReviewsPage;