import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://thermofusion-f5jf.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  if (auth) {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const api = {
  // Health check endpoint for warming up the backend
  healthCheck: () => apiClient.get('/health'),

  // AI Model Inference
  inferTif: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/infer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Jobs (legacy - keeping for compatibility)
  createJob: (formData: FormData) => apiClient.post('/jobs', formData),
  getJobs: (uid?: string) => apiClient.get(`/jobs${uid ? `?uid=${uid}` : ''}`),
  getJob: (id: string) => apiClient.get(`/jobs/${id}`),

  // Files
  getFile: (id: string) => apiClient.get(`/files/${id}`, { responseType: 'blob' }),
};

export default apiClient;
