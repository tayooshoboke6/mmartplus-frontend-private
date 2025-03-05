# Voucher System Troubleshooting Guide

This guide provides solutions for common issues that may arise with the voucher system in the M-Mart+ application. It's intended for administrators and support staff who need to diagnose and fix issues with vouchers.

## Table of Contents

1. [Common Issues and Solutions](#common-issues-and-solutions)
2. [API Error Codes](#api-error-codes)
3. [Validation Failures](#validation-failures)
4. [Monitoring and Debugging](#monitoring-and-debugging)
5. [Rollback Procedures](#rollback-procedures)

## Common Issues and Solutions

### Issue: Voucher Not Applying to Cart

**Symptoms:**
- Customer reports entering a valid voucher code but no discount appears
- API call to `/vouchers/validate` succeeds but discount doesn't show

**Possible Causes and Solutions:**

1. **Minimum Purchase Requirement Not Met**
   - **Check:** Verify the voucher's minimum purchase amount vs. the cart subtotal
   - **Solution:** Inform the customer of the minimum purchase requirement

2. **Product Category Restrictions**
   - **Check:** Verify if the voucher has category restrictions that exclude items in the cart
   - **Solution:** Inform the customer which items are not eligible for the voucher

3. **Customer Eligibility Issues**
   - **Check:** Verify if the voucher is restricted to specific customer groups
   - **Solution:** Confirm customer account status and eligibility

4. **Frontend Calculation Error**
   - **Check:** Compare the API response with what's displayed in the UI
   - **Solution:** Clear browser cache or guide customer to refresh the page

### Issue: Voucher Shows as Invalid When It Should Be Valid

**Symptoms:**
- Valid voucher code returns error when entered
- Error message indicates the voucher is invalid or expired

**Possible Causes and Solutions:**

1. **Case Sensitivity**
   - **Check:** Verify if the customer entered the code with correct capitalization
   - **Solution:** Update validation to be case-insensitive or instruct customer on correct format

2. **Whitespace Issues**
   - **Check:** Look for leading/trailing spaces in the voucher code input
   - **Solution:** Trim whitespace from inputs before validation

3. **Activation Date Not Reached**
   - **Check:** Verify if the voucher has a future activation date
   - **Solution:** Inform customer when the voucher will become active

4. **Database Inconsistency**
   - **Check:** Verify voucher status in the admin panel vs. database
   - **Solution:** Manually update the voucher status if there's a discrepancy

### Issue: Excessive Voucher Usage

**Symptoms:**
- Voucher with usage limits being applied more times than the limit
- Analytics show unusual spike in voucher redemptions

**Possible Causes and Solutions:**

1. **Race Condition**
   - **Check:** Look for concurrent API calls validating the same voucher
   - **Solution:** Enable the usage limit middleware in API configuration

2. **Caching Issues**
   - **Check:** Verify if voucher status is being properly updated in cache
   - **Solution:** Clear the system cache or adjust cache TTL settings

3. **Multiple Accounts**
   - **Check:** Check if the same voucher is being used across multiple accounts
   - **Solution:** Add account-based restrictions if needed

### Issue: Discount Amount Incorrect

**Symptoms:**
- Voucher applies but shows wrong discount amount
- Order total doesn't reflect the expected discount

**Possible Causes and Solutions:**

1. **Calculation Logic Error**
   - **Check:** Review the discount calculation formula for percentage/fixed discounts
   - **Solution:** Verify calculations match the business rules for that voucher type

2. **Tax Application Order**
   - **Check:** Verify if discount is applied before or after tax as expected
   - **Solution:** Adjust the calculation sequence in the order processing pipeline

3. **Rounding Errors**
   - **Check:** Look for decimal/rounding inconsistencies
   - **Solution:** Standardize rounding to 2 decimal places throughout the application

## API Error Codes

When troubleshooting voucher issues, refer to these API error codes returned by the voucher endpoints:

| Code | Description | Resolution |
|------|-------------|------------|
| `VOUCHER_INVALID` | Voucher code doesn't exist | Verify code against admin dashboard |
| `VOUCHER_EXPIRED` | Voucher is past expiration date | Check expiration date in admin panel |
| `VOUCHER_NOT_ACTIVE` | Voucher exists but is not active | Activate voucher in admin panel |
| `VOUCHER_USAGE_EXCEEDED` | Usage limit reached | Check usage count in admin dashboard |
| `VOUCHER_MIN_AMOUNT` | Cart total below minimum | Inform customer of minimum purchase requirement |
| `VOUCHER_CATEGORY_RESTRICTED` | Some products don't qualify | Verify product category eligibility |
| `VOUCHER_USER_RESTRICTED` | User not eligible | Check user group restrictions |
| `VOUCHER_ALREADY_USED` | User already used this voucher | Verify user's voucher usage history |

## Validation Failures

If voucher validation is failing, check these common validation points:

### Frontend Validation

1. **Format Validation**
   - Voucher codes should match the pattern: `/^[A-Z0-9_-]{3,16}$/`
   - Check for invalid characters or length issues

2. **Client-Side Checks**
   - Minimum cart value check should match server logic
   - Ensure correct subtotal is being sent to API

### Backend Validation

1. **Database Constraints**
   - Ensure voucher fields match expected types
   - Check for NULL values in critical fields

2. **Business Rule Validation**
   - Time-based restrictions (day of week, time of day)
   - Combination restrictions (can't be used with other vouchers)

## Monitoring and Debugging

To diagnose voucher issues in real-time:

### Admin Dashboard Monitoring

1. Access the Voucher API Monitor in the admin dashboard
   - Navigate to: Admin > System > API Monitor > Vouchers
   - Check for patterns of errors or slow responses

2. Review the most recent errors
   - Filter by voucher code to isolate specific issues
   - Look for timing correlations with customer reports

### Browser Console Debugging

Guide customers or support staff to check browser console:

1. Open developer tools (F12 in most browsers)
2. Go to the Console tab
3. Enter this debug command:
   ```javascript
   localStorage.setItem('debugVoucherApi', 'true');
   ```
4. Refresh the page and attempt to use the voucher again
5. Review console output for detailed error information

### Server Logs

For backend issues, check these log locations:

1. API request logs: `/var/log/mmart/api-requests.log`
2. Voucher service logs: `/var/log/mmart/voucher-service.log`
3. Error logs: `/var/log/mmart/errors.log`

## Rollback Procedures

If a critical voucher issue occurs in production, follow these rollback steps:

### Emergency Voucher Deactivation

1. Access the Admin Dashboard
2. Navigate to Promotions > Vouchers
3. Select the problematic voucher
4. Click "Deactivate" to immediately disable it
5. Optionally add a note explaining the deactivation reason

### System-Wide Voucher Disable

In case of widespread issues:

1. Access the System Configuration panel
2. Navigate to Features > Checkout
3. Toggle "Enable Vouchers" to OFF
4. Save changes
5. Monitor system for 15 minutes to ensure stability

### Rollback Communication

After implementing a rollback:

1. Notify the customer service team about the issue and expected resolution time
2. Update the status page if customer-facing
3. Document the incident for post-mortem analysis

---

## Need Further Assistance?

If you're unable to resolve a voucher issue using this guide:

1. Open a support ticket in the internal help desk
2. Include the voucher code, affected user(s), and detailed error information
3. Specify any troubleshooting steps already attempted
4. Mark as "Urgent" if the issue is affecting multiple customers

For critical production issues, contact the on-call developer via the emergency contact information.
