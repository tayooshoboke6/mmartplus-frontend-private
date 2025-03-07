import { useState, useEffect } from 'react';
import type { TouchEvent as ReactTouchEvent } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Text, Button, FlexBox } from '../styles/GlobalComponents';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import recentlyViewedService from '../services/recentlyViewedService';
import productService, { Product } from '../services/productService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import config from '../config';

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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
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

const ProductTitle = styled(Link)`
  font-size: 14px;
  margin: 0 0 8px;
  font-weight: 500;
  text-decoration: none;
  color: var(--text-primary);
`;

const PriceDisplay = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const CurrentPrice = styled.div`
  font-weight: bold;
  color: var(--primary-color);
`;

const OldPrice = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: line-through;
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

const SimilarProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
`;

const SimilarProductCard = styled.div`
  cursor: pointer;
`;

const SimilarProductImage = styled.div`
  overflow: hidden;
  border-radius: 8px;
`;

const SimilarProductInfo = styled.div`
  padding: 12px;
`;

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem, cartItems, updateQuantity, removeFromCart, buyNow } = useCart();
  
  // State management
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('description');
  
  // Touch events for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [currentFrequentlyBoughtIndex, setCurrentFrequentlyBoughtIndex] = useState(0);

  // Find if product is already in cart
  const cartItem = cartItems?.find(item => id && item.id?.toString() === id.toString());
  const isInCart = !!cartItem;

  // Fetch product data when the component mounts or ID changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Using hardcoded data for development
        // This is temporary until the API is properly connected
        const mockProduct = {
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
        };
        
        console.log('Using mock product data for development');
        setProduct(mockProduct);
        
        // Mock similar products
        setSimilarProducts([
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
        ]);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  // Handle case where product is loading
  if (loading) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <LoadingSpinner />
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }

  // Handle case where product isn't found or there's an error
  if (error || !product) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text size="lg" color="var(--error-color)">{error || 'Product not found'}</Text>
            <Spacer size={20} />
            <Button variant="outlined" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </div>
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }

  // Select default size if product has sizes and none is selected
  useEffect(() => {
    if (product?.productType === 'sizes' && !selectedSize) {
      // Find first size that has stock
      const availableSize = Object.entries(product.sizeStock || {})
        .find(([_, stock]) => stock > 0);
      
      if (availableSize) {
        setSelectedSize(availableSize[0]);
      }
    }
  }, [product, selectedSize]);
  
  const maxFrequentlyBoughtIndex = Math.max(0, similarProducts.length - 4);

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
        
      addItem({
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
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 1-.163.506l-.694 3.957-3.686-1.894a.503.503 0 0 1-.461 0z"/>
        </svg>
      );
    }

    if (halfStar) {
      stars.push(
        <svg key="star-half" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFD700" viewBox="0 0 16 16">
          <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.506l2.907 2.77-4.052-.575a.525.525 0 0 1-.393-.288L8.001 2.226 8 2.226v9.8z"/>
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`star-empty-${i}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D3D3D3" viewBox="0 0 16 16">
          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8 2.223l-1.847 3.658a.525.525 0 0 0-.393.288l-4.052.575 2.906 2.77a.565.565 0 0 1 .163.506l.694 3.957 3.686-1.894a.503.503 0 0 1 .461 0z"/>
        </svg>
      );
    }

    return stars;
  };

  // Track product view
  useEffect(() => {
    const trackProductView = async () => {
      try {
        await recentlyViewedService.addProduct(product);
      } catch (error) {
        console.error('Error tracking product view:', error);
      }
    };
    trackProductView();
  }, [product]);

  return (
    <PageContainer>
      <Header />

      <MainContent>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text size="lg" color="var(--error-color)">{error}</Text>
            <Spacer size={20} />
            <Button variant="outlined" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </div>
        ) : product ? (
          <SectionContainer>
            {/* Breadcrumb Navigation */}
            <BreadcrumbNavigation>
              <Breadcrumb to="/">Home</Breadcrumb>
              <BreadcrumbSeparator>›</BreadcrumbSeparator>
              {product.category && (
                <>
                  <Breadcrumb to={`/category/${product.category.id}`}>
                    {product.category.name}
                  </Breadcrumb>
                  <BreadcrumbSeparator>›</BreadcrumbSeparator>
                </>
              )}
              <BreadcrumbCurrent>{product.name}</BreadcrumbCurrent>
            </BreadcrumbNavigation>

            <ProductGrid>
              {/* Left Column - Product Images */}
              <ProductImages>
                {product.images && product.images.length > 0 && (
                  <img 
                    src={product.images[0].url} 
                    alt={product.name}
                    style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }}
                  />
                )}
              </ProductImages>

              {/* Right Column - Product Info */}
              <ProductInfo>
                <Text size="xl" weight="bold">{product.name}</Text>

                <Rating>
                  {renderStars(product.rating || 0)}
                  <ReviewCount>{product.rating || 0} ({product.review_count || 0} reviews)</ReviewCount>
                </Rating>

                <PriceContainer>
                  <Text size="xl" weight="bold" color="var(--primary-color)">
                    {formatCurrency(product.price)}
                  </Text>
                </PriceContainer>

                <Text>{product.description}</Text>

                <Spacer size={20} />

                {/* Quantity controls */}
                <Text size="md" weight="medium">Quantity:</Text>
                <FlexBox align="center" gap="10px">
                  <QuantityButton onClick={handleDecrement}>-</QuantityButton>
                  <QuantityDisplay>{isInCart ? cartItem?.quantity : quantity}</QuantityDisplay>
                  <QuantityButton onClick={handleIncrement}>+</QuantityButton>
                </FlexBox>

                <Spacer size={20} />

                {/* Add to cart & Buy now buttons */}
                <FlexBox gap="15px" wrap="wrap">
                  <Button 
                    onClick={handleAddToCart} 
                    variant={isInCart ? "outlined" : "filled"}
                    fullWidth
                  >
                    {isInCart ? 'Update Cart' : 'Add to Cart'}
                  </Button>
                  <Button 
                    onClick={handleBuyNow} 
                    variant="filled" 
                    color="secondary"
                    fullWidth
                  >
                    Buy Now
                  </Button>
                </FlexBox>
              </ProductInfo>
            </ProductGrid>

            {/* Similar Products */}
            {similarProducts && similarProducts.length > 0 && (
              <SectionContainer>
                <Text size="lg" weight="bold" style={{ marginBottom: '20px' }}>
                  Similar Products
                </Text>
                <SimilarProductsGrid>
                  {similarProducts.map((product) => (
                    <div key={product.id} onClick={() => navigate(`/product/${product.slug || product.id}`)}>
                      <SimilarProductCard>
                        <SimilarProductImage>
                          {product.images && product.images.length > 0 && (
                            <img 
                              src={product.images[0].url} 
                              alt={product.name}
                              style={{ maxWidth: '100%', height: 'auto' }}
                            />
                          )}
                        </SimilarProductImage>
                        <SimilarProductInfo>
                          <Text size="sm" weight="medium">{product.name}</Text>
                          <Text size="sm" color="var(--primary-color)" weight="medium">
                            {formatCurrency(product.price)}
                          </Text>
                        </SimilarProductInfo>
                      </SimilarProductCard>
                    </div>
                  ))}
                </SimilarProductsGrid>
              </SectionContainer>
            )}
          </SectionContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text size="lg">Product not found</Text>
            <Spacer size={20} />
            <Button variant="outlined" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </div>
        )}
      </MainContent>

      <Footer />
    </PageContainer>
  );
};

export default ProductDetailPage;
