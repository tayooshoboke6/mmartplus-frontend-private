import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Text, FlexBox } from '../styles/GlobalComponents';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import productService, { Product } from '../services/productService';
import recentlyViewedService from '../services/recentlyViewedService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/product/StarRating';
import ProductRatings from '../components/product/ProductRatings';

// Check if a string is numeric
const isNumeric = (str: string): boolean => {
  return !isNaN(parseFloat(str)) && isFinite(Number(str));
};

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

const ErrorContainer = styled.div`
  margin: 50px auto;
  padding: 20px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
  max-width: 600px;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: var(--border-color);
  margin: 20px 0;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: #fff;
  cursor: pointer;
`;

const QuantityDisplay = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary', fullWidth?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  background-color: ${props => props.variant === 'primary' ? 'var(--primary-color)' : 'var(--secondary-color)'};
  color: #fff;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const ReviewCount = styled.span`
  margin-left: 8px;
  color: var(--text-secondary);
  font-size: 14px;
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

const StockInfo = styled.div<{ inStock: boolean }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 10px;
  background-color: ${props => props.inStock ? 'var(--success-light)' : 'var(--error-light)'};
  color: ${props => props.inStock ? 'var(--success-color)' : 'var(--error-color)'};
`;

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // State variables
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Get product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`[ProductDetailPage] Starting product fetch for ID/slug: ${id}`);
        
        if (isNumeric(id)) {
          // If ID is numeric, fetch by ID
          try {
            console.log(`[ProductDetailPage] Fetching by numeric ID: ${id}`);
            const productByIdResponse = await productService.getProduct(parseInt(id));
            
            if (productByIdResponse.success && productByIdResponse.product) {
              console.log('[ProductDetailPage] Successfully fetched product by ID:', productByIdResponse.product);
              setProduct(productByIdResponse.product);
              setError(null);
              setLoading(false);
              return;
            }
          } catch (idError) {
            console.error('[ProductDetailPage] Error fetching by ID:', idError);
          }
        } else {
          // If ID is not numeric, fetch by slug
          try {
            console.log(`[ProductDetailPage] Fetching by slug: ${id}`);
            const productBySlugResponse = await productService.getProductBySlug(id);
            
            if (productBySlugResponse.success && productBySlugResponse.product) {
              console.log('[ProductDetailPage] Successfully fetched product by slug:', productBySlugResponse.product);
              setProduct(productBySlugResponse.product);
              setError(null);
              setLoading(false);
              return;
            } else {
              console.error('[ProductDetailPage] No product found in response:', productBySlugResponse);
              setError(productBySlugResponse.message || 'Product not found');
            }
          } catch (slugError) {
            console.error(`[ProductDetailPage] Error fetching by slug: ${slugError}`);
            setError(`Failed to fetch product: ${slugError.message || 'Unknown error'}`);
          }
        }
        
        console.error(`[ProductDetailPage] No product found with ID/slug: ${id}`);
        setError(`Product with slug '${id}' not found`);
        setLoading(false);
      } catch (error) {
        console.error('[ProductDetailPage] Error:', error);
        setError('An unexpected error occurred. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  // Track product view
  useEffect(() => {
    const trackProductView = async () => {
      if (!product) return;
      
      try {
        console.log('[ProductDetailPage] Tracking product view:', product.id);
        
        // Create a simplified product object with only the required fields
        const trackProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: typeof product.images?.[0] === 'string' 
            ? product.images?.[0] 
            : product.images?.[0]?.url || '',
          category: product.category?.name || 'General',
          rating: product.bayesian_rating || product.average_rating || 0
        };
        
        // Try to add to recently viewed, but don't let it block rendering if it fails
        await recentlyViewedService.addToRecentlyViewed(trackProduct);
        console.log('[ProductDetailPage] Successfully added to recently viewed');
      } catch (error) {
        // This is normal for users without proper permissions, so just log it
        console.log('[ProductDetailPage] Could not add to recently viewed, user may not have proper permissions');
      }
    };
    
    trackProductView();
  }, [product]);

  // Handle adding product to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  // Render loading state
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

  // Render error state
  if (error || !product) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <ErrorContainer>
            <Text size="lg" weight="bold" color="var(--error-color)">Something went wrong</Text>
            <Text>{error || 'Product not found'}</Text>
            <button onClick={() => navigate('/')}>Return to Home</button>
          </ErrorContainer>
        </MainContent>
        <Footer />
      </PageContainer>
    );
  }

  // Render product details
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <BreadcrumbNavigation>
          <Breadcrumb to="/">Home</Breadcrumb>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          {product.category ? (
            <>
              <Breadcrumb to={`/category/${product.category.id || product.category.slug}`}>
                {product.category.name}
              </Breadcrumb>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </>
          ) : (
            <>
              <Breadcrumb to="/products">Products</Breadcrumb>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </>
          )}
          <BreadcrumbCurrent>{product.name}</BreadcrumbCurrent>
        </BreadcrumbNavigation>
        <ProductGrid>
          {/* Left Column - Product Images */}
          <ProductImages>
            {product.images && product.images.length > 0 && (
              <img 
                src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url} 
                alt={product.name}
                style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px' }}
              />
            )}
          </ProductImages>

          {/* Right Column - Product Info */}
          <ProductInfo>
            <Text size="xl" weight="bold">{product.name}</Text>
            
            <Rating>
              <StarRating 
                rating={product.average_rating || 0} 
                bayesianRating={product.bayesian_rating || 0}
                useBayesian={true}
                size="md"
                showCount={true}
                count={product.rating_count || 0}
                tooltipText="Calculated using Bayesian average to provide a fair rating"
              />
            </Rating>
            
            <Text>{product.description || product.short_description || 'No description available'}</Text>
            
            <PriceContainer>
              <Text size="xl" weight="bold" color="var(--primary-color)">
                {formatCurrency(product.price)}
              </Text>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <Text size="md" style={{ textDecoration: 'line-through', color: 'var(--text-secondary)' }}>
                  {formatCurrency(product.compare_at_price)}
                </Text>
              )}
            </PriceContainer>

            <StockInfo inStock={product.stock_quantity > 0 || product.stock > 0}>
              {product.stock_quantity > 0 || product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </StockInfo>

            <Divider />
            
            {/* Quantity Selector */}
            <Text size="md" weight="medium">Quantity:</Text>
            <QuantitySelector>
              <QuantityButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</QuantityButton>
              <QuantityDisplay>{quantity}</QuantityDisplay>
              <QuantityButton onClick={() => setQuantity(Math.min(99, quantity + 1))}>+</QuantityButton>
            </QuantitySelector>

            <Divider />

            <FlexBox gap="15px" wrap="wrap">
              <Button 
                onClick={handleAddToCart} 
                variant="primary" 
                fullWidth
                disabled={!(product.stock_quantity > 0 || product.stock > 0)}
              >
                Add to Cart
              </Button>
              <Button 
                onClick={() => navigate('/cart')} 
                variant="secondary" 
                fullWidth
              >
                Buy Now
              </Button>
            </FlexBox>
          </ProductInfo>
        </ProductGrid>
        
        {/* Product Ratings Section */}
        <ProductRatings 
          productId={product.id}
          initialAverageRating={product.average_rating}
          initialBayesianRating={product.bayesian_rating}
          initialRatingCount={product.rating_count}
        />
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

export default ProductDetailPage;
