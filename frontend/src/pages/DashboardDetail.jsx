// frontend/src/pages/DashboardDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardsService } from '../services/dashboards';
import { widgetsService } from '../services/widgets';
import WidgetWithTimeRange from '../components/Widgets/WidgetWithTimeRange';
import AddWidgetDialog from '../components/Widgets/AddWidgetDialog';

function DashboardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch dashboard details
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['dashboard', id],
    queryFn: () => dashboardsService.getById(id),
    enabled: !!id,
  });

  // Mutation for creating a widget
  const createWidgetMutation = useMutation({
    mutationFn: widgetsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboard', id]);
      setDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating widget:', error);
      alert('Failed to create widget. Please try again.');
    },
  });

  // Mutation for deleting a widget
  const deleteWidgetMutation = useMutation({
    mutationFn: widgetsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboard', id]);
    },
    onError: (error) => {
      console.error('Error deleting widget:', error);
      alert('Failed to delete widget. Please try again.');
    },
  });

  const handleAddWidget = (widgetData) => {
    createWidgetMutation.mutate(widgetData);
  };

  const handleDeleteWidget = (widgetId) => {
    if (window.confirm('Are you sure you want to delete this widget?')) {
      deleteWidgetMutation.mutate(widgetId);
    }
  };

  const handleEditWidget = (widget) => {
    // TODO: Implement edit functionality
    console.log('Edit widget:', widget);
    alert('Edit functionality coming soon!');
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
          Error loading dashboard: {error.message}
        </Alert>
      </Container>
    );
  }

  if (!dashboard) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Dashboard not found
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => navigate('/dashboards')}
            sx={{ mr: 2 }}
            aria-label="Back to dashboards"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            {dashboard.name}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            disabled={createWidgetMutation.isLoading}
          >
            Add Widget
          </Button>
        </Box>

        {/* Description */}
        {dashboard.description && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {dashboard.description}
          </Typography>
        )}

        {/* Widgets Grid */}
        <Grid container spacing={3}>
          {dashboard.widgets && dashboard.widgets.length > 0 ? (
            dashboard.widgets.map((widget) => (
              <Grid item xs={12} md={6} lg={4} key={widget.id}>
                <WidgetWithTimeRange
                  widget={widget}
                  onDelete={handleDeleteWidget}
                  onEdit={handleEditWidget}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  border: '2px dashed',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No widgets yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add your first widget to start visualizing city metrics
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                >
                  Add First Widget
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Loading overlay for mutations */}
        {(createWidgetMutation.isLoading || deleteWidgetMutation.isLoading) && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}
      </Container>

      {/* Add Widget Dialog */}
      <AddWidgetDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddWidget}
        dashboardId={parseInt(id)}
      />
    </>
  );
}

export default DashboardDetail;
