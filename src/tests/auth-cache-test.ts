import api, { clearApiCache } from '../services/api';
import authService from '../services/authService';
import Cookies from 'js-cookie';

/**
 * This is a test script to verify the caching and cookie functionality
 * Run this in the browser console or modify to run in a test framework
 */

// Test cache functionality
async function testApiCache() {
  console.group('🧪 Testing API Cache Functionality');
  
  try {
    // Make a GET request that should be cached
    console.log('Making first API request...');
    const firstResponse = await api.get('/products?page=1');
    console.log('First request response:', firstResponse);
    
    // Make the same request again - should come from cache
    console.log('Making second API request (should be cached)...');
    const startTime = performance.now();
    const secondResponse = await api.get('/products?page=1');
    const endTime = performance.now();
    console.log(`Second request completed in ${endTime - startTime}ms`);
    console.log('Second request response:', secondResponse);
    
    // Check if responses match
    const areResponsesEqual = JSON.stringify(firstResponse.data) === JSON.stringify(secondResponse.data);
    console.log('Responses match:', areResponsesEqual);
    console.log('Cache test ' + (areResponsesEqual ? 'PASSED ✅' : 'FAILED ❌'));
    
    // Clear cache
    console.log('Clearing cache...');
    clearApiCache();
    
    // Make request again - should not be cached
    console.log('Making third API request (cache cleared)...');
    const thirdStartTime = performance.now();
    const thirdResponse = await api.get('/products?page=1');
    const thirdEndTime = performance.now();
    console.log(`Third request completed in ${thirdEndTime - thirdStartTime}ms`);
    
    // The time for the third request should be similar to the first (not cached)
    console.log('Third request response:', thirdResponse);
  } catch (error) {
    console.error('API Cache test error:', error);
    console.log('Cache test FAILED ❌');
  }
  
  console.groupEnd();
}

// Test cookie functionality
async function testAuthCookies() {
  console.group('🧪 Testing Auth Cookie Functionality');
  
  try {
    // Mock login
    const mockUser = {
      id: 999,
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const mockResponse = {
      success: true,
      token: 'mock-token-for-testing',
      user: mockUser,
      message: 'Login success'
    };
    
    // Manually save auth data to simulate login
    localStorage.setItem('mmartToken', mockResponse.token);
    localStorage.setItem('mmartUser', JSON.stringify(mockResponse.user));
    
    // Set domain for cookie operations
    const domain = window.location.hostname;
    const cookieOptions = {
      expires: 30,
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
      domain: domain !== 'localhost' ? domain : undefined
    };
    
    Cookies.set('mmartToken', mockResponse.token, cookieOptions);
    Cookies.set('mmartUser', JSON.stringify(mockResponse.user), cookieOptions);
    
    // Check if the user is logged in according to our auth service
    const isLoggedIn = authService.isLoggedIn();
    console.log('Is user logged in:', isLoggedIn);
    console.log('Login test ' + (isLoggedIn ? 'PASSED ✅' : 'FAILED ❌'));
    
    // Test getUser method - should retrieve from cookies
    const user = authService.getUser();
    console.log('Retrieved user:', user);
    const userMatch = user && user.id === mockUser.id;
    console.log('User retrieval test ' + (userMatch ? 'PASSED ✅' : 'FAILED ❌'));
    
    // Test isAdmin method
    const isAdmin = authService.isAdmin();
    console.log('Is user admin:', isAdmin);
    console.log('Admin role test ' + (isAdmin ? 'PASSED ✅' : 'FAILED ❌'));
    
    // Test logout - should clear both localStorage and cookies
    await authService.logout();
    
    // Check if localStorage items are cleared
    const tokenAfterLogout = localStorage.getItem('mmartToken');
    const userAfterLogout = localStorage.getItem('mmartUser');
    console.log('Token after logout (localStorage):', tokenAfterLogout);
    console.log('User after logout (localStorage):', userAfterLogout);
    
    // Check if cookies are cleared
    const cookieTokenAfterLogout = Cookies.get('mmartToken');
    const cookieUserAfterLogout = Cookies.get('mmartUser');
    console.log('Token after logout (cookie):', cookieTokenAfterLogout);
    console.log('User after logout (cookie):', cookieUserAfterLogout);
    
    const logoutSuccess = 
      !tokenAfterLogout && 
      !userAfterLogout && 
      !cookieTokenAfterLogout && 
      !cookieUserAfterLogout;
    
    console.log('Logout test ' + (logoutSuccess ? 'PASSED ✅' : 'FAILED ❌'));
    
    // After logout, isLoggedIn should return false
    const isLoggedInAfterLogout = authService.isLoggedIn();
    console.log('Is user logged in after logout:', isLoggedInAfterLogout);
    console.log('Login status after logout test ' + (!isLoggedInAfterLogout ? 'PASSED ✅' : 'FAILED ❌'));
  } catch (error) {
    console.error('Auth Cookie test error:', error);
    console.log('Cookie test FAILED ❌');
  }
  
  console.groupEnd();
}

// Run all tests
async function runAllTests() {
  console.log('🧪 STARTING AUTH & CACHE TESTS 🧪');
  console.log('================================');
  
  await testApiCache();
  console.log('');
  await testAuthCookies();
  
  console.log('');
  console.log('================================');
  console.log('🧪 ALL TESTS COMPLETE 🧪');
}

// Export for use in the browser console
export { testApiCache, testAuthCookies, runAllTests };

// Automatically run tests when this script is executed directly
if (typeof window !== 'undefined') {
  // Set a timeout to ensure the app is loaded
  setTimeout(() => {
    runAllTests();
  }, 1000);
}
