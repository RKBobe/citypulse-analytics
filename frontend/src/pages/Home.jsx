import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { metricsService } from '../services/metrics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AssessmentIcon from '@mui/icons-material/Assessment';

function Home() {
  const navigate = useNavigate();
  
  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: metricsService.getCities,
  });

  const { data: metricTypes = [], isLoading: typesLoading } = useQuery({
    queryKey: ['metricTypes'],
    queryFn: metricsService.getMetricTypes,
  });

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Welcome to CityPulse Analytics
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Real-time city metrics and analytics dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <LocationCityIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" gutterBottom>
              {citiesLoading ? '...' : cities.length}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Cities Monitored
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <AssessmentIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h3" gutterBottom>
              {typesLoading ? '...' : metricTypes.length}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Metric Types
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <TrendingUpIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h3" gutterBottom>
              1350+
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Data Points
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/dashboard')}
          startIcon={<AssessmentIcon />}
        >
          View Dashboards
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/metrics')}
          startIcon={<TrendingUpIcon />}
        >
          Explore Metrics
        </Button>
      </Box>
    </Box>
  );
}

export default Home;
