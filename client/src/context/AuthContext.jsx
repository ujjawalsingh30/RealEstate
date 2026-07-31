import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('authToken') || null);
  const [role, setRole] = useState(() => localStorage.getItem('userRole') || 'buyer');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Validate session on initialization if token exists
  useEffect(() => {
    const verifySession = async () => {
      if (!token) return;
      try {
        const currentRole = localStorage.getItem('userRole') || 'buyer';
        // Check session validity against server profile/verify endpoint
        if (currentRole === 'admin') {
          const res = await api.get('/admin/verify');
          if (res.data?.admin) setUser(res.data.admin);
        } else if (currentRole === 'seller' || currentRole === 'buyer') {
          const res = await api.get(`/${currentRole}/profile`);
          const updatedProfile = res.data?.seller || res.data?.buyer;
          if (updatedProfile) {
            setUser(updatedProfile);
            localStorage.setItem('userData', JSON.stringify(updatedProfile));
          }
        }
      } catch (error) {
        console.warn('Session verification failed, clearing tokens:', error.response?.data?.message);
        // Do not force logout on temporary networking glitches unless unauthorized
        if (error.response?.status === 401) {
          logout();
        }
      }
    };

    verifySession();
  }, [token]);

  /**
   * Universal Login Handler for Buyer, Seller, and Admin
   */
  const loginUser = async (email, password, selectedRole) => {
    setLoading(true);
    setAuthError(null);
    try {
      const endpoint = `/${selectedRole.toLowerCase()}/login`;
      const response = await api.post(endpoint, { email, password });
      
      const resData = response.data;
      if (resData.success) {
        const newToken = resData.token;
        const loggedUser = resData.user || { email, role: selectedRole };
        const activeRole = resData.role || selectedRole;

        // Save session in state and localStorage
        setToken(newToken);
        setUser(loggedUser);
        setRole(activeRole);
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('userData', JSON.stringify(loggedUser));
        localStorage.setItem('userRole', activeRole);

        setLoading(false);
        return { success: true, user: loggedUser, role: activeRole, message: resData.message };
      } else {
        setLoading(false);
        return { success: false, message: resData.message || 'Login failed' };
      }
    } catch (error) {
      setLoading(false);
      const errorMsg = error.response?.data?.message || 'Server error during login. Make surebackend is running!';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  /**
   * Registration Handler for Buyer and Seller
   */
  const registerUser = async (formData, selectedRole) => {
    setLoading(true);
    setAuthError(null);
    try {
      const endpoint = `/${selectedRole.toLowerCase()}/register`;
      const response = await api.post(endpoint, formData);
      
      const resData = response.data;
      if (resData.success) {
        if (resData.token) {
          setToken(resData.token);
          localStorage.setItem('authToken', resData.token);
        }
        if (resData.user) {
          setUser(resData.user);
          localStorage.setItem('userData', JSON.stringify(resData.user));
        }
        setRole(selectedRole);
        localStorage.setItem('userRole', selectedRole);

        setLoading(false);
        return { success: true, user: resData.user, message: resData.message };
      }
      setLoading(false);
      return { success: false, message: resData.message };
    } catch (error) {
      setLoading(false);
      const errorMsg = error.response?.data?.message || 'Server error during registration.';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  /**
   * Update current user profile via API and sync state
   */
  const updateProfile = async (updatedFields) => {
    setLoading(true);
    try {
      const response = await api.put(`/${role}/profile`, updatedFields);
      if (response.data.success) {
        const updatedUser = response.data.seller || response.data.buyer || response.data.user;
        if (updatedUser) {
          setUser(updatedUser);
          localStorage.setItem('userData', JSON.stringify(updatedUser));
        }
        setLoading(false);
        return { success: true, message: 'Profile updated successfully!', user: updatedUser };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  };

  /**
   * Logout User and clear stored authentication tokens
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthError(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    // Keep userRole in localStorage or default to buyer so layouts don't crash
    localStorage.setItem('userRole', 'buyer');
    setRole('buyer');
  };

  const value = {
    user,
    role,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    authError,
    setRole,
    loginUser,
    registerUser,
    updateProfile,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
