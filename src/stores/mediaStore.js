import { create } from 'zustand';
import axios from 'axios';

export const useMediaStore = create((set, get) => ({
  uploading: false,

  uploadFile: async (file) => {
    if (!file) return null;
    
    set({ uploading: true });
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('/files/', formData);
      set({ uploading: false });
      return response.data;
    } catch (error) {
      set({ uploading: false });
      throw error;
    }
  }
}));