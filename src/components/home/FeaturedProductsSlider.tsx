import React, { useState, useRef, TouchEvent } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';

// Styled components for the slider
const Container = styled.div`
  margin: 30px 0;
  position: relative;
`;

const SliderTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 600;
`;

const ProductsCarousel = styled.div`
  position: relative;
  overflow: hidden;
  padding: 0 40px;
  touch-action: pan-y;
  
  @media (max-width: 480px) {
    padding: 0 30px;
  }
`;

const ProductsTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  gap: 20px;
  
  @media (max-width: 768px) {
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const ProductCard = styled.div`
  flex: 0 0 calc(25% - 20px);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 1024px) {
    flex: 0 0 calc(33.333% - 15px);
  }
  
  @media (max-width: 768px) {
    flex: 0 0 calc(50% - 15px);
  }
  
  @media (max-width: 480px) {
    flex: 0 0 calc(100% - 10px);
  }
`;

const ProductImage = styled.div`
  height: 200px;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    height: 180px;
  }
  
  @media (max-width: 480px) {
    height: 160px;
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e74c3c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: 500;
  
  a {
    color: #333;
    text-decoration: none;
    
    &:hover {
      color: #0070f3;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CurrentPrice = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #0070f3;
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const OriginalPrice = styled.span`
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const NavButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'left' ? 'left: 0;' : 'right: 0;'}
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  svg {
    width: 24px;
    height: 24px;
    fill: #333;
  }
  
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

// Interface for product data
interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image?: string;
  images?: string[];
  category?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
}

interface FeaturedProductsSliderProps {
  products: Product[];
  title?: string;
  onAddToCart?: (productId: number) => void;
}

const FeaturedProductsSlider: React.FC<FeaturedProductsSliderProps> = ({ 
  products,
  title = "Featured Products",
  onAddToCart 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Filter featured products
  const featuredProducts = products
    .filter(product => product.discount || product.oldPrice)
    .slice(0, 12);
  
  // Calculate the maximum index that still shows a full set of products
  const maxIndex = Math.max(0, featuredProducts.length - 4);
  
  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };
  
  // Touch handlers for swipe functionality
  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: TouchEvent) => {
    if (!touchStart) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (distance > minSwipeDistance && currentIndex < maxIndex) {
      // Swipe left - go to next
      handleNext();
    } else if (distance < -minSwipeDistance && currentIndex > 0) {
      // Swipe right - go to previous
      handlePrev();
    }
    
    // Reset touch values
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // Helper function to generate image placeholders for testing
  const getImagePlaceholder = (index: number) => {
    return `https://via.placeholder.com/300x200?text=Featured+${index + 1}`;
  };
  
  if (featuredProducts.length === 0) {
    return null;
  }
  
  return (
    <Container>
      <SliderTitle>{title}</SliderTitle>
      
      <ProductsCarousel>
        <NavButton 
          direction="left" 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </NavButton>
        
        <ProductsTrack 
          ref={trackRef}
          style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id}>
              <ProductImage>
                <img 
                  src={product.image || product.images?.[0] || getImagePlaceholder(index)} 
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Product';
                  }}
                />
                {(product.discount || product.oldPrice) && (
                  <DiscountBadge>
                    {product.discount ? 
                      `-${product.discount}%` : 
                      `-${Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)}%`}
                  </DiscountBadge>
                )}
              </ProductImage>
              <ProductInfo>
                <ProductName>
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </ProductName>
                <ProductPrice>
                  <CurrentPrice>{formatCurrency(product.price)}</CurrentPrice>
                  {(product.oldPrice || product.discount) && (
                    <OriginalPrice>
                      {product.oldPrice ? 
                        formatCurrency(product.oldPrice) : 
                        formatCurrency(product.price * (1 + product.discount! / 100))}
                    </OriginalPrice>
                  )}
                </ProductPrice>
                {product.rating && (
                  <div>
                    <span>{product.rating.toFixed(1)} ({product.reviewCount || 0})</span>
                  </div>
                )}
                <button onClick={() => onAddToCart?.(product.id)}>Add to Cart</button>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsTrack>
        
        <NavButton 
          direction="right" 
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
          style={{ opacity: currentIndex === maxIndex ? 0.5 : 1 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </NavButton>
      </ProductsCarousel>
    </Container>
  );
};

export default FeaturedProductsSlider;
