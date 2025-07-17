// frontend/src/services/dashboards.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const dashboardsService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/dashboards`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/dashboards/${id}`);
    return response.data;
  },
  create: async (payload) => {
    const response = await axios.post(`${API_URL}/dashboards`, payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await axios.put(`${API_URL}/dashboards/${id}`, payload);
    return response.data;
  },
  delete: async (id) => {
    await axios.delete(`${API_URL}/dashboards/${id}`);
    return { success: true };
  },
  // Get widgets for a dashboard
  getWidgets: async (dashboardId) => {
    const response = await axios.get(`${API_URL}/dashboards/${dashboardId}/widgets`);
    return response.data;
  },
};
