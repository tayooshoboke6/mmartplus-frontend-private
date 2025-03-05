# Voucher Testing API Configuration

## Overview
This document provides instructions on how to switch between mock data and live API testing for the voucher checkout integration in the M-Mart+ application.

## Mock Data vs. Live API

### Mock Data Mode
- Uses frontend-generated mock responses for API calls
- Allows testing without a running backend
- Provides consistent, predetermined responses
- Useful for frontend UI testing and development

### Live API Mode
- Makes real HTTP requests to the backend API
- Tests the complete integrated system
- Validates actual backend implementation
- Required for final validation before deployment

## Switching Between Modes

### Method 1: Using the Browser Console

1. Open your browser's developer tools (F12 or Right-click > Inspect)
2. Go to the Console tab
3. Load the testing utility by running:
   ```javascript
   // Import the voucher API utilities
   import('/testing/voucher-api-utils.js')
   ```

4. Use the following commands:
   - To enable mock data mode:
     ```javascript
     VoucherTestUtils.enableMockData()
     ```
   - To disable mock data mode (use live API):
     ```javascript
     VoucherTestUtils.disableMockData()
     ```
   - To check current status:
     ```javascript
     VoucherTestUtils.checkMockDataStatus()
     ```
   - To enable API response debugging:
     ```javascript
     VoucherTestUtils.toggleApiDebugMode()
     ```
   - To reset to default settings:
     ```javascript
     VoucherTestUtils.resetDevSettings()
     ```

5. Refresh the page after changing settings

### Method 2: Using localStorage Directly

1. Open your browser's developer tools (F12 or Right-click > Inspect)
2. Go to the Console tab
3. To enable mock data mode:
   ```javascript
   localStorage.setItem('useMockDataOnFailure', 'true')
   ```
4. To disable mock data mode (use live API):
   ```javascript
   localStorage.setItem('useMockDataOnFailure', 'false')
   ```
5. Refresh the page after changing settings

### Method 3: Modifying config.ts (Permanent Change)

1. Open `src/config.ts`
2. Locate the `useMockData` feature flag:
   ```typescript
   features: {
     useMockData: import.meta.env.DEV && (localStorage.getItem('useMockDataOnFailure') !== 'false'),
     ...
   }
   ```
3. For development environments, this setting respects the localStorage flag
4. In production environments, mock data is always disabled

## Verifying Current Mode

You can verify whether you're using mock data or the live API by:

1. Opening the browser console
2. Running:
   ```javascript
   VoucherTestUtils.checkMockDataStatus()
   ```

Alternatively, with API debug mode enabled, you'll see all API requests and responses logged to the console, which will indicate the source of the data.

## Testing API Endpoints

To test the voucher API endpoints directly:

1. Open your browser's developer tools
2. Go to the Console tab
3. Import the utilities and run the test function:
   ```javascript
   import('/testing/voucher-api-utils.js').then(() => {
     VoucherTestUtils.testVoucherApiEndpoints()
   })
   ```

This will attempt to call both the voucher validation and application endpoints and log the results.

## Recommended Testing Flow

1. Start with mock data mode enabled to verify frontend implementation
2. Run the automated test scripts (`voucher-validation.js` and `voucher-order-application.js`)
3. Complete manual testing using the testing checklist with mock data
4. Switch to live API mode
5. Repeat key tests to verify backend integration
6. Document any discrepancies between mock and live implementations

## Troubleshooting

If you encounter issues:

1. Check the browser console for errors
2. Verify your backend API is running and accessible
3. Ensure endpoints match the expected format
4. Check network requests in the Network tab to see actual API calls
5. Try resetting to default settings using `VoucherTestUtils.resetDevSettings()`
