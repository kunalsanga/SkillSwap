import React, { createContext, useState, useEffect } from 'react';
import { login, register } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to load user from local storage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
    
    // Listen for 401s from the api interceptor
    const handleAuthError = () => {
      setUser(null);
    };
    window.addEventListener('auth-error', handleAuthError);
    
    setLoading(false);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  const loginUser = async (credentials) => {
    try {
      const res = await login(credentials);
      if (res.success && res.data?.token) {
        localStorage.setItem('token', res.data.token);
        
        // Ensure user object comes from the backend or fallback to mock
        const userData = res.data.user || {
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: credentials.email.includes('admin') ? 'ADMIN' : 'USER'
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return res;
      }
      throw new Error(res.message || 'Login failed');
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      const res = await register(userData);
      if (res.success) {
        return res;
      }
      throw new Error(res.message || 'Registration failed');
    } catch (error) {
      if (error.response && error.response.data) {
        // If there are validation errors, combine them
        if (error.response.data.errors) {
          const validationMsg = error.response.data.errors.map(err => err.message).join(', ');
          throw new Error(validationMsg || error.response.data.message || 'Registration failed');
        }
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw error;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
