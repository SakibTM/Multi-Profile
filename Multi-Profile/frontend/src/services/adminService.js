// frontend/src/services/adminService.js
import api from './authService';

export const adminService = {
  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data.data;
  },

  async updateUser(id, userData) {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data.data;
  }
};

export default adminService;