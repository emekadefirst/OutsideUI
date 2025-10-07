import { create } from 'zustand';
import axios from 'axios';

export const useUsersStore = create((set, get) => ({
  users: [],
  stats: null,
  loading: false,

  getUserList: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/users/');
      set({ users: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getUserStats: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/users/stats');
      set({ stats: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  }
}));