import { useState, useEffect } from 'react';
import type { TouchEvent as ReactTouchEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Text, Button, FlexBox } from '../styles/GlobalComponents';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const SectionContainer = styled.section`
  margin-bottom: 40px;
`;

const BreadcrumbNavigation = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Breadcrumb = styled(Link)`
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 8px;
  color: var(--text-secondary);
`;

const BreadcrumbCurrent = styled.span`
  color: var(--text-primary);
  font-size: 14px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ProductImages = styled.div`
  position: relative;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ReviewCount = styled.span`
  margin-left: 8px;
  color: var(--text-secondary);
  font-size: 14px;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const Spacer = styled.div<{ size: number }>`
  height: ${props => props.size}px;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  background: var(--background-light);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  
  &:hover {
    background: var(--background-hover);
  }
`;

const QuantityValue = styled.span`
  width: 50px;
  text-align: center;
  font-size: 16px;
`;

const AddToCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  
  @media (min-width: 568px) {
    flex-direction: row;
  }
`;

const FrequentlyBoughtTogetherSection = styled.div`
  margin-top: 40px;
`;

const ProductsCarousel = styled.div`
  position: relative;
  margin-top: 20px;
`;

const ProductsTrack = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: hidden;
  transition: transform 0.2s ease-out; /* Faster transition time and smoother easing */
`;

const ProductSlideCard = styled.div`
  flex: 0 0 calc(33.333% - 16px);
  max-width: calc(33.333% - 16px);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex: 0 0 calc(50% - 16px);
    max-width: calc(50% - 16px);
  }
  
  @media (max-width: 576px) {
    flex: 0 0 calc(100% - 16px);
    max-width: calc(100% - 16px);
  }
`;

const CardContent = styled.div`
  padding: 12px;
`;

const CardTitle = styled.h3`
  font-size: 14px;
  margin: 0 0 8px;
  font-weight: 500;
`;

const CardPrice = styled.div`
  font-weight: bold;
  color: var(--primary-color);
`;

const CardImage = styled.div`
  overflow: hidden;
  border-radius: 8px 8px 0 0;
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NavButton = styled.button<{ direction?: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid var(--border-color);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: var(--background-hover);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.direction === 'left' ? 'left: 0;' : ''}
  ${props => props.direction === 'right' ? 'right: 0;' : ''}
`;

// Import ProductImageGallery component or define it here if it doesn't exist
const ProductImageGallery = ({ images, altText, onImageChange }: { 
  images: string[], 
  altText: string,
  onImageChange: (index: number) => void 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    if (onImageChange) {
      onImageChange(activeIndex);
    }
  }, [activeIndex, onImageChange]);
  
  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <img 
          src={images[activeIndex] || 'https://via.placeholder.com/500x500?text=No+Image'} 
          alt={altText} 
          style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
        {images.map((img, idx) => (
          <img 
            key={idx}
            src={img} 
            alt={`${altText} thumbnail ${idx + 1}`}
            style={{ 
              width: '80px', 
              height: '80px', 
              objectFit: 'cover',
              cursor: 'pointer',
              borderRadius: '4px',
              border: idx === activeIndex ? '2px solid var(--primary-color)' : '2px solid transparent'
            }}
            onClick={() => setActiveIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};

// Mock data for products with grocery store categories
const mockProducts = [
  {
    id: 1,
    name: 'Fresh Whole Milk',
    images: [
      'https://via.placeholder.com/500x400?text=Fresh+Whole+Milk',
      'https://via.placeholder.com/500x400?text=Milk+Nutritional+Info',
      'https://via.placeholder.com/500x400?text=Milk+Package',
    ],
    category: 'Dairy & Breakfast',
    price: 1200,
    compareAtPrice: 1500,
    description: 'Fresh and nutritious whole milk from local farms. Rich in calcium and protein, this milk is perfect for your daily nutrition needs. Pasteurized for safety while maintaining its fresh taste.',
    shortDescription: 'Fresh whole milk from local farms.',
    specifications: [
      { name: 'Volume', value: '1 Liter' },
      { name: 'Fat Content', value: '3.5%' },
      { name: 'Storage', value: 'Refrigerated' },
      { name: 'Shelf Life', value: '7 days' }
    ],
    productType: 'pieces',
    stock: 24,
    expiry: '2025-03-15',
    features: [
      'Fresh from local farms',
      'Rich in calcium and vitamin D',
      'No preservatives added',
      'Recyclable packaging'
    ],
    specs: {
      volume: '1 Liter',
      storage: 'Keep refrigerated',
      shelfLife: '7 days after opening'
    },
    rating: 4.8,
    reviewCount: 128
  },
  {
    id: 2,
    name: 'Premium Basmati Rice (5kg)',
    images: [
      'https://via.placeholder.com/500x400?text=Premium+Basmati+Rice',
      'https://via.placeholder.com/500x400?text=Rice+Package+Back',
      'https://via.placeholder.com/500x400?text=Rice+Cooking+Instructions',
    ],
    category: 'Staples & Grains',
    price: 7500,
    compareAtPrice: 8200,
    description: 'High-quality aged basmati rice with aromatic flavor. Grown in the finest rice fields and aged to perfection. Perfect for biryani, jollof rice, and other special dishes.',
    shortDescription: 'Aged basmati rice with aromatic flavor.',
    specifications: [
      { name: 'Weight', value: '5 Kilograms' },
      { name: 'Origin', value: 'Imported' },
      { name: 'Cooking Time', value: '15-20 minutes' },
      { name: 'Storage', value: 'Dry place' }
    ],
    productType: 'packs',
    stock: 12,
    expiry: '2025-12-18',
    features: [
      'Premium long grain',
      'Naturally aromatic',
      'Aged for better flavor',
      'Stays separate when cooked'
    ],
    specs: {
      weight: '5 Kilograms',
      origin: 'Imported',
      cookingTime: '15-20 minutes'
    },
    rating: 4.9,
    reviewCount: 205
  },
  {
    id: 3,
    name: 'Fresh Tomatoes (1kg)',
    images: [
      'https://via.placeholder.com/500x400?text=Fresh+Tomatoes',
      'https://via.placeholder.com/500x400?text=Tomatoes+Close+Up',
      'https://via.placeholder.com/500x400?text=Tomatoes+In+Basket',
    ],
    category: 'Fruits & Vegetables',
    price: 1800,
    compareAtPrice: 2000,
    description: 'Fresh locally grown tomatoes, perfect for salads and sauces. These tomatoes are harvested at the peak of ripeness to ensure the best flavor and nutritional value.',
    shortDescription: 'Locally grown fresh tomatoes.',
    specifications: [
      { name: 'Weight', value: '1 Kilogram' },
      { name: 'Type', value: 'Roma/Plum' },
      { name: 'Storage', value: 'Room temperature or refrigerate' },
      { name: 'Shelf Life', value: '3-5 days' }
    ],
    productType: 'pieces',
    stock: 38,
    expiry: '2025-03-07',
    features: [
      'Locally grown',
      'Rich in lycopene',
      'Versatile for cooking',
      'No pesticides used'
    ],
    specs: {
      weight: '1 Kilogram',
      type: 'Roma/Plum',
      storage: 'Room temperature or refrigerate'
    },
    rating: 4.6,
    reviewCount: 87
  },
  {
    id: 4,
    name: 'Frozen Chicken Breast (1kg)',
    images: [
      'https://via.placeholder.com/500x400?text=Frozen+Chicken+Breast',
      'https://via.placeholder.com/500x400?text=Chicken+Package',
      'https://via.placeholder.com/500x400?text=Chicken+Nutritional+Info',
    ],
    category: 'Packaged & Frozen Foods',
    price: 5500,
    compareAtPrice: 6000,
    description: 'Premium quality chicken breast, perfect for grilling or baking. Sourced from farms with high animal welfare standards. Individually quick frozen to preserve freshness.',
    shortDescription: 'Premium quality frozen chicken breast.',
    specifications: [
      { name: 'Weight', value: '1 Kilogram' },
      { name: 'Pieces', value: '4-5 pieces approximately' },
      { name: 'Storage', value: 'Keep frozen until use' },
      { name: 'Shelf Life', value: '12 months' }
    ],
    productType: 'pieces',
    stock: 45,
    expiry: '2025-06-22',
    features: [
      'Hormone-free',
      'High protein content',
      'Individually packaged pieces',
      'Easy to portion'
    ],
    specs: {
      weight: '1 Kilogram',
      pieces: '4-5 pieces approximately',
      storage: 'Keep frozen until use'
    },
    rating: 4.7,
    reviewCount: 156
  },
  {
    id: 5,
    name: 'Premium Dish Soap',
    images: [
      'https://via.placeholder.com/500x400?text=Premium+Dish+Soap',
      'https://via.placeholder.com/500x400?text=Dish+Soap+Label',
      'https://via.placeholder.com/500x400?text=Dish+Soap+Usage',
    ],
    category: 'Cleaning & Laundry',
    price: 950,
    compareAtPrice: 1200,
    description: 'Effective dish soap with gentle formula for clean dishes and hands. Cuts through grease while being gentle on your skin. Pleasant citrus scent.',
    shortDescription: 'Gentle and effective dish soap.',
    specifications: [
      { name: 'Volume', value: '750ml' },
      { name: 'Concentration', value: 'Ultra-concentrated' },
      { name: 'Ingredients', value: 'Plant-based surfactants' },
      { name: 'Storage', value: 'Dry place' }
    ],
    productType: 'pieces',
    stock: 10,
    expiry: null,
    features: [
      'Biodegradable formula',
      'Gentle on hands',
      'Effective grease cutter',
      'Citrus scent'
    ],
    specs: {
      volume: '750ml',
      concentration: 'Ultra-concentrated',
      ingredients: 'Plant-based surfactants'
    },
    rating: 4.5,
    reviewCount: 92
  },
  {
    id: 6,
    name: 'Fresh Eggs (Crate of 30)',
    images: [
      'https://via.placeholder.com/500x400?text=Fresh+Eggs',
      'https://via.placeholder.com/500x400?text=Egg+Carton',
      'https://via.placeholder.com/500x400?text=Eggs+Close+Up',
    ],
    category: 'Dairy & Breakfast',
    price: 3200,
    compareAtPrice: 3500,
    description: 'Farm-fresh eggs from free-range chickens. Perfect for breakfast, baking, or any recipe that calls for fresh eggs. Each egg is inspected for quality.',
    shortDescription: 'Farm-fresh eggs from free-range chickens.',
    specifications: [
      { name: 'Quantity', value: '30 eggs' },
      { name: 'Size', value: 'Large' },
      { name: 'Type', value: 'Free Range' },
      { name: 'Storage', value: 'Refrigerated' }
    ],
    productType: 'packs',
    stock: 8,
    expiry: '2025-03-20',
    features: [
      'From free-range chickens',
      'No antibiotics used',
      'Rich in protein',
      'Large size eggs'
    ],
    specs: {
      quantity: '30 eggs',
      size: 'Large',
      storage: 'Refrigerated'
    },
    rating: 4.9,
    reviewCount: 73
  },
  {
    id: 7,
    name: 'Premium Cotton T-Shirt',
    images: [
      'https://via.placeholder.com/500x400?text=Cotton+Tshirt',
      'https://via.placeholder.com/500x400?text=Tshirt+Back'
    ],
    category: 'Clothing',
    price: 5500,
    compareAtPrice: 6000,
    description: 'Premium quality cotton t-shirt, comfortable for everyday wear.',
    shortDescription: '100% cotton t-shirt in various sizes.',
    specifications: [
      { name: 'Material', value: '100% Cotton' },
      { name: 'Care', value: 'Machine Washable' },
      { name: 'Style', value: 'Round Neck' }
    ],
    productType: 'sizes',
    sizeStock: {
      S: 10,
      M: 15,
      L: 20,
      XL: 8,
      XXL: 5
    },
    rating: 4.5,
    reviewCount: 210
  }
];

const StockDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
`;

const SizeButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const SizeButton = styled.button<{ selected?: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : '#ddd'};
  background-color: ${props => props.selected ? 'var(--primary-color)' : '#fff'};
  color: ${props => props.selected ? '#fff' : '#333'};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.selected ? 'var(--primary-color)' : '#f5f5f5'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #ddd;
    background-color: #f5f5f5;
  }
`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, buyNow, cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [_, setSelectedImage] = useState(0);
  const [currentFrequentlyBoughtIndex, setCurrentFrequentlyBoughtIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Find if product is already in cart
  const cartItem = cartItems.find(item => item.id.toString() === id);
  const isInCart = !!cartItem;

  // Get the product data
  // In a real app, this would be fetched from an API
  const product = mockProducts.find((p) => p.id.toString() === id);

  // Handle case where product isn't found
  if (!product) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <Text size="xl">Product not found</Text>
          <Button variant="primary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }

  // Select default size if product has sizes and none is selected
  useEffect(() => {
    if (product.productType === 'sizes' && !selectedSize) {
      // Find first size that has stock
      const availableSize = Object.entries(product.sizeStock || {})
        .find(([_, stock]) => stock > 0);
      
      if (availableSize) {
        setSelectedSize(availableSize[0]);
      }
    }
  }, [product, selectedSize]);

  // Get similar products (same category, excluding current product)
  const frequentlyBoughtProducts = mockProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 8); // Limit to 8 similar products
  
  const maxFrequentlyBoughtIndex = Math.max(0, frequentlyBoughtProducts.length - 4);

  const handlePrevFrequentlyBought = () => {
    setCurrentFrequentlyBoughtIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNextFrequentlyBought = () => {
    setCurrentFrequentlyBoughtIndex(prev => Math.min(maxFrequentlyBoughtIndex, prev + 1));
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 30; // Reduced from 50 for more sensitive swiping
    
    if (distance > minSwipeDistance && currentFrequentlyBoughtIndex < maxFrequentlyBoughtIndex) {
      // Swipe left - go to next recommended products
      handleNextFrequentlyBought();
    } else if (distance < -minSwipeDistance && currentFrequentlyBoughtIndex > 0) {
      // Swipe right - go to previous recommended products
      handlePrevFrequentlyBought();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Helper function to generate image placeholders for testing
  const getImagePlaceholder = (index: number) => {
    return `https://via.placeholder.com/500x500?text=Product+Image+${index + 1}`;
  };

  // Check if product is in stock based on product type
  const isInStock = () => {
    if (product.productType === 'sizes' && selectedSize) {
      return product.sizeStock?.[selectedSize] > 0;
    }
    return product.stock > 0;
  };

  // Get available stock based on product type and selected size
  const getAvailableStock = () => {
    if (product.productType === 'sizes' && selectedSize) {
      return product.sizeStock?.[selectedSize] || 0;
    }
    return product.stock;
  };

  // Handle adding to cart - always adds 1 initially
  const handleAddToCart = () => {
    if (product) {
      // For sized products, we need to include the selected size
      const metadata = product.productType === 'sizes' 
        ? { size: selectedSize } 
        : {};
        
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || getImagePlaceholder(0),
        quantity: quantity,
        metadata
      });
      alert('Product added to cart');
    }
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!isInCart && product) {
      // For sized products, we need to include the selected size
      const metadata = product.productType === 'sizes' 
        ? { size: selectedSize } 
        : {};
        
      // If not in cart, use the buyNow function from context
      buyNow({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || getImagePlaceholder(0),
        quantity: quantity,
        metadata
      });
    } else {
      // Navigate to cart page
      navigate('/cart');
    }
  };

  // Navigate to checkout
  const handleContinueToCheckout = () => {
    // Use the navigation functionality from cart context instead of direct window.location
    // This ensures the cart state is preserved when going to checkout
    navigate('/cart');
  };

  // Navigate back to home page
  const handleContinueShopping = () => {
    navigate('/');
  };

  // Increment cart quantity
  const handleIncrement = () => {
    if (isInCart && cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    } else {
      setQuantity(prev => Math.min(prev + 1, 99)); // Set a reasonable max quantity
    }
  };

  // Decrement cart quantity
  const handleDecrement = () => {
    if (isInCart && cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(cartItem.id, cartItem.quantity - 1);
      } else {
        removeFromCart(cartItem.id);
      }
    } else {
      setQuantity(prev => Math.max(prev - 1, 1)); // Don't go below 1
    }
  };

  // Helper to render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`star-${i}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFD700" viewBox="0 0 16 16">
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 1-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 1-.461 0z"/>
        </svg>
      );
    }

    if (halfStar) {
      stars.push(
        <svg key="star-half" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFD700" viewBox="0 0 16 16">
          <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.506l2.907-2.77-4.052-.575a.525.525 0 0 1-.393-.288L8.001 2.226 8 2.226v9.8z"/>
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`star-empty-${i}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D3D3D3" viewBox="0 0 16 16">
          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 1-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 1-.461 0z"/>
        </svg>
      );
    }

    return stars;
  };

  return (
    <PageContainer>
      <Header />

      <MainContent>
        <SectionContainer>
          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation>
            <Breadcrumb to="/">Home</Breadcrumb>
            <BreadcrumbSeparator>›</BreadcrumbSeparator>
            <Breadcrumb to="/category/electronics">Category</Breadcrumb>
            <BreadcrumbSeparator>›</BreadcrumbSeparator>
            <BreadcrumbCurrent>{product.name}</BreadcrumbCurrent>
          </BreadcrumbNavigation>

          <ProductGrid>
            {/* Left Column - Product Images */}
            <ProductImages>
              <ProductImageGallery 
                images={product.images || []} 
                altText={product.name}
                onImageChange={(index) => setSelectedImage(index)}
              />
            </ProductImages>

            {/* Right Column - Product Info */}
            <ProductInfo>
              <Text size="xl" weight="bold">{product.name}</Text>

              <Rating>
                {renderStars(product.rating)}
                <ReviewCount>{product.rating} ({product.reviewCount} reviews)</ReviewCount>
              </Rating>

              <PriceContainer>
                <Text size="xl" weight="bold" color="var(--primary-color)">
                  {formatCurrency(product.price)}
                </Text>
              </PriceContainer>

              <Text>{product.description}</Text>

              <Spacer size={20} />

              {/* Stock information */}
              <StockDisplay>
                {product.productType === 'sizes' ? (
                  <>
                    <Text size="md" weight="medium">Select Size:</Text>
                    <SizeButtons>
                      {Object.entries(product.sizeStock || {}).map(([size, qty]) => (
                        <SizeButton 
                          key={size}
                          selected={selectedSize === size}
                          disabled={qty <= 0}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size} {qty <= 0 && '(Out of Stock)'}
                        </SizeButton>
                      ))}
                    </SizeButtons>
                    {selectedSize && (
                      <Text size="sm">
                        {product.sizeStock?.[selectedSize] > 0 
                          ? `${product.sizeStock?.[selectedSize]} items available in size ${selectedSize}` 
                          : `Out of stock in size ${selectedSize}`}
                      </Text>
                    )}
                  </>
                ) : (
                  <Text size="sm">
                    {product.stock > 0 
                      ? `${product.stock} ${product.productType === 'packs' ? 'packs' : 'items'} available` 
                      : 'Out of stock'}
                  </Text>
                )}
              </StockDisplay>

              {/* Quantity controls - shown for all products */}
              <div style={{ marginTop: '20px' }}>
                <Text weight="500">Quantity</Text>
                <QuantitySelector>
                  <QuantityButton 
                    onClick={handleDecrement}
                    aria-label="Decrease quantity"
                    disabled={!isInCart && quantity <= 1}
                  >
                    -
                  </QuantityButton>
                  <QuantityValue>{isInCart ? cartItem?.quantity : quantity}</QuantityValue>
                  <QuantityButton 
                    onClick={handleIncrement}
                    aria-label="Increase quantity"
                    disabled={!isInCart && quantity >= 99}
                  >
                    +
                  </QuantityButton>
                </QuantitySelector>
              </div>

              {/* Conditional buttons based on cart status */}
              <FlexBox gap="15px" style={{ marginTop: '20px' }}>
                {isInCart ? (
                  <>
                    <Button 
                      variant="primary" 
                      fullWidth
                      onClick={handleContinueToCheckout}
                    >
                      Checkout Now
                    </Button>
                    <Button 
                      variant="secondary" 
                      fullWidth
                      onClick={handleContinueShopping}
                    >
                      Continue Shopping
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="primary" 
                      fullWidth
                      onClick={handleAddToCart}
                      disabled={!isInStock()}
                    >
                      Add to Cart
                    </Button>
                    <Button 
                      variant="secondary" 
                      fullWidth
                      onClick={handleBuyNow}
                      disabled={!isInStock()}
                    >
                      Buy Now
                    </Button>
                  </>
                )}
              </FlexBox>
            </ProductInfo>
          </ProductGrid>

          {/* Frequently Bought Together Section */}
          <FrequentlyBoughtTogetherSection>
            <Text size="xl" weight="bold" style={{ marginBottom: '20px' }}>Frequently Bought Together</Text>

            {frequentlyBoughtProducts.length > 0 ? (
              <ProductsCarousel>
                <NavButton 
                  direction="left" 
                  onClick={handlePrevFrequentlyBought}
                  disabled={currentFrequentlyBoughtIndex === 0}
                  style={{ opacity: currentFrequentlyBoughtIndex === 0 ? 0.5 : 1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                </NavButton>

                <ProductsTrack 
                  style={{ transform: `translateX(-${currentFrequentlyBoughtIndex * 25}%)` }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {frequentlyBoughtProducts.map(similarProduct => (
                    <ProductSlideCard key={similarProduct.id}>
                      <ProductCard>
                        <CardImage>
                          <img 
                            src={similarProduct.images?.[0] || getImagePlaceholder(0)} 
                            alt={similarProduct.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Product';
                            }}
                          />
                        </CardImage>
                        <CardContent>
                          <CardTitle>
                            <Link to={`/product/${similarProduct.id}`}>{similarProduct.name}</Link>
                          </CardTitle>
                          <CardPrice>{formatCurrency(similarProduct.price)}</CardPrice>
                        </CardContent>
                      </ProductCard>
                    </ProductSlideCard>
                  ))}
                </ProductsTrack>

                <NavButton 
                  direction="right" 
                  onClick={handleNextFrequentlyBought}
                  disabled={currentFrequentlyBoughtIndex === maxFrequentlyBoughtIndex}
                  style={{ opacity: currentFrequentlyBoughtIndex === maxFrequentlyBoughtIndex ? 0.5 : 1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </NavButton>
              </ProductsCarousel>
            ) : (
              <div>No recommended products found</div>
            )}
          </FrequentlyBoughtTogetherSection>
        </SectionContainer>
      </MainContent>

      <Footer />
    </PageContainer>
  );
};

export default ProductDetailPage;
