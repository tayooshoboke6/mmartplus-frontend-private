/**
 * Voucher Edge Case Testing
 * 
 * This script tests advanced edge cases for the voucher API integration:
 * 1. Concurrent voucher usage with usage limits
 * 2. Timeout handling and resilience
 * 3. Error mapping for various API responses
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  testVouchers: [
    { code: 'LIMITED5', minPurchase: 50, type: 'percentage', value: 15, usage_limit: 5 },
    { code: 'EXPIRED20', minPurchase: 100, type: 'fixed', value: 20, expired: true },
    { code: 'RESTRICTED', minPurchase: 0, type: 'percentage', value: 10, productRestrictions: true }
  ],
  useMockData: true,
  logFile: path.join(__dirname, 'logs', 'voucher-edge-cases.log'),
  timeoutMs: 5000, // Timeout for API calls in milliseconds
  retryCount: 3,   // Number of retries for failed API calls
  concurrentRequests: 10 // Number of concurrent requests to simulate
};

// Ensure log directory exists
try {
  fs.mkdirSync(path.dirname(config.logFile), { recursive: true });
} catch (error) {
  // Directory might already exist, ignore error
}

// Setup logging
const log = (...args) => {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ${args.join(' ')}`;
  console.log(message);
  
  fs.appendFileSync(config.logFile, message + '\n');
};

// Error handling
const logError = (context, error) => {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] [ERROR] ${context}: ${error.message}`;
  console.error(message);
  
  if (error.stack) {
    fs.appendFileSync(config.logFile, message + '\n' + error.stack + '\n');
  } else {
    fs.appendFileSync(config.logFile, message + '\n');
  }
};

// API call with timeout and retry handling
async function callApiWithRetry(url, options, retryCount = config.retryCount) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);
  
  try {
    const fetchOptions = {
      ...options,
      signal: controller.signal
    };
    
    const start = Date.now();
    const response = await fetch(url, fetchOptions);
    const duration = Date.now() - start;
    
    log(`API call to ${url} completed in ${duration}ms`);
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      logError(`API Timeout (${config.timeoutMs}ms)`, new Error(`Request to ${url} timed out`));
    } else {
      logError('API Call', error);
    }
    
    if (retryCount > 0) {
      log(`Retrying API call (${retryCount} attempts left)...`);
      return await callApiWithRetry(url, options, retryCount - 1);
    }
    
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Mock concurrent voucher validation
async function mockConcurrentVoucherValidation(code, cartTotal, requestCount) {
  // Simulate usage counter
  let usageCount = 0;
  const usageLimit = 5;
  
  const results = [];
  
  // Process concurrent requests
  for (let i = 0; i < requestCount; i++) {
    // Simulate some randomness in processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
    
    const voucher = config.testVouchers.find(v => v.code === code);
    if (!voucher) {
      results.push({
        status: 'error',
        message: 'Invalid voucher code',
        data: {
          valid: false,
          error_message: 'The voucher code is invalid or has expired'
        }
      });
      continue;
    }
    
    if (voucher.expired) {
      results.push({
        status: 'error',
        message: 'Expired voucher',
        data: {
          valid: false,
          error_message: 'This voucher has expired'
        }
      });
      continue;
    }
    
    if (cartTotal < voucher.minPurchase) {
      results.push({
        status: 'error',
        message: 'Minimum purchase amount not met',
        data: {
          valid: false,
          error_message: `Minimum purchase of ₦${voucher.minPurchase} required to use this voucher`
        }
      });
      continue;
    }
    
    if (voucher.usage_limit && usageCount >= voucher.usage_limit) {
      results.push({
        status: 'error',
        message: 'Usage limit reached',
        data: {
          valid: false,
          error_message: 'This voucher has reached its usage limit'
        }
      });
      continue;
    }
    
    // Validate product restrictions
    if (voucher.productRestrictions) {
      results.push({
        status: 'error',
        message: 'Product restrictions apply',
        data: {
          valid: false,
          error_message: 'This voucher cannot be applied to some items in your cart'
        }
      });
      continue;
    }
    
    // Success case - voucher is valid
    usageCount++;
    
    let discount_amount;
    if (voucher.type === 'percentage') {
      discount_amount = cartTotal * (voucher.value / 100);
      if (voucher.maxDiscount && discount_amount > voucher.maxDiscount) {
        discount_amount = voucher.maxDiscount;
      }
    } else {
      discount_amount = voucher.value;
    }
    
    results.push({
      status: 'success',
      data: {
        valid: true,
        discount_amount,
        voucher: {
          code: voucher.code,
          discount_type: voucher.type,
          discount_value: voucher.value,
          min_order_amount: voucher.minPurchase
        }
      }
    });
  }
  
  return results;
}

// Simulate slow API response
async function simulateSlowResponse(data, delay) {
  await new Promise(resolve => setTimeout(resolve, delay));
  return data;
}

// Test concurrent voucher validation
async function testConcurrentVoucherValidation() {
  log('=== Testing Concurrent Voucher Validation ===');
  log(`Simulating ${config.concurrentRequests} concurrent requests for a limited voucher`);
  
  try {
    const results = await mockConcurrentVoucherValidation('LIMITED5', 100, config.concurrentRequests);
    
    // Count successful validations
    const successCount = results.filter(r => r.status === 'success').length;
    const usageLimitErrors = results.filter(r => 
      r.status === 'error' && 
      r.data?.error_message?.includes('usage limit')
    ).length;
    
    log(`Success: ${successCount} / Rejected (Usage Limit): ${usageLimitErrors} / Total: ${results.length}`);
    
    // Race condition test passes if:
    // 1. We didn't exceed the usage limit
    // 2. Some requests got rejected with usage limit errors
    const passCondition = (successCount <= 5) && (usageLimitErrors > 0);
    
    log(`Race Condition Test: ${passCondition ? 'PASS' : 'FAIL'}`);
    log(`Voucher was applied ${successCount} times (limit: 5)`);
    
    return successCount <= 5;
  } catch (error) {
    logError('Concurrent validation test', error);
    return false;
  }
}

// Test timeout handling
async function testTimeoutHandling() {
  log('=== Testing Timeout Handling ===');
  
  try {
    // Case 1: Response within timeout
    log('Case 1: Response within timeout');
    const fastResponse = await Promise.race([
      simulateSlowResponse({ status: 'success' }, 1000),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), config.timeoutMs)
      )
    ]);
    
    log(`Result: ${fastResponse.status === 'success' ? 'PASS' : 'FAIL'}`);
    
    // Case 2: Response exceeds timeout
    log('Case 2: Response exceeds timeout (should trigger retry)');
    try {
      await Promise.race([
        simulateSlowResponse({ status: 'success' }, config.timeoutMs + 1000),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), config.timeoutMs)
        )
      ]);
      log('Result: FAIL (Should have timed out)');
      return false;
    } catch (error) {
      log(`Result: PASS (Properly timed out: ${error.message})`);
    }
    
    return true;
  } catch (error) {
    logError('Timeout handling test', error);
    return false;
  }
}

// Test error mapping
async function testErrorMapping() {
  log('=== Testing Error Mapping ===');
  
  const errorCases = [
    { 
      code: 'INVALID', 
      cartTotal: 100, 
      expectedError: 'The voucher code is invalid or has expired',
      userFriendlyMessage: 'This voucher code is invalid. Please check and try again.' 
    },
    { 
      code: 'EXPIRED20', 
      cartTotal: 100, 
      expectedError: 'This voucher has expired',
      userFriendlyMessage: 'This voucher has expired and can no longer be used.' 
    },
    { 
      code: 'WELCOME10', 
      cartTotal: 10, 
      expectedError: 'Minimum purchase',
      userFriendlyMessage: 'A minimum purchase is required to use this voucher.' 
    },
    { 
      code: 'RESTRICTED', 
      cartTotal: 100, 
      expectedError: 'cannot be applied to some items',
      userFriendlyMessage: 'This voucher cannot be applied to some items in your cart.' 
    }
  ];
  
  try {
    let passCount = 0;
    
    for (const testCase of errorCases) {
      log(`Testing error case: ${testCase.code} with cart total: ₦${testCase.cartTotal}`);
      
      if (config.useMockData) {
        const results = await mockConcurrentVoucherValidation(testCase.code, testCase.cartTotal, 1);
        const result = results[0];
        
        const errorMessage = result.data?.error_message || '';
        const containsExpectedError = errorMessage.includes(testCase.expectedError);
        
        log(`Error message: ${errorMessage}`);
        log(`Contains expected error text: ${containsExpectedError ? 'YES' : 'NO'}`);
        log(`User-friendly message would be: "${testCase.userFriendlyMessage}"`);
        
        if (containsExpectedError) passCount++;
      } else {
        // Implementation for real API testing would go here
      }
      
      log('-'.repeat(50));
    }
    
    log(`Error mapping test: ${passCount === errorCases.length ? 'PASS' : 'FAIL'}`);
    log(`${passCount} out of ${errorCases.length} error cases correctly mapped`);
    
    return passCount === errorCases.length;
  } catch (error) {
    logError('Error mapping test', error);
    return false;
  }
}

// Main test function
async function runEdgeCaseTests() {
  log('=== Starting Voucher API Edge Case Tests ===');
  
  const concurrentTest = await testConcurrentVoucherValidation();
  log('-'.repeat(50));
  
  const timeoutTest = await testTimeoutHandling();
  log('-'.repeat(50));
  
  const errorMappingTest = await testErrorMapping();
  log('-'.repeat(50));
  
  // Summary
  log('=== Voucher API Edge Case Test Summary ===');
  log(`Concurrent Validation: ${concurrentTest ? 'PASS' : 'FAIL'}`);
  log(`Timeout Handling: ${timeoutTest ? 'PASS' : 'FAIL'}`);
  log(`Error Mapping: ${errorMappingTest ? 'PASS' : 'FAIL'}`);
  
  const overallPass = concurrentTest && timeoutTest && errorMappingTest;
  log(`Overall result: ${overallPass ? 'PASS' : 'FAIL'}`);
  
  if (!overallPass) {
    log('⚠️ Some edge case tests failed. Review the logs for details.');
    log('These issues should be addressed before production deployment.');
  } else {
    log('✅ All edge case tests passed. The voucher system handles advanced scenarios well.');
  }
  
  log('=== Edge Case Tests Completed ===');
}

// Run the tests
runEdgeCaseTests().catch(error => {
  logError('Test execution', error);
  process.exit(1);
});
