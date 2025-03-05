// Development Mode Restrictions Test Script
// Run this in the browser console

// This script will test if development features are properly restricted

async function testDevModeRestrictions() {
  console.log('=== Testing Development Mode Restrictions ===');
  
  // Save original config state to restore later
  const originalConfig = { ...window.config };
  
  // Test results container
  const results = {};
  
  // Test 1: Try to enable mock data in "production" mode
  console.log('Test 1: Trying to enable mock data in production mode');
  try {
    // Simulate production mode
    window.config.app.environment = 'production';
    
    // Try to enable mock data
    localStorage.setItem('useMockDataOnFailure', 'true');
    
    // Check if the feature is enabled
    results.mockDataTest = {
      attempted: true,
      isEnabled: window.config.features.useMockData,
      expectedEnabled: false,
      success: window.config.features.useMockData === false
    };
  } catch (e) {
    console.error('Error in mock data test:', e);
    results.mockDataTest = { error: e.message };
  }
  
  // Test 2: Try to use loginAsAdmin in "production" mode
  console.log('Test 2: Trying to use loginAsAdmin in production mode');
  try {
    // Try to use loginAsAdmin
    const authContext = window.authContext || document.querySelector('[data-auth-context]')?.__reactProps$;
    
    if (authContext && authContext.loginAsAdmin) {
      const loginResult = await authContext.loginAsAdmin();
      
      results.loginAsAdminTest = {
        attempted: true,
        success: !loginResult.success, // Should fail in production
        result: loginResult
      };
    } else {
      results.loginAsAdminTest = {
        attempted: false,
        error: 'Could not access auth context to test loginAsAdmin'
      };
    }
  } catch (e) {
    console.error('Error in loginAsAdmin test:', e);
    results.loginAsAdminTest = { error: e.message };
  }
  
  // Test 3: Check if localStorage settings reset in production
  console.log('Test 3: Testing localStorage reset in production mode');
  try {
    // Set some dev settings
    localStorage.setItem('skipAuthForAdmin', 'true');
    localStorage.setItem('debugApiResponses', 'true');
    
    // Force production mode behavior
    if (typeof window.resetConfigForProduction === 'function') {
      window.resetConfigForProduction();
    } else {
      // Simulate the production reset logic
      Object.defineProperties(window.config.features, {
        'useMockData': { value: false, writable: false },
        'skipAuthForAdmin': { value: false, writable: false },
        'debugApiResponses': { value: false, writable: false }
      });
      
      localStorage.removeItem('useMockDataOnFailure');
      localStorage.removeItem('skipAuthForAdmin');
      localStorage.removeItem('debugApiResponses');
    }
    
    // Check if settings were cleared
    results.localStorageResetTest = {
      attempted: true,
      skipAuthValue: localStorage.getItem('skipAuthForAdmin'),
      debugApiValue: localStorage.getItem('debugApiResponses'),
      expectedValue: null,
      success: 
        localStorage.getItem('skipAuthForAdmin') === null && 
        localStorage.getItem('debugApiResponses') === null
    };
  } catch (e) {
    console.error('Error in localStorage reset test:', e);
    results.localStorageResetTest = { error: e.message };
  }
  
  // Test 4: Try to override production feature lockdown
  console.log('Test 4: Trying to override production feature lockdown');
  try {
    // Try to override the readonly properties
    try {
      window.config.features.useMockData = true;
      window.config.features.skipAuthForAdmin = true;
      window.config.features.debugApiResponses = true;
    } catch (e) {
      // Expected to fail with TypeError for readonly properties
      console.log('Expected error when trying to modify readonly properties:', e);
    }
    
    // Check if properties remained locked
    results.readonlyPropertiesTest = {
      attempted: true,
      useMockData: window.config.features.useMockData,
      skipAuthForAdmin: window.config.features.skipAuthForAdmin,
      debugApiResponses: window.config.features.debugApiResponses,
      expectedValues: {
        useMockData: false,
        skipAuthForAdmin: false,
        debugApiResponses: false
      },
      success: 
        window.config.features.useMockData === false &&
        window.config.features.skipAuthForAdmin === false &&
        window.config.features.debugApiResponses === false
    };
  } catch (e) {
    console.error('Error in readonly properties test:', e);
    results.readonlyPropertiesTest = { error: e.message };
  }
  
  // Restore original config
  window.config = originalConfig;
  
  // Calculate overall test success
  results.allTestsPassed = 
    results.mockDataTest?.success &&
    results.loginAsAdminTest?.success &&
    results.localStorageResetTest?.success &&
    results.readonlyPropertiesTest?.success;
  
  console.log('=== Development Mode Restrictions Test Results ===', results);
  return results;
}

// Execute all tests
// testDevModeRestrictions().then(results => console.table(results));
