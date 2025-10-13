import { create } from 'zustand';
import axios from 'axios';

export const useOrdersStore = create((set, get) => ({
  orders: [],
  loading: false,

  createOrder: async (data) => {
    set({ loading: true });
    try {
      const response = await axios.post('/orders/', data);
      set(state => ({ 
        orders: [...state.orders, response.data], 
        loading: false 
      }));
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getOrders: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await axios.get('/orders/', { params });
      set({ orders: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  }
}));