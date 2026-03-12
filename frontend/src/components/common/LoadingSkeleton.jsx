import { Box, Skeleton, Card, CardContent, Grid } from '@mui/material';

// Reusable loading skeleton components for better UX
export const CardSkeleton = ({ count = 3 }) => (
  <Grid container spacing={3}>
    {[...Array(count)].map((_, index) => (
      <Grid item xs={12} md={4} key={index}>
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} width="60%" />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <Box>
    {[...Array(rows)].map((_, index) => (
      <Box key={index} sx={{ mb: 2 }}>
        <Skeleton variant="rectangular" height={60} />
      </Box>
    ))}
  </Box>
);

export const DashboardSkeleton = () => (
  <Box>
    <Skeleton variant="text" height={60} width={300} sx={{ mb: 4 }} />
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[...Array(4)].map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
              <Skeleton variant="text" height={40} />
              <Skeleton variant="text" height={20} width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default { CardSkeleton, TableSkeleton, DashboardSkeleton };
