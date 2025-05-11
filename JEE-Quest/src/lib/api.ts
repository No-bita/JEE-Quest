import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle all errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Clear auth data for any error
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');

    // Show toast notification
    toast({
      title: "Something went wrong",
      description: "Please sign in again to continue",
      variant: "destructive"
    });

    // Redirect to sign in
    window.location.href = '/signin';

    return Promise.reject(error);
  }
);

export default api; 