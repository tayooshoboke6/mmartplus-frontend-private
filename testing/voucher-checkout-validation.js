/**
 * Voucher Checkout Integration Test
 * 
 * This script validates the complete voucher application flow during checkout:
 * 1. Adding products to cart
 * 2. Applying voucher codes in the cart
 * 3. Verifying discount calculation
 * 4. Completing checkout with an applied voucher
 * 5. Verifying order details post-voucher application
 */

// Use ES modules for Node.js
import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  baseUrl: process.env.REACT_APP_BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  credentials: {
    email: 'test@example.com',
    password: 'password123'
  },
  testVouchers: [
    { code: 'WELCOME10', minPurchase: 50, type: 'percentage', value: 10, maxDiscount: 20 },
    { code: 'FLAT20', minPurchase: 200, type: 'fixed', value: 20 }
  ],
  useMockData: true,
  logFile: path.join(__dirname, 'logs', 'voucher-checkout-validation.log')
};

// Ensure log directory exists
const logDir = path.dirname(config.logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
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

// Initialize browser
async function startBrowser() {
  log('Starting browser...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1366,768']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  // Set longer timeout for navigation
  page.setDefaultTimeout(30000);
  page.setDefaultNavigationTimeout(30000);
  
  // Enable request interception for mock data
  if (config.useMockData) {
    await page.setRequestInterception(true);
    page.on('request', interceptRequest);
  }
  
  return { browser, page };
}

// Mock API responses
function interceptRequest(request) {
  const url = request.url();
  
  // Only intercept API calls when useMockData is true
  if (!url.includes(config.apiUrl)) {
    request.continue();
    return;
  }
  
  // Mock voucher validation
  if (url.includes('/vouchers/validate') && request.method() === 'POST') {
    request.respond({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockVoucherValidation(request))
    });
    return;
  }
  
  // Mock apply voucher to order
  if (url.includes('/orders/apply-voucher') && request.method() === 'POST') {
    request.respond({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockApplyVoucher(request))
    });
    return;
  }
  
  // Continue with the request for other URLs
  request.continue();
}

// Mock voucher validation response
async function mockVoucherValidation(request) {
  const postData = JSON.parse(request.postData());
  const { code, cart_total } = postData;
  
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
  
  if (cart_total < voucher.minPurchase) {
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
    discount_amount = cart_total * (voucher.value / 100);
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

// Mock apply voucher response
async function mockApplyVoucher(request) {
  const postData = JSON.parse(request.postData());
  const { order_id, voucher_code } = postData;
  
  const voucher = config.testVouchers.find(v => v.code === voucher_code);
  if (!voucher) {
    return {
      status: 'error',
      message: 'Invalid voucher code'
    };
  }
  
  // Assume a fixed order total for the mock
  const orderTotal = 250;
  let discountAmount;
  
  if (voucher.type === 'percentage') {
    discountAmount = orderTotal * (voucher.value / 100);
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
      new_total: orderTotal - discountAmount
    }
  };
}

// Login to the application
async function login(page) {
  log('Navigating to login page...');
  await page.goto(`${config.baseUrl}/login`);
  
  log('Logging in...');
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', config.credentials.email);
  await page.type('input[type="password"]', config.credentials.password);
  
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
  
  log('Login successful');
}

// Go to product page and add to cart
async function addProductToCart(page) {
  log('Navigating to featured products...');
  await page.goto(`${config.baseUrl}`);
  
  log('Waiting for products to load...');
  await page.waitForSelector('.product-card');
  
  // Click on the first product
  log('Clicking on first product...');
  await Promise.all([
    page.click('.product-card:first-child'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
  
  // Wait for the product details page to load
  await page.waitForSelector('.product-details');
  
  // Add to cart
  log('Adding product to cart...');
  await page.click('.add-to-cart-button');
  
  // Wait for "added to cart" confirmation
  await page.waitForSelector('.cart-notification', { visible: true });
  
  log('Product added to cart');
}

// View cart and apply voucher
async function applyVoucherInCart(page, voucherCode) {
  // Navigate to cart page
  log('Navigating to cart page...');
  await page.goto(`${config.baseUrl}/cart`);
  
  // Wait for cart page to load
  await page.waitForSelector('.cart-container');
  
  // Check if products exist in cart
  const hasProducts = await page.evaluate(() => {
    return document.querySelectorAll('.cart-item').length > 0;
  });
  
  if (!hasProducts) {
    throw new Error('Cart is empty, cannot proceed with voucher test');
  }
  
  // Enter voucher code
  log(`Applying voucher: ${voucherCode}`);
  await page.waitForSelector('input[placeholder="Enter voucher code"]');
  await page.type('input[placeholder="Enter voucher code"]', voucherCode);
  
  // Click apply button
  await page.click('button:contains("Apply")');
  
  // Wait for voucher response
  try {
    await page.waitForFunction(
      () => document.querySelector('.voucher-message') !== null,
      { timeout: 5000 }
    );
    
    // Check if voucher was applied successfully
    const voucherStatus = await page.evaluate(() => {
      const messageElement = document.querySelector('.voucher-message');
      if (!messageElement) return null;
      
      return {
        text: messageElement.textContent,
        isSuccess: messageElement.classList.contains('success')
      };
    });
    
    if (voucherStatus && voucherStatus.isSuccess) {
      log('Voucher applied successfully');
      return true;
    } else {
      log(`Voucher application failed: ${voucherStatus?.text || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logError('Voucher application', error);
    return false;
  }
}

// Verify discount is correctly applied
async function verifyDiscount(page, voucherCode) {
  const voucher = config.testVouchers.find(v => v.code === voucherCode);
  if (!voucher) {
    throw new Error(`Test voucher ${voucherCode} not found in configuration`);
  }
  
  // Get cart subtotal
  const subtotal = await page.evaluate(() => {
    const subtotalElement = document.querySelector('.cart-summary .subtotal .amount');
    if (!subtotalElement) return null;
    
    // Extract numeric value from price string (e.g., "₦250.00" -> 250)
    const priceText = subtotalElement.textContent.replace(/[^0-9.]/g, '');
    return parseFloat(priceText);
  });
  
  if (subtotal === null) {
    throw new Error('Could not find subtotal amount on page');
  }
  
  // Get discount amount
  const discountAmount = await page.evaluate(() => {
    const discountElement = document.querySelector('.cart-summary .discount .amount');
    if (!discountElement) return 0;
    
    // Extract numeric value from price string (e.g., "₦25.00" -> 25)
    const discountText = discountElement.textContent.replace(/[^0-9.]/g, '');
    return parseFloat(discountText);
  });
  
  // Calculate expected discount
  let expectedDiscount;
  if (voucher.type === 'percentage') {
    expectedDiscount = subtotal * (voucher.value / 100);
    if (voucher.maxDiscount && expectedDiscount > voucher.maxDiscount) {
      expectedDiscount = voucher.maxDiscount;
    }
  } else {
    expectedDiscount = voucher.value;
  }
  
  // Check if discount is correct (allow for small rounding differences)
  const isDiscountCorrect = Math.abs(discountAmount - expectedDiscount) < 0.01;
  
  if (isDiscountCorrect) {
    log(`Discount amount verification passed: Expected=${expectedDiscount}, Actual=${discountAmount}`);
    return true;
  } else {
    log(`Discount amount verification failed: Expected=${expectedDiscount}, Actual=${discountAmount}`);
    return false;
  }
}

// Complete checkout process
async function completeCheckout(page) {
  // Click on proceed to checkout
  log('Proceeding to checkout...');
  await page.click('button:contains("Proceed to checkout")');
  
  // Wait for checkout page
  await page.waitForSelector('.checkout-page');
  
  // Select delivery address if needed
  const needsAddress = await page.evaluate(() => {
    return document.querySelector('.address-selection') !== null;
  });
  
  if (needsAddress) {
    // Select the first address or add a new one
    const hasAddresses = await page.evaluate(() => {
      return document.querySelectorAll('.address-card').length > 0;
    });
    
    if (hasAddresses) {
      log('Selecting first available address...');
      await page.click('.address-card:first-child input[type="radio"]');
    } else {
      log('No addresses found, adding a new address...');
      await page.click('button:contains("Add new address")');
      
      // Fill address form
      await page.waitForSelector('.address-form');
      await page.type('input[name="fullName"]', 'Test User');
      await page.type('input[name="phone"]', '08012345678');
      await page.type('input[name="address"]', '123 Test Street');
      await page.type('input[name="city"]', 'Lagos');
      await page.type('input[name="state"]', 'Lagos');
      
      // Save address
      await page.click('button:contains("Save Address")');
      await page.waitForSelector('.address-card input[type="radio"]');
      await page.click('.address-card:first-child input[type="radio"]');
    }
  }
  
  // Select payment method
  log('Selecting payment method...');
  await page.click('.payment-method-card:first-child');
  
  // Complete order
  log('Completing order...');
  await Promise.all([
    page.click('button:contains("Complete Order")'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
  
  // Check if we reached the order confirmation page
  const isOrderConfirmed = await page.evaluate(() => {
    return document.querySelector('.order-confirmation') !== null;
  });
  
  if (isOrderConfirmed) {
    log('Order placed successfully with voucher applied');
    return true;
  } else {
    log('Failed to complete the order');
    return false;
  }
}

// Verify order details in order history
async function verifyOrderHistory(page) {
  // Navigate to order history
  log('Checking order history...');
  await page.goto(`${config.baseUrl}/account/orders`);
  
  // Wait for orders to load
  await page.waitForSelector('.orders-list');
  
  // Click on the first/most recent order
  await Promise.all([
    page.click('.order-item:first-child'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
  
  // Check if discount is shown in the order details
  const discountShown = await page.evaluate(() => {
    const discountElement = document.querySelector('.order-summary .discount');
    return discountElement !== null;
  });
  
  if (discountShown) {
    log('Order history shows the applied voucher discount');
    return true;
  } else {
    log('Order history does not show the applied voucher discount');
    return false;
  }
}

// Main test function
async function runVoucherCheckoutTest() {
  let browser;
  let page;
  
  try {
    log('=== Starting Voucher Checkout Integration Test ===');
    log(`Config: Base URL = ${config.baseUrl}, API URL = ${config.apiUrl}, Mock Data = ${config.useMockData}`);
    
    // Start browser
    const browserInstance = await startBrowser();
    browser = browserInstance.browser;
    page = browserInstance.page;
    
    // Login
    await login(page);
    
    // Clear existing cart
    log('Clearing existing cart...');
    await page.goto(`${config.baseUrl}/cart`);
    
    const clearCartVisible = await page.evaluate(() => {
      const clearButton = document.querySelector('button:contains("Clear Cart")');
      return clearButton !== null && clearButton.style.display !== 'none';
    });
    
    if (clearCartVisible) {
      await page.click('button:contains("Clear Cart")');
      await page.waitForFunction(
        () => document.querySelectorAll('.cart-item').length === 0,
        { timeout: 5000 }
      );
    }
    
    // Add product to cart
    await addProductToCart(page);
    
    // Test first voucher (WELCOME10)
    const voucherCode = config.testVouchers[0].code;
    const voucherApplied = await applyVoucherInCart(page, voucherCode);
    
    if (voucherApplied) {
      // Verify discount calculation
      const discountVerified = await verifyDiscount(page, voucherCode);
      
      if (discountVerified) {
        // Complete checkout process
        const checkoutCompleted = await completeCheckout(page);
        
        if (checkoutCompleted) {
          // Verify order history
          const orderVerified = await verifyOrderHistory(page);
          
          if (orderVerified) {
            log('=== Voucher Checkout Integration Test PASSED ===');
          } else {
            log('=== Voucher Checkout Integration Test FAILED: Order history verification failed ===');
          }
        } else {
          log('=== Voucher Checkout Integration Test FAILED: Checkout process failed ===');
        }
      } else {
        log('=== Voucher Checkout Integration Test FAILED: Discount verification failed ===');
      }
    } else {
      log('=== Voucher Checkout Integration Test FAILED: Voucher application failed ===');
    }
  } catch (error) {
    logError('Test execution', error);
    log('=== Voucher Checkout Integration Test FAILED with error ===');
  } finally {
    // Take a screenshot before closing
    if (page) {
      await page.screenshot({
        path: path.join(logDir, 'voucher-checkout-result.png'),
        fullPage: true
      });
    }
    
    // Close the browser
    if (browser) {
      await browser.close();
    }
    
    log('Test completed. See log file for details.');
  }
}

// Run the test
runVoucherCheckoutTest().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
