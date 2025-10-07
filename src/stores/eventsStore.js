import { create } from 'zustand';
import axios from 'axios';

export const useEventsStore = create((set, get) => ({
  events: [],
  currentEvent: null,
  loading: false,

  getAllEvents: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/events/');
      set({ events: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getEventById: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/events/${id}`);
      set({ currentEvent: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createEvent: async (data) => {
    set({ loading: true });
    try {
      const response = await axios.post('/events/', data);
      const newEvent = response.data;
      set(state => ({ 
        events: [...state.events, newEvent], 
        loading: false 
      }));
      return newEvent;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateEvent: async (id, data) => {
    set({ loading: true });
    try {
      const response = await axios.put(`/events/${id}`, data);
      const updatedEvent = response.data;
      set(state => ({
        events: state.events.map(event => 
          event.id === id ? updatedEvent : event
        ),
        currentEvent: state.currentEvent?.id === id ? updatedEvent : state.currentEvent,
        loading: false
      }));
      return updatedEvent;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/events/${id}`);
      set(state => ({
        events: state.events.filter(event => event.id !== id),
        currentEvent: state.currentEvent?.id === id ? null : state.currentEvent,
        loading: false
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  }
}));