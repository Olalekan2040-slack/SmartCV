import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete authAPI.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const fetchUser = async () => {
    try {
      const response = await authAPI.get('/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Don't logout immediately on API failure
      // Just clear the token if it's actually invalid
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      // Set the token in axios headers
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]); // Remove fetchUser from dependencies to avoid circular reference

  const login = async (email, password) => {
    try {
      const response = await authAPI.post('/login', { email, password });
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      await fetchUser();
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.detail || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.post('/register', userData);
      toast.success('Registration successful! Please login.');
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data?.detail || 'Registration failed');
      return false;
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await authAPI.put('/me', userData);
      setUser(response.data);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error.response?.data?.detail || 'Update failed');
      return false;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isPremium: user?.is_premium || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
