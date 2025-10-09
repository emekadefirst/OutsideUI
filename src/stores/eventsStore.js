import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useEventsStore = create(
  persist(
    (set, get) => ({
      events: [],
      currentEvent: null,
      loading: false,
      lastFetch: null,

      getAllEvents: async (forceRefresh = false) => {
        const state = get();
        const now = Date.now();
        
        // Return cached data if fresh and not forcing refresh
        if (!forceRefresh && state.events.length > 0 && state.lastFetch && (now - state.lastFetch) < CACHE_DURATION) {
          return state.events;
        }

        set({ loading: true });
        try {
          const response = await axios.get('/events/');
          set({ 
            events: response.data, 
            loading: false, 
            lastFetch: now 
          });
          return response.data;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      refreshEvents: () => {
        return get().getAllEvents(true);
      },

      isStale: () => {
        const state = get();
        if (!state.lastFetch) return true;
        return (Date.now() - state.lastFetch) >= CACHE_DURATION;
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
            loading: false,
            lastFetch: Date.now() // Update cache timestamp
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
    }),
    {
      name: 'events-store',
      partialize: (state) => ({ 
        events: state.events, 
        lastFetch: state.lastFetch 
      })
    }
  )
);