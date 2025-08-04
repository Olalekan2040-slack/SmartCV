// Enhanced error handling utility for SmartCV application
import toast from 'react-hot-toast';

export class SmartCVError extends Error {
  constructor(message, type = 'GENERAL_ERROR', context = {}) {
    super(message);
    this.name = 'SmartCVError';
    this.type = type;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export const ERROR_TYPES = {
  CIRCULAR_DEPENDENCY: 'CIRCULAR_DEPENDENCY',
  API_ERROR: 'API_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  GENERAL_ERROR: 'GENERAL_ERROR'
};

export const handleError = (error, context = {}) => {
  console.error('SmartCV Error:', {
    error,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });

  // Handle different error types
  if (error.name === 'ReferenceError' && error.message.includes('Cannot access')) {
    const circularDepError = new SmartCVError(
      'Application initialization error. Please refresh the page.',
      ERROR_TYPES.CIRCULAR_DEPENDENCY,
      { originalError: error.message, context }
    );
    
    toast.error('Loading error detected. Refreshing the page...', {
      duration: 3000,
    });
    
    // Auto-refresh after a short delay to allow user to see the message
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
    return circularDepError;
  }

  // Handle API errors
  if (error.response) {
    const apiError = new SmartCVError(
      error.response.data?.message || 'An API error occurred',
      ERROR_TYPES.API_ERROR,
      { 
        status: error.response.status,
        endpoint: error.config?.url,
        context 
      }
    );
    
    toast.error(apiError.message);
    return apiError;
  }

  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || !error.response) {
    const networkError = new SmartCVError(
      'Network connection error. Please check your internet connection.',
      ERROR_TYPES.NETWORK_ERROR,
      { context }
    );
    
    toast.error(networkError.message);
    return networkError;
  }

  // Handle validation errors
  if (error.type === ERROR_TYPES.VALIDATION_ERROR) {
    toast.error(error.message);
    return error;
  }

  // Default error handling
  const generalError = new SmartCVError(
    error.message || 'An unexpected error occurred',
    ERROR_TYPES.GENERAL_ERROR,
    { context }
  );
  
  toast.error(generalError.message);
  return generalError;
};

export const withErrorHandling = (fn, context = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return handleError(error, { ...context, function: fn.name });
    }
  };
};

// React Hook for error handling
export const useErrorHandler = () => {
  return (error, context = {}) => {
    return handleError(error, context);
  };
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const startTime = performance.now();
    try {
      const result = await fn(...args);
      const endTime = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance: ${name} took ${endTime - startTime} milliseconds`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      console.error(`Performance: ${name} failed after ${endTime - startTime} milliseconds`, error);
      throw error;
    }
  };
};

const errorHandlerExports = {
  SmartCVError,
  ERROR_TYPES,
  handleError,
  withErrorHandling,
  useErrorHandler,
  measurePerformance
};

export default errorHandlerExports;
