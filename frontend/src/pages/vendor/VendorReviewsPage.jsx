import { useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Avatar, Rating, 
  Chip, LinearProgress, Button, IconButton, Divider
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EventIcon from '@mui/icons-material/Event';

/* ── shared glass card style ── */
const glass = {
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
};

const VendorReviewsPage = () => {
  const [reviews] = useState([
    {
      id: 1,
      clientName: 'Sarah Johnson',
      clientAvatar: 'SJ',
      rating: 5,
      date: '2024-03-15',
      eventType: 'Wedding',
      review: 'Absolutely amazing service! The catering was exceptional and all our guests were impressed. The team was professional, punctual, and the food presentation was beautiful. Highly recommend!',
      helpful: 24
    },
    {
      id: 2,
      clientName: 'Mike Davis',
      clientAvatar: 'MD',
      rating: 5,
      date: '2024-03-10',
      eventType: 'Birthday Party',
      review: 'Great experience from start to finish. The food was delicious and the service was impeccable. They accommodated all our dietary requirements without any issues.',
      helpful: 18
    },
    {
      id: 3,
      clientName: 'Emma Wilson',
      clientAvatar: 'EW',
      rating: 4,
      date: '2024-03-05',
      eventType: 'Anniversary',
      review: 'Very good service overall. The food quality was excellent and the staff was friendly. Only minor issue was a slight delay in setup, but they made up for it with their professionalism.',
      helpful: 15
    },
    {
      id: 4,
      clientName: 'Tech Corp Inc.',
      clientAvatar: 'TC',
      rating: 5,
      date: '2024-02-28',
      eventType: 'Corporate Event',
      review: 'Outstanding catering for our corporate gala. Professional service, excellent food quality, and great attention to detail. Will definitely use their services again.',
      helpful: 32
    },
    {
      id: 5,
      clientName: 'Robert Brown',
      clientAvatar: 'RB',
      rating: 4,
      date: '2024-02-20',
      eventType: 'Graduation Party',
      review: 'Good value for money. The buffet setup was perfect for our outdoor event. Food was tasty and there was plenty for everyone. Would recommend!',
      helpful: 12
    },
    {
      id: 6,
      clientName: 'Lisa Anderson',
      clientAvatar: 'LA',
      rating: 5,
      date: '2024-02-15',
      eventType: 'Baby Shower',
      review: 'Exceeded our expectations! The presentation was beautiful and the food was delicious. They were very accommodating with our last-minute changes. Thank you!',
      helpful: 21
    },
    {
      id: 7,
      clientName: 'David Martinez',
      clientAvatar: 'DM',
      rating: 4,
      date: '2024-02-10',
      eventType: 'Retirement Party',
      review: 'Solid catering service. Everything was well-organized and the food quality was consistently good. Staff was courteous and professional throughout the event.',
      helpful: 9
    },
    {
      id: 8,
      clientName: 'Jennifer Lee',
      clientAvatar: 'JL',
      rating: 5,
      date: '2024-02-05',
      eventType: 'Engagement Party',
      review: 'Fantastic experience! The cocktail reception was elegant and the hors d\'oeuvres were creative and delicious. Our guests are still talking about the food!',
      helpful: 28
    }
  ]);

  const stats = {
    avgRating: 4.8,
    totalReviews: reviews.length,
    fiveStars: reviews.filter(r => r.rating === 5).length,
    fourStars: reviews.filter(r => r.rating === 4).length,
    threeStars: reviews.filter(r => r.rating === 3).length,
    twoStars: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length
  };

  const getRatingPercentage = (count) => {
    return (count / stats.totalReviews) * 100;
  };

  const getAvatarColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
      'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    ];
    return colors[index % colors.length];
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
      {/* Mesh Grid Overlay */}
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
              color: 'white', 
              fontWeight: 900,
              letterSpacing: '-0.02em',
              mb: 1,
              background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Customer Reviews
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              {stats.totalReviews} total experiences shared
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', height: 20, mt: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
              <Typography variant="h6" sx={{ color: '#F59E0B', fontWeight: 700 }}>{stats.avgRating}</Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Rating Overview */}
          <Grid item xs={12} lg={4}>
            <Box sx={{
              position: 'sticky',
              top: 24,
              animation: 'fadeInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              '@keyframes fadeInLeft': {
                from: { opacity: 0, transform: 'translateX(-30px)' },
                to: { opacity: 1, transform: 'translateX(0)' }
              }
            }}>
              <Card sx={{ ...glass, overflow: 'hidden' }}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', mb: 3 }}>
                    Review Distribution
                  </Typography>

                  {/* Average Rating Big */}
                  <Box sx={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    flexDirection: 'column', mb: 5,
                    p: 3, borderRadius: '20px', background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <Typography 
                      sx={{ 
                        fontSize: '5rem', fontWeight: 900, color: 'white', lineHeight: 1,
                        background: 'linear-gradient(135deg, #fff 0%, #8B5CF6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stats.avgRating}
                    </Typography>
                    <Rating value={stats.avgRating} precision={0.1} readOnly size="large" sx={{ my: 1.5, '& .MuiRating-iconFilled': { color: '#F59E0B' } }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                      Global Satisfaction Score
                    </Typography>
                  </Box>

                  {/* Rating Breakdown */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = star === 5 ? stats.fiveStars :
                                    star === 4 ? stats.fourStars :
                                    star === 3 ? stats.threeStars :
                                    star === 2 ? stats.twoStars :
                                    stats.oneStar;
                      const percentage = getRatingPercentage(count);

                      return (
                        <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 45 }}>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>
                              {star}
                            </Typography>
                            <StarIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.2)' }} />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              '& .MuiLinearProgress-bar': {
                                background: star >= 4 ? 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)' : 'rgba(255,255,255,0.2)',
                                borderRadius: 3,
                              }
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 800, color: 'white', minWidth: 30, textAlign: 'right' }}>
                            {count}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  <Button 
                    fullWidth 
                    variant="outlined" 
                    sx={{ 
                      mt: 4, borderRadius: '14px', py: 1.5, 
                      borderColor: 'rgba(255,255,255,0.1)', color: 'white', 
                      textTransform: 'none', fontWeight: 600,
                      '&:hover': { borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.03)' }
                    }}
                  >
                    View All Analytics
                  </Button>
                </Box>
              </Card>
            </Box>
          </Grid>

          {/* Reviews List */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {reviews.map((review, index) => (
                <Card
                  key={review.id}
                  sx={{
                    ...glass,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`,
                    '@keyframes fadeInUp': {
                      from: { opacity: 0, transform: 'translateY(30px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    },
                    '&:hover': {
                      transform: 'translateY(-5px) scale(1.01)',
                      background: 'rgba(255, 255, 255, 0.06)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box sx={{ display: 'flex', gap: 2.5, flex: 1 }}>
                        <Avatar
                          sx={{
                            width: 60, height: 60,
                            background: getAvatarColor(index),
                            fontWeight: 900, fontSize: '1.2rem',
                            border: '2px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                          }}
                        >
                          {review.clientAvatar}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', mb: 0.5 }}>
                            {review.clientName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <Rating 
                              value={review.rating} 
                              readOnly size="small" 
                              sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }} 
                            />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.05em' }}>
                              {review.date}
                            </Typography>
                          </Box>
                          <Chip
                            icon={<EventIcon sx={{ fontSize: '14px !important', color: 'white !important' }} />}
                            label={review.eventType}
                            size="small"
                            sx={{
                              background: 'rgba(139, 92, 246, 0.15)',
                              border: '1px solid rgba(139, 92, 246, 0.2)',
                              color: 'white', fontWeight: 700,
                              height: 24, fontSize: '0.75rem', px: 0.5
                            }}
                          />
                        </Box>
                      </Box>
                      <IconButton sx={{ color: 'rgba(255,255,255,0.2)', '&:hover': { color: 'white' } }}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    {/* Review Text */}
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        lineHeight: 1.8,
                        fontSize: '1.05rem',
                        mb: 4,
                        fontStyle: 'italic',
                        position: 'relative',
                        '&::before': {
                          content: '"“"',
                          position: 'absolute', left: -20, top: -10,
                          fontSize: '3rem', color: 'rgba(255,255,255,0.05)',
                          fontFamily: 'serif'
                        }
                      }}
                    >
                      {review.review}
                    </Typography>

                    {/* Actions */}
                    <Box sx={{ 
                      display: 'flex', gap: 2, pt: 3, 
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      flexWrap: 'wrap'
                    }}>
                      <Button
                        size="small"
                        startIcon={<ThumbUpIcon sx={{ fontSize: 18 }} />}
                        sx={{
                          textTransform: 'none', borderRadius: '10px',
                          color: review.helpful > 20 ? '#8B5CF6' : 'rgba(255,255,255,0.4)',
                          fontWeight: 700, px: 2,
                          background: review.helpful > 20 ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'white'
                          }
                        }}
                      >
                        Helpful ({review.helpful})
                      </Button>
                      <Button
                        size="small"
                        startIcon={<ReplyIcon sx={{ fontSize: 18 }} />}
                        sx={{
                          textTransform: 'none', borderRadius: '10px',
                          color: 'rgba(255,255,255,0.4)',
                          fontWeight: 700, px: 2,
                          '&:hover': {
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: '#8B5CF6'
                          }
                        }}
                      >
                        Reply to Review
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default VendorReviewsPage;

