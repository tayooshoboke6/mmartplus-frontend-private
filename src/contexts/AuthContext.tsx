import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import authService from '../services/authService';
import emailVerificationService from '../services/emailVerificationService';
import axios from 'axios'; // Import axios

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

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsAuthenticated(false);
        setLoading(true);

        const token = localStorage.getItem('mmartToken') || 
                      sessionStorage.getItem('mmartToken') || 
                      localStorage.getItem('token') || 
                      localStorage.getItem('adminToken');

        if (!token) {
          console.log('No authentication token found');
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setToken(token);

        console.log('Authentication token found, fetching user data');

        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const response = await api.get('/user');

          if (response?.data?.data || response?.data) {
            const userData = response.data.data || response.data;

            const userIsAdmin = userData.roles?.some(role => 
              role.name === 'admin' || role.name === 'super-admin'
            );

            setUser(userData);
            setIsAdmin(userIsAdmin);
            setIsAuthenticated(true);
            console.log('User authenticated successfully, admin status:', userIsAdmin);
          } else {
            throw new Error('Invalid user data format from API');
          }
        } catch (error: any) {
          console.error('Error fetching user data:', error);
          
          // Don't clear token on network errors - this allows offline access
          // and prevents logout on temporary API unavailability
          if (axios.isAxiosError(error) && (!error.response || error.response.status >= 500)) {
            console.log('Network or server error, keeping authentication state');
          } else if (axios.isAxiosError(error) && error.response?.status === 401) {
            // Only clear on actual auth errors (401)
            console.log('Authentication token invalid, logging out');
            clearToken();
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('Error in auth verification:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

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

  const setToken = (token: string) => {
    localStorage.setItem('mmartToken', token);
    sessionStorage.setItem('mmartToken', token); 
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const clearToken = () => {
    localStorage.removeItem('mmartToken');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('mmartToken'); 
    delete api.defaults.headers.common['Authorization'];
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);

      const { email, password } = credentials;
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data.data || response.data;

      setToken(token);
      
      const userIsAdmin = userData.roles?.some(role => 
        role.name === 'admin' || role.name === 'super-admin'
      );

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
      await api.post('/logout');
    } catch (err) {
      console.error('Logout API failed, but proceeding with local cleanup:', err);
    } finally {
      clearToken();
      
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

      if (response.data.token) {
        setToken(response.data.token);
        
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
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
      return null;
    } catch (err) {
      console.error('Google login failed:', err);
      return null;
    }
  };

  const loginWithApple = async () => {
    try {
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

  const updateUser = (updatedUser: User) => {
    setUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
  };

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
