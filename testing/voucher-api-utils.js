/**
 * Voucher API Test Utility
 * 
 * This script provides utility functions to switch between mock data 
 * and live API testing for the voucher checkout integration.
 */

// Function to enable mock data mode
function enableMockData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Setting useMockDataOnFailure to true means mock data will be used
    localStorage.setItem('useMockDataOnFailure', 'true');
    console.log('✅ Mock data mode ENABLED');
    console.log('👉 API calls will use mock data from the frontend');
  } else {
    console.error('❌ localStorage not available');
  }
}

// Function to disable mock data mode (use live API)
function disableMockData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Setting useMockDataOnFailure to false means real API will be used
    localStorage.setItem('useMockDataOnFailure', 'false');
    console.log('✅ Mock data mode DISABLED');
    console.log('👉 API calls will use the real backend API');
  } else {
    console.error('❌ localStorage not available');
  }
}

// Function to check current mock data status
function checkMockDataStatus() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const status = localStorage.getItem('useMockDataOnFailure');
    
    if (status === 'false') {
      console.log('📊 Current status: Using LIVE API');
    } else {
      console.log('📊 Current status: Using MOCK DATA');
    }
  } else {
    console.error('❌ localStorage not available');
  }
}

// Function to toggle debug mode for API responses
function toggleApiDebugMode() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const currentStatus = localStorage.getItem('debugApiResponses');
    const newStatus = currentStatus === 'true' ? 'false' : 'true';
    
    localStorage.setItem('debugApiResponses', newStatus);
    console.log(`✅ API debug mode ${newStatus === 'true' ? 'ENABLED' : 'DISABLED'}`);
    
    if (newStatus === 'true') {
      console.log('👉 API responses will be logged to the console');
    }
  } else {
    console.error('❌ localStorage not available');
  }
}

// Function to reset all development settings
function resetDevSettings() {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('useMockDataOnFailure');
    localStorage.removeItem('skipAuthForAdmin');
    localStorage.removeItem('debugApiResponses');
    console.log('✅ Development settings have been reset to defaults');
  } else {
    console.error('❌ localStorage not available');
  }
}

// Test voucher API endpoints
async function testVoucherApiEndpoints() {
  console.log('🧪 Testing Voucher API Endpoints');
  
  try {
    const baseUrl = window.location.origin;
    
    // Test voucher validation endpoint
    console.log('🔍 Testing voucher validation endpoint...');
    const validationResponse = await fetch(`${baseUrl}/api/vouchers/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: 'TESTCODE',
        cart_total: 100
      })
    });
    
    console.log(`Validation Status: ${validationResponse.status}`);
    if (validationResponse.ok) {
      const validationData = await validationResponse.json();
      console.log('Validation Response:', validationData);
    }
    
    // Test apply voucher endpoint
    console.log('🔍 Testing apply voucher endpoint...');
    const applyResponse = await fetch(`${baseUrl}/api/orders/apply-voucher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: 12345,
        voucher_code: 'TESTCODE'
      })
    });
    
    console.log(`Apply Status: ${applyResponse.status}`);
    if (applyResponse.ok) {
      const applyData = await applyResponse.json();
      console.log('Apply Response:', applyData);
    }
    
    console.log('✅ API endpoint tests completed');
    
  } catch (error) {
    console.error('❌ Error testing API endpoints:', error);
  }
}

// Export functions for use in the browser console
if (typeof window !== 'undefined') {
  window.VoucherTestUtils = {
    enableMockData,
    disableMockData,
    checkMockDataStatus,
    toggleApiDebugMode,
    resetDevSettings,
    testVoucherApiEndpoints
  };
  
  console.log('🛠️ Voucher Test Utilities loaded!');
  console.log('Usage:');
  console.log('  VoucherTestUtils.enableMockData() - Switch to mock data mode');
  console.log('  VoucherTestUtils.disableMockData() - Switch to live API mode');
  console.log('  VoucherTestUtils.checkMockDataStatus() - Check current mode');
  console.log('  VoucherTestUtils.toggleApiDebugMode() - Toggle API response logging');
  console.log('  VoucherTestUtils.resetDevSettings() - Reset to defaults');
  console.log('  VoucherTestUtils.testVoucherApiEndpoints() - Test API endpoints');
}
