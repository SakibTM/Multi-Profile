// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth service functions
export const authService = {
  async signup(name, email, password) {
    const response = await api.post('/auth/signup', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    }
    throw new Error('Registration failed');
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    }
    throw new Error('Login failed');
  },

  async logout() {
    localStorage.removeItem('token');
  },

  async resetPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    return response.data.user;
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      return null;
    }
  },

  onAuthStateChanged(callback) {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token');
    if (token) {
      this.getCurrentUser().then(user => {
        callback(user);
      }).catch(() => {
        callback(null);
      });
    } else {
      callback(null);
    }

    // Return a function to unsubscribe (not needed for localStorage)
    return () => {};
  }
};

export default api;