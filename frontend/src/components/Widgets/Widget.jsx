// frontend/src/components/Widgets/Widget.jsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
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

const Widget = ({ widget, onDelete, onEdit }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { data: metrics = [], isLoading, error } = useQuery({
    queryKey: ['widget-metrics', widget.id, widget.config],
    queryFn: async () => {
      const allMetrics = await metricsService.getAll();
      return allMetrics
        .filter(m =>
          m.metric_type === widget.config?.metric_type &&
          m.city === widget.config?.city
        )
        .map(m => ({
          ...m,
          timestamp: new Date(m.timestamp).toLocaleDateString(),
        }))
        .slice(-30); // Get last 30 data points
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

  const renderContent = () => {
    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error loading data</Alert>;
    if (metrics.length === 0) return <Typography variant="body2" color="text.secondary">No data available</Typography>;

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
        const latestMetric = metrics[metrics.length - 1];
        return (
          <MetricCard
            title="Latest Value"
            value={latestMetric?.value.toFixed(2) || 'N/A'}
            type="latest"
          />
        );
      }
      case 'gauge': {
        // For now, just show a metric card for gauge type
        const latestMetric = metrics[metrics.length - 1];
        return (
          <MetricCard
            title="Current"
            value={latestMetric?.value.toFixed(2) || 'N/A'}
            type="average"
          />
        );
      }
      default:
        return <Typography>Unknown widget type</Typography>;
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {renderContent()}
      </Box>
    </Paper>
  );
};

export default Widget;
