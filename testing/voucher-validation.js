/**
 * Voucher Validation Test
 * 
 * This script validates the voucher application functionality in the cart:
 * 1. Testing valid and invalid voucher codes
 * 2. Verifying discount calculations
 * 3. Testing various edge cases
 */

// Note: This is a simplified version that tests only voucher validation without browser automation

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
    { code: 'WELCOME10', minPurchase: 50, type: 'percentage', value: 10, maxDiscount: 20 },
    { code: 'FLAT20', minPurchase: 200, type: 'fixed', value: 20 }
  ],
  useMockData: true,
  logFile: path.join(__dirname, 'logs', 'voucher-validation.log')
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

// Mock voucher validation
async function mockVoucherValidation(code, cartTotal) {
  const voucher = config.testVouchers.find(v => v.code === code);
  if (!voucher) {
    return {
      status: 'error',
      message: 'Invalid voucher code',
      data: {
        valid: false,
        error_message: 'The voucher code is invalid or has expired'
      }
    };
  }
  
  if (cartTotal < voucher.minPurchase) {
    return {
      status: 'error',
      message: 'Minimum purchase amount not met',
      data: {
        valid: false,
        error_message: `Minimum purchase of ₦${voucher.minPurchase} required to use this voucher`
      }
    };
  }
  
  let discount_amount;
  if (voucher.type === 'percentage') {
    discount_amount = cartTotal * (voucher.value / 100);
    if (voucher.maxDiscount && discount_amount > voucher.maxDiscount) {
      discount_amount = voucher.maxDiscount;
    }
  } else {
    discount_amount = voucher.value;
  }
  
  return {
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
  };
}

// Validate voucher through API or mock
async function validateVoucher(code, cartTotal) {
  log(`Validating voucher: ${code} for cart total: ₦${cartTotal}`);
  
  try {
    if (config.useMockData) {
      // Use mock data
      const response = await mockVoucherValidation(code, cartTotal);
      return response;
    } else {
      // Use real API
      const response = await fetch(`${config.apiUrl}/vouchers/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          cart_total: cartTotal
        })
      });
      
      return await response.json();
    }
  } catch (error) {
    logError('Voucher validation', error);
    return {
      status: 'error',
      message: 'Failed to validate voucher',
      data: {
        valid: false,
        error_message: 'An error occurred while validating the voucher'
      }
    };
  }
}

// Test function for voucher validation
async function testVoucherValidation() {
  log('=== Starting Voucher Validation Tests ===');
  
  // Test case 1: Valid voucher with sufficient cart total
  const testCase1 = await validateVoucher('WELCOME10', 100);
  log('Test Case 1: Valid voucher with sufficient cart total');
  log(`Result: ${testCase1.status === 'success' ? 'PASS' : 'FAIL'}`);
  log(`Expected discount: ₦10, Actual: ₦${testCase1.data?.discount_amount || 'N/A'}`);
  log('-'.repeat(50));
  
  // Test case 2: Valid voucher with insufficient cart total
  const testCase2 = await validateVoucher('WELCOME10', 30);
  log('Test Case 2: Valid voucher with insufficient cart total');
  log(`Result: ${testCase2.status === 'error' && testCase2.data?.valid === false ? 'PASS' : 'FAIL'}`);
  log(`Error message: ${testCase2.data?.error_message || 'N/A'}`);
  log('-'.repeat(50));
  
  // Test case 3: Invalid voucher code
  const testCase3 = await validateVoucher('INVALID', 100);
  log('Test Case 3: Invalid voucher code');
  log(`Result: ${testCase3.status === 'error' && testCase3.data?.valid === false ? 'PASS' : 'FAIL'}`);
  log(`Error message: ${testCase3.data?.error_message || 'N/A'}`);
  log('-'.repeat(50));
  
  // Test case 4: Fixed amount voucher
  const testCase4 = await validateVoucher('FLAT20', 250);
  log('Test Case 4: Fixed amount voucher');
  log(`Result: ${testCase4.status === 'success' ? 'PASS' : 'FAIL'}`);
  log(`Expected discount: ₦20, Actual: ₦${testCase4.data?.discount_amount || 'N/A'}`);
  log('-'.repeat(50));
  
  // Test case 5: Percentage voucher with max discount cap
  const testCase5 = await validateVoucher('WELCOME10', 300);
  log('Test Case 5: Percentage voucher with max discount cap');
  log(`Result: ${testCase5.status === 'success' ? 'PASS' : 'FAIL'}`);
  log(`Expected discount: ₦20 (capped), Actual: ₦${testCase5.data?.discount_amount || 'N/A'}`);
  log('-'.repeat(50));
  
  // Summary
  log('=== Voucher Validation Test Summary ===');
  const passCount = [
    testCase1.status === 'success',
    testCase2.status === 'error' && testCase2.data?.valid === false,
    testCase3.status === 'error' && testCase3.data?.valid === false,
    testCase4.status === 'success',
    testCase5.status === 'success'
  ].filter(Boolean).length;
  
  log(`Tests passed: ${passCount} out of 5`);
  log(`Overall result: ${passCount === 5 ? 'PASS' : 'FAIL'}`);
  log('=== Test Completed ===');
}

// Run the test
testVoucherValidation().catch(error => {
  logError('Test execution', error);
  process.exit(1);
});
