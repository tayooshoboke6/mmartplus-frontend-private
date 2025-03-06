import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  isAdmin?: boolean;
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
    const token = localStorage.getItem('token');

    if (token) {
      setLoading(true);

      api.get('/user')
        .then(response => {
          const userData = response.data.data || response.data;

          // Check if user has admin role
          const userIsAdmin = userData.roles?.includes('admin') || false;

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
          localStorage.removeItem('token');
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
    localStorage.setItem('token', mockToken);

    const mockUser = {
      id: 999,
      name: 'Admin User',
      email: 'admin@example.com',
      isAdmin: true,
      roles: ['admin']
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
      const response = await api.post('/login', { email, password });
      const { token, user: userData } = response.data.data || response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Check if user has admin role
      const userIsAdmin = userData.roles?.includes('admin') || false;

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

      // Remove development mode bypass login
      return { success: false, error: errorMessage };
    }
  };

  // Clear user data and tokens on logout
  const logout = async () => {
    // Clear auth data from storage
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
    setIsAuthenticated(false);

    // Optional: Call logout endpoint
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    try {
      setError(null);
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation
      });

      const { token, user: userData } = response.data.data || response.data;

      // Store token
      localStorage.setItem('token', token);

      // Set user with admin flag (likely false for new registrations)
      setUser({
        ...userData,
        isAdmin: userData.roles?.includes('admin') || false
      });

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);

      // Remove development mode bypass for registration
      return { success: false, error: errorMessage };
    }
  };

  // For development - implement mock social login functions
  const loginWithGoogle = async () => {
    try {
      setError(null);

      // In production, this would redirect to Google OAuth
      setError("Google login is not implemented in this testing environment");
      return null;
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed. Please try again.');
      return null;
    }
  };

  const loginWithApple = async () => {
    try {
      setError(null);

      // In production, this would redirect to Apple OAuth
      setError("Apple login is not implemented in this testing environment");
      return null;
    } catch (err) {
      console.error('Apple login error:', err);
      setError('Apple login failed. Please try again.');
      return null;
    }
  };

  // Clear the error state
  const clearError = () => {
    setError(null);
  };

  const value = {
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
    loginWithApple
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
