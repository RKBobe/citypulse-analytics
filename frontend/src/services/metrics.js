import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const metricsService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/metrics`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/metrics/${id}`);
    return response.data;
  },
  create: async (payload) => {
    const response = await axios.post(`${API_URL}/metrics`, payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await axios.put(`${API_URL}/metrics/${id}`, payload);
    return response.data;
  },
  delete: async (id) => {
    await axios.delete(`${API_URL}/metrics/${id}`);
    return { success: true };
  },
};
