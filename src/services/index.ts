export { default as api } from './api';
export { default as authService } from './authService';
export { default as categoryService } from './categoryService';
export { default as productService } from './productService';

// Re-export types
export type { 
  LoginCredentials, 
  RegisterData, 
  User,
  AuthResponse 
} from './authService';

export type { 
  Category,
  CategoryResponse,
  SingleCategoryResponse
} from './categoryService';

export type { 
  Product,
  Review,
  ProductsResponse,
  SingleProductResponse
} from './productService';
