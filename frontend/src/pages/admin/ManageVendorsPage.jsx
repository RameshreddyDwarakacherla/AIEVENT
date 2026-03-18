import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Tabs,
  Tab,
  InputAdornment,
  Rating,
  Divider,
  List,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PendingIcon from '@mui/icons-material/Pending';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '../../components/common';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const VENDOR_TYPES = [
  'Venue',
  'Catering',
  'Photography',
  'Videography',
  'Florist',
  'Music/DJ',
  'Decor',
  'Wedding Planner',
  'Bakery',
  'Transportation',
  'Rentals',
  'Lighting',
  'Entertainment',
  'Invitations',
  'Officiant',
  'Other'
];

const ManageVendorsPage = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [vendorServices, setVendorServices] = useState([]);
  const [vendorReviews, setVendorReviews] = useState([]);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check if user is admin using the userRole from context
        if (userRole !== 'admin') {
          throw new Error('You do not have admin privileges');
        }

        fetchVendors();
      } catch (err) {
        console.error('Error checking admin access:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (user) {
      checkAdminAccess();
    }
  }, [user, userRole]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      console.log('Fetching vendors from database...');

      // Fetch all vendors from API
      const response = await api.get('/vendors');
      if (!response.success) throw new Error(response.message);

      // Process and map backend fields to frontend expectations
      const processedVendors = (response.data || []).map(vendor => {
        // Map backend userId to profiles object for UI compatibility
        const profile = vendor.userId || {};
        
        return {
          ...vendor,
          id: vendor._id || vendor.id,
          company_name: vendor.companyName,
          vendor_type: vendor.vendorType,
          is_verified: !!vendor.isVerified,
          avg_rating: vendor.avgRating || 0,
          review_count: vendor.reviewCount || 0,
          created_at: vendor.createdAt,
          profiles: {
            id: profile._id || profile.id,
            email: profile.email,
            first_name: profile.firstName,
            last_name: profile.lastName,
            phone: profile.phone
          }
        };
      });

      console.log('Processed vendors data:', processedVendors);

      setVendors(processedVendors);
      setFilteredVendors(processedVendors);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    filterVendors(newValue, searchQuery);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterVendors(tabValue, query);
  };

  const filterVendors = (tabIndex, query) => {
    console.log('Filtering vendors. Tab:', tabIndex, 'Query:', query);
    console.log('Current vendors state:', vendors);

    let filtered = vendors;

    // Filter by verification status based on tab
    if (tabIndex === 1) { // Pending verification
      console.log('Filtering for pending vendors');
      filtered = vendors.filter(vendor => {
        console.log('Vendor:', vendor.company_name, 'is_verified:', vendor.is_verified, 'type:', typeof vendor.is_verified);
        return !vendor.is_verified;
      });
    } else if (tabIndex === 2) { // Verified
      console.log('Filtering for verified vendors');
      filtered = vendors.filter(vendor => {
        console.log('Vendor:', vendor.company_name, 'is_verified:', vendor.is_verified, 'type:', typeof vendor.is_verified);
        return vendor.is_verified;
      });
    }

    // Filter by search query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(vendor =>
        (vendor.company_name && vendor.company_name.toLowerCase().includes(lowercaseQuery)) ||
        (vendor.vendor_type && vendor.vendor_type.toLowerCase().includes(lowercaseQuery)) ||
        (vendor.profiles?.email && vendor.profiles.email.toLowerCase().includes(lowercaseQuery)) ||
        (vendor.profiles?.first_name && vendor.profiles.first_name.toLowerCase().includes(lowercaseQuery)) ||
        (vendor.profiles?.last_name && vendor.profiles.last_name.toLowerCase().includes(lowercaseQuery))
      );
    }

    setFilteredVendors(filtered);
  };

  const handleViewDetails = async (vendor) => {
    try {
      setCurrentVendor(vendor);
      setLoading(true);

      // Fetch vendor services - mock data for now since we don't have this endpoint
      const servicesData = [];

      // Fetch vendor reviews - mock data for now since we don't have this endpoint  
      const reviewsData = [];

      setVendorServices(servicesData || []);
      setVendorReviews(reviewsData || []);
      setDetailsDialogOpen(true);
    } catch (err) {
      console.error('Error fetching vendor details:', err);
      toast.error('Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClick = (vendor) => {
    setCurrentVendor(vendor);
    setVerifyDialogOpen(true);
  };

  const handleBlockClick = (vendor) => {
    setCurrentVendor(vendor);
    setBlockDialogOpen(true);
  };

  const handleVerifyVendor = async (vendorId, approve) => {
    try {
      setLoading(true);
      const res = await api.put(`/vendors/${vendorId}/verify`, { isVerified: approve });
      if (res.success) {
        toast.success(approve ? '✅ Vendor approved!' : '❌ Vendor rejected');
        fetchVendors();
      }
    } catch (err) {
      toast.error('Failed to update vendor status');
    } finally {
      setLoading(false);
    }
  };



  const handleBlockVendor = async () => {
    try {
      if (!currentVendor) return;

      // Update vendor status
      const response = await api.put(`/vendors/${currentVendor.id}`, {
        isVerified: false
      });

      if (!response.success) throw new Error(response.message);

      // Update user status - we'll need to call the users endpoint
      const userResponse = await api.put(`/users/${currentVendor.profiles.id}`, {
        isActive: false
      });

      if (!userResponse.success) throw new Error(userResponse.message);

      // Update local state immediately
      setVendors(prevVendors =>
        prevVendors.map(vendor =>
          vendor.id === currentVendor.id
            ? {
                ...vendor,
                is_verified: false,
                profiles: {
                  ...vendor.profiles,
                  is_active: false
                }
              }
            : vendor
        )
      );

      setFilteredVendors(prevVendors =>
        prevVendors.map(vendor =>
          vendor.id === currentVendor.id
            ? {
                ...vendor,
                is_verified: false,
                profiles: {
                  ...vendor.profiles,
                  is_active: false
                }
              }
            : vendor
        )
      );

      // Also update currentVendor
      setCurrentVendor(prev => ({
        ...prev,
        is_verified: false,
        profiles: {
          ...prev.profiles,
          is_active: false
        }
      }));

      // Refresh vendor list from the server
      fetchVendors();
      setBlockDialogOpen(false);
      toast.success('Vendor blocked successfully');
    } catch (err) {
      console.error('Error blocking vendor:', err);
      setError(err.message);
      toast.error('Failed to block vendor');
    }
  };

  const formatPrice = (price, priceType) => {
    if (!price) return 'Contact for pricing';

    switch (priceType) {
      case 'fixed':
        return `$${price.toFixed(2)}`;
      case 'starting_at':
        return `Starting at $${price.toFixed(2)}`;
      case 'per_person':
        return `$${price.toFixed(2)} per person`;
      case 'hourly':
        return `$${price.toFixed(2)}/hour`;
      default:
        return `$${price.toFixed(2)}`;
    }
  };

  if (loading && vendors.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <PageContainer
      title="Vendor Management"
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip 
            label={`${vendors.filter(v => v.is_verified).length} Verified`} 
            sx={{ 
              bgcolor: 'rgba(52, 211, 153, 0.1)', 
              color: '#10B981', 
              fontWeight: 700, 
              border: '1px solid rgba(16, 185, 129, 0.3)' 
            }} 
          />
          <Chip 
            label={`${vendors.filter(v => !v.is_verified).length} Pending`} 
            sx={{ 
              bgcolor: 'rgba(245, 158, 11, 0.1)', 
              color: '#F59E0B', 
              fontWeight: 700, 
              border: '1px solid rgba(245, 158, 11, 0.3)' 
            }} 
          />
        </Box>
      }
    >

      {/* Filters and Search */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="vendor filter tabs">
              <Tab label="All Vendors" />
              <Tab label="Pending Verification" />
              <Tab label="Verified Vendors" />
            </Tabs>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  console.log('Force refreshing data...');
                  fetchVendors();
                  toast.info('Data refreshed');
                }}
                sx={{ minWidth: '100px' }}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Vendors Table */}
      <Paper 
        elevation={0}
        sx={{ 
          width: '100%', 
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 4
        }}
      >
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Vendor profile</TableCell>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Service category</TableCell>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Performance</TableCell>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Verification</TableCell>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Details</TableCell>
                <TableCell align="right" sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor, index) => (
                    <TableRow 
                      key={vendor.id}
                      component={motion.tr}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      hover
                      sx={{ 
                        '&:hover': { background: 'rgba(255,255,255,0.04) !important' },
                        borderBottom: '1px solid rgba(255,255,255,0.04)'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            width: 48, height: 48, 
                            background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          }}>
                            <StorefrontIcon />
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                              {vendor.company_name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocationOnIcon sx={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }} />
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                {vendor.city || 'N/A'}, {vendor.state || ''}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={vendor.vendor_type}
                          size="small"
                          sx={{ 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: 600,
                            borderRadius: '6px'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Rating value={vendor.avg_rating || 0} precision={0.5} size="small" readOnly sx={{ 
                            '& .MuiRating-iconFilled': { color: '#FBBF24' },
                            '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.1)' }
                          }} />
                          <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.4)' }}>
                            {vendor.review_count || 0} Reviews
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={vendor.is_verified ? <VerifiedIcon style={{ fontSize: 14 }} /> : <PendingIcon style={{ fontSize: 14 }} />}
                          label={vendor.is_verified ? 'VERIFIED' : 'PENDING'}
                          size="small"
                          sx={{
                            background: vendor.is_verified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: vendor.is_verified ? '#34D399' : '#FBBF24',
                            fontWeight: 800,
                            borderRadius: '8px',
                            border: '1px solid currentColor',
                            fontSize: '0.65rem'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                            Email: {vendor.profiles?.email}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            Joined: {vendor.created_at ? format(new Date(vendor.created_at), 'MMM yyyy') : 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Detailed Profile">
                          <IconButton
                            onClick={() => handleViewDetails(vendor)}
                            sx={{ color: '#8B5CF6', '&:hover': { background: 'rgba(139, 92, 246, 0.1)' } }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {!vendor.is_verified && (
                          <Tooltip title="Approve Verification">
                            <IconButton
                              onClick={() => handleVerifyClick(vendor)}
                              sx={{ color: '#10B981', '&:hover': { background: 'rgba(16, 185, 129, 0.1)' } }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Block Vendor">
                          <IconButton
                            onClick={() => handleBlockClick(vendor)}
                            sx={{ color: '#EF4444', '&:hover': { background: 'rgba(239, 68, 68, 0.1)' } }}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 12, border: 'none' }}>
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        sx={{ textAlign: 'center' }}
                      >
                        <Box sx={{ 
                          width: 80, height: 80, 
                          borderRadius: '50%', 
                          background: 'rgba(139, 92, 246, 0.1)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          mx: 'auto', mb: 3,
                          color: '#A78BFA'
                        }}>
                          <StorefrontIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                          No Vendors Registered Yet
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.4)', maxWidth: 400, mx: 'auto' }}>
                          Wait for vendors to join the platform or try adjusting your search filters to find what you're looking for.
                        </Typography>
                        <Button
                          variant="text"
                          startIcon={<RefreshIcon />}
                          onClick={() => fetchVendors()}
                          sx={{ mt: 3, color: '#A78BFA', fontWeight: 700 }}
                        >
                          Refresh Database
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Vendor Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Vendor Details
        </DialogTitle>
        <DialogContent>
          {currentVendor && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Vendor Profile */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
                          <StorefrontIcon fontSize="large" />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {currentVendor.company_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {currentVendor.vendor_type}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Rating value={currentVendor.avg_rating || 0} precision={0.5} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {currentVendor.avg_rating ? `${currentVendor.avg_rating.toFixed(1)} stars` : 'No ratings yet'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Chip
                        icon={currentVendor.is_verified ? <VerifiedIcon /> : <PendingIcon />}
                        label={currentVendor.is_verified ? 'Verified' : 'Pending Verification'}
                        color={currentVendor.is_verified ? 'success' : 'warning'}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Contact Person
                        </Typography>
                        <Typography variant="body1">
                          {currentVendor.profiles?.first_name} {currentVendor.profiles?.last_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {currentVendor.profiles?.email}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Description
                        </Typography>
                        <Typography variant="body1">
                          {currentVendor.description || 'No description provided'}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1">
                          {currentVendor.address ? (
                            <>
                              {currentVendor.address}<br />
                              {currentVendor.city}{currentVendor.state ? `, ${currentVendor.state}` : ''} {currentVendor.zip_code}
                            </>
                          ) : (
                            'No address provided'
                          )}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Website
                        </Typography>
                        <Typography variant="body1">
                          {currentVendor.website ? (
                            <a href={currentVendor.website} target="_blank" rel="noopener noreferrer">
                              {currentVendor.website}
                            </a>
                          ) : (
                            'No website provided'
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Services */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Services ({vendorServices.length})
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  {vendorServices.length > 0 ? (
                    <List dense>
                      {vendorServices.map((service) => (
                        <Box key={service.id} sx={{ mb: 2 }}>
                          <Typography variant="subtitle1">
                            {service.service_name || service.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {service.description || 'No description'}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">
                              {service.price ? formatPrice(service.price, service.price_type) : 'Contact for pricing'}
                            </Typography>
                            <Chip
                              label={service.is_available ? 'Available' : 'Unavailable'}
                              color={service.is_available ? 'success' : 'default'}
                              size="small"
                            />
                          </Box>
                          {service !== vendorServices[vendorServices.length - 1] && <Divider sx={{ my: 2 }} />}
                        </Box>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                      No services listed
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {/* Reviews */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Reviews ({vendorReviews.length})
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  {vendorReviews.length > 0 ? (
                    <List dense>
                      {vendorReviews.map((review) => (
                        <Box key={review.id} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                {review.profiles?.first_name ? review.profiles.first_name[0] : 'U'}
                              </Avatar>
                              <Typography variant="subtitle2">
                                {review.profiles ? `${review.profiles.first_name} ${review.profiles.last_name}` : 'Anonymous'}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(review.created_at), 'MMM d, yyyy')}
                            </Typography>
                          </Box>
                          <Rating value={review.rating} readOnly size="small" sx={{ mt: 1 }} />
                          <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                            {review.review_text || 'No comment provided'}
                          </Typography>
                          {review !== vendorReviews[vendorReviews.length - 1] && <Divider sx={{ my: 2 }} />}
                        </Box>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                      No reviews yet
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          {currentVendor && !currentVendor.is_verified && (
            <Button
              onClick={() => {
                setDetailsDialogOpen(false);
                handleVerifyClick(currentVendor);
              }}
              color="success"
              variant="contained"
            >
              Verify Vendor
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Verify Vendor Dialog */}
      <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)}>
        <DialogTitle>Confirm Verification</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Are you sure you want to verify {currentVendor?.company_name}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will allow them to be visible to users and receive bookings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleVerifyVendor} color="success" variant="contained">
            Verify Vendor
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block Vendor Dialog */}
      <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
        <DialogTitle>Confirm Block</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Are you sure you want to block {currentVendor?.company_name}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will remove their verification status and prevent them from logging in.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBlockVendor} color="error">
            Block Vendor
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ManageVendorsPage;