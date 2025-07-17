import React from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AccessTime as AccessTimeIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';

const iconMap = {
  average: <ShowChartIcon />,
  min: <ArrowDownwardIcon />,
  max: <ArrowUpwardIcon />,
  latest: <AccessTimeIcon />,
};

const colorMap = {
  average: 'primary.main',
  min: 'error.main',
  max: 'success.main',
  latest: 'warning.main',
};

const MetricCard = ({ title, value, type }) => {
  const theme = useTheme();
  const icon = iconMap[type] || <ShowChartIcon />;
  const color = theme.palette[colorMap[type]] || theme.palette.primary.main;

  return (
    <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          mr: 2,
          p: 1,
          bgcolor: color,
          borderRadius: '50%',
          color: theme.palette.getContrastText(color),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6">{value}</Typography>
      </Box>
    </Paper>
  );
};

export default MetricCard;
