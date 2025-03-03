import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const CategoriesCarousel = styled.div`
  position: relative;
  overflow: hidden;
  padding: 0 40px;
  touch-action: pan-y;
  
  @media (max-width: 480px) {
    padding: 0 30px;
  }
`;

const CategoriesTrack = styled.div`
  display: flex;
  transition: transform 0.25s ease-out;
  gap: 15px;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const CategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  flex: 0 0 calc(100% / 6 - 15px);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 1024px) {
    flex: 0 0 calc(100% / 4 - 15px);
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    flex: 0 0 calc(100% / 3 - 10px);
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    flex: 0 0 calc(100% / 2 - 8px);
  }
`;

const CategoryIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  
  img {
    max-width: 100%;
    max-height: 100%;
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    margin-bottom: 5px;
  }
`;

const CategoryName = styled.p`
  font-size: 14px;
  text-align: center;
  margin: 0;
  
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

// Interface for category data
interface Category {
  id: number;
  name: string;
  icon: string;
  slug?: string;
  isActive?: boolean;
}

// Mock category data for the homepage carousel
// These categories are the main categories from our hierarchy
const mockCategories: Category[] = [
  { id: 1, name: 'Food & Groceries', icon: '/category-food.png', slug: 'food-groceries', isActive: true },
  { id: 2, name: 'Household Essentials', icon: '/category-household.png', slug: 'household-essentials', isActive: true },
  { id: 3, name: 'Kitchen & Home', icon: '/category-kitchen.png', slug: 'kitchen-home', isActive: true },
  { id: 4, name: 'Baby & Family Care', icon: '/category-baby.png', slug: 'baby-family', isActive: true },
  { id: 5, name: 'Drinks & Alcohol', icon: '/category-drinks.png', slug: 'drinks-alcohol', isActive: true },
  { id: 6, name: 'Office & General', icon: '/category-office.png', slug: 'office-general', isActive: true },
  { id: 7, name: 'Staples & Grains', icon: '/category-staples.png', slug: 'staples-grains', isActive: true },
  { id: 8, name: 'Cooking Essentials', icon: '/category-cooking.png', slug: 'cooking-essentials', isActive: true },
  { id: 9, name: 'Packaged Foods', icon: '/category-packaged.png', slug: 'packaged-frozen', isActive: true },
  { id: 10, name: 'Fruits & Vegetables', icon: '/category-fruit-veg.png', slug: 'fruits-vegetables', isActive: true },
  { id: 11, name: 'Dairy & Breakfast', icon: '/category-dairy.png', slug: 'dairy-breakfast', isActive: true },
  { id: 12, name: 'Cleaning & Laundry', icon: '/category-cleaning.png', slug: 'cleaning-laundry', isActive: true }
];

const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Touch swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // In the future, this will fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Simulate API call
        setLoading(true);
        
        // In production, this will be replaced with a real API call:
        // const response = await fetch('/api/categories');
        // const data = await response.json();
        
        // For now, use mock data and add a slight delay to simulate network request
        setTimeout(() => {
          setCategories(mockCategories.filter(cat => cat.isActive));
          setLoading(false);
        }, 300);
      } catch (err) {
        setError('Failed to load categories');
        setLoading(false);
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  const maxIndex = Math.max(0, categories.length - 6);
  
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
    const minSwipeDistance = 30;
    
    if (distance > minSwipeDistance && currentIndex < maxIndex) {
      // Swipe left - go to next category
      handleNext();
    } else if (distance < -minSwipeDistance && currentIndex > 0) {
      // Swipe right - go to previous category
      handlePrev();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // Handle navigation to category page
  const handleCategoryClick = (category: Category) => {
    if (category.slug) {
      navigate(`/category/${category.slug}`);
    }
  };
  
  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading categories...</div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>
      </Container>
    );
  }
  
  if (categories.length === 0) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '20px' }}>No categories found</div>
      </Container>
    );
  }
  
  return (
    <Container>
      <CategoriesCarousel>
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
        
        <CategoriesTrack 
          ref={trackRef}
          style={{ transform: `translateX(-${currentIndex * (100 / 6)}%)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {categories.map(category => (
            <CategoryCard 
              key={category.id}
              onClick={() => handleCategoryClick(category)}
            >
              <CategoryIcon>
                <img 
                  src={category.icon} 
                  alt={category.name} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/60x60?text=${category.name.charAt(0)}`;
                  }}
                />
              </CategoryIcon>
              <CategoryName>{category.name}</CategoryName>
            </CategoryCard>
          ))}
        </CategoriesTrack>
        
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
      </CategoriesCarousel>
    </Container>
  );
};

export default CategorySection;
