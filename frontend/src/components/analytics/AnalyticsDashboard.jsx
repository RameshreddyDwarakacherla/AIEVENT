import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatCard from '../common/StatCard';

const AnalyticsDashboard = ({ data }) => {
  const [timeRange, setTimeRange] = useState('30days');

  // Sample data - replace with real data
  const eventTrendData = [
    { month: 'Jan', events: 12, revenue: 45000 },
    { month: 'Feb', events: 15, revenue: 52000 },
    { month: 'Mar', events: 18, revenue: 68000 },
    { month: 'Apr', events: 22, revenue: 75000 },
    { month: 'May', events: 25, revenue: 89000 },
    { month: 'Jun', events: 28, revenue: 95000 }
  ];

  const eventTypeData = [
    { name: 'Weddings', value: 45, color: '#1976d2' },
    { name: 'Corporate', value: 25, color: '#2196f3' },
    { name: 'Birthday', value: 15, color: '#42a5f5' },
    { name: 'Conference', value: 10, color: '#64b5f6' },
    { name: 'Other', value: 5, color: '#90caf9' }
  ];

  const vendorPerformanceData = [
    { name: 'Catering', bookings: 45, rating: 4.8 },
    { name: 'Photography', bookings: 38, rating: 4.6 },
    { name: 'Venue', bookings: 32, rating: 4.9 },
    { name: 'Decoration', bookings: 28, rating: 4.5 },
    { name: 'Entertainment', bookings: 25, rating: 4.7 }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Analytics Dashboard
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7days">Last 7 Days</MenuItem>
            <MenuItem value="30days">Last 30 Days</MenuItem>
            <MenuItem value="90days">Last 90 Days</MenuItem>
            <MenuItem value="1year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Events"
            value="156"
            icon={EventIcon}
            trend="up"
            trendValue="+12%"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value="$524K"
            icon={AttachMoneyIcon}
            trend="up"
            trendValue="+18%"
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value="2,847"
            icon={PeopleIcon}
            trend="up"
            trendValue="+8%"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Event Size"
            value="125"
            icon={TrendingUpIcon}
            trend="down"
            trendValue="-3%"
            color="warning"
            subtitle="guests"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Event Trends */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Event & Revenue Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={eventTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="events"
                    stroke="#1976d2"
                    strokeWidth={2}
                    name="Events"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2e7d32"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Event Types Distribution */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Event Types
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Vendor Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Top Vendor Categories
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vendorPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="bookings" fill="#1976d2" name="Bookings" />
                  <Bar yAxisId="right" dataKey="rating" fill="#2e7d32" name="Avg Rating" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;
