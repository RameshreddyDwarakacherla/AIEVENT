import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Breadcrumbs, 
  Link as MuiLink,
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StorageIcon from '@mui/icons-material/Storage';
import CreateBudgetTable from '../../components/admin/CreateBudgetTable';

const DatabaseSetupPage = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ p: { xs: 2, md: 4 } }}
    >
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, '& .MuiTypography-root': { color: 'rgba(255,255,255,0.7)', fontWeight: 600 } }}>
          <MuiLink 
            component={Link} 
            to="/admin/dashboard" 
            sx={{ color: '#A78BFA', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Dashboard
          </MuiLink>
          <Typography color="text.primary">Database Maintenance</Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ 
            p: 1.5, borderRadius: 2, 
            background: 'rgba(139, 92, 246, 0.15)', 
            color: '#A78BFA',
            display: 'flex'
          }}>
            <StorageIcon />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
            Infrastructure & Schema
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>
          Initialize and maintain the required database structures for the platform.
        </Typography>
        
        <Paper
          elevation={0}
          sx={{
            p: 4,
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 5
          }}
        >
          <CreateBudgetTable />
        </Paper>
      </Box>
    </Box>
  );
};

export default DatabaseSetupPage;
