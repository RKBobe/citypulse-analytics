// frontend/src/components/Widgets/WidgetWithTimeRange.jsx
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { metricsService } from '../../services/metrics';
import MetricsChart from '../Charts/MetricsChart';
import MetricCard from '../Metrics/MetricCard';

const WidgetWithTimeRange = ({ widget, onDelete, onEdit }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [timeRange, setTimeRange] = useState('24h');

  const { data: metrics = [], isLoading, error } = useQuery({
    queryKey: ['widget-metrics', widget.id, widget.config, timeRange],
    queryFn: async () => {
      const allMetrics = await metricsService.getAll();

      // Filter by metric type and city
      let filteredMetrics = allMetrics.filter(m =>
        m.metric_type === widget.config?.metric_type &&
        m.city === widget.config?.city
      );

      // Filter by time range
      const now = new Date();
      const timeRanges = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
      };

      if (timeRanges[timeRange]) {
        const cutoffTime = now.getTime() - timeRanges[timeRange];
        filteredMetrics = filteredMetrics.filter(m =>
          new Date(m.timestamp).getTime() > cutoffTime
        );
      }

      return filteredMetrics
        .map(m => ({
          ...m,
          timestamp: new Date(m.timestamp).toLocaleDateString(),
          value: parseFloat(m.value),
        }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    },
    enabled: !!widget.config?.metric_type && !!widget.config?.city,
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete(widget.id);
    handleMenuClose();
  };

  const handleEdit = () => {
    onEdit(widget);
    handleMenuClose();
  };

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const getStatistics = () => {
    if (metrics.length === 0) return { avg: 0, min: 0, max: 0, latest: 0 };

    const values = metrics.map(m => m.value);
    return {
      avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2),
      latest: values[values.length - 1]?.toFixed(2) || 0,
    };
  };

  const renderContent = () => {
    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error loading data</Alert>;
    if (metrics.length === 0) return <Typography variant="body2" color="text.secondary">No data available</Typography>;

    const stats = getStatistics();

    switch (widget.widget_type) {
      case 'line_chart':
      case 'bar_chart':
      case 'area_chart':
        return (
          <MetricsChart
            data={metrics}
            type={widget.widget_type.replace('_chart', '')}
          />
        );
      case 'metric_card': {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <MetricCard
              title="Current"
              value={stats.latest}
              type="latest"
            />
            <Typography variant="body2" color="text.secondary">
              Avg: {stats.avg} | Min: {stats.min} | Max: {stats.max}
            </Typography>
          </Box>
        );
      }
      case 'gauge': {
        // Simple gauge representation
        const percentage = ((parseFloat(stats.latest) / parseFloat(stats.max)) * 100).toFixed(0);
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" color="primary">
              {percentage}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stats.latest} / {stats.max}
            </Typography>
          </Box>
        );
      }
      default:
        return <Typography>Unknown widget type</Typography>;
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">{widget.title}</Typography>
        <IconButton onClick={handleMenuOpen} size="small">
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" /> Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" /> Delete
          </MenuItem>
        </Menu>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          size="small"
        >
          <ToggleButton value="1h">1H</ToggleButton>
          <ToggleButton value="24h">24H</ToggleButton>
          <ToggleButton value="7d">7D</ToggleButton>
          <ToggleButton value="30d">30D</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {renderContent()}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
        {widget.config?.metric_type?.replace('_', ' ')} - {widget.config?.city?.replace('_', ' ')}
      </Typography>
    </Paper>
  );
};

export default WidgetWithTimeRange;
