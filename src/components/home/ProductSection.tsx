import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ProductCard from '../product/ProductCard';
import productService, { Product } from '../../services/productService';
import LoadingSpinner from '../common/LoadingSpinner';

const Container = styled.div`
  margin: 30px 0;
  position: relative;
  
  @media (max-width: 768px) {
    margin: 20px 0;
  }
  
  @media (max-width: 480px) {
    margin: 15px 0;
  }
`;

const ProductsWrapper = styled.div`
  position: relative;
  overflow: hidden;
  padding: 0 5px;
`;

const ProductsScroll = styled.div`
  display: flex;
  gap: 15px;
  transition: transform 0.5s ease;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
  
  @media (max-width: 576px) {
    gap: 8px;
  }
`;

const ProductItem = styled.div`
  flex: 0 0 auto;
  width: calc(16.666% - 13px);
  
  @media (max-width: 1200px) {
    width: calc(25% - 12px);
  }
  
  @media (max-width: 768px) {
    width: calc(33.333% - 7px);
  }
  
  @media (max-width: 576px) {
    width: calc(50% - 4px);
  }
  
  @media (max-width: 375px) {
    width: 100%;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #f8f8f8;
  }
  
  &.prev {
    left: -20px;
  }
  
  &.next {
    right: -20px;
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    
    &.prev {
      left: -10px;
    }
    
    &.next {
      right: -10px;
    }
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const ProductSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getFeaturedProducts(12); // Fetch more products for scrolling
        setProducts(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handlePrevClick = () => {
    if (!scrollRef.current) return;
    
    // Get item width (including gap)
    const itemWidth = scrollRef.current.querySelector('div')?.offsetWidth || 0;
    const containerWidth = scrollRef.current.offsetWidth;
    const itemsPerScreen = Math.floor(containerWidth / itemWidth);
    
    // Calculate new scroll position
    const newPosition = Math.max(0, scrollPosition - (itemWidth * itemsPerScreen));
    setScrollPosition(newPosition);
  };

  const handleNextClick = () => {
    if (!scrollRef.current) return;
    
    // Get item width (including gap)
    const itemWidth = scrollRef.current.querySelector('div')?.offsetWidth || 0;
    const containerWidth = scrollRef.current.offsetWidth;
    const itemsPerScreen = Math.floor(containerWidth / itemWidth);
    
    // Calculate max scroll position
    const scrollableWidth = scrollRef.current.scrollWidth - containerWidth;
    
    // Calculate new scroll position
    const newPosition = Math.min(scrollableWidth, scrollPosition + (itemWidth * itemsPerScreen));
    setScrollPosition(newPosition);
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#e53935' }}>{error}</div>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>No featured products available at the moment.</div>
      </Container>
    );
  }

  // Determine if nav buttons should be visible
  const canScrollPrev = scrollPosition > 0;
  const canScrollNext = scrollRef.current ? 
    scrollPosition < (scrollRef.current.scrollWidth - scrollRef.current.offsetWidth - 5) : // 5px buffer
    products.length > 6;

  return (
    <Container>
      <ProductsWrapper>
        <ProductsScroll 
          ref={scrollRef}
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {products.map((product) => (
            <ProductItem key={product.id}>
              <ProductCard
                id={product.id}
                slug={product.slug}
                name={product.name}
                image={product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : 'https://via.placeholder.com/300x300?text=No+Image'}
                price={parseFloat(product.price.toString())}
                salePrice={product.sale_price ? parseFloat(product.sale_price.toString()) : undefined}
                rating={product.average_rating || 0}
                reviewCount={product.review_count || 0}
                deliveryTime={product.delivery_time}
                category={product.category?.name || ''}
                inStock={product.stock > 0}
              />
            </ProductItem>
          ))}
        </ProductsScroll>
      </ProductsWrapper>
      
      {canScrollPrev && (
        <NavigationButton className="prev" onClick={handlePrevClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </NavigationButton>
      )}
      
      {canScrollNext && (
        <NavigationButton className="next" onClick={handleNextClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </NavigationButton>
      )}
    </Container>
  );
};

export default ProductSection;
