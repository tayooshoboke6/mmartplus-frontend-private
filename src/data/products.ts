/**
 * Product data structure for M-Mart+
 * This file defines sample products for each category
 */

import { categories } from './categories';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  images: string[];
  category_id: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags?: string[];
  attributes?: Record<string, string>;
  rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

// Helper function to generate a random number between min and max
const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Helper function to generate a random discount price (70-95% of original price)
const generateDiscountPrice = (price: number): number | undefined => {
  // Only 30% of products have a discount
  if (Math.random() > 0.3) return undefined;
  
  const discountPercent = randomBetween(5, 30);
  const discountPrice = Math.round(price * (1 - discountPercent / 100));
  return discountPrice;
};

// Helper function to generate a random rating between 3.5 and 5.0
const generateRating = (): number => {
  return Number((Math.random() * 1.5 + 3.5).toFixed(1));
};

// Helper function to generate a random review count between 5 and 200
const generateReviewCount = (): number => {
  return randomBetween(5, 200);
};

// Helper function to generate a product image URL with the category color
const generateProductImage = (categoryId: number, productIndex: number): string => {
  // Get different colors for different categories
  const colors = [
    '8B4513', '1E90FF', 'FF6347', 'FFD700', '32CD32', 
    'CD5C5C', 'FFFACD', '87CEEB', 'FF69B4', '9370DB', 
    '008000', 'A0522D'
  ];
  
  const colorIndex = (categoryId - 1) % colors.length;
  const color = colors[colorIndex];
  
  // Generate a unique product image
  return `https://dummyimage.com/300x200/${color}/ffffff&text=Product+${productIndex}`;
};

// Generate products for each category
export const generateProducts = (): Product[] => {
  let productId = 1;
  const now = new Date().toISOString();
  const products: Product[] = [];

  // For each parent category
  categories.forEach(category => {
    // Generate 3-8 products for each parent category
    const numParentProducts = randomBetween(3, 8);
    
    for (let i = 0; i < numParentProducts; i++) {
      const price = randomBetween(1000, 15000);
      
      products.push({
        id: productId,
        name: `${category.name} Item ${i + 1}`,
        slug: `${category.slug}-item-${i + 1}`,
        description: `High-quality ${category.name.toLowerCase()} product for your daily needs.`,
        price: price,
        discount_price: generateDiscountPrice(price),
        stock_quantity: randomBetween(10, 100),
        images: [generateProductImage(category.id, productId)],
        category_id: category.id,
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug
        },
        tags: [category.name.toLowerCase(), 'featured'],
        rating: generateRating(),
        review_count: generateReviewCount(),
        created_at: now,
        updated_at: now
      });
      
      productId++;
    }
    
    // If the category has children, generate products for each child category
    if (category.children && category.children.length > 0) {
      category.children.forEach(childCategory => {
        // Generate 2-5 products for each child category
        const numChildProducts = randomBetween(2, 5);
        
        for (let i = 0; i < numChildProducts; i++) {
          const price = randomBetween(500, 10000);
          
          products.push({
            id: productId,
            name: `${childCategory.name} Product ${i + 1}`,
            slug: `${childCategory.slug}-product-${i + 1}`,
            description: `Premium ${childCategory.name.toLowerCase()} item from our ${category.name.toLowerCase()} collection.`,
            price: price,
            discount_price: generateDiscountPrice(price),
            stock_quantity: randomBetween(5, 50),
            images: [generateProductImage(childCategory.id, productId)],
            category_id: childCategory.id,
            category: {
              id: childCategory.id,
              name: childCategory.name,
              slug: childCategory.slug
            },
            tags: [childCategory.name.toLowerCase(), category.name.toLowerCase()],
            rating: generateRating(),
            review_count: generateReviewCount(),
            created_at: now,
            updated_at: now
          });
          
          productId++;
        }
      });
    }
  });

  return products;
};

// Generate and export the products
export const products = generateProducts();

// Helper functions to get products
export const getProductsByCategory = (categoryId: number): Product[] => {
  return products.filter(product => product.category_id === categoryId);
};

export const getProductsByCategorySlug = (categorySlug: string): Product[] => {
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return [];
  
  return getProductsByCategory(category.id);
};

export const getFeaturedProducts = (): Product[] => {
  return products
    .filter(product => product.tags?.includes('featured'))
    .sort(() => Math.random() - 0.5) // Shuffle the array
    .slice(0, 12); // Get the first 12 products
};

export const getNewArrivals = (): Product[] => {
  return [...products]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);
};

export const getBestSellers = (): Product[] => {
  return [...products]
    .filter(product => product.rating && product.rating >= 4.5)
    .sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
    .slice(0, 8);
};

export const getDiscountedProducts = (): Product[] => {
  return products
    .filter(product => product.discount_price !== undefined)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    product => 
      product.name.toLowerCase().includes(lowerQuery) || 
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category?.name.toLowerCase().includes(lowerQuery) ||
      product.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
