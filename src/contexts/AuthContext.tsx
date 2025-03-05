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
  loginAsAdmin: () => Promise<{ success: boolean; error?: string; user?: User | null }>;
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
  loginAsAdmin: async () => ({ success: false }),
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
  
  // Determine if the user is an admin
  // const isAdmin = user?.isAdmin || user?.roles?.includes('admin') || false;
  
  // Check if the user is authenticated based on token presence
  // const isAuthenticated = !!localStorage.getItem('token') || !!user;

  // Load user data from token
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
          
          // Store admin token separately if user is admin
          if (userIsAdmin) {
            localStorage.setItem('adminToken', token);
          }
        })
        .catch(err => {
          console.error('Failed to fetch user data:', err);
          
          // In development mode, set a mock user
          if (isDevelopment) {
            const mockUser = {
              id: 1,
              name: 'Development User',
              email: 'dev@example.com',
              isAdmin: true,
              roles: ['admin']
            };
            setUser(mockUser);
            
            // Set a mock admin token for development
            localStorage.setItem('token', 'dev-token-for-testing');
            localStorage.setItem('adminToken', 'dev-admin-token-for-testing');
            console.log('Development mode: Set mock admin user and tokens');
          } else {
            setError('Failed to fetch user data. Please login again.');
            localStorage.removeItem('token');
            localStorage.removeItem('adminToken');
            setUser(null);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (isDevelopment) {
      setLoading(false);
      
      // In development mode, we can optionally auto-login an admin user
      const autoLoginAdmin = localStorage.getItem('autoLoginAdmin') === 'true';
      if (autoLoginAdmin) {
        console.log('Development mode: Auto-logging in as admin');
        loginAsAdmin();
      }
    } else {
      setLoading(false);
    }
  }, [isDevelopment]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      
      const { email, password } = credentials;
      const response = await api.post('/login', { email, password });
      const { token, user: userData } = response.data.data || response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Check if user has admin role and store admin token if they do
      const userIsAdmin = userData.roles?.includes('admin') || false;
      if (userIsAdmin) {
        localStorage.setItem('adminToken', token);
      }
      
      // Set user state with admin flag
      const updatedUser = {
        ...userData,
        isAdmin: userIsAdmin
      };
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      
      // In development mode, allow a bypass login
      if (isDevelopment) {
        console.log('Development mode: Using mock login');
        
        // Set a mock token
        localStorage.setItem('token', 'dev-token-for-testing');
        localStorage.setItem('adminToken', 'dev-admin-token-for-testing');
        
        // Set a mock user
        setUser({
          id: 1,
          name: 'Development User',
          email: credentials.email || 'dev@example.com',
          isAdmin: true
        });
        
        return { success: true, user: {
          id: 1,
          name: 'Development User',
          email: credentials.email || 'dev@example.com',
          isAdmin: true
        } };
      }
      
      return { success: false, error: errorMessage };
    }
  };
  
  // Login as admin without backend
  const loginAsAdmin = async () => {
    try {
      // Generate a more realistic admin token
      const timestamp = Date.now();
      const mockToken = `admin-token-${timestamp}-${Math.random().toString(36).substring(2, 10)}`;
      const mockAdminToken = mockToken; // Use the same token for both admin and general
      
      // Store tokens securely
      localStorage.setItem('token', mockToken);
      localStorage.setItem('adminToken', mockAdminToken);
      localStorage.setItem('autoLoginAdmin', 'true');
      
      // Set mock admin user
      const mockAdminUser = {
        id: 1,
        name: 'Development Admin',
        email: 'admin@example.com',
        isAdmin: true,
        roles: ['admin']
      };
      setUser(mockAdminUser);
      
      // Explicitly set auth state
      setIsAuthenticated(true);
      setIsAdmin(true);
      
      console.log('Logged in as admin with tokens:', { 
        token: mockToken.substring(0, 15) + '...',
        adminToken: mockAdminToken.substring(0, 15) + '...'
      });

      // Initialize session with fresh timestamps
      localStorage.setItem('mmartLoginTimestamp', Date.now().toString());
      localStorage.setItem('mmartLastActivityTimestamp', Date.now().toString());
      
      return { success: true, user: mockAdminUser };
    } catch (err: any) {
      console.error('Admin login error:', err);
      return { success: false, error: 'Failed to login as admin' };
    }
  };

  // Clear user data and tokens on logout
  const logout = () => {
    // Clear auth data from storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      setUser(null);
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
      
      // For development, allow registration bypass
      if (isDevelopment) {
        console.log('Development mode: Using mock registration');
        
        // Set mock token
        localStorage.setItem('token', 'dev-token-for-testing');
        
        // Set mock user
        setUser({
          id: 1,
          name: name || 'Development User',
          email: email || 'dev@example.com',
          isAdmin: false
        });
        
        return { success: true };
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // For development - implement mock social login functions
  const loginWithGoogle = async () => {
    try {
      setError(null);
      
      // In production, this would redirect to Google OAuth
      // But for now, especially in development, we'll mock it
      
      if (isDevelopment) {
        // Set mock tokens for development
        const mockToken = `google-dev-token-${Date.now()}`;
        localStorage.setItem('token', mockToken);
        
        // Create a mock user
        const mockUser = {
          id: 999,
          name: 'Google User',
          email: 'google-user@example.com',
          isAdmin: false
        };
        
        // Update state
        setUser(mockUser);
        setIsAuthenticated(true);
        setError(null);
        
        console.log('Development mode: Logged in with Google');
        return mockUser;
      }
      
      // For production environments
      // This would call the backend to start Google OAuth flow
      // const response = await api.get('/auth/google');
      // window.location.href = response.data.redirect_url;
      
      return null;
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Failed to login with Google');
      return null;
    }
  };
  
  const loginWithApple = async () => {
    try {
      setError(null);
      
      // Similar to Google login, this is a mock for development
      
      if (isDevelopment) {
        // Set mock tokens for development
        const mockToken = `apple-dev-token-${Date.now()}`;
        localStorage.setItem('token', mockToken);
        
        // Create a mock user
        const mockUser = {
          id: 888,
          name: 'Apple User',
          email: 'apple-user@example.com',
          isAdmin: false
        };
        
        // Update state
        setUser(mockUser);
        setIsAuthenticated(true);
        setError(null);
        
        console.log('Development mode: Logged in with Apple');
        return mockUser;
      }
      
      // For production environments
      // This would call the backend to start Apple OAuth flow
      // const response = await api.get('/auth/apple');
      // window.location.href = response.data.redirect_url;
      
      return null;
    } catch (err: any) {
      console.error('Apple login error:', err);
      setError('Failed to login with Apple');
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
    loginAsAdmin,
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
