# M-Mart+ Validation Testing Guide

This guide provides instructions for running the validation tests for the M-Mart+ admin dashboard features.

## Prerequisites

- Backend server running locally at http://localhost:8000 or configured in your environment variables
- Admin user credentials for testing
- Node.js installed for frontend tests

## Available Test Scripts

### Backend API Validation

These PHP scripts test the backend API directly within the Laravel environment.

1. **Product Sections API Validation**
   - Script: `tests/product-sections-api-validation.php`
   - Run: `php tests/product-sections-api-validation.php`
   - Tests: CRUD operations, status toggling, and reordering for product sections

2. **Promotions API Validation**
   - Script: `tests/promotions-api-validation.php`
   - Run: `php tests/promotions-api-validation.php`
   - Tests: Banner and notification bar CRUD operations and status toggling

### Frontend UI Validation

These JavaScript files test the frontend services and their integration with the backend API.

1. **Product Sections UI Validation**
   - Script: `testing/product-sections-ui-validation.js`
   - Run: `node testing/product-sections-ui-validation.js`
   - Requirements: Configure the admin credentials in the script before running

2. **Promotions UI Validation**
   - Script: `testing/promotions-ui-validation.js`
   - Run: `node testing/promotions-ui-validation.js`
   - Requirements: Configure the admin credentials in the script before running

3. **Categories Validation**
   - Documentation: `testing/admin-categories-validation.md`
   - Manual test procedures outlined in the documentation

## Running a Full Validation Test

### Step 1: Backend API Validation

1. Start in the backend project directory:
   ```
   cd C:\Users\ITAdmin\Documents\mmartplus-backend
   ```

2. Run the Product Sections validation:
   ```
   php tests/product-sections-api-validation.php
   ```

3. Run the Promotions validation:
   ```
   php tests/promotions-api-validation.php
   ```

4. Verify that both tests complete successfully without errors

### Step 2: Frontend Service Validation

1. Start in the frontend project directory:
   ```
   cd C:\Users\ITAdmin\Documents\mmartplus-fe
   ```

2. Install dependencies if needed:
   ```
   npm install node-fetch
   ```

3. Run the Product Sections UI validation:
   ```
   node testing/product-sections-ui-validation.js
   ```

4. Run the Promotions UI validation:
   ```
   node testing/promotions-ui-validation.js
   ```

5. Check for any failures in the test output

### Step 3: Manual UI Testing

After automated tests, perform these manual validations:

1. **Product Sections**
   - Log in to admin dashboard
   - Navigate to Product Sections page
   - Verify you can create a new section
   - Test reordering using drag and drop
   - Toggle status and verify it updates in real-time
   - Check the storefront to confirm sections display correctly

2. **Promotions**
   - Navigate to Promotions page in admin
   - Test banner creation with image upload
   - Verify notification bar updates
   - Toggle status for both banners and notification bar
   - Check storefront to confirm only active items display

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify admin credentials in test scripts
   - Check that your API is running and accessible
   - Confirm the token is being properly included in requests

2. **API Connection Problems**
   - Verify the API URL in test scripts
   - Check CORS settings if testing from a different domain
   - Ensure your local development server is running

3. **Test Data Conflicts**
   - If tests fail unexpectedly, check for conflicting test data
   - The scripts attempt to clean up after themselves, but may leave residual data if they crash

### Getting Help

If you encounter issues with the validation scripts:

1. Check the console output for specific error messages
2. Review the implementation documentation in the `docs` folder
3. Examine the API responses directly using a tool like Postman

## Next Steps After Validation

Once all tests pass successfully:

1. Update the implementation status in `docs/features-implementation-status.md`
2. Proceed to testing the next feature (Vouchers recommended)
3. Create any additional test scripts needed for comprehensive coverage
