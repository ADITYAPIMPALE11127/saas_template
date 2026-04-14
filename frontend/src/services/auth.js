import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post('/auth/refresh/', { refresh: refreshToken });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      return response.data.access;
    }
    throw new Error('Token refresh failed');
  },

  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    // Optional: Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expired = payload.exp * 1000 < Date.now();
      if (expired) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  },

  getUserFromToken() {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.user_id,
        exp: payload.exp
      };
    } catch (error) {
      return null;
    }
  }
};