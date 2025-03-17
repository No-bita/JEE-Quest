
import { ResultsData, Question } from './types';

// Base API URL - replace with your actual backend URL when deployed
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Simulates API latency for development
const SIMULATE_LATENCY = true;
const simulateLatency = () => 
  SIMULATE_LATENCY ? new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300)) : Promise.resolve();

// Error handler
const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  if (error instanceof Error) {
    return { success: false, error: error.message };
  }
  return { success: false, error: 'Unknown API error occurred' };
};

// HTTP methods wrapper with authorization header
const api = {
  get: async (endpoint: string) => {
    try {
      await simulateLatency();
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return { success: true, data: await response.json() };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  post: async (endpoint: string, data: any) => {
    try {
      await simulateLatency();
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return { success: true, data: await response.json() };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  put: async (endpoint: string, data: any) => {
    try {
      await simulateLatency();
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return { success: true, data: await response.json() };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  delete: async (endpoint: string) => {
    try {
      await simulateLatency();
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return { success: true, data: await response.json() };
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Auth API endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isAdmin', response.data.isAdmin ? 'true' : 'false');
      window.dispatchEvent(new Event('storage'));
    }
    return response;
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isAdmin', 'false');
      window.dispatchEvent(new Event('storage'));
    }
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    window.dispatchEvent(new Event('storage'));
    return { success: true };
  },
  
  checkAuth: async () => {
    // Check if the token is still valid
    return await api.get('/auth/verify');
  },
};

// Papers API endpoints
export const papersApi = {
  getAllPapers: async () => {
    return await api.get('/papers');
  },
  
  getPaperById: async (paperId: string) => {
    return await api.get(`/papers/${paperId}`);
  },
  
  getPaperQuestions: async (paperId: string) => {
    return await api.get(`/papers/${paperId}/questions`);
  },
};

// Test Results API endpoints
export const resultsApi = {
  saveTestResult: async (result: ResultsData) => {
    return await api.post('/results', result);
  },
  
  getUserResults: async () => {
    return await api.get('/results');
  },
  
  getResultById: async (resultId: string) => {
    return await api.get(`/results/${resultId}`);
  },
};

// Subscription & Payment API endpoints
export const subscriptionApi = {
  getPricingPlans: async () => {
    return await api.get('/subscriptions/plans');
  },
  
  getCurrentSubscription: async () => {
    return await api.get('/subscriptions/current');
  },
  
  initiatePayment: async (planId: string) => {
    return await api.post('/payments/create-checkout', { planId });
  },
  
  purchasePaper: async (paperId: string) => {
    return await api.post('/payments/purchase-paper', { paperId });
  },
  
  checkPurchaseStatus: async (sessionId: string) => {
    return await api.get(`/payments/status/${sessionId}`);
  },
};

// User API endpoints
export const userApi = {
  getUserProfile: async () => {
    return await api.get('/user/profile');
  },
  
  updateUserProfile: async (profileData: any) => {
    return await api.put('/user/profile', profileData);
  },
  
  getFreeTestsRemaining: async () => {
    return await api.get('/user/free-tests-remaining');
  },
  
  getPurchasedPapers: async () => {
    return await api.get('/user/purchased-papers');
  },
};

// Fallback to localStorage for development without a backend
export const useMockApi = () => {
  const mockApiEnabled = !import.meta.env.VITE_API_BASE_URL;
  
  if (mockApiEnabled) {
    console.warn('Using mock API - no API_BASE_URL provided');
  }
  
  return mockApiEnabled;
};

// Mock implementation to be used during development without a backend
export const mockStorageApi = {
  // Mock auth (local storage based)
  login: async (email: string, password: string) => {
    await simulateLatency();
    const isAdmin = email === 'admin@example.com' && password === 'admin123';
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    
    window.dispatchEvent(new Event('storage'));
    return { success: true, data: { email, isAdmin } };
  },
  
  register: async (name: string, email: string) => {
    await simulateLatency();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isAdmin', 'false');
    
    window.dispatchEvent(new Event('storage'));
    return { success: true, data: { name, email } };
  },
  
  // Mock results
  saveTestResult: async (result: ResultsData) => {
    await simulateLatency();
    const existingResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    existingResults.push(result);
    localStorage.setItem('testResults', JSON.stringify(existingResults));
    return { success: true, data: result };
  },
  
  // Helper to check user subscription status from localStorage
  getUserSubscriptionStatus: () => {
    return {
      hasSubscription: localStorage.getItem('hasSubscription') === 'true',
      purchasedPapers: JSON.parse(localStorage.getItem('purchasedPapers') || '[]'),
      freeTestsRemaining: localStorage.getItem('freeTestsRemaining') || '1'
    };
  }
};
