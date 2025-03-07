// Dummy data for development and testing
// This data is used when API calls fail or in development mode

// Product data with predefined items 
export const dummyProducts = {
  // Common dairy products
  'fresh-whole-milk': {
    id: 125,
    name: 'Fresh Whole Milk',
    description: 'Farm-fresh whole milk with rich taste and creamy texture. Perfect for your morning coffee, cereal, or drinking straight from the glass.',
    short_description: 'Farm-fresh whole milk with rich taste and creamy texture',
    price: 4.99,
    stock: 100,
    category_id: 3,
    category: {
      id: 3,
      name: 'Dairy Products',
    },
    images: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        is_primary: true
      }
    ],
    slug: 'fresh-whole-milk',
    rating: 4.8,
    review_count: 152,
    is_active: true
  },
  
  // Add more products as needed
  'organic-eggs': {
    id: 126,
    name: 'Organic Free-Range Eggs',
    description: 'Farm-fresh organic eggs from free-range chickens. These eggs are packed with nutrition and have a rich, delicious taste.',
    short_description: 'Farm-fresh organic eggs from free-range chickens',
    price: 6.99,
    stock: 75,
    category_id: 3,
    category: {
      id: 3,
      name: 'Dairy Products',
    },
    images: [
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1598965675045-45c7bb7d1f9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        is_primary: true
      }
    ],
    slug: 'organic-eggs',
    rating: 4.7,
    review_count: 98,
    is_active: true
  }
};

// Similar products that can be shown with any product
export const dummySimilarProducts = [
  {
    id: 127,
    name: 'Low-Fat Milk',
    price: 3.99,
    images: [{ url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', is_primary: true }],
    rating: 4.5,
    review_count: 120,
    slug: 'low-fat-milk'
  },
  {
    id: 128,
    name: 'Greek Yogurt',
    price: 5.99,
    images: [{ url: 'https://images.unsplash.com/photo-1571212515416-8d699f7c8b5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', is_primary: true }],
    rating: 4.7,
    review_count: 85,
    slug: 'greek-yogurt'
  },
  {
    id: 129,
    name: 'Cheddar Cheese',
    price: 6.99,
    images: [{ url: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', is_primary: true }],
    rating: 4.6,
    review_count: 95,
    slug: 'cheddar-cheese'
  }
];

// Function to get a dummy product by ID or slug
export const getDummyProduct = (idOrSlug: string | number) => {
  // Check if it's a direct match in our dummyProducts object
  if (typeof idOrSlug === 'string' && dummyProducts[idOrSlug]) {
    return dummyProducts[idOrSlug];
  }
  
  // Find by numeric ID
  if (typeof idOrSlug === 'number' || /^\d+$/.test(String(idOrSlug))) {
    const numericId = typeof idOrSlug === 'number' ? idOrSlug : parseInt(String(idOrSlug));
    const found = Object.values(dummyProducts).find(p => p.id === numericId);
    if (found) return found;
  }
  
  // Find by slug as string
  if (typeof idOrSlug === 'string') {
    const found = Object.values(dummyProducts).find(
      p => p.slug.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (found) return found;
  }
  
  // If no match, return a generic product based on the ID/slug
  return {
    id: typeof idOrSlug === 'number' ? idOrSlug : 999,
    name: `Product ${idOrSlug}`,
    description: 'This is a placeholder product for development purposes.',
    short_description: 'Placeholder product',
    price: 9.99,
    stock: 100,
    category_id: 1,
    category: {
      id: 1,
      name: 'General',
    },
    images: [
      {
        id: 1,
        url: 'https://via.placeholder.com/600x400?text=Product+Image',
        is_primary: true
      }
    ],
    slug: String(idOrSlug),
    rating: 4.0,
    review_count: 0,
    is_active: true
  };
};
