# M-Mart+ Mock API Implementation

This document provides a comprehensive overview of the temporary mock API implementation for the M-Mart+ frontend project.

## Overview

The M-Mart+ frontend requires API data for various components to function properly. However, since the actual backend is still under development, we've implemented a temporary mock API solution to simulate backend responses. This allows frontend development to proceed without waiting for the backend to be completed.

## Implementation Details

### Technology Stack

- **Mock Service Worker (MSW)**: A library that intercepts API requests at the network level and provides mock responses.
- **TypeScript**: Used for type safety and better developer experience.
- **HTTP-only Cookies**: Simulated for authentication to match our production security approach.

### Directory Structure

```
src/
├── mocks/
│   ├── data/
│   │   ├── users.ts       # User data and authentication functions
│   │   ├── products.ts    # Product data and CRUD operations
│   │   ├── categories.ts  # Category data and operations
│   │   └── orders.ts      # Order data and operations
│   ├── browser.ts         # MSW browser setup
│   ├── handlers.ts        # API request handlers
│   ├── index.ts           # Main entry point
│   └── README.md          # Documentation
└── utils/
    └── mockAPI.ts         # API client utility
```

### Mock Data

The mock API includes realistic data for:

1. **Users**: Admin and regular user accounts with appropriate permissions
2. **Products**: Various products with details like name, price, description, and images
3. **Categories**: Product categories with parent-child relationships
4. **Orders**: Order history with status tracking and payment information

### API Endpoints

The mock API implements the following endpoints:

#### Authentication

- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `POST /api/auth/logout`: User logout
- `GET /api/auth/me`: Get current user information

#### Products

- `GET /api/products`: Get all products (with optional category filtering)
- `GET /api/products/:id`: Get product by ID
- `POST /api/products`: Create new product (admin only)
- `PUT /api/products/:id`: Update product (admin only)
- `DELETE /api/products/:id`: Delete product (admin only)

#### Categories

- `GET /api/categories`: Get all categories
- `GET /api/categories/parent`: Get parent categories
- `GET /api/categories/:id`: Get category by ID
- `GET /api/categories/:id/subcategories`: Get subcategories for a parent category

#### Orders

- `GET /api/orders`: Get all orders (admin) or user orders (regular user)
- `GET /api/orders/:id`: Get order by ID
- `POST /api/orders`: Create new order
- `PATCH /api/orders/:id/status`: Update order status (admin only)
- `PATCH /api/orders/:id/payment`: Update payment status

### Authentication Flow

The mock API simulates a secure authentication flow using HTTP-only cookies:

1. When a user logs in or registers, the API generates mock access and refresh tokens
2. These tokens are sent back in HTTP-only cookies
3. Subsequent requests include these cookies for authentication
4. The API validates the tokens and provides appropriate responses based on user roles

### Role-Based Access Control

The mock API implements role-based access control with two main roles:

1. **Admin**: Can access and modify all resources
2. **Regular User**: Can only access and modify their own resources

### Integration with Frontend

The mock API is designed to work seamlessly with our existing frontend code:

1. **Automatic Initialization**: The mock API is automatically initialized when the application starts in development mode if the `VITE_USE_MOCK_API` environment variable is set to `true`.

2. **Transparent Interception**: All axios requests from service files are intercepted by MSW, so no code changes are required in the frontend components.

3. **Consistent Response Format**: The mock API follows the same response format as the planned actual API:

```typescript
{
  success: boolean;
  data?: {
    [key: string]: any;
  };
  message?: string;
}
```

## Usage Guide

### Enabling the Mock API

Add the following to your `.env.local` file:

```
VITE_USE_MOCK_API=true
```

### Available Mock Users

1. **Admin User**
   - Email: admin@mmart.com
   - Password: admin123
   - Role: admin

2. **Regular User**
   - Email: user@example.com
   - Password: password123
   - Role: user

### Using in Service Files

You can continue using axios directly as per our standardized API service architecture:

```typescript
import axios from 'axios';
import config from '../config';

const getProducts = async () => {
  try {
    const response = await axios.get(`${config.api.baseUrl}/products`, {
      withCredentials: true
    });
    return response.data.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
```

### Testing the Mock API

You can test the mock API by:

1. Opening the browser's developer tools
2. Going to the Network tab
3. Interacting with the application
4. Observing the API requests and responses

### Limitations

- The mock API stores data in memory, so data will be reset when the page is refreshed
- Some complex backend logic may be simplified in the mock implementation
- File uploads are simulated and don't actually store files

## Extending the Mock API

### Adding New Data

To add new mock data:

1. Create or update the appropriate file in the `src/mocks/data/` directory
2. Define interfaces for your data types
3. Create an array of mock data
4. Implement helper functions for CRUD operations

Example:

```typescript
// src/mocks/data/reviews.ts
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: '2',
    rating: 5,
    comment: 'Great product!',
    createdAt: '2025-01-15T10:30:00Z'
  },
  // More reviews...
];

// Helper functions
export const getProductReviews = (productId: string): Review[] => {
  return reviews.filter(review => review.productId === productId);
};

// More helper functions...
```

### Adding New Endpoints

To add new API endpoints:

1. Update the `src/mocks/handlers.ts` file
2. Add new request handlers for your endpoints
3. Implement the appropriate logic and responses

Example:

```typescript
// In src/mocks/handlers.ts
// Add to the handlers array:

http.get(`${config.api.baseUrl}/products/:id/reviews`, async ({ params }) => {
  await delay(300); // Simulate network delay
  
  const reviews = getProductReviews(params.id as string);
  
  return HttpResponse.json({
    success: true,
    data: {
      reviews,
      total: reviews.length
    }
  });
}),
```

## Transition Plan

When the actual backend is ready:

1. Set `VITE_USE_MOCK_API=false` in your environment
2. Verify that all API calls work correctly with the real backend
3. Make any necessary adjustments to service files if the actual API differs from the mock
4. Eventually, the mock API code can be removed or kept for testing purposes

## Conclusion

The mock API implementation provides a temporary solution that allows frontend development to proceed without waiting for the backend. It simulates all the planned API endpoints and provides realistic data for testing and development purposes.

By using MSW to intercept network requests, we've created a seamless experience that requires minimal changes to the frontend code and will make the transition to the actual backend as smooth as possible.
