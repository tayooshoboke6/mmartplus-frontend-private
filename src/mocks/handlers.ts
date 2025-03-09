import { http, HttpResponse, delay } from 'msw';
import config from '../config';
import { users, findUserByEmail, findUserById, createUser, updateUser } from './data/users';
import { products, getAllProducts, getProductById, getProductsByCategory, createProduct, updateProduct, deleteProduct } from './data/products';
import { categories, getAllCategories, getCategoryById, getParentCategories, getSubcategories, createCategory, updateCategory, deleteCategory } from './data/categories';
import { orders, getAllOrders, getOrderById, getUserOrders, createOrder, updateOrderStatus, updatePaymentStatus } from './data/orders';

// Simulate authentication tokens
const tokens: Record<string, { accessToken: string; refreshToken: string }> = {};

// Helper function to generate a token
const generateToken = (userId: string) => {
  const accessToken = `access-token-${userId}-${Date.now()}`;
  const refreshToken = `refresh-token-${userId}-${Date.now()}`;
  tokens[userId] = { accessToken, refreshToken };
  return { accessToken, refreshToken };
};

// Helper to check if a request is authenticated
const isAuthenticated = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.split(' ')[1];
  return Object.values(tokens).some(t => t.accessToken === token);
};

// Helper to get user ID from token
const getUserIdFromToken = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  const userId = Object.keys(tokens).find(id => tokens[id].accessToken === token);
  return userId || null;
};

// API handlers
export const handlers = [
  // Auth endpoints
  http.post(`${config.api.baseUrl}/auth/login`, async ({ request }) => {
    await delay(500); // Simulate network delay
    
    const data = await request.json() as { email: string; password: string };
    const user = findUserByEmail(data.email);
    
    if (!user || user.password !== data.password) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid email or password' 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const { accessToken, refreshToken } = generateToken(user.id);
    
    // Omit password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return HttpResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        tokens: { accessToken, refreshToken }
      }
    }, {
      headers: {
        'Set-Cookie': [
          `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=3600`,
          `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=86400`
        ] as unknown as string[]
      }
    });
  }),
  
  http.post(`${config.api.baseUrl}/auth/register`, async ({ request }) => {
    await delay(500); // Simulate network delay
    
    const userData = await request.json() as { email: string; password: string; firstName: string; lastName: string };
    const existingUser = findUserByEmail(userData.email);
    
    if (existingUser) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Email already in use' 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const newUser = createUser({
      ...userData as any,
      role: 'user' // Default role for new registrations
    });
    
    const { password: _, ...userWithoutPassword } = newUser;
    const { accessToken, refreshToken } = generateToken(newUser.id);
    
    return HttpResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        tokens: { accessToken, refreshToken }
      }
    }, {
      headers: {
        'Set-Cookie': [
          `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=3600`,
          `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=86400`
        ] as unknown as string[]
      }
    });
  }),
  
  http.post(`${config.api.baseUrl}/auth/logout`, async () => {
    await delay(300); // Simulate network delay
    
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, {
      headers: {
        'Set-Cookie': [
          'accessToken=; HttpOnly; Path=/; Max-Age=0',
          'refreshToken=; HttpOnly; Path=/; Max-Age=0'
        ] as unknown as string[]
      }
    });
  }),
  
  http.get(`${config.api.baseUrl}/auth/me`, async ({ request }) => {
    await delay(300); // Simulate network delay
    
    if (!isAuthenticated(request)) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const userId = getUserIdFromToken(request);
    const user = userId ? findUserById(userId) : null;
    
    if (!user) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'User not found' 
        }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    return HttpResponse.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });
  }),
  
  // Products endpoints
  http.get(`${config.api.baseUrl}/products`, async ({ request }) => {
    await delay(500); // Simulate network delay
    
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');
    
    let productsList;
    if (categoryId) {
      productsList = getProductsByCategory(categoryId);
    } else {
      productsList = getAllProducts();
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        products: productsList,
        total: productsList.length
      }
    });
  }),
  
  http.get(`${config.api.baseUrl}/products/:id`, async ({ params }) => {
    await delay(300); // Simulate network delay
    
    const product = getProductById(params.id as string);
    
    if (!product) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Product not found' 
        }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        product
      }
    });
  }),
  
  http.post(`${config.api.baseUrl}/products`, async ({ request }) => {
    await delay(500); // Simulate network delay
    
    if (!isAuthenticated(request)) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const productData = await request.json() as any;
    const newProduct = createProduct(productData);
    
    return HttpResponse.json({
      success: true,
      data: {
        product: newProduct
      }
    });
  }),
  
  http.put(`${config.api.baseUrl}/products/:id`, async ({ request, params }) => {
    await delay(500); // Simulate network delay
    
    if (!isAuthenticated(request)) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const productData = await request.json() as any;
    const updatedProduct = updateProduct(params.id as string, productData);
    
    if (!updatedProduct) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Product not found' 
        }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        product: updatedProduct
      }
    });
  }),
  
  http.delete(`${config.api.baseUrl}/products/:id`, async ({ request, params }) => {
    await delay(500); // Simulate network delay
    
    if (!isAuthenticated(request)) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const success = deleteProduct(params.id as string);
    
    if (!success) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Product not found' 
        }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return HttpResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  }),
  
  // Categories endpoints
  http.get(`${config.api.baseUrl}/categories`, async () => {
    await delay(300); // Simulate network delay
    
    const categoriesList = getAllCategories();
    
    return HttpResponse.json({
      success: true,
      data: {
        categories: categoriesList,
        total: categoriesList.length
      }
    });
  }),
  
  http.get(`${config.api.baseUrl}/categories/parent`, async () => {
    await delay(300); // Simulate network delay
    
    const parentCategories = getParentCategories();
    
    return HttpResponse.json({
      success: true,
      data: {
        categories: parentCategories,
        total: parentCategories.length
      }
    });
  }),
  
  http.get(`${config.api.baseUrl}/categories/:id/subcategories`, async ({ params }) => {
    await delay(300); // Simulate network delay
    
    const subcategories = getSubcategories(params.id as string);
    
    return HttpResponse.json({
      success: true,
      data: {
        categories: subcategories,
        total: subcategories.length
      }
    });
  }),
  
  http.get(`${config.api.baseUrl}/categories/:id`, async ({ params }) => {
    await delay(300); // Simulate network delay
    
    const category = getCategoryById(params.id as string);
    
    if (!category) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Category not found' 
        }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        category
      }
    });
  }),
  
  // Orders endpoints
  http.get(`${config.api.baseUrl}/orders`, async ({ request }) => {
    await delay(500); // Simulate network delay
    
    if (!isAuthenticated(request)) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const userId = getUserIdFromToken(request);
    const user = userId ? findUserById(userId) : null;
    
    let ordersList;
    if (user?.role === 'admin') {
      // Admins can see all orders
      ordersList = getAllOrders();
    } else if (userId) {
      // Regular users can only see their own orders
      ordersList = getUserOrders(userId);
    } else {
      ordersList = [];
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        orders: ordersList,
        total: ordersList.length
      }
    });
  }),
  
  http.get(`${config.api.baseUrl}/orders/:id`, async ({ request, params }) => {
    await delay(300); // Simulate network delay
    
    if (!isAuthenticated(request)) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const order = getOrderById(params.id as string);
    
    if (!order) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Order not found' 
        }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const userId = getUserIdFromToken(request);
    const user = userId ? findUserById(userId) : null;
    
    // Check if user has permission to view this order
    if (user?.role !== 'admin' && order.userId !== userId) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        order
      }
    });
  }),
  
  http.post(`${config.api.baseUrl}/orders`, async ({ request }) => {
    await delay(700); // Simulate network delay
    
    if (!isAuthenticated(request)) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const orderData = await request.json() as any;
    const newOrder = createOrder({
      ...orderData,
      userId,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    return HttpResponse.json({
      success: true,
      data: {
        order: newOrder
      }
    });
  }),
  
  http.patch(`${config.api.baseUrl}/orders/:id/status`, async ({ request, params }) => {
    await delay(500); // Simulate network delay
    
    if (!isAuthenticated(request)) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const userId = getUserIdFromToken(request);
    const user = userId ? findUserById(userId) : null;
    
    // Only admins can update order status
    if (user?.role !== 'admin') {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const data = await request.json() as { status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' };
    const updatedOrder = updateOrderStatus(params.id as string, data.status);
    
    if (!updatedOrder) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Order not found' 
        }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        order: updatedOrder
      }
    });
  }),
  
  http.patch(`${config.api.baseUrl}/orders/:id/payment`, async ({ request, params }) => {
    await delay(500); // Simulate network delay
    
    if (!isAuthenticated(request)) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const data = await request.json() as { paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' };
    const updatedOrder = updatePaymentStatus(params.id as string, data.paymentStatus);
    
    if (!updatedOrder) {
      return new HttpResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Order not found' 
        }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        order: updatedOrder
      }
    });
  })
];
