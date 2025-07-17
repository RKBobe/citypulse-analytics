// frontend/src/components/Dashboards/DashboardCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Dashboard as DashboardIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DashboardCard = ({ dashboard, onDelete }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboards/${dashboard.id}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DashboardIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="div">
            {dashboard.name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {dashboard.description || 'No description'}
        </Typography>
        <Box>
          <Chip
            label={`${dashboard.widgets?.length || 0} widgets`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button size="small" onClick={handleView}>
          View Dashboard
        </Button>
        <Box>
          <IconButton
            size="small"
            onClick={() => onDelete(dashboard.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default DashboardCard;
