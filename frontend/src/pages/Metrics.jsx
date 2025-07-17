// frontend/src/pages/Metrics.jsx
import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { metricsService } from '../services/metrics';
import MetricsChart from '../components/Charts/MetricsChart';
import MetricCard from '../components/Metrics/MetricCard';

function Metrics() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedMetricType, setSelectedMetricType] = useState('all');

  const { data: metrics = [], isLoading, error } = useQuery({
    queryKey: ['metrics'],
    queryFn: metricsService.getAll,
  });

  // Get unique cities and metric types
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(metrics.map(m => m.city))];
    return ['all', ...uniqueCities];
  }, [metrics]);

  const metricTypes = useMemo(() => {
    const uniqueTypes = [...new Set(metrics.map(m => m.metric_type))];
    return ['all', ...uniqueTypes];
  }, [metrics]);

  // Filter metrics based on selection
  const filteredMetrics = useMemo(() => {
    return metrics.filter(metric => {
      const cityMatch = selectedCity === 'all' || metric.city === selectedCity;
      const typeMatch = selectedMetricType === 'all' || metric.metric_type === selectedMetricType;
      return cityMatch && typeMatch;
    });
  }, [metrics, selectedCity, selectedMetricType]);

  // Prepare data for chart
  const chartData = useMemo(() => {
    if (selectedMetricType === 'all' || selectedCity === 'all') {
      // Show aggregated data when 'all' is selected
      const aggregated = {};

      filteredMetrics.forEach(metric => {
        const timestamp = new Date(metric.timestamp).toLocaleDateString();
        if (!aggregated[timestamp]) {
          aggregated[timestamp] = {
            timestamp,
            count: 0,
            totalValue: 0,
          };
        }
        aggregated[timestamp].count += 1;
        aggregated[timestamp].totalValue += metric.value;
      });

      return Object.values(aggregated).map(item => ({
        timestamp: item.timestamp,
        value: item.totalValue / item.count, // Average value
      })).slice(-30); // Last 30 data points
    } else {
      // Show specific metric data
      return filteredMetrics
        .map(metric => ({
          timestamp: new Date(metric.timestamp).toLocaleDateString(),
          value: metric.value,
        }))
        .slice(-30); // Last 30 data points
    }
  }, [filteredMetrics, selectedCity, selectedMetricType]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (filteredMetrics.length === 0) {
      return { average: 0, min: 0, max: 0, latest: 0 };
    }

    const values = filteredMetrics.map(m => m.value);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const latest = filteredMetrics[filteredMetrics.length - 1]?.value || 0;

    return { average, min, max, latest };
  }, [filteredMetrics]);

  // Format title for chart
  const formatTitle = (metricType, city) => {
    const metricLabel = metricType === 'all'
      ? 'All Metrics'
      : metricType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const cityLabel = city === 'all'
      ? 'All Cities'
      : city.charAt(0).toUpperCase() + city.slice(1);

    return `${metricLabel} - ${cityLabel}`;
  };

  if (isLoading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading metrics: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        City Metrics
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                label="City"
              >
                {cities.map(city => (
                  <MenuItem key={city} value={city}>
                    {city.charAt(0).toUpperCase() + city.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Metric Type</InputLabel>
              <Select
                value={selectedMetricType}
                onChange={(e) => setSelectedMetricType(e.target.value)}
                label="Metric Type"
              >
                {metricTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type.split('_').map(word =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Average"
            value={summaryStats.average.toFixed(2)}
            type="average"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Minimum"
            value={summaryStats.min.toFixed(2)}
            type="min"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Maximum"
            value={summaryStats.max.toFixed(2)}
            type="max"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Latest"
            value={summaryStats.latest.toFixed(2)}
            type="latest"
          />
        </Grid>
      </Grid>

      {/* Chart */}
      <Box sx={{ mb: 3 }}>
        <MetricsChart
          data={chartData}
          title={formatTitle(selectedMetricType, selectedCity)}
          type="line"
        />
      </Box>

      {/* Metrics Count */}
      <Typography variant="body2" color="text.secondary" align="center">
        Showing {filteredMetrics.length} metrics
      </Typography>
    </Container>
  );
}

export default Metrics;
