import { Box, Typography, Button, Paper } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

const EmptyState = ({
  icon: Icon = InboxIcon,
  title = 'No items found',
  description = 'Get started by creating your first item',
  actionLabel,
  onAction,
  iconColor = 'primary.main'
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 3
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 100,
          height: 100,
          borderRadius: '50%',
          bgcolor: 'background.paper',
          mb: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        <Icon sx={{ fontSize: 50, color: iconColor }} />
      </Box>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
        {description}
      </Typography>

      {actionLabel && onAction && (
        <Button
          variant="contained"
          size="large"
          onClick={onAction}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
