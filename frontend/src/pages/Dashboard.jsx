// frontend/src/pages/Dashboards.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardsService } from '../services/dashboards';
import DashboardCard from '../components/Dashboards/DashboardCard';

function Dashboards() {
  const [open, setOpen] = useState(false);
  const [newDashboard, setNewDashboard] = useState({ name: '', description: '' });
  const queryClient = useQueryClient();

  const { data: dashboards = [], isLoading, error } = useQuery({
    queryKey: ['dashboards'],
    queryFn: dashboardsService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: dashboardsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboards']);
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: dashboardsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboards']);
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewDashboard({ name: '', description: '' });
  };

  const handleCreate = () => {
    if (newDashboard.name.trim()) {
      createMutation.mutate(newDashboard);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this dashboard?')) {
      deleteMutation.mutate(id);
    }
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
          Error loading dashboards: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboards
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Create Dashboard
        </Button>
      </Box>

      <Grid container spacing={3}>
        {dashboards.map((dashboard) => (
          <Grid item xs={12} sm={6} md={4} key={dashboard.id}>
            <DashboardCard
              dashboard={dashboard}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

      {dashboards.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No dashboards yet. Create your first dashboard!
          </Typography>
        </Box>
      )}

      {/* Create Dashboard Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Dashboard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Dashboard Name"
            fullWidth
            variant="outlined"
            value={newDashboard.name}
            onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newDashboard.description}
            onChange={(e) => setNewDashboard({ ...newDashboard, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!newDashboard.name.trim() || createMutation.isLoading}
          >
            {createMutation.isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboards;
