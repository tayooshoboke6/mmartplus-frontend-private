import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Text, Button } from '../styles/GlobalComponents';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../contexts/CartContext';

// Mock Categories with new hierarchy
const MOCK_CATEGORIES = [
  // Main Categories
  {
    id: 1,
    name: 'Food & Groceries',
    slug: 'food-groceries',
    parentId: null,
    image: 'https://via.placeholder.com/40',
    description: 'All food and grocery items',
    productCount: 150,
    color: '#4CAF50'
  },
  {
    id: 2,
    name: 'Household Essentials & Cleaning',
    slug: 'household-essentials',
    parentId: null,
    image: 'https://via.placeholder.com/40',
    description: 'Household and cleaning products',
    productCount: 80,
    color: '#2196F3'
  },
  {
    id: 3,
    name: 'Kitchen & Home Needs',
    slug: 'kitchen-home',
    parentId: null,
    image: 'https://via.placeholder.com/40',
    description: 'Kitchen and home products',
    productCount: 60,
    color: '#FF9800'
  },
  {
    id: 4,
    name: 'Baby & Family Care',
    slug: 'baby-family',
    parentId: null,
    image: 'https://via.placeholder.com/40',
    description: 'Products for babies and family care',
    productCount: 45,
    color: '#E91E63'
  },
  {
    id: 5,
    name: 'Drinks & Alcohol',
    slug: 'drinks-alcohol',
    parentId: null,
    image: 'https://via.placeholder.com/40',
    description: 'Beverages and alcoholic drinks',
    productCount: 70,
    color: '#9C27B0'
  },
  {
    id: 6,
    name: 'Office & General Supplies',
    slug: 'office-general',
    parentId: null,
    image: 'https://via.placeholder.com/40',
    description: 'Office supplies and general products',
    productCount: 50,
    color: '#607D8B'
  },
  
  // Food & Groceries subcategories
  {
    id: 7,
    name: 'Staples & Grains',
    slug: 'staples-grains',
    parentId: 1,
    image: 'https://via.placeholder.com/40',
    description: 'Rice, Beans, Garri, Semovita, Wheat, Yam, etc.',
    productCount: 30,
    color: '#4CAF50'
  },
  {
    id: 8,
    name: 'Cooking Essentials',
    slug: 'cooking-essentials',
    parentId: 1,
    image: 'https://via.placeholder.com/40',
    description: 'Flour, Baking Needs, Oils, Spices, Seasonings, Tomato Paste, etc.',
    productCount: 25,
    color: '#4CAF50'
  },
  {
    id: 9,
    name: 'Packaged & Frozen Foods',
    slug: 'packaged-frozen',
    parentId: 1,
    image: 'https://via.placeholder.com/40',
    description: 'Noodles, Pasta, Canned Foods, Sardines, Frozen Chicken, Fish, etc.',
    productCount: 35,
    color: '#4CAF50'
  },
  {
    id: 10,
    name: 'Snacks & Beverages',
    slug: 'snacks-beverages',
    parentId: 1,
    image: 'https://via.placeholder.com/40',
    description: 'Biscuits, Chocolates, Juice, Soft Drinks, Tea, Coffee, Milo, etc.',
    productCount: 40,
    color: '#4CAF50'
  },
  {
    id: 11,
    name: 'Dairy & Breakfast',
    slug: 'dairy-breakfast',
    parentId: 1,
    image: 'https://via.placeholder.com/40',
    description: 'Milk, Yogurt, Eggs, Cereals, Custard, etc.',
    productCount: 20,
    color: '#4CAF50'
  },
  {
    id: 12,
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    parentId: 1,
    image: 'https://via.placeholder.com/40',
    description: 'Fresh & Frozen Produce',
    productCount: 30,
    color: '#4CAF50'
  },
  
  // Household Essentials & Cleaning subcategories
  {
    id: 13,
    name: 'Cleaning & Laundry',
    slug: 'cleaning-laundry',
    parentId: 2,
    image: 'https://via.placeholder.com/40',
    description: 'Detergents, Soaps, Bleach, Mopping Liquids, Air Fresheners, etc.',
    productCount: 30,
    color: '#2196F3'
  },
  {
    id: 14,
    name: 'Toiletries & Personal Care',
    slug: 'toiletries-personal',
    parentId: 2,
    image: 'https://via.placeholder.com/40',
    description: 'Toothpaste, Tissue, Sanitary Pads, Deodorants, Perfumes, etc.',
    productCount: 35,
    color: '#2196F3'
  },
  {
    id: 15,
    name: 'Pest Control & Safety',
    slug: 'pest-safety',
    parentId: 2,
    image: 'https://via.placeholder.com/40',
    description: 'Insecticides, Mosquito Repellents, First Aid, Disinfectants, etc.',
    productCount: 15,
    color: '#2196F3'
  },
  
  // Kitchen & Home Needs subcategories
  {
    id: 16,
    name: 'Cookware & Storage',
    slug: 'cookware-storage',
    parentId: 3,
    image: 'https://via.placeholder.com/40',
    description: 'Pots, Pans, Plates, Cutlery, Bowls, Food Containers, Coolers, etc.',
    productCount: 30,
    color: '#FF9800'
  },
  {
    id: 17,
    name: 'Small Appliances',
    slug: 'small-appliances',
    parentId: 3,
    image: 'https://via.placeholder.com/40',
    description: 'Blenders, Kettles, Toasters, Fans, Irons, Rechargeable Lamps, etc.',
    productCount: 30,
    color: '#FF9800'
  },
  
  // Baby & Family Care subcategories
  {
    id: 18,
    name: 'Baby Food & Diapers',
    slug: 'baby-food-diapers',
    parentId: 4,
    image: 'https://via.placeholder.com/40',
    description: 'Formula, Wipes, Baby Toiletries, Clothing, etc.',
    productCount: 25,
    color: '#E91E63'
  },
  {
    id: 19,
    name: 'Health & Wellness',
    slug: 'health-wellness',
    parentId: 4,
    image: 'https://via.placeholder.com/40',
    description: 'Medicines, Multivitamins, Sanitary Products, Bandages, etc.',
    productCount: 20,
    color: '#E91E63'
  },
  
  // Drinks & Alcohol subcategories
  {
    id: 20,
    name: 'Soft Drinks & Juices',
    slug: 'soft-drinks-juices',
    parentId: 5,
    image: 'https://via.placeholder.com/40',
    description: 'Coke, Fanta, Chivita, Hollandia, etc.',
    productCount: 25,
    color: '#9C27B0'
  },
  {
    id: 21,
    name: 'Alcoholic Drinks',
    slug: 'alcoholic-drinks',
    parentId: 5,
    image: 'https://via.placeholder.com/40',
    description: 'Beer, Wine, Spirits, etc.',
    productCount: 30,
    color: '#9C27B0'
  },
  {
    id: 22,
    name: 'Water & Energy Drinks',
    slug: 'water-energy-drinks',
    parentId: 5,
    image: 'https://via.placeholder.com/40',
    description: 'Bottled water and energy drinks',
    productCount: 15,
    color: '#9C27B0'
  },
  
  // Office & General Supplies subcategories
  {
    id: 23,
    name: 'Stationery & Packaging',
    slug: 'stationery-packaging',
    parentId: 6,
    image: 'https://via.placeholder.com/40',
    description: 'Pens, Notebooks, Cartons, Cellotape, Nylon Bags, etc.',
    productCount: 30,
    color: '#607D8B'
  },
  {
    id: 24,
    name: 'Pet & Livestock Needs',
    slug: 'pet-livestock',
    parentId: 6,
    image: 'https://via.placeholder.com/40',
    description: 'Pet Food, Animal Care Essentials',
    productCount: 20,
    color: '#607D8B'
  }
];

// Update the mock products to match the new categories
const MOCK_PRODUCTS = [
  {
    id: 1,
    image: 'https://via.placeholder.com/150',
    name: 'Fresh Whole Milk',
    category: 'Dairy & Breakfast',
    price: 1200,
    stock: 24,
    expiry: '2025-03-15',
    createdAt: '2025-02-15',
    description: 'Fresh and nutritious whole milk from local farms.'
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/150',
    name: 'Premium Basmati Rice (5kg)',
    category: 'Staples & Grains',
    price: 7500,
    stock: 12,
    expiry: '2025-12-18',
    createdAt: '2025-02-18',
    description: 'High-quality aged basmati rice with aromatic flavor.'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/150',
    name: 'Fresh Tomatoes (1kg)',
    category: 'Fruits & Vegetables',
    price: 1800,
    stock: 38,
    expiry: '2025-03-07',
    createdAt: '2025-02-20',
    description: 'Fresh locally grown tomatoes, perfect for salads and sauces.'
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/150',
    name: 'Frozen Chicken Breast (1kg)',
    category: 'Packaged & Frozen Foods',
    price: 5500,
    stock: 45,
    expiry: '2025-06-22',
    createdAt: '2025-02-22',
    description: 'Premium quality chicken breast, perfect for grilling or baking.'
  },
  {
    id: 5,
    image: 'https://via.placeholder.com/150',
    name: 'Premium Dish Soap',
    category: 'Cleaning & Laundry',
    price: 950,
    stock: 10,
    expiry: null,
    createdAt: '2025-02-25',
    description: 'Effective dish soap with gentle formula for clean dishes and hands.'
  },
  {
    id: 6,
    image: 'https://via.placeholder.com/150',
    name: 'Fresh Eggs (Crate of 30)',
    category: 'Dairy & Breakfast',
    price: 3200,
    stock: 8,
    expiry: '2025-03-20',
    createdAt: '2025-02-26',
    description: 'Farm-fresh eggs from free-range chickens.'
  },
  {
    id: 7,
    image: 'https://via.placeholder.com/150',
    name: 'Local Honey (500g)',
    category: 'Cooking Essentials',
    price: 4500,
    stock: 32,
    expiry: '2026-02-28',
    createdAt: '2025-02-28',
    description: 'Pure, unfiltered honey from local beekeepers.'
  },
  {
    id: 8,
    image: 'https://via.placeholder.com/150',
    name: 'Laundry Detergent (2kg)',
    category: 'Cleaning & Laundry',
    price: 3500,
    stock: 15,
    expiry: null,
    createdAt: '2025-03-01',
    description: 'High-efficiency laundry detergent for all washing machines.'
  },
  {
    id: 9,
    image: 'https://via.placeholder.com/150',
    name: 'Red Apples (1kg)',
    category: 'Fruits & Vegetables',
    price: 1500,
    stock: 45,
    expiry: '2025-03-10',
    createdAt: '2025-02-15',
    description: 'Sweet and crunchy red apples, perfect for snacking.'
  },
  {
    id: 10,
    image: 'https://via.placeholder.com/150',
    name: 'Whole Wheat Bread',
    category: 'Packaged & Frozen Foods',
    price: 1200,
    stock: 15,
    expiry: '2025-03-05',
    createdAt: '2025-03-01',
    description: 'Freshly baked whole wheat bread, rich in fiber and nutrients.'
  },
  {
    id: 11,
    image: 'https://via.placeholder.com/150',
    name: 'Organic Spinach (200g)',
    category: 'Fruits & Vegetables',
    price: 1200,
    stock: 20,
    expiry: '2025-03-06',
    createdAt: '2025-03-01',
    description: 'Fresh organic spinach leaves, perfect for salads and cooking.'
  },
  {
    id: 12,
    name: 'Cheddar Cheese (250g)',
    category: 'Dairy & Breakfast',
    price: 2200,
    stock: 30,
    expiry: '2025-04-15',
    createdAt: '2025-02-20',
    description: 'Aged cheddar cheese with rich, sharp flavor.',
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 13,
    image: 'https://via.placeholder.com/150',
    name: 'Indomie Noodles (40 Pack)',
    category: 'Packaged & Frozen Foods',
    price: 5800,
    stock: 25,
    expiry: '2025-10-15',
    createdAt: '2025-03-01',
    description: 'Popular instant noodles in bulk pack, various flavors.'
  },
  {
    id: 14,
    image: 'https://via.placeholder.com/150',
    name: 'Ceramic Cooking Pot Set',
    category: 'Cookware & Storage',
    price: 12500,
    stock: 8,
    expiry: null,
    createdAt: '2025-02-25',
    description: 'Premium ceramic cooking pot set with 3 different sizes.'
  },
  {
    id: 15,
    image: 'https://via.placeholder.com/150',
    name: 'Pampers Diapers (Pack of 48)',
    category: 'Baby Food & Diapers',
    price: 6500,
    stock: 18,
    expiry: null,
    createdAt: '2025-02-28',
    description: 'Premium quality diapers for babies, sizes 3-5.'
  },
  {
    id: 16,
    image: 'https://via.placeholder.com/150',
    name: 'Coca Cola (12 Pack)',
    category: 'Soft Drinks & Juices',
    price: 2800,
    stock: 30,
    expiry: '2025-09-15',
    createdAt: '2025-03-02',
    description: 'Classic Coca Cola soft drink in canned pack.'
  },
  {
    id: 17,
    image: 'https://via.placeholder.com/150',
    name: 'A4 Printing Paper (500 Sheets)',
    category: 'Stationery & Packaging',
    price: 3200,
    stock: 22,
    expiry: null,
    createdAt: '2025-03-01',
    description: 'High-quality A4 white paper for printing and copying.'
  },
  {
    id: 18,
    image: 'https://via.placeholder.com/150',
    name: 'Dog Food Premium (5kg)',
    category: 'Pet & Livestock Needs',
    price: 7800,
    stock: 12,
    expiry: '2026-01-15',
    createdAt: '2025-02-25',
    description: 'Premium nutrition dog food for adult dogs of all breeds.'
  }
];

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CategoryIcon = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    height: 180px;
  }
  
  @media (max-width: 480px) {
    height: 150px;
  }
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  font-size: 16px;
  margin: 0 0 8px 0;
  font-weight: 500;
  color: #333;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ProductPrice = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #0066b2;
  margin-bottom: 10px;
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ProductStock = styled.div<{ inStock: boolean }>`
  font-size: 14px;
  color: ${props => props.inStock ? '#2e7d32' : '#b71c1c'};
  margin-bottom: 15px;
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Breadcrumbs = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
  
  a {
    color: #0066b2;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 8px;
    color: #666;
  }
`;

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  description: string;
  expiry: string | null;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  image: string;
  description: string;
  productCount: number;
  color: string;
}

const CategoryProductsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      
      // Navigate to product page after adding to cart
      navigate(`/product/${product.id}`);
    }
  };
  
  useEffect(() => {
    // Simulating an API call to fetch category and related products
    const fetchCategoryAndProducts = () => {
      setLoading(true);
      
      // Find the category by slug
      const foundCategory = MOCK_CATEGORIES.find(cat => cat.slug === slug);
      
      if (foundCategory) {
        setCategory(foundCategory);
        
        // Find all products in this category
        // Including subcategories (if the current category is a parent category)
        let filteredProducts: any[] = [];
        
        // If this is a parent category, get products from its subcategories too
        if (foundCategory.parentId === null) {
          // Find all subcategories
          const subcategories = MOCK_CATEGORIES.filter(
            cat => cat.parentId === foundCategory.id
          );
          
          // Get product category names (including the parent category)
          const categoryNames = [
            foundCategory.name,
            ...subcategories.map(cat => cat.name)
          ];
          
          // Filter products by these category names
          filteredProducts = MOCK_PRODUCTS.filter(product => 
            categoryNames.includes(product.category)
          );
        } else {
          // If this is a subcategory, just get products from this category
          filteredProducts = MOCK_PRODUCTS.filter(
            product => product.category === foundCategory.name
          );
        }
        
        setProducts(filteredProducts);
      } else {
        // If category not found, set empty products array
        setProducts([]);
      }
      
      setLoading(false);
    };
    
    fetchCategoryAndProducts();
  }, [slug]);
  
  // Find parent category if the current category is a subcategory
  const getParentCategory = () => {
    if (category && category.parentId) {
      return MOCK_CATEGORIES.find(cat => cat.id === category.parentId);
    }
    return null;
  };
  
  const parentCategory = category ? getParentCategory() : null;
  
  if (loading) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <div>Loading...</div>
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }
  
  if (!category) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <Breadcrumbs>
            <Link to="/">Home</Link> <span>›</span> Category not found
          </Breadcrumbs>
          <NoProducts>
            <Text size="lg" weight="bold">Category Not Found</Text>
            <Text size="md" style={{ marginTop: '10px' }}>
              The category you're looking for does not exist.
            </Text>
          </NoProducts>
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <Breadcrumbs>
          <Link to="/">Home</Link> 
          <span>›</span>
          {parentCategory && (
            <>
              <Link to={`/category/${parentCategory.slug}`}>{parentCategory.name}</Link>
              <span>›</span>
            </>
          )}
          <span>{category.name}</span>
        </Breadcrumbs>
        
        <CategoryHeader>
          <CategoryIcon 
            src={category.image} 
            alt={category.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/60x60?text=${category.name.charAt(0)}`;
            }}
          />
          <CategoryInfo>
            <Text size="xl" weight="bold">{category.name}</Text>
            <Text size="md" color="#666">{category.description}</Text>
          </CategoryInfo>
        </CategoryHeader>
        
        {products.length > 0 ? (
          <ProductsGrid>
            {products.map(product => (
              <ProductCard key={product.id}>
                <div onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer' }}>
                  <ProductImage>
                    <img src={product.image} alt={product.name} />
                  </ProductImage>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>{formatCurrency(product.price)}</ProductPrice>
                    <ProductStock inStock={product.stock > 0}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </ProductStock>
                    <Button 
                      variant="primary" 
                      fullWidth 
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Notify Me'}
                    </Button>
                  </ProductInfo>
                </div>
              </ProductCard>
            ))}
          </ProductsGrid>
        ) : (
          <NoProducts>
            <Text size="lg" weight="bold">No Products Found</Text>
            <Text size="md" style={{ marginTop: '10px' }}>
              There are currently no products available in this category.
            </Text>
          </NoProducts>
        )}
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

export default CategoryProductsPage;
