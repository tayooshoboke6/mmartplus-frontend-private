import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginCredentials, RegisterData } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  loginWithGoogle: () => Promise<User | null>;
  loginWithApple: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  loading: true,
  isLoading: false,
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          
          // Check if user has admin role
          const hasAdminRole = userData.roles?.some(role => 
            role.name.toLowerCase() === 'admin'
          );
          
          setIsAdmin(hasAdminRole || false);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(credentials);
      
      if (response && response.user) {
        const userData = response.user;
        
        // Set user state with admin flag
        setUser(userData);
        
        // Check if user has admin role
        const hasAdminRole = userData.roles?.some(role => 
          role.name.toLowerCase() === 'admin'
        );
        
        setIsAdmin(hasAdminRole || false);
        setIsAuthenticated(true);

        return { success: true, user: userData };
      }
      
      // If login failed
      const errorMessage = 'Invalid email or password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Clear user data and cookies on logout
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout endpoint to clear HTTP-only cookies
      await authService.logout();
      
      // Update state
      setUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
      
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      
      if (response && response.user) {
        // Don't automatically log in after registration
        // In a real app, this would depend on the verification flow
        return { success: true };
      }
      
      // If registration failed
      const errorMessage = 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Implement social login functions
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.loginWithGoogle();
      
      if (response && response.user) {
        const userData = response.user;
        
        // Set user state
        setUser(userData);
        
        // Check if user has admin role
        const hasAdminRole = userData.roles?.some(role => 
          role.name.toLowerCase() === 'admin'
        );
        
        setIsAdmin(hasAdminRole || false);
        setIsAuthenticated(true);

        return userData;
      }
      
      return null;
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Failed to login with Google');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithApple = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.loginWithApple();
      
      if (response && response.user) {
        const userData = response.user;
        
        // Set user state
        setUser(userData);
        
        // Check if user has admin role
        const hasAdminRole = userData.roles?.some(role => 
          role.name.toLowerCase() === 'admin'
        );
        
        setIsAdmin(hasAdminRole || false);
        setIsAuthenticated(true);

        return userData;
      }
      
      return null;
    } catch (err: any) {
      console.error('Apple login error:', err);
      setError('Failed to login with Apple');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        user,
        loading,
        isLoading,
        error,
        login,
        logout,
        register,
        clearError,
        loginWithGoogle,
        loginWithApple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
