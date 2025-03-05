# Voucher Checkout Integration - Manual Testing Checklist

## Overview
This document outlines the manual testing steps for verifying the complete voucher application and checkout flow in the M-Mart+ application. It covers both the customer frontend and admin backend aspects of the voucher system.

## Prerequisites
- Access to M-Mart+ admin account
- Access to M-Mart+ customer account
- Test voucher codes (WELCOME10, FLAT20, etc.)
- Test payment method (test card, wallet balance, etc.)

## Test Environment
- Browser: Chrome, Firefox, Safari, Edge
- Devices: Desktop, tablet, mobile
- Network conditions: Regular, slow connection

## 1. Voucher Creation & Management (Admin)

### 1.1 Create Test Vouchers
- [ ] Log in to admin dashboard
- [ ] Navigate to Voucher Management page
- [ ] Create percentage-based voucher (e.g., 10% off with minimum purchase)
- [ ] Create fixed-amount voucher (e.g., ₦2000 off with minimum purchase)
- [ ] Create voucher with usage limit (e.g., max 5 uses)
- [ ] Create time-limited voucher (valid for next 24 hours only)
- [ ] Create voucher with maximum discount cap (e.g., up to ₦5000)

### 1.2 Edit Vouchers
- [ ] Edit an existing voucher to change discount amount
- [ ] Edit an existing voucher to change validity period
- [ ] Edit an existing voucher to change minimum purchase requirement
- [ ] Verify changes are saved correctly

### 1.3 Toggle Voucher Status
- [ ] Activate an inactive voucher
- [ ] Deactivate an active voucher
- [ ] Verify status changes immediately

### 1.4 Generate Bulk Vouchers
- [ ] Use bulk generation tool to create 10 vouchers
- [ ] Verify all generated vouchers appear in the list
- [ ] Verify each has unique code but same parameters

### 1.5 Delete Vouchers
- [ ] Delete a voucher that has not been used
- [ ] Attempt to delete a voucher that has been used (should show warning)

## 2. Voucher Application (Customer)

### 2.1 Empty Cart Validation
- [ ] Navigate to an empty cart
- [ ] Check if voucher input field is available
- [ ] Enter valid voucher code
- [ ] Verify appropriate error message appears (cart is empty)

### 2.2 Below Minimum Purchase Validation
- [ ] Add product(s) below minimum purchase requirement
- [ ] Enter voucher code with higher minimum purchase
- [ ] Verify error message shows minimum purchase requirement
- [ ] Add more products to meet minimum purchase
- [ ] Apply same voucher code
- [ ] Verify voucher is now applied successfully

### 2.3 Percentage Discount Voucher Application
- [ ] Add products to cart
- [ ] Apply percentage discount voucher (e.g., WELCOME10)
- [ ] Verify discount amount is correctly calculated (10% of subtotal)
- [ ] Verify discount is displayed in order summary
- [ ] Verify total price is updated correctly (subtotal - discount)

### 2.4 Fixed Amount Discount Voucher Application
- [ ] Add products to cart
- [ ] Apply fixed amount voucher (e.g., FLAT20)
- [ ] Verify discount amount is exactly the fixed amount
- [ ] Verify discount is displayed in order summary
- [ ] Verify total price is updated correctly (subtotal - discount)

### 2.5 Maximum Discount Cap
- [ ] Add expensive products to reach high subtotal
- [ ] Apply percentage voucher with maximum cap
- [ ] Verify discount is capped at maximum amount
- [ ] Verify order summary shows correct discount

### 2.6 Voucher Removal
- [ ] Apply a valid voucher
- [ ] Click "Remove" button
- [ ] Verify discount is removed
- [ ] Verify total is recalculated without discount
- [ ] Verify voucher input field is cleared/reset

### 2.7 Invalid/Expired Voucher
- [ ] Enter invalid voucher code
- [ ] Verify error message appears
- [ ] Enter expired voucher code
- [ ] Verify appropriate error message appears

### 2.8 Voucher Usage Limit
- [ ] Use a voucher with limited usage count
- [ ] Complete checkout with that voucher
- [ ] Try to use the same voucher again after its usage limit is reached
- [ ] Verify appropriate error message appears

## 3. Checkout Integration

### 3.1 Voucher Persistence During Checkout
- [ ] Apply voucher in cart
- [ ] Proceed to checkout
- [ ] Verify voucher discount is still applied in checkout page
- [ ] Navigate back to cart and then to checkout again
- [ ] Verify voucher is still applied

### 3.2 Address Selection with Voucher
- [ ] Apply voucher in cart
- [ ] Proceed to checkout
- [ ] Select/change delivery address
- [ ] Verify voucher discount remains applied

### 3.3 Payment Method Selection with Voucher
- [ ] Apply voucher in cart
- [ ] Proceed to checkout
- [ ] Select different payment methods
- [ ] Verify voucher discount remains applied with each payment method

### 3.4 Order Placement with Voucher
- [ ] Apply voucher in cart
- [ ] Complete checkout process
- [ ] Verify order confirmation page shows voucher discount
- [ ] Verify order total is correctly calculated with discount

### 3.5 Order History Verification
- [ ] Place order with voucher applied
- [ ] Navigate to order history
- [ ] View the placed order details
- [ ] Verify order details show applied voucher and discount amount
- [ ] Verify order total reflects the discount

## 4. Edge Cases & Error Handling

### 4.1 Session Handling
- [ ] Apply voucher
- [ ] Log out and log back in
- [ ] Verify cart maintains the voucher (if store maintains cart in session)

### 4.2 Multiple Voucher Handling
- [ ] Apply one voucher
- [ ] Attempt to apply a second voucher
- [ ] Verify system behavior (either replace first voucher or show appropriate message)

### 4.3 Networking Issues
- [ ] Simulate slow connection (using browser tools)
- [ ] Apply voucher
- [ ] Verify loading indicator appears
- [ ] Verify appropriate error handling if request times out

### 4.4 Concurrent Cart Updates
- [ ] Apply voucher
- [ ] Immediately add/remove products
- [ ] Verify voucher status updates correctly with new cart total

### 4.5 Browser Refresh Handling
- [ ] Apply voucher
- [ ] Refresh the page
- [ ] Verify voucher remains applied

## 5. API Testing (Backend)

### 5.1 Voucher Validation API
- [ ] Use API testing tool (Postman/Insomnia)
- [ ] Send request to `/vouchers/validate` endpoint with valid code
- [ ] Verify response format and data
- [ ] Test with invalid code
- [ ] Verify appropriate error response

### 5.2 Apply Voucher API
- [ ] Use API testing tool
- [ ] Send request to `/orders/apply-voucher` endpoint
- [ ] Verify successful application response
- [ ] Test with already used voucher
- [ ] Verify appropriate error response

## Test Results Summary

| Test Category | Status | Issues Found | Notes |
|---------------|--------|--------------|-------|
| Voucher Creation |  |  |  |
| Voucher Application |  |  |  |
| Checkout Integration |  |  |  |
| Edge Cases |  |  |  |
| API Testing |  |  |  |

## Overall Status
- [ ] PASS: All tests passed successfully
- [ ] CONDITIONAL PASS: Minor issues found but not blocking
- [ ] FAIL: Critical issues found that need fixing

## Notes and Recommendations
*Add any observations, issues, or recommendations here after completing testing*
