# M-Mart+ Mock API

This directory contains a temporary mock API implementation to simulate backend responses until the actual backend is ready.

## Overview

The mock API uses [Mock Service Worker (MSW)](https://mswjs.io/) to intercept API requests at the network level and provide mock responses. This allows the frontend to work without an actual backend, making development and testing easier.

## Features

- Simulates all planned backend endpoints (`/auth/register`, `/products`, `/orders`, etc.)
- Provides realistic mock data for products, categories, orders, and users
- Implements authentication flow with login, logout, and user roles (user, admin)
- Uses HTTP-only cookies for authentication (simulated)
- Supports all CRUD operations for main resources

## Structure

- `index.ts` - Main entry point for the mock API
- `browser.ts` - MSW browser setup
- `handlers.ts` - API request handlers and response definitions
- `data/` - Mock data and helper functions
  - `users.ts` - User data and authentication
  - `products.ts` - Product data and operations
  - `categories.ts` - Category data and operations
  - `orders.ts` - Order data and operations

## Usage

The mock API is automatically initialized when the application starts in development mode if the `VITE_USE_MOCK_API` environment variable is set to `true`.

To use the mock API in your service files, you can use the `mockAPI` utility:

```typescript
import { mockAPI } from '../utils/mockAPI';

// Example usage
const getProducts = async () => {
  try {
    const response = await mockAPI.get('/products');
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
```

Alternatively, you can continue using axios directly as per our standardized API service architecture, and the mock API will intercept the requests:

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

## Available Mock Users

The mock API comes with two pre-defined users:

1. **Admin User**
   - Email: admin@mmart.com
   - Password: admin123
   - Role: admin

2. **Regular User**
   - Email: user@example.com
   - Password: password123
   - Role: user

## Environment Setup

To enable the mock API, add the following to your `.env.local` file:

```
VITE_USE_MOCK_API=true
```

## Adding New Mock Data

To add new mock data or endpoints:

1. Add new data models and mock data to the appropriate file in the `data/` directory
2. Add new request handlers in `handlers.ts`
3. Test the new endpoints using the browser's network tab or by calling them from your components

## Limitations

- The mock API stores data in memory, so data will be reset when the page is refreshed
- Some complex backend logic may be simplified in the mock implementation
- File uploads are simulated and don't actually store files
