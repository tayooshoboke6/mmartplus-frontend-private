import React from 'react';
import styled from 'styled-components';

interface StarRatingProps {
  rating: number;
  bayesianRating?: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
  interactive?: boolean;
  useBayesian?: boolean;
  tooltipText?: string;
  onRatingChange?: (rating: number) => void;
}

const StarsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  position: relative;
`;

const StarsWrapper = styled.div`
  position: relative;
  display: inline-block;
  color: #f3c200;
  white-space: nowrap;
  font-size: 16px;
`;

const FilledStars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  color: #f3c200;
  overflow: hidden;
  z-index: 1;
  white-space: nowrap;
`;

const EmptyStars = styled.div`
  white-space: nowrap;
  z-index: 0;
  color: #d1d1d1;
`;

const ReviewCount = styled.span`
  margin-left: 3px;
  color: #666;
  font-size: 12px;
`;

const RatingTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }
`;

const RatingContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${RatingTooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  bayesianRating,
  maxRating = 5,
  size = 'md',
  showCount = false,
  count = 0,
  interactive = false,
  useBayesian = false,
  tooltipText,
  onRatingChange
}) => {
  // Determine which rating to use
  const displayRating = useBayesian && bayesianRating !== undefined ? bayesianRating : rating;
  
  // Determine star size based on size prop
  const getStarSize = () => {
    switch (size) {
      case 'sm': return '16px';
      case 'lg': return '24px';
      default: return '18px';
    }
  };
  
  // Calculate width of filled stars
  const getFilledWidth = () => {
    return `${(displayRating / maxRating) * 100}%`;
  };

  // Handle click for interactive ratings
  const handleClick = (clickedRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(clickedRating);
    }
  };

  // Generate stars for interactive mode
  const renderInteractiveStars = () => {
    return Array.from({ length: maxRating }).map((_, index) => {
      const starValue = index + 1;
      return (
        <span 
          key={index} 
          onClick={() => handleClick(starValue)}
          style={{ cursor: 'pointer' }}
        >
          {starValue <= displayRating ? '★' : '☆'}
        </span>
      );
    });
  };
  
  return (
    <RatingContainer>
      <StarsContainer>
        {interactive ? (
          <StarsWrapper style={{ fontSize: getStarSize() }}>
            {renderInteractiveStars()}
          </StarsWrapper>
        ) : (
          <StarsWrapper style={{ fontSize: getStarSize() }}>
            <EmptyStars>☆☆☆☆☆</EmptyStars>
            <FilledStars style={{ width: getFilledWidth() }}>★★★★★</FilledStars>
          </StarsWrapper>
        )}
        
        {showCount && (
          <ReviewCount>
            ({count})
          </ReviewCount>
        )}
      </StarsContainer>

      {tooltipText && (
        <RatingTooltip>
          {tooltipText}
        </RatingTooltip>
      )}
    </RatingContainer>
  );
};

export default StarRating;
