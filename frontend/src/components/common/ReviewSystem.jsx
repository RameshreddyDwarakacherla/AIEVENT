import { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Avatar, Rating, 
  Button, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, Chip, LinearProgress, IconButton, Divider,
  Alert, CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplyIcon from '@mui/icons-material/Reply';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { toast } from 'react-toastify';

const glass = {
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
};

const ReviewSystem = ({ vendorId, vendorName }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: ''
  });
  const [stats, setStats] = useState({
    avgRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  useEffect(() => {
    fetchReviews();
  }, [vendorId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews/vendor/${vendorId}`);
      if (response.success) {
        setReviews(response.data);
        calculateStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviewsData) => {
    const total = reviewsData.length;
    if (total === 0) {
      setStats({ avgRating: 0, totalReviews: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
      return;
    }

    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    const avg = (sum / total).toFixed(1);
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach(review => {
      distribution[review.rating]++;
    });

    setStats({ avgRating: parseFloat(avg), totalReviews: total, distribution });
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    if (newReview.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/reviews', {
        vendorId,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment
      });

      if (response.success) {
        toast.success('Review submitted successfully!');
        setOpenDialog(false);
        setNewReview({ rating: 0, title: '', comment: '' });
        fetchReviews(); // Refresh reviews
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingPercentage = (rating) => {
    return stats.totalReviews > 0 ? (stats.distribution[rating] / stats.totalReviews) * 100 : 0;
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#8B5CF6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Header with Add Review Button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              color: 'white', 
              fontWeight: 900,
              letterSpacing: '-0.02em',
              mb: 1
            }}
          >
            Customer Reviews
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              {stats.totalReviews} total reviews for {vendorName}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', height: 20, mt: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
              <Typography variant="h6" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                {stats.avgRating}
              </Typography>
            </Box>
          </Box>
        </Box>

        {user && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              borderRadius: '16px',
              px: 3,
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(139, 92, 246, 0.6)'
              }
            }}
          >
            Write Review
          </Button>
        )}
      </Box>

      {!user && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 4, 
            borderRadius: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#60A5FA',
            '& .MuiAlert-icon': { color: '#3B82F6' }
          }}
        >
          Please login to write and submit reviews for this vendor.
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {/* Rating Overview */}
        <Box sx={{ minWidth: 350, flex: '0 0 auto' }}>
          <Card sx={{ ...glass, position: 'sticky', top: 24 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', mb: 3 }}>
                Review Distribution
              </Typography>

              {/* Average Rating */}
              <Box sx={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                flexDirection: 'column', mb: 4,
                p: 3, borderRadius: '20px', background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <Typography 
                  sx={{ 
                    fontSize: '4rem', fontWeight: 900, color: 'white', lineHeight: 1,
                    background: 'linear-gradient(135deg, #fff 0%, #8B5CF6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stats.avgRating}
                </Typography>
                <Rating 
                  value={stats.avgRating} 
                  precision={0.1} 
                  readOnly 
                  size="large" 
                  sx={{ my: 1, '& .MuiRating-iconFilled': { color: '#F59E0B' } }} 
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                  Global Satisfaction Score
                </Typography>
              </Box>

              {/* Rating Breakdown */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.distribution[rating];
                  const percentage = getRatingPercentage(rating);

                  return (
                    <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 45 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>
                          {rating}
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
                            background: rating >= 4 ? 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)' : 'rgba(255,255,255,0.2)',
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
            </CardContent>
          </Card>
        </Box>

        {/* Reviews List */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {reviews.length === 0 ? (
            <Card sx={{ ...glass, p: 6, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                No reviews yet
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>
                Be the first to share your experience with this vendor!
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <AnimatePresence>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        ...glass,
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          background: 'rgba(255, 255, 255, 0.06)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                          borderColor: 'rgba(255, 255, 255, 0.15)',
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        {/* Header */}
                        <Box sx={{ display: 'flex', gap: 2.5, mb: 3 }}>
                          <Avatar
                            sx={{
                              width: 60, height: 60,
                              background: getAvatarColor(index),
                              fontWeight: 900, fontSize: '1.2rem',
                              border: '2px solid rgba(255,255,255,0.1)',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                            }}
                          >
                            {review.userId?.firstName?.[0]}{review.userId?.lastName?.[0]}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', mb: 0.5 }}>
                              {review.userId?.firstName} {review.userId?.lastName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                              <Rating 
                                value={review.rating} 
                                readOnly 
                                size="small" 
                                sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }} 
                              />
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                                {formatDate(review.createdAt)}
                              </Typography>
                            </Box>
                            {review.title && (
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                                {review.title}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        {/* Review Text */}
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.7)', 
                            lineHeight: 1.8,
                            fontSize: '1.05rem',
                            mb: 3,
                            fontStyle: 'italic'
                          }}
                        >
                          {review.comment}
                        </Typography>

                        {/* Vendor Reply */}
                        {review.vendorReply && (
                          <Box sx={{ 
                            mt: 3, 
                            p: 3, 
                            borderRadius: '16px',
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.2)'
                          }}>
                            <Typography variant="subtitle2" sx={{ color: '#8B5CF6', fontWeight: 700, mb: 1 }}>
                              Vendor Response:
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {review.vendorReply}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
          )}
        </Box>
      </Box>

      {/* Add Review Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            ...glass,
            background: 'rgba(13, 17, 23, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>
          Write a Review for {vendorName}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Rating */}
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                Rating *
              </Typography>
              <Rating
                value={newReview.rating}
                onChange={(event, newValue) => {
                  setNewReview({ ...newReview, rating: newValue });
                }}
                size="large"
                sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }}
              />
            </Box>

            {/* Title */}
            <TextField
              label="Review Title (Optional)"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              fullWidth
              InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{
                sx: {
                  background: 'linear-gradient(135deg, #87CEEB, #B0E0E6)',
                  color: '#1a1a1a',
                  borderRadius: '16px',
                  fontWeight: 600,
                  '& fieldset': { border: 'none' }
                }
              }}
            />

            {/* Comment */}
            <TextField
              label="Your Review *"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              multiline
              rows={4}
              fullWidth
              placeholder="Share your experience with this vendor..."
              InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{
                sx: {
                  background: 'linear-gradient(135deg, #87CEEB, #B0E0E6)',
                  color: '#1a1a1a',
                  borderRadius: '16px',
                  fontWeight: 600,
                  '& fieldset': { border: 'none' }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ 
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            disabled={submitting}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              borderRadius: '12px',
              px: 3,
              py: 1,
              fontWeight: 700,
              textTransform: 'none'
            }}
          >
            {submitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewSystem;