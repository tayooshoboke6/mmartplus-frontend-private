import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginCredentials, RegisterData } from '../services/authService';

// Define types for our authentication context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<User | null>;
  loginWithApple: () => Promise<User | null>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<User>;
  updateUser: (userData: User) => void;
  clearError: () => void;
  verifyEmail: (code: string) => Promise<void>;
  sendVerificationCode: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check admin status whenever user changes
  useEffect(() => {
    setIsAdmin(!!user && user.role === 'admin');
  }, [user]);

  // On component mount, check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (authService.isLoggedIn()) {
        try {
          // Try to get the current user from storage
          const storedUser = authService.getUser();
          
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            // If no user in storage, try to fetch from API
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              setIsAuthenticated(true);
            }
          }
        } catch (err) {
          console.error('Error authenticating user:', err);
          // Clear any invalid tokens
          await authService.logout();
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function using the auth service
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Google login function - will be implemented when backend is ready
  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // This will be implemented when integrating with the backend
      // For now, we'll simulate a successful login
      const mockUser = {
        id: 123,
        first_name: 'John',
        last_name: 'Doe',
        email: 'user@example.com',
        phone: '1234567890',
        role: 'user' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Store the user data
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('mmartUser', JSON.stringify(mockUser));
      localStorage.setItem('mmartToken', 'mock-google-token');
      
      return mockUser;
    } catch (error) {
      setError('Google login failed. Please try again.');
      console.error('Google login error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Apple login function - will be implemented when backend is ready
  const loginWithApple = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // This will be implemented when integrating with the backend
      // For now, we'll simulate a successful login
      const mockUser = {
        id: 456,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        role: 'user' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Store the user data
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('mmartUser', JSON.stringify(mockUser));
      localStorage.setItem('mmartToken', 'mock-apple-token');
      
      return mockUser;
    } catch (error) {
      setError('Apple login failed. Please try again.');
      console.error('Apple login error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function using auth service
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update user profile through API
  const updateProfile = async (userData: Partial<User>): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update user data locally (without API call)
  const updateUser = (userData: User): void => {
    setUser(userData);
    // If you need to update local storage or other client-side storage
    authService.saveUser(userData);
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear any authentication errors
  const clearError = () => setError(null);

  // Email verification functions
  const verifyEmail = async (code: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.verifyEmail(code);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify email');
      console.error('Email verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.sendVerificationCode();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send verification code');
      console.error('Send verification code error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Provide the auth context value to all children
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isAdmin,
        error,
        login,
        loginWithGoogle,
        loginWithApple,
        register,
        logout,
        updateProfile,
        updateUser,
        clearError,
        verifyEmail,
        sendVerificationCode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
