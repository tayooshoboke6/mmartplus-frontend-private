import React, { useState, useRef, TouchEvent } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';

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

const ProductSlideCard = styled.div`
  flex: 0 0 calc(25% - 20px);
  
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

const ProductCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div`
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
`;

const CardContent = styled.div`
  padding: 15px;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 10px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const CardPrice = styled.div`
  font-weight: bold;
  color: var(--primary-color);
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

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 600;
`;

interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
  images?: string[];
  category?: string;
}

interface SimilarProductsSliderProps {
  products: Product[];
  currentProductId: number;
  title?: string;
}

/**
 * SimilarProductsSlider - A touchable slider for displaying similar products
 * 
 * @example
 * <SimilarProductsSlider 
 *   products={products} 
 *   currentProductId={123} 
 *   title="Products you may like" 
 * />
 */
const SimilarProductsSlider: React.FC<SimilarProductsSliderProps> = ({ 
  products, 
  currentProductId,
  title = 'Similar Products'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [dragTranslateX, setDragTranslateX] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Filter out current product and limit to 8 similar products
  const similarProducts = products
    .filter(product => product.id !== currentProductId)
    .slice(0, 8);
  
  const maxIndex = Math.max(0, similarProducts.length - 4);
  
  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };
  
  // Touch handlers for swipe functionality
  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
    setDragTranslateX(-(currentIndex * 25)); // Initialize drag position to current position
  };
  
  const onTouchMove = (e: TouchEvent) => {
    if (!touchStart) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;
    
    // Calculate the percentage to move based on screen width
    const containerWidth = trackRef.current?.offsetWidth || 1;
    const percentageMoved = (diff / containerWidth) * 100;
    
    // Calculate the new position with the drag offset
    const newPosition = -(currentIndex * 25) - (percentageMoved / 4);
    
    // Add boundaries to prevent dragging too far beyond the first/last slide
    // Allow some elasticity (5% overflow) for a natural feel
    if (newPosition > 5) {
      // Dragging past the first slide (left edge)
      setDragTranslateX(5);
    } else if (newPosition < -(maxIndex * 25 + 5)) {
      // Dragging past the last slide (right edge)
      setDragTranslateX(-(maxIndex * 25 + 5));
    } else {
      // Normal dragging within bounds
      setDragTranslateX(newPosition);
    }
    
    setTouchEnd(currentTouch);
  };
  
  // Get the sensitivity setting from localStorage or use the default value
  const getSensitivity = () => {
    const storedSensitivity = localStorage.getItem('sliderSensitivity');
    return storedSensitivity ? parseInt(storedSensitivity) : 50; // Default to 50 if not set
  };
  
  // Calculate minimum swipe distance based on sensitivity
  // Higher sensitivity = smaller swipe distance required
  const getMinSwipeDistance = () => {
    const baseSensitivity = 50; // This corresponds to 50px swipe distance
    const baseDistance = 50;
    
    // Convert sensitivity to a distance value (inversely proportional)
    // Higher sensitivity = lower distance required
    const currentSensitivity = getSensitivity();
    return Math.max(10, Math.round(baseDistance * (baseSensitivity / currentSensitivity)));
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    setIsSwiping(false);
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = getMinSwipeDistance();
    
    // Calculate which product set to snap to based on the current drag position
    // Get the current drag percentage relative to the item width (25%)
    const currentDragPercentage = Math.abs(dragTranslateX - (-(currentIndex * 25)));
    
    // If dragged more than 6.25% (quarter of an item width), move to the next/previous set
    let targetIndex = currentIndex;
    
    if (currentDragPercentage > 6.25) {
      if (distance > 0 && currentIndex < maxIndex) {
        // Dragged left significantly, go to next set
        targetIndex = currentIndex + 1;
      } else if (distance < 0 && currentIndex > 0) {
        // Dragged right significantly, go to previous set
        targetIndex = currentIndex - 1;
      }
    } else {
      // For smaller drags, use the swipe velocity/direction
      if (distance > minSwipeDistance && currentIndex < maxIndex) {
        // Swipe left - go to next similar products
        targetIndex = currentIndex + 1;
      } else if (distance < -minSwipeDistance && currentIndex > 0) {
        // Swipe right - go to previous similar products
        targetIndex = currentIndex - 1;
      }
    }
    
    // Update the current index
    setCurrentIndex(targetIndex);
    
    // Reset touch values
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // Generate image placeholder if needed
  const getImagePlaceholder = (index: number) => {
    return `https://via.placeholder.com/200x200?text=Product+${index + 1}`;
  };
  
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      
      {similarProducts.length > 0 ? (
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
            style={{ 
              transform: `translateX(${isSwiping ? dragTranslateX : -(currentIndex * 25)}%)`,
              transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {similarProducts.map((product) => (
              <ProductSlideCard key={product.id}>
                <ProductCard>
                  <CardImage>
                    <img 
                      src={product.images?.[0] || getImagePlaceholder(0)} 
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Product';
                      }}
                    />
                  </CardImage>
                  <CardContent>
                    <CardTitle>
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </CardTitle>
                    <CardPrice>{formatCurrency(product.discount || product.price)}</CardPrice>
                  </CardContent>
                </ProductCard>
              </ProductSlideCard>
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
      ) : (
        <div>No similar products found</div>
      )}
    </div>
  );
};

export default SimilarProductsSlider;
