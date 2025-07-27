import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instances for different endpoints
export const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cvAPI = axios.create({
  baseURL: `${API_BASE_URL}/cv`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const paymentsAPI = axios.create({
  baseURL: `${API_BASE_URL}/payments`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const addAuthInterceptor = (apiInstance) => {
  apiInstance.interceptors.request.use(
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

  // Response interceptor to handle common errors
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Add interceptors to all API instances
addAuthInterceptor(authAPI);
addAuthInterceptor(cvAPI);
addAuthInterceptor(paymentsAPI);

// CV API functions
export const cvService = {
  // Get all CVs for current user
  getCVs: () => cvAPI.get('/'),
  
  // Get specific CV by ID
  getCV: (id) => cvAPI.get(`/${id}`),
  
  // Create new CV
  createCV: (cvData) => cvAPI.post('/', cvData),
  
  // Update CV
  updateCV: (id, cvData) => cvAPI.put(`/${id}`, cvData),
  
  // Delete CV
  deleteCV: (id) => cvAPI.delete(`/${id}`),
  
  // Duplicate CV
  duplicateCV: (id) => cvAPI.post(`/${id}/duplicate`),
  
  // Validate CV data
  validateCV: (cvData) => cvAPI.post('/validate', cvData),
  
  // Generate PDF
  generatePDF: (id) => cvAPI.post(`/${id}/generate-pdf`),
  
  // Get PDF status
  getPDFStatus: (cvId, taskId) => cvAPI.get(`/${cvId}/pdf-status/${taskId}`),
};

// Payment API functions
export const paymentService = {
  // Create checkout session
  createCheckoutSession: (plan) => paymentsAPI.post('/create-checkout-session', { plan }),
  
  // Get subscription info
  getSubscription: () => paymentsAPI.get('/subscription'),
  
  // Cancel subscription
  cancelSubscription: () => paymentsAPI.post('/cancel-subscription'),
};

// Auth API functions
export const authService = {
  // Login
  login: (credentials) => authAPI.post('/login', credentials),
  
  // Register
  register: (userData) => authAPI.post('/register', userData),
  
  // Get current user
  getUser: () => authAPI.get('/me'),
  
  // Update user
  updateUser: (userData) => authAPI.put('/me', userData),
};

export default {
  cvService,
  paymentService,
  authService,
};
