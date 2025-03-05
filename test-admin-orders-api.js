/**
 * Test script to check admin orders API
 */

// This script will make a direct fetch request to the backend API
(function() {
  console.log('Starting admin orders API test...');
  
  // Create admin token (for testing purposes)
  const testToken = 'test-admin-token';
  
  // Make sure we have the API URL from the env file
  const API_URL = 'http://localhost:8000/api';
  
  // Function to test the API
  async function testOrdersAPI() {
    try {
      console.log('Fetching orders from API:', `${API_URL}/admin/orders`);
      
      const response = await fetch(`${API_URL}/admin/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${testToken}`
        }
      });
      
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Orders data received:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }
  
  // Run the test
  testOrdersAPI();
})();
