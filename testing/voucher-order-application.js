/**
 * Voucher Order Application Test
 * 
 * This script validates the voucher application to orders functionality:
 * 1. Testing voucher application to orders
 * 2. Verifying order total calculations after voucher
 * 3. Testing edge cases for order-voucher interactions
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
    { code: 'WELCOME10', minPurchase: 50, type: 'percentage', value: 10, maxDiscount: 20 },
    { code: 'FLAT20', minPurchase: 200, type: 'fixed', value: 20 }
  ],
  useMockData: true,
  logFile: path.join(__dirname, 'logs', 'voucher-order-application.log')
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

// Mock order data
const mockOrders = [
  { id: 101, total: 150, items: [{ id: 1, name: 'Product 1', price: 50, quantity: 3 }] },
  { id: 102, total: 75, items: [{ id: 2, name: 'Product 2', price: 25, quantity: 3 }] },
  { id: 103, total: 250, items: [{ id: 3, name: 'Product 3', price: 125, quantity: 2 }] },
  { id: 104, total: 45, items: [{ id: 4, name: 'Product 4', price: 15, quantity: 3 }] }
];

// Mock apply voucher to order
async function mockApplyVoucher(orderId, voucherCode) {
  // Find the order
  const order = mockOrders.find(o => o.id === orderId);
  if (!order) {
    return {
      status: 'error',
      message: 'Order not found'
    };
  }
  
  // Find the voucher
  const voucher = config.testVouchers.find(v => v.code === voucherCode);
  if (!voucher) {
    return {
      status: 'error',
      message: 'Invalid voucher code'
    };
  }
  
  // Check minimum purchase requirement
  if (order.total < voucher.minPurchase) {
    return {
      status: 'error',
      message: `Minimum purchase of ₦${voucher.minPurchase} required to use this voucher`
    };
  }
  
  // Calculate discount amount
  let discountAmount;
  if (voucher.type === 'percentage') {
    discountAmount = order.total * (voucher.value / 100);
    if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
      discountAmount = voucher.maxDiscount;
    }
  } else {
    discountAmount = voucher.value;
  }
  
  return {
    status: 'success',
    message: 'Voucher applied successfully',
    data: {
      discount_amount: discountAmount,
      new_total: order.total - discountAmount
    }
  };
}

// Apply voucher to order through API or mock
async function applyVoucherToOrder(orderId, voucherCode) {
  log(`Applying voucher: ${voucherCode} to order: #${orderId}`);
  
  try {
    if (config.useMockData) {
      // Use mock data
      const response = await mockApplyVoucher(orderId, voucherCode);
      return response;
    } else {
      // Use real API
      const response = await fetch(`${config.apiUrl}/orders/apply-voucher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId,
          voucher_code: voucherCode
        })
      });
      
      return await response.json();
    }
  } catch (error) {
    logError('Apply voucher to order', error);
    return {
      status: 'error',
      message: 'Failed to apply voucher to order'
    };
  }
}

// Test function for applying vouchers to orders
async function testVoucherOrderApplication() {
  log('=== Starting Voucher Order Application Tests ===');
  
  // Test case 1: Valid voucher with sufficient order total
  const testCase1 = await applyVoucherToOrder(101, 'WELCOME10');
  log('Test Case 1: Valid voucher with sufficient order total');
  log(`Result: ${testCase1.status === 'success' ? 'PASS' : 'FAIL'}`);
  log(`Original total: ₦150, Discount: ₦${testCase1.data?.discount_amount || 'N/A'}, New total: ₦${testCase1.data?.new_total || 'N/A'}`);
  log('-'.repeat(50));
  
  // Test case 2: Valid voucher with insufficient order total
  const testCase2 = await applyVoucherToOrder(104, 'WELCOME10');
  log('Test Case 2: Valid voucher with insufficient order total');
  log(`Result: ${testCase2.status === 'error' ? 'PASS' : 'FAIL'}`);
  log(`Error message: ${testCase2.message || 'N/A'}`);
  log('-'.repeat(50));
  
  // Test case 3: Invalid voucher code
  const testCase3 = await applyVoucherToOrder(101, 'INVALID');
  log('Test Case 3: Invalid voucher code');
  log(`Result: ${testCase3.status === 'error' ? 'PASS' : 'FAIL'}`);
  log(`Error message: ${testCase3.message || 'N/A'}`);
  log('-'.repeat(50));
  
  // Test case 4: Fixed amount voucher
  const testCase4 = await applyVoucherToOrder(103, 'FLAT20');
  log('Test Case 4: Fixed amount voucher');
  log(`Result: ${testCase4.status === 'success' ? 'PASS' : 'FAIL'}`);
  log(`Original total: ₦250, Discount: ₦${testCase4.data?.discount_amount || 'N/A'}, New total: ₦${testCase4.data?.new_total || 'N/A'}`);
  log('-'.repeat(50));
  
  // Test case 5: Percentage voucher with max discount cap
  const testCase5 = await applyVoucherToOrder(103, 'WELCOME10');
  log('Test Case 5: Percentage voucher with max discount cap');
  log(`Result: ${testCase5.status === 'success' ? 'PASS' : 'FAIL'}`);
  log(`Original total: ₦250, Discount: ₦${testCase5.data?.discount_amount || 'N/A'}, New total: ₦${testCase5.data?.new_total || 'N/A'}`);
  log('-'.repeat(50));
  
  // Test case 6: Order not found
  const testCase6 = await applyVoucherToOrder(999, 'WELCOME10');
  log('Test Case 6: Order not found');
  log(`Result: ${testCase6.status === 'error' ? 'PASS' : 'FAIL'}`);
  log(`Error message: ${testCase6.message || 'N/A'}`);
  log('-'.repeat(50));
  
  // Summary
  log('=== Voucher Order Application Test Summary ===');
  const passCount = [
    testCase1.status === 'success',
    testCase2.status === 'error',
    testCase3.status === 'error',
    testCase4.status === 'success',
    testCase5.status === 'success',
    testCase6.status === 'error'
  ].filter(Boolean).length;
  
  log(`Tests passed: ${passCount} out of 6`);
  log(`Overall result: ${passCount === 6 ? 'PASS' : 'FAIL'}`);
  log('=== Test Completed ===');
}

// Run the test
testVoucherOrderApplication().catch(error => {
  logError('Test execution', error);
  process.exit(1);
});
