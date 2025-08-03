// frontend/src/services/profileService.js
import api from './authService';

export const profileService = {
  async getProfiles() {
    const response = await api.get('/profiles');
    return response.data.data;
  },

  async getProfile(id) {
    const response = await api.get(`/profiles/${id}`);
    return response.data.data;
  },

  async createProfile(profileData) {
    const response = await api.post('/profiles', profileData);
    return response.data.data;
  },

  async updateProfile(id, profileData) {
    const response = await api.put(`/profiles/${id}`, profileData);
    return response.data.data;
  },

  async deleteProfile(id) {
    const response = await api.delete(`/profiles/${id}`);
    return response.data.data;
  },

  async launchProfile(id) {
    const response = await api.post(`/profiles/${id}/launch`);
    return response.data.data;
  }
};

export default profileService;