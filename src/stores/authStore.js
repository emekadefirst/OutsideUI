import { create } from 'zustand';
import axios from 'axios';
import { setTokens, clearTokens, getToken } from '../services/api.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: !!getToken(),
  loading: false,

  login: async (data) => {
    set({ loading: true });
    try {
      const response = await axios.post('/users/login', data);
      setTokens(response.data.access_token, response.data.refresh_token);
      set({ isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post('/users/logout');
    } catch (error) {
      console.warn('Logout API failed');
    } finally {
      clearTokens();
      set({ user: null, isAuthenticated: false });
    }
  },

  getUser: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/users/whoami');
      set({ user: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  checkAuth: () => {
    set({ isAuthenticated: !!getToken() });
  }
}));