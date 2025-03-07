import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import authService from '../services/authService';
import emailVerificationService from '../services/emailVerificationService';

interface User {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  isAdmin?: boolean;
  email_verified_at?: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  loginWithGoogle: () => Promise<User | null>;
  loginWithApple: () => Promise<User | null>;
  updateUser: (user: User) => void;
  sendVerificationCode: () => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (code: string) => Promise<{ success: boolean; error?: string }>;
  isEmailVerified: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  loading: true,
  error: null,
  login: async () => ({ success: false }),
  logout: async () => {},
  register: async () => ({ success: false }),
  clearError: () => {},
  loginWithGoogle: async () => null,
  loginWithApple: async () => null,
  updateUser: () => {},
  sendVerificationCode: async () => ({ success: false }),
  verifyEmail: async () => ({ success: false }),
  isEmailVerified: () => false
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check development mode
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    // Use consistent token names - check all possible token variations
    const token = localStorage.getItem('mmartToken') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('adminToken');

    if (token) {
      setLoading(true);

      // Store the token consistently as mmartToken
      if (!localStorage.getItem('mmartToken')) {
        localStorage.setItem('mmartToken', token);
      }

      api.get('/user')
        .then(response => {
          const userData = response.data.data || response.data;

          // Check if user has admin role using the proper role object structure
          const userIsAdmin = userData.roles?.some(role => 
            role.name === 'admin' || role.name === 'super-admin'
          ) || false;

          setUser({
            ...userData,
            isAdmin: userIsAdmin
          });

          setIsAdmin(userIsAdmin);
          setIsAuthenticated(true);
        })
        .catch(err => {
          console.error('Failed to fetch user data:', err);
          
          // Remove auto-login in development mode
          setError('Failed to fetch user data. Please login again.');
          localStorage.removeItem('mmartToken');
          localStorage.removeItem('token');
          localStorage.removeItem('adminToken');
          setUser(null);
          setIsAdmin(false);
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Always require manual login regardless of environment
      setLoading(false);
      setIsAuthenticated(false);
    }
  }, [isDevelopment]);

  const loginAsDevelopmentAdmin = async () => {
    if (!import.meta.env.DEV) return { success: false };

    const mockToken = `dev-token-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('mmartToken', mockToken);

    const mockUser = {
      id: 999,
      name: 'Admin User',
      email: 'admin@example.com',
      isAdmin: true,
      roles: [{ name: 'admin' }]
    };

    setUser(mockUser);
    setIsAdmin(true);
    setIsAuthenticated(true);

    return { success: true, user: mockUser };
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);

      const { email, password } = credentials;
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data.data || response.data;

      // Store token in localStorage with consistent naming
      localStorage.setItem('mmartToken', token);

      // Check if user has admin role using the proper role object structure
      const userIsAdmin = userData.roles?.some(role => 
        role.name === 'admin' || role.name === 'super-admin'
      ) || false;

      // Set user state with admin flag
      const updatedUser = {
        ...userData,
        isAdmin: userIsAdmin
      };

      setUser(updatedUser);
      setIsAdmin(userIsAdmin);
      setIsAuthenticated(true);

      return { success: true, user: updatedUser };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await api.post('/logout');
    } catch (err) {
      console.error('Logout API failed, but proceeding with local cleanup:', err);
    } finally {
      // Clear auth data regardless of API success
      localStorage.removeItem('mmartToken');
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      setUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      setError(null);
      
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation
      });

      // Only store token if registration includes auto-login
      if (response.data.token) {
        localStorage.setItem('mmartToken', response.data.token);
        
        if (response.data.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          setIsAdmin(false); // New users are not admins by default
        }
      }

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
      return null;
    } catch (err) {
      console.error('Google login failed:', err);
      return null;
    }
  };

  const loginWithApple = async () => {
    try {
      // Redirect to Apple OAuth endpoint
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/apple`;
      return null;
    } catch (err) {
      console.error('Apple login failed:', err);
      return null;
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Function to update user data (e.g., after profile updates)
  const updateUser = (updatedUser: User) => {
    setUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
  };

  // Email verification functions
  const sendVerificationCode = async () => {
    if (!user) {
      return { success: false, error: 'No user is logged in' };
    }

    try {
      const response = await emailVerificationService.sendVerificationCode();
      
      if (response.status === 'success') {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send verification code' };
    }
  };

  const verifyEmail = async (code: string) => {
    if (!user) {
      return { success: false, error: 'No user is logged in' };
    }

    try {
      const response = await emailVerificationService.verifyEmail(code);
      
      if (response.status === 'success') {
        // Update user with verified status
        setUser(prev => prev ? {
          ...prev,
          email_verified_at: new Date().toISOString()
        } : null);
        
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to verify email' };
    }
  };

  // Helper to check if email is verified
  const isEmailVerified = (): boolean => {
    return !!user?.email_verified_at;
  };

  const contextValue = {
    isAuthenticated,
    isAdmin,
    user,
    loading,
    error,
    login,
    logout,
    register,
    clearError,
    loginWithGoogle,
    loginWithApple,
    updateUser,
    sendVerificationCode,
    verifyEmail,
    isEmailVerified
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
