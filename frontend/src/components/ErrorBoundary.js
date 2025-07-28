import React from 'react';
import { handleError } from '../utils/errorHandler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Use our enhanced error handler
    handleError(error, { 
      context: 'ErrorBoundary',
      componentStack: errorInfo.componentStack 
    });
    
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">We encountered an error while loading the application.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Reload Page
            </button>
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-gray-400">Error Details</summary>
              <div className="text-red-400 text-sm mt-2 p-4 bg-gray-800 rounded overflow-auto">
                <div className="mb-4">
                  <strong>Error:</strong>
                  <pre className="mt-1">{this.state.error?.toString()}</pre>
                </div>
                
                {this.state.errorInfo && (
                  <div className="mb-4">
                    <strong>Component Stack:</strong>
                    <pre className="mt-1 text-xs">{this.state.errorInfo.componentStack}</pre>
                  </div>
                )}
                
                <div className="mb-2 text-gray-300">
                  <strong>Environment Info:</strong>
                  <div className="text-xs mt-1">
                    <div>API URL: {process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}</div>
                    <div>Environment: {process.env.NODE_ENV}</div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
