import { Card, CardContent, Box, Typography, Avatar, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
  subtitle,
  onClick
}) => {
  const colors = {
    primary: { main: '#1976d2', light: '#e3f2fd' },
    secondary: { main: '#9c27b0', light: '#f3e5f5' },
    success: { main: '#2e7d32', light: '#e8f5e9' },
    error: { main: '#d32f2f', light: '#ffebee' },
    warning: { main: '#ed6c02', light: '#fff3e0' },
    info: { main: '#0288d1', light: '#e1f5fe' }
  };

  const selectedColor = colors[color] || colors.primary;

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 6
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          
          {Icon && (
            <Avatar
              sx={{
                bgcolor: selectedColor.light,
                color: selectedColor.main,
                width: 56,
                height: 56
              }}
            >
              <Icon sx={{ fontSize: 28 }} />
            </Avatar>
          )}
        </Box>

        {trend && trendValue && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={trendValue}
              size="small"
              color={trend === 'up' ? 'success' : 'error'}
              sx={{ fontWeight: 600 }}
            />
            <Typography variant="caption" color="text.secondary">
              vs last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
