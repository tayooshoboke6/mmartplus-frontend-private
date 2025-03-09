/**
 * Category data structure for M-Mart+
 * This file defines the category hierarchy for the application
 */

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number | null;
  image_url?: string;
  is_active: boolean;
  children?: Category[];
}

/**
 * Main parent categories with their child categories
 */
export const categories: Category[] = [
  {
    id: 1,
    name: 'Food Staples & Grains',
    slug: 'food-staples-grains',
    description: 'Essential food items including rice, beans, yam products, flour, and cereals',
    parent_id: null,
    image_url: 'https://dummyimage.com/300x200/8B4513/ffffff&text=Food+Staples',
    is_active: true,
    children: [
      { id: 101, name: 'Rice', slug: 'rice', parent_id: 1, is_active: true },
      { id: 102, name: 'Beans', slug: 'beans', parent_id: 1, is_active: true },
      { id: 103, name: 'Yam & Cassava Products', slug: 'yam-cassava-products', parent_id: 1, is_active: true },
      { id: 104, name: 'Flour & Semolina', slug: 'flour-semolina', parent_id: 1, is_active: true },
      { id: 105, name: 'Cereals & Porridges', slug: 'cereals-porridges', parent_id: 1, is_active: true }
    ]
  },
  {
    id: 2,
    name: 'Beverages',
    slug: 'beverages',
    description: 'Drinks including soft drinks, juices, water, energy drinks, and traditional drinks',
    parent_id: null,
    image_url: 'https://dummyimage.com/300x200/1E90FF/ffffff&text=Beverages',
    is_active: true,
    children: [
      { id: 201, name: 'Soft Drinks', slug: 'soft-drinks', parent_id: 2, is_active: true },
      { id: 202, name: 'Juices & Nectars', slug: 'juices-nectars', parent_id: 2, is_active: true },
      { id: 203, name: 'Bottled Water', slug: 'bottled-water', parent_id: 2, is_active: true },
      { id: 204, name: 'Energy & Sports Drinks', slug: 'energy-sports-drinks', parent_id: 2, is_active: true },
      { id: 205, name: 'Traditional Drinks', slug: 'traditional-drinks', parent_id: 2, is_active: true }
    ]
  },
  {
    id: 3,
    name: 'Snacks & Confectionery',
    slug: 'snacks-confectionery',
    description: 'Snack foods including chips, biscuits, chocolates, nuts, and traditional snacks',
    parent_id: null,
    image_url: 'https://dummyimage.com/300x200/FF6347/ffffff&text=Snacks',
    is_active: true,
    children: [
      { id: 301, name: 'Chips & Crisps', slug: 'chips-crisps', parent_id: 3, is_active: true },
      { id: 302, name: 'Biscuits & Cookies', slug: 'biscuits-cookies', parent_id: 3, is_active: true },
      { id: 303, name: 'Chocolates & Candies', slug: 'chocolates-candies', parent_id: 3, is_active: true },
      { id: 304, name: 'Nuts & Seeds', slug: 'nuts-seeds', parent_id: 3, is_active: true },
      { id: 305, name: 'Traditional Snacks', slug: 'traditional-snacks', parent_id: 3, is_active: true }
    ]
  },
  {
    id: 4,
    name: 'Cooking Essentials & Condiments',
    slug: 'cooking-essentials-condiments',
    description: 'Cooking ingredients including oils, spices, sauces, stock cubes, and condiments',
    parent_id: null,
    image_url: 'https://dummyimage.com/300x200/FFD700/000000&text=Cooking+Essentials',
    is_active: true,
    children: [
      { id: 401, name: 'Cooking Oils & Fats', slug: 'cooking-oils-fats', parent_id: 4, is_active: true },
      { id: 402, name: 'Spices & Seasonings', slug: 'spices-seasonings', parent_id: 4, is_active: true },
      { id: 403, name: 'Sauces & Pastes', slug: 'sauces-pastes', parent_id: 4, is_active: true },
      { id: 404, name: 'Stock Cubes & Broths', slug: 'stock-cubes-broths', parent_id: 4, is_active: true },
      { id: 405, name: 'Salt, Sugar & Other Condiments', slug: 'salt-sugar-condiments', parent_id: 4, is_active: true }
    ]
  },
  {
    id: 5,
    name: 'Fresh Produce',
    slug: 'fresh-produce',
    description: 'Fresh fruits, vegetables, and herbs',
    parent_id: null,
    image_url: 'https://dummyimage.com/300x200/32CD32/ffffff&text=Fresh+Produce',
    is_active: true,
    children: [
      { id: 501, name: 'Fruits', slug: 'fruits', parent_id: 5, is_active: true },
      { id: 502, name: 'Vegetables', slug: 'vegetables', parent_id: 5, is_active: true },
      { id: 503, name: 'Herbs & Greens', slug: 'herbs-greens', parent_id: 5, is_active: true }
    ]
  },
  {
    id: 6,
    name: 'Meat, Poultry & Seafood',
    slug: 'meat-poultry-seafood',
    description: 'Fresh and processed meat, poultry, and seafood products',
    parent_id: null,
    image_url: 'https://dummyimage.com/300x200/CD5C5C/ffffff&text=Meat+%26+Seafood',
    is_active: true,
    children: [
      { id: 601, name: 'Fresh Meat', slug: 'fresh-meat', parent_id: 6, is_active: true },
      { id: 602, name: 'Poultry', slug: 'poultry', parent_id: 6, is_active: true },
      { id: 603, name: 'Seafood', slug: 'seafood', parent_id: 6, is_active: true },
      { id: 604, name: 'Processed Meats', slug: 'processed-meats', parent_id: 6, is_active: true }
    ]
  },
  {
    id: 7,
    name: 'Dairy & Eggs',
    slug: 'dairy-eggs',
    description: 'Dairy products including milk, yogurt, cheese, eggs, and butter',
    parent_id: null,
    image_url: 'https://dummyimage.com/300x200/FFFACD/000000&text=Dairy+%26+Eggs',
    is_active: true,
    children: [
      { id: 701, name: 'Milk & Cream', slug: 'milk-cream', parent_id: 7, is_active: true },
      { id: 702, name: 'Yogurt & Kefir', slug: 'yogurt-kefir', parent_id: 7, is_active: true },
      { id: 703, name: 'Cheese', slug: 'cheese', parent_id: 7, is_active: true },
      { id: 704, name: 'Eggs', slug: 'eggs', parent_id: 7, is_active: true },
      { id: 705, name: 'Butter & Margarine', slug: 'butter-margarine', parent_id: 7, is_active: true }
    ]
  },
  {
    id: 8,
    name: 'Household Cleaning & Supplies',
    slug: 'household-cleaning-supplies',
    description: 'Cleaning products and household supplies',
    parent_id: null,
    image_url: 'https://dummyimage.com/300x200/87CEEB/000000&text=Household+Cleaning',
    is_active: true,
    children: [
      { id: 801, name: 'Cleaning Agents', slug: 'cleaning-agents', parent_id: 8, is_active: true },
      { id: 802, name: 'Laundry Supplies', slug: 'laundry-supplies', parent_id: 8, is_active: true },
      { id: 803, name: 'Dishwashing Products', slug: 'dishwashing-products', parent_id: 8, is_active: true },
      { id: 804, name: 'Cleaning Tools', slug: 'cleaning-tools', parent_id: 8, is_active: true },
      { id: 805, name: 'Waste Bags & Cleaning Cloths', slug: 'waste-bags-cleaning-cloths', parent_id: 8, is_active: true }
    ]
  },
  {
    id: 9,
    name: 'Personal Care & Beauty',
    slug: 'personal-care-beauty',
    description: 'Personal care and beauty products',
    parent_id: null,
    image_url: 'https://dummyimage.com/300x200/FF69B4/ffffff&text=Personal+Care',
    is_active: true,
    children: [
      { id: 901, name: 'Hair Care', slug: 'hair-care', parent_id: 9, is_active: true },
      { id: 902, name: 'Skin Care', slug: 'skin-care', parent_id: 9, is_active: true },
      { id: 903, name: 'Oral Care', slug: 'oral-care', parent_id: 9, is_active: true },
      { id: 904, name: 'Deodorants & Fragrances', slug: 'deodorants-fragrances', parent_id: 9, is_active: true },
      { id: 905, name: 'Men\'s Grooming', slug: 'mens-grooming', parent_id: 9, is_active: true },
      { id: 906, name: 'Feminine Hygiene', slug: 'feminine-hygiene', parent_id: 9, is_active: true }
    ]
  },
  {
    id: 10,
    name: 'Baby, Kids & Maternity',
    slug: 'baby-kids-maternity',
    description: 'Products for babies, kids, and maternity needs',
    parent_id: null,
    image_url: 'https://dummyimage.com/300x200/9370DB/ffffff&text=Baby+%26+Kids',
    is_active: true,
    children: [
      { id: 1001, name: 'Baby Food & Formula', slug: 'baby-food-formula', parent_id: 10, is_active: true },
      { id: 1002, name: 'Diapers & Wipes', slug: 'diapers-wipes', parent_id: 10, is_active: true },
      { id: 1003, name: 'Baby Bath & Grooming', slug: 'baby-bath-grooming', parent_id: 10, is_active: true },
      { id: 1004, name: 'Toys & Accessories', slug: 'toys-accessories', parent_id: 10, is_active: true },
      { id: 1005, name: 'Maternity Essentials', slug: 'maternity-essentials', parent_id: 10, is_active: true }
    ]
  },
  {
    id: 11,
    name: 'Traditional Nigerian Foods & Local Delicacies',
    slug: 'traditional-nigerian-foods',
    description: 'Traditional Nigerian foods and local delicacies',
    parent_id: null,
    image_url: 'https://dummyimage.com/300x200/008000/ffffff&text=Traditional+Foods',
    is_active: true,
    children: [
      { id: 1101, name: 'Local Seasonings & Spices', slug: 'local-seasonings-spices', parent_id: 11, is_active: true },
      { id: 1102, name: 'Traditional Snacks & Sweets', slug: 'traditional-snacks-sweets', parent_id: 11, is_active: true },
      { id: 1103, name: 'Fermented Foods', slug: 'fermented-foods', parent_id: 11, is_active: true },
      { id: 1104, name: 'Local Condiments', slug: 'local-condiments', parent_id: 11, is_active: true }
    ]
  },
  {
    id: 12,
    name: 'Home & Kitchen Essentials',
    slug: 'home-kitchen-essentials',
    description: 'Home and kitchen essentials including cookware, appliances, storage, and tableware',
    parent_id: null,
    image_url: 'https://dummyimage.com/300x200/A0522D/ffffff&text=Home+%26+Kitchen',
    is_active: true,
    children: [
      { id: 1201, name: 'Cookware & Utensils', slug: 'cookware-utensils', parent_id: 12, is_active: true },
      { id: 1202, name: 'Kitchen Appliances & Gadgets', slug: 'kitchen-appliances-gadgets', parent_id: 12, is_active: true },
      { id: 1203, name: 'Storage & Organization', slug: 'storage-organization', parent_id: 12, is_active: true },
      { id: 1204, name: 'Tableware & Serveware', slug: 'tableware-serveware', parent_id: 12, is_active: true },
      { id: 1205, name: 'General Home Essentials', slug: 'general-home-essentials', parent_id: 12, is_active: true }
    ]
  }
];

/**
 * Get all parent categories
 */
export const getParentCategories = (): Category[] => {
  return categories.map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parent_id: category.parent_id,
    image_url: category.image_url,
    is_active: category.is_active
  }));
};

/**
 * Get child categories for a specific parent category
 * @param parentId The ID of the parent category
 */
export const getChildCategories = (parentId: number): Category[] => {
  const parent = categories.find(category => category.id === parentId);
  return parent?.children || [];
};

/**
 * Get a category by its ID
 * @param id The ID of the category to find
 */
export const getCategoryById = (id: number): Category | undefined => {
  // Check parent categories
  const parentCategory = categories.find(category => category.id === id);
  if (parentCategory) return parentCategory;
  
  // Check child categories
  for (const parent of categories) {
    if (parent.children) {
      const childCategory = parent.children.find(child => child.id === id);
      if (childCategory) return childCategory;
    }
  }
  
  return undefined;
};

/**
 * Get a category by its slug
 * @param slug The slug of the category to find
 */
export const getCategoryBySlug = (slug: string): Category | undefined => {
  // Check parent categories
  const parentCategory = categories.find(category => category.slug === slug);
  if (parentCategory) return parentCategory;
  
  // Check child categories
  for (const parent of categories) {
    if (parent.children) {
      const childCategory = parent.children.find(child => child.slug === slug);
      if (childCategory) return childCategory;
    }
  }
  
  return undefined;
};
