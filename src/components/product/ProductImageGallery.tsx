import React, { useState, TouchEvent } from 'react';
import styled from 'styled-components';

const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
`;

const MainImageContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: 768px) {
    height: 300px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
  }
`;

const ThumbsContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ThumbImage = styled.div<{ active: boolean }>`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s ease;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:hover {
    border-color: ${props => props.active ? 'var(--primary-color)' : '#ddd'};
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const NavButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'left' ? 'left: 10px;' : 'right: 10px;'}
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

interface ProductImageGalleryProps {
  images: string[];
  altText: string;
  onImageChange?: (index: number) => void;
}

/**
 * ProductImageGallery - A component for displaying product images with navigation
 */
const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  images, 
  altText,
  onImageChange 
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Generate placeholder image if no images are provided
  const getImagePlaceholder = () => {
    return `https://via.placeholder.com/500x500?text=Product+Image`;
  };
  
  // Use provided images or a single placeholder if none provided
  // Only use the actual number of images that were uploaded
  const productImages = images && images.length > 0 
    ? images 
    : [getImagePlaceholder()];
  
  const handleImageChange = (index: number) => {
    setActiveImage(index);
    if (onImageChange) {
      onImageChange(index);
    }
  };
  
  const handlePrev = () => {
    const newIndex = activeImage === 0 ? productImages.length - 1 : activeImage - 1;
    handleImageChange(newIndex);
  };
  
  const handleNext = () => {
    const newIndex = activeImage === productImages.length - 1 ? 0 : activeImage + 1;
    handleImageChange(newIndex);
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
  
  // Touch swipe handlers
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
    const minSwipeDistance = getMinSwipeDistance();
    
    if (distance > minSwipeDistance) {
      // Swipe left - go to next image
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swipe right - go to previous image
      handlePrev();
    }
    
    // Reset touch values
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  return (
    <GalleryContainer>
      <MainImageContainer
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img 
          src={productImages[activeImage]} 
          alt={`${altText} - View ${activeImage + 1}`} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = getImagePlaceholder();
          }}
        />
        
        {productImages.length > 1 && (
          <>
            <NavButton 
              direction="left" 
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </NavButton>
            
            <NavButton 
              direction="right" 
              onClick={handleNext}
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </NavButton>
          </>
        )}
      </MainImageContainer>
      
      {productImages.length > 1 && (
        <ThumbsContainer>
          {productImages.map((image, index) => (
            <ThumbImage 
              key={index} 
              active={index === activeImage}
              onClick={() => handleImageChange(index)}
            >
              <img 
                src={image} 
                alt={`${altText} thumbnail ${index + 1}`} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getImagePlaceholder();
                }}
              />
            </ThumbImage>
          ))}
        </ThumbsContainer>
      )}
    </GalleryContainer>
  );
};

export default ProductImageGallery;
