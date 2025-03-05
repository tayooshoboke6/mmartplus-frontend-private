import React, { useState, useEffect, useRef, TouchEvent, ReactNode } from 'react';
import styled from 'styled-components';

// Styled Components
const SliderContainer = styled.div<{ fullHeight?: boolean }>`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: ${props => props.fullHeight ? '100%' : 'auto'};
  touch-action: pan-y;
`;

const SliderTrack = styled.div<{ transition: string }>`
  display: flex;
  width: 100%;
  height: 100%;
  transition: ${props => props.transition};
`;

const SliderDots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  z-index: 10;
`;

const SliderDot = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  margin: 0 4px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 480px) {
    width: 8px;
    height: 8px;
    margin: 0 3px;
  }
`;

// Types
interface TouchSliderProps {
  children: ReactNode[];
  autoRotate?: boolean;
  rotationInterval?: number;
  showDots?: boolean;
  fullHeight?: boolean;
  dotsColor?: string;
  dotsActiveColor?: string;
  onSlideChange?: (index: number) => void;
  sensitivity?: number; // Optional prop to override the global sensitivity
}

/**
 * TouchSlider - A reusable component for creating touch-enabled sliders
 * 
 * Features:
 * - Touch swipe navigation
 * - Optional auto-rotation
 * - Optional navigation dots
 * - Customizable timing and appearance
 * 
 * @example
 * <TouchSlider autoRotate rotationInterval={5000} showDots>
 *   <SlideContent>Slide 1</SlideContent>
 *   <SlideContent>Slide 2</SlideContent>
 *   <SlideContent>Slide 3</SlideContent>
 * </TouchSlider>
 */
const TouchSlider: React.FC<TouchSliderProps> = ({
  children,
  autoRotate = false,
  rotationInterval = 5000,
  showDots = true,
  fullHeight = false,
  dotsColor,
  dotsActiveColor,
  onSlideChange,
  sensitivity
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0); // Track the current drag position
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Get the sensitivity setting from localStorage or use the default/prop value
  const getSensitivity = () => {
    // If prop is provided, use it
    if (sensitivity !== undefined) {
      return sensitivity;
    }
    
    // Otherwise try to get from localStorage
    const storedSensitivity = localStorage.getItem('sliderSensitivity');
    return storedSensitivity ? parseInt(storedSensitivity) : 50; // Default to 50 if not set
  };
  
  // Calculate minimum swipe distance based on sensitivity
  // Higher sensitivity = smaller swipe distance required
  const getMinSwipeDistance = () => {
    const baseSensitivity = 50; // This corresponds to 30px swipe distance
    const baseDistance = 30;
    
    // Convert sensitivity to a distance value (inversely proportional)
    // Higher sensitivity = lower distance required
    const currentSensitivity = getSensitivity();
    return Math.max(10, Math.round(baseDistance * (baseSensitivity / currentSensitivity)));
  };
  
  // Minimum swipe distance required (in pixels) - now dynamic based on sensitivity
  const slideCount = React.Children.count(children);
  
  // Auto-rotate slides
  useEffect(() => {
    let interval: number;
    
    if (autoRotate && !isSwiping && slideCount > 1) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slideCount);
      }, rotationInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRotate, isSwiping, rotationInterval, slideCount]);
  
  // Update translateX when currentSlide changes
  useEffect(() => {
    setTranslateX(-currentSlide * 100);
    
    if (onSlideChange) {
      onSlideChange(currentSlide);
    }
  }, [currentSlide, onSlideChange]);
  
  // Touch handlers for swipe functionality
  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
    setDragOffset(0); // Reset drag offset when starting a new touch
  };
  
  const onTouchMove = (e: TouchEvent) => {
    if (!touchStart || slideCount <= 1) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;
    
    // Calculate the percentage to move based on screen width
    const containerWidth = sliderRef.current?.offsetWidth || 1;
    const percentageMoved = (diff / containerWidth) * 100;
    
    // Store the current touch position
    setTouchEnd(currentTouch);
    
    // Store the current drag offset
    setDragOffset(percentageMoved);
    
    // Update the translateX with the current drag position
    // This creates a free-flowing movement that follows the user's finger
    const newTranslateX = -currentSlide * 100 - percentageMoved;
    
    // Add boundaries to prevent dragging too far beyond the first/last slide
    // Allow some elasticity (20% overflow) for a natural feel
    if (newTranslateX > 20) {
      // Dragging past the first slide (left edge)
      setTranslateX(20);
    } else if (newTranslateX < -((slideCount - 1) * 100 + 20)) {
      // Dragging past the last slide (right edge)
      setTranslateX(-((slideCount - 1) * 100 + 20));
    } else {
      // Normal dragging within bounds
      setTranslateX(newTranslateX);
    }
  };
  
  const onTouchEnd = () => {
    setIsSwiping(false);
    
    if (!touchStart || !touchEnd || slideCount <= 1) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = getMinSwipeDistance();
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // Calculate which slide to snap to based on the current position and drag amount
    // This creates a more natural feel as it considers how far the user has dragged
    let targetSlide = currentSlide;
    
    // If the user has dragged more than 30% of the slide width, move to the next/previous slide
    if (Math.abs(dragOffset) > 30) {
      if (dragOffset > 0 && currentSlide < slideCount - 1) {
        // Dragged left significantly, go to next slide
        targetSlide = currentSlide + 1;
      } else if (dragOffset < 0 && currentSlide > 0) {
        // Dragged right significantly, go to previous slide
        targetSlide = currentSlide - 1;
      }
    } else {
      // For smaller drags, use the swipe velocity/direction
      if (isLeftSwipe && currentSlide < slideCount - 1) {
        // Swipe left - go to next slide
        targetSlide = currentSlide + 1;
      } else if (isRightSwipe && currentSlide > 0) {
        // Swipe right - go to previous slide
        targetSlide = currentSlide - 1;
      }
    }
    
    // Set the current slide, which will trigger the useEffect to update translateX
    setCurrentSlide(targetSlide);
    
    // Reset touch values
    setTouchStart(null);
    setTouchEnd(null);
    setDragOffset(0);
  };
  
  // Go to a specific slide
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  return (
    <SliderContainer 
      ref={sliderRef} 
      fullHeight={fullHeight}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <SliderTrack 
        style={{ transform: `translateX(${translateX}%)` }}
        transition={isSwiping ? 'none' : 'transform 0.3s ease-out'} // Smooth transition when not swiping
      >
        {React.Children.map(children, (child) => (
          <div style={{ minWidth: '100%', width: '100%', flexShrink: 0 }}>
            {child}
          </div>
        ))}
      </SliderTrack>
      
      {showDots && slideCount > 1 && (
        <SliderDots>
          {Array.from({ length: slideCount }).map((_, index) => (
            <SliderDot
              key={index}
              active={index === currentSlide}
              onClick={() => goToSlide(index)}
              style={index === currentSlide 
                ? dotsActiveColor ? { backgroundColor: dotsActiveColor } : {}
                : dotsColor ? { backgroundColor: dotsColor } : {}
              }
            />
          ))}
        </SliderDots>
      )}
    </SliderContainer>
  );
};

export default TouchSlider;
