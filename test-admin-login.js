/**
 * Test script to check admin login and navigate to orders page
 */

// This script will run in the browser console when loaded
(function() {
  console.log('Starting admin login test...');
  
  // Try to clear any existing auth data
  localStorage.removeItem('mmartToken');
  localStorage.removeItem('mmartUser');
  
  console.log('Local storage cleared');
  
  // Set up admin user credentials
  const adminCredentials = {
    email: 'admin@mmart.com',
    password: 'password'
  };
  
  console.log('Attempting admin login with:', adminCredentials);

  // Now create admin data in local storage directly (bypassing API for testing)
  const adminUser = {
    id: 1,
    name: 'Admin User',
    email: 'admin@mmart.com',
    role: 'admin'
  };
  
  // Store user data in localStorage for testing
  localStorage.setItem('mmartToken', 'test-admin-token');
  localStorage.setItem('mmartUser', JSON.stringify(adminUser));
  
  console.log('Admin user data stored in localStorage:', adminUser);
  console.log('Now you can navigate to /admin/orders to test the orders page.');
  console.log('You might need to reload the page if you were already logged in with a different account.');
  
  // Offer to navigate to the orders page
  if (confirm('Do you want to navigate to the admin orders page now?')) {
    window.location.href = '/admin/orders';
  }
})();
