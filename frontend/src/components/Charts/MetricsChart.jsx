// frontend/src/components/Charts/MetricsChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const MetricsChart = ({ data, title, type = 'line', dataKey = 'value' }) => {
  const theme = useTheme();

  const getChart = () => {
    const commonProps = {
      data: data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const commonAxisProps = {
      stroke: theme.palette.text.secondary,
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="timestamp" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
            <Legend />
            <Bar dataKey={dataKey} fill={theme.palette.primary.main} />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="timestamp" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={theme.palette.primary.main}
              fill={theme.palette.primary.light}
              fillOpacity={0.6}
            />
          </AreaChart>
        );

      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="timestamp" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ fill: theme.palette.primary.dark, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      {title && (
        <Typography variant="h6" gutterBottom color="text.primary">
          {title}
        </Typography>
      )}
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          {getChart()}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default MetricsChart;
