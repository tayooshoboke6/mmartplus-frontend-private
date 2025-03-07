import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface AdminRouteProps {
  children?: React.ReactNode;
}

/**
 * Protected route specifically for admin users
 * Redirects to admin login if not authenticated or not an admin
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, isAdmin, user } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  // Check for token presence on initial render
  useEffect(() => {
    const verifyToken = async () => {
      // First set to verifying state to prevent premature redirects
      setIsVerifying(true);
      
      try {
        // Check all possible token locations for better persistence
        const token = localStorage.getItem('mmartToken') || 
                      sessionStorage.getItem('mmartToken') || 
                      localStorage.getItem('token') ||
                      localStorage.getItem('adminToken');
        
        if (token) {
          // Ensure consistent token storage
          localStorage.setItem('mmartToken', token);
          sessionStorage.setItem('mmartToken', token);
          
          // Set authorization header for all API requests in admin routes
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('Admin route: Authorization header set with token');
          
          setHasToken(true);
        } else {
          console.warn('Admin route: No token found in storage');
          setHasToken(false);
        }
      } catch (err) {
        console.error('Error verifying admin token:', err);
        setHasToken(false);
      } finally {
        // Only finish verification after a short delay to give auth context time to initialize
        setTimeout(() => {
          setIsVerifying(false);
        }, 500);
      }
    };
    
    verifyToken();
  }, [location.pathname]);

  // Show loading state while checking authentication or verifying token
  if (isLoading || isVerifying) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If we have a token but auth context says not authenticated, 
  // render children anyway and let auth context catch up
  if (hasToken && !isAuthenticated) {
    console.log('Admin route: Has token but auth context not ready yet. Rendering content anyway...');
    return <>{children || <Outlet />}</>;
  }

  // If definitely not authenticated or definitely not admin, redirect to login
  if (!hasToken || (!isAuthenticated && !isVerifying) || (!isAdmin && !isVerifying)) {
    console.log('Admin route: User not authenticated or not admin, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Log admin access for debugging
  console.log(`Admin route: Access granted to ${user?.name || 'user'} (${user?.email || 'unknown email'})`);

  // Render children or outlet if authenticated and is admin
  return <>{children || <Outlet />}</>;
};

export default AdminRoute;
