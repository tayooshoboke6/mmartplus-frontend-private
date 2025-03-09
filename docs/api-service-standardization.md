# API Service Standardization Documentation

## Overview

This document outlines the standardization of API service files in the M-Mart+ frontend project. This standardization ensures consistent API interactions across the application, proper mock API interception during development, and secure authentication using HTTP-only cookies.

## Updated Service Files

The following service files have been updated to use axios directly instead of the custom API service:

1. `authService.ts` - Authentication operations (login, register, logout)
2. `productService.ts` - Product-related operations
3. `categoryService.ts` - Category management operations
4. `cartService.ts` - Shopping cart operations
5. `orderService.ts` - Order processing and management
6. `imageService.ts` - Image upload and management
7. `wishlistService.ts` - User wishlist management
8. `walletService.ts` - Wallet operations
9. `recentlyViewedService.ts` - Recently viewed products tracking
10. `inboxService.ts` - User inbox and notifications
11. `AddressService.ts` - User address management
12. `PaystackService.ts` - Payment method operations
13. `VoucherService.ts` - Voucher and discount management

## Service Files Using Mock Data (No Updates Required)

The following service files use mock data with simulated API delays rather than making actual API calls, so they didn't need to be updated:

1. `ProductSectionService.ts`
2. `PromotionService.ts`
3. `StoreAddressService.ts`
4. `emailVerificationService.ts`
5. `adminMessageService.ts`
6. `PaymentService.ts`

## Standardization Approach

For all updated service files, we implemented the following consistent patterns:

### 1. Direct Axios Import

Imported axios directly instead of using the custom API service:

```typescript
import axios from 'axios';
```

### 2. Base URL Configuration

Used the centralized config for API base URL:

```typescript
import config from '../config';
// ...
const response = await axios.get(`${config.api.baseUrl}/endpoint`, {...});
```

### 3. HTTP-only Cookie Support

Added `withCredentials: true` to all axios requests:

```typescript
await axios.post(`${config.api.baseUrl}/auth/login`, credentials, {
  withCredentials: true
});
```

### 4. Consistent Error Handling

Maintained consistent error handling patterns across all services:

```typescript
try {
  // API call
} catch (error) {
  console.error('Error message:', error);
  // Appropriate error handling
}
```

### 5. Mock Data Support

Ensured proper mock API interception during development:

```typescript
if (import.meta.env.DEV && config.features.useMockData) {
  // Mock data handling
}
```

## Benefits of This Standardization

1. **Improved Security**: HTTP-only cookies for authentication protect against XSS attacks
2. **Better Development Experience**: Proper mock API interception during development
3. **Consistency**: Uniform API calling patterns across the entire application
4. **Maintainability**: Easier to understand and modify service files
5. **Reliability**: Same code works in both development and production environments
6. **Simplified Components**: No conditional code or environment checks needed in components

## Implementation Example

Below is an example of how a service file was updated to follow the standardized approach:

### Before:

```typescript
import { api } from '../utils/apiClient';

export const exampleService = {
  getData: async () => {
    try {
      const response = await api.get('/data');
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
};
```

### After:

```typescript
import axios from 'axios';
import config from '../config';

export const exampleService = {
  getData: async () => {
    try {
      const response = await axios.get(`${config.api.baseUrl}/data`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
};
```

## Conclusion

This standardization completes an important architectural improvement to the M-Mart+ frontend, making the codebase more robust, secure, and maintainable. All service files now follow a consistent pattern, ensuring proper mock API interception during development and secure authentication using HTTP-only cookies.
