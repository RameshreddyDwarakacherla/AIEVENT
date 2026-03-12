import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Chip,
  TextField,
  MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';

const FilterPanel = ({
  open,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters
}) => {
  const [localFilters, setLocalFilters] = useState(filters || {});

  const handleCheckboxChange = (category, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        values: prev[category]?.values?.includes(value)
          ? prev[category].values.filter(v => v !== value)
          : [...(prev[category]?.values || []), value]
      }
    }));
  };

  const handleSliderChange = (category, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: { ...prev[category], value }
    }));
  };

  const handleSelectChange = (category, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: { ...prev[category], value }
    }));
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    if (onResetFilters) {
      onResetFilters();
    }
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).filter(filter => {
      if (Array.isArray(filter.values)) {
        return filter.values.length > 0;
      }
      return filter.value !== undefined && filter.value !== null;
    }).length;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 360 }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
            {getActiveFilterCount() > 0 && (
              <Chip
                label={getActiveFilterCount()}
                size="small"
                color="primary"
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Example Filter Sections */}
        <Box sx={{ mb: 4 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
              Event Type
            </FormLabel>
            <FormGroup>
              {['Wedding', 'Corporate', 'Birthday', 'Conference', 'Other'].map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      checked={localFilters.eventType?.values?.includes(type) || false}
                      onChange={() => handleCheckboxChange('eventType', type)}
                    />
                  }
                  label={type}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>

        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 2, fontWeight: 600 }}>
              Budget Range
            </FormLabel>
            <Slider
              value={localFilters.budget?.value || [0, 100000]}
              onChange={(e, value) => handleSliderChange('budget', value)}
              valueLabelDisplay="auto"
              min={0}
              max={100000}
              step={1000}
              marks={[
                { value: 0, label: '$0' },
                { value: 50000, label: '$50k' },
                { value: 100000, label: '$100k' }
              ]}
            />
          </FormControl>
        </Box>

        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 2, fontWeight: 600 }}>
              Status
            </FormLabel>
            <TextField
              select
              value={localFilters.status?.value || ''}
              onChange={(e) => handleSelectChange('status', e.target.value)}
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="planning">Planning</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </FormControl>
        </Box>

        <Box sx={{ mb: 4 }}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
              Guest Count
            </FormLabel>
            <FormGroup>
              {['1-50', '51-100', '101-200', '200+'].map((range) => (
                <FormControlLabel
                  key={range}
                  control={
                    <Checkbox
                      checked={localFilters.guestCount?.values?.includes(range) || false}
                      onChange={() => handleCheckboxChange('guestCount', range)}
                    />
                  }
                  label={range}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FilterPanel;
