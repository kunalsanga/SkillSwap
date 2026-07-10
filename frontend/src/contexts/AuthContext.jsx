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
    const res = await login(credentials);
    if (res.success && res.data?.token) {
      localStorage.setItem('token', res.data.token);
      
      // For now, since auth backend is a placeholder, we mock basic user data from credentials
      // In production, the backend should return the user object or a real JWT we can decode
      const mockUser = {
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'ADMIN' : 'USER'
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const registerUser = async (userData) => {
    const res = await register(userData);
    if (res.success) {
      return res;
    }
    throw new Error(res.message || 'Registration failed');
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
