import { ResultsData, Question } from './types';

// Base API URL - replace with your actual backend URL when deployed
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Enhanced error handler to parse JSON error responses when available
const handleApiError = async (response: Response) => {
  try {
    // Try to parse error message from API response
    const errorData = await response.json();
    return { 
      success: false, 
      error: errorData.message || `API Error: ${response.status} ${response.statusText}`,
      status: response.status,
      data: errorData
    } as const;
  } catch (e) {
    // If we can't parse JSON, return a generic error
    return { 
      success: false, 
      error: `API Error: ${response.status} ${response.statusText}`,
      status: response.status 
    } as const;
  }
};

// Network error handler
const handleNetworkError = (error: unknown) => {
  console.error('Network Error:', error);
  if (error instanceof Error) {
    return { success: false, error: error.message, networkError: true } as const;
  }
  return { success: false, error: 'Unknown network error occurred', networkError: true } as const;
};

// Token management
const tokenService = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token: string) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  
  // Helper to check if token is expired (if JWT)
  isTokenExpired: () => {
    const token = localStorage.getItem('authToken');
    if (!token) return true;
    
    try {
      // For JWT tokens
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      console.warn('Could not parse token for expiration check', e);
      return false; // Assume token is valid if we can't parse it
    }
  }
};

// HTTP methods wrapper with authorization header
const api = {
  get: async (endpoint: string) => {
    try {
      const token = tokenService.getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      
      if (!response.ok) {
        return await handleApiError(response);
      }
      
      return { success: true, data: await response.json(), status: response.status } as const;
    } catch (error) {
      return handleNetworkError(error);
    }
  },
  
  post: async (endpoint: string, data: any) => {
    try {
      const token = tokenService.getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        return await handleApiError(response);
      }
      
      return { success: true, data: await response.json(), status: response.status } as const;
    } catch (error) {
      return handleNetworkError(error);
    }
  },
  
  put: async (endpoint: string, data: any) => {
    try {
      const token = tokenService.getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        return await handleApiError(response);
      }
      
      return { success: true, data: await response.json(), status: response.status } as const;
    } catch (error) {
      return handleNetworkError(error);
    }
  },
  
  delete: async (endpoint: string) => {
    try {
      const token = tokenService.getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      
      if (!response.ok) {
        return await handleApiError(response);
      }
      
      // Some DELETE endpoints might not return content
      const data = response.status !== 204 ? await response.json() : null;
      return { success: true, data, status: response.status } as const;
    } catch (error) {
      return handleNetworkError(error);
    }
  },
};

// User session management
const userSession = {
  setUserData: (userData: {
    token: string;
    userId: string;
    name: string;
    email: string;
    isAdmin: boolean;
  }) => {
    tokenService.setToken(userData.token);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('isAdmin', userData.isAdmin ? 'true' : 'false');
    window.dispatchEvent(new Event('storage'));
  },
  
  clearUserData: () => {
    tokenService.removeToken();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    window.dispatchEvent(new Event('storage'));
  },
  
  getUserData: () => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userName: localStorage.getItem('userName'),
    userEmail: localStorage.getItem('userEmail'),
    userId: localStorage.getItem('userId'),
    isAdmin: localStorage.getItem('isAdmin') === 'true',
  })
};

// Auth API endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.success && response.data && response.data.token) {
      userSession.setUserData({
        token: response.data.token,
        userId: response.data.userId,
        name: response.data.name, 
        email,
        isAdmin: response.data.isAdmin || false,
      });
    }
    return response;
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    
    if (response.success && response.data && response.data.token) {
      userSession.setUserData({
        token: response.data.token,
        userId: response.data.userId,
        name,
        email,
        isAdmin: response.data.isAdmin || false,
      });
    }
    return response;
  },
  
  logout: () => {
    userSession.clearUserData();
    return { success: true } as const;
  },
  
  checkAuth: async () => {
    // Handle token expiration
    if (tokenService.isTokenExpired()) {
      console.log('Token expired, user needs to log in again');
      userSession.clearUserData();
      return { success: false, error: 'Authentication expired' } as const;
    }
    
    // Check if the token is still valid with the server
    return await api.get('/auth/verify');
  },
  
  refreshToken: async () => {
    return await api.post('/auth/refresh-token', {});
  }
};

// Papers API endpoints
export const papersApi = {  
  getPaperQuestions: async (paperId: string) => {
    return await api.get(`/papers/${paperId}/questions`);
  },
  
  // Add function to submit test results
  submitTestResults: async (paperId: string, answers: any[], timeSpent: number) => {
    return await api.post('/submissions', {
      paperId,
      answers,
      timeSpent
    });
  },
  
  getAllPapers: async () => {
    return await api.get('/papers');
  },
  
  getPaperById: async (paperId: string) => {
    return await api.get(`/papers/${paperId}`);
  }
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
  
  // Get detailed analytics
  getResultsAnalytics: async () => {
    return await api.get('/results/analytics');
  }
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
  
  cancelSubscription: async () => {
    return await api.post('/subscriptions/cancel', {});
  }
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
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    return await api.put('/user/change-password', { currentPassword, newPassword });
  }
};