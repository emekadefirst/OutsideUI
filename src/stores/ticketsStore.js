import { create } from 'zustand';
import axios from 'axios';

export const useTicketsStore = create((set, get) => ({
  tickets: [],
  loading: false,

  getTicketsByEvent: async (eventId) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/tickets/event/${eventId}`);
      set({ tickets: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createTickets: async (data) => {
    set({ loading: true });
    try {
      const response = await axios.post('/tickets/', data);
      const newTickets = response.data;
      set(state => ({ 
        tickets: [...state.tickets, ...newTickets], 
        loading: false 
      }));
      return newTickets;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  }
}));