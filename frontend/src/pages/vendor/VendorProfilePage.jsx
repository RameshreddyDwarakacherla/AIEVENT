import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Avatar,
  MenuItem,
  IconButton
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';

const VENDOR_TYPES = [
  'Venue', 'Catering', 'Photography', 'Videography', 'Florist',
  'Music/DJ', 'Decor', 'Wedding Planner', 'Bakery', 'Transportation',
  'Rentals', 'Lighting', 'Entertainment', 'Invitations', 'Officiant', 'Other'
];

const VendorProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '', vendorType: '', description: '', address: '',
    city: '', state: '', zipCode: '', website: '', phone: '', email: '', isVerified: false
  });

  useEffect(() => {
    loadVendorProfile();
  }, [user]);

  const loadVendorProfile = () => {
    try {
      setLoading(true);
      if (!user) return;
      const vendorProfileData = localStorage.getItem(`vendorProfile_${user.id}`);
      if (vendorProfileData) {
        setFormData(JSON.parse(vendorProfileData));
      } else {
        const defaultProfile = {
          companyName: 'My Vendor Business', vendorType: 'Catering',
          description: 'Professional event services provider', address: '123 Business St',
          city: 'New York', state: 'NY', zipCode: '10001', website: 'https://myvendor.com',
          phone: '(555) 123-4567', email: user.email || 'vendor@example.com', isVerified: true
        };
        setFormData(defaultProfile);
        localStorage.setItem(`vendorProfile_${user.id}`, JSON.stringify(defaultProfile));
      }
    } catch (err) {
      console.error('Error loading vendor profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    try {
      setSaving(true);
      setSuccess(false);
      if (!user) return;
      localStorage.setItem(`vendorProfile_${user.id}`, JSON.stringify(formData));
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating vendor profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', p: 4, position: 'relative', overflow: 'hidden' }}>
      {[...Array(6)].map((_, i) => (
        <Box key={i} sx={{ position: 'absolute', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', animation: `float ${15 + i * 2}s ease-in-out infinite`, animationDelay: `${i * 0.5}s`, width: `${100 + i * 50}px`, height: `${100 + i * 50}px`, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, '@keyframes float': { '0%, 100%': { transform: 'translate(0, 0) scale(1)' }, '33%': { transform: `translate(${30 + i * 10}px, ${-30 - i * 10}px) scale(1.1)` }, '66%': { transform: `translate(${-20 - i * 5}px, ${20 + i * 5}px) scale(0.9)` } } }} />
      ))}
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.2)', mb: 1 }}>Vendor Profile</Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 300 }}>Manage your business information</Typography>
        </Box>
        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>Profile updated successfully!</Alert>}
        {formData.isVerified && <Alert severity="success" sx={{ mb: 3, borderRadius: 3, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>✓ Your vendor account is verified</Alert>}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                  <Avatar sx={{ width: 120, height: 120, mx: 'auto', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: '3rem', fontWeight: 700, boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)' }}>{formData.companyName?.charAt(0) || 'V'}</Avatar>
                  <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', '&:hover': { background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)' } }}><PhotoCameraIcon /></IconButton>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1E293B' }}>{formData.companyName}</Typography>
                <Chip label={formData.vendorType} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 600, mb: 1 }} />
                {formData.isVerified && <Chip label="✓ Verified" color="success" sx={{ ml: 1, fontWeight: 600 }} />}
                <Typography variant="body1" sx={{ color: '#64748B', mt: 2, mb: 3 }}>{formData.description || 'No description provided'}</Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>📧 {formData.email}</Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>📞 {formData.phone}</Typography>
                  {formData.website && <Typography variant="body2" sx={{ color: '#64748B' }}>🌐 <a href={formData.website} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>{formData.website}</a></Typography>}
                </Box>
                <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditing(true)} fullWidth sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 3, py: 1.5, fontWeight: 700, '&:hover': { background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)' } }}>Edit Profile</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 4, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                {editing ? (
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1E293B' }}>Edit Profile</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}><TextField label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} fullWidth required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                      <Grid item xs={12} sm={6}><TextField select label="Vendor Type" name="vendorType" value={formData.vendorType} onChange={handleInputChange} fullWidth required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>{VENDOR_TYPES.map((type) => (<MenuItem key={type} value={type}>{type}</MenuItem>))}</TextField></Grid>
                      <Grid item xs={12} sm={6}><TextField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                      <Grid item xs={12}><TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth type="email" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                      <Grid item xs={12}><TextField label="Website" name="website" value={formData.website} onChange={handleInputChange} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                      <Grid item xs={12}><TextField label="Description" name="description" value={formData.description} onChange={handleInputChange} fullWidth multiline rows={4} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                      <Grid item xs={12}><Divider sx={{ my: 1 }} /><Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 2 }}>Location</Typography></Grid>
                      <Grid item xs={12}><TextField label="Address" name="address" value={formData.address} onChange={handleInputChange} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                      <Grid item xs={12} sm={4}><TextField label="City" name="city" value={formData.city} onChange={handleInputChange} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                      <Grid item xs={12} sm={4}><TextField label="State" name="state" value={formData.state} onChange={handleInputChange} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                      <Grid item xs={12} sm={4}><TextField label="ZIP Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button variant="outlined" onClick={() => setEditing(false)} disabled={saving} sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 600, borderColor: '#667eea', color: '#667eea', '&:hover': { borderColor: '#5568d3', background: 'rgba(102, 126, 234, 0.05)' } }}>Cancel</Button>
                      <Button variant="contained" onClick={handleSaveProfile} disabled={saving} startIcon={saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SaveIcon />} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 3, px: 4, py: 1.5, fontWeight: 700, '&:hover': { background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)' } }}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>Business Information</Typography>
                      <Button startIcon={<EditIcon />} onClick={() => setEditing(true)} sx={{ color: '#667eea', fontWeight: 600, '&:hover': { background: 'rgba(102, 126, 234, 0.05)' } }}>Edit</Button>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}><Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>Company Name</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{formData.companyName}</Typography></Grid>
                      <Grid item xs={12} sm={6}><Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>Vendor Type</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{formData.vendorType}</Typography></Grid>
                      <Grid item xs={12} sm={6}><Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>Phone</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{formData.phone || 'Not provided'}</Typography></Grid>
                      <Grid item xs={12} sm={6}><Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>Email</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{formData.email}</Typography></Grid>
                      <Grid item xs={12}><Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>Description</Typography><Typography variant="body1" sx={{ color: '#1E293B' }}>{formData.description || 'No description provided'}</Typography></Grid>
                      <Grid item xs={12}><Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>Website</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{formData.website ? <a href={formData.website} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>{formData.website}</a> : 'Not provided'}</Typography></Grid>
                      <Grid item xs={12}><Divider sx={{ my: 2 }} /><Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 2 }}>Location</Typography></Grid>
                      <Grid item xs={12}><Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>Address</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{formData.address || 'Not provided'}</Typography></Grid>
                      <Grid item xs={12} sm={4}><Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>City</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{formData.city || 'Not provided'}</Typography></Grid>
                      <Grid item xs={12} sm={4}><Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>State</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{formData.state || 'Not provided'}</Typography></Grid>
                      <Grid item xs={12} sm={4}><Typography variant="subtitle2" sx={{ color: '#64748B', mb: 0.5 }}>ZIP Code</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B' }}>{formData.zipCode || 'Not provided'}</Typography></Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default VendorProfilePage;
