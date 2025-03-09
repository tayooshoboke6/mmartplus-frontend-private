import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import categoryService, { Category } from '../../services/categoryService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Container = styled.div`
  margin: 30px 0;
  width: 100%;
  overflow: hidden;
  
  @media (max-width: 768px) {
    margin: 20px 0;
  }
  
  @media (max-width: 480px) {
    margin: 15px 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 10px;
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
  background-color: #fff;
  height: 100%;
  width: 100%;
  max-width: 160px;
  margin: 0 auto;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    max-width: 140px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    max-width: 120px;
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
    object-fit: contain;
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
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  width: 100%;
`;

const ErrorState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  width: 100%;
  color: #e53935;
`;

const StyledSwiper = styled(Swiper)`
  padding: 10px 0 20px;
  margin: 0 -2px;
  position: relative;
  
  .swiper-button-next,
  .swiper-button-prev {
    color: #0066c0;
    background: rgba(255, 255, 255, 0.9);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    
    &:after {
      font-size: 14px;
      font-weight: bold;
    }
    
    &.swiper-button-disabled {
      display: none;
    }
  }
  
  .swiper-button-prev {
    left: 5px;
  }
  
  .swiper-button-next {
    right: 5px;
  }
  
  @media (max-width: 480px) {
    padding: 5px 0 15px;
    
    .swiper-button-next,
    .swiper-button-prev {
      width: 25px;
      height: 25px;
      
      &:after {
        font-size: 12px;
      }
    }
  }
`;

const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Get parent categories only (those with parent_id = null)
        const response = await categoryService.getCategories({
          include_inactive: false,
          parent_id: null
        });
        
        if (response.success) {
          setCategories(response.data!.data);
        } else {
          setError(response.error?.message || 'Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('An error occurred while fetching categories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleCategoryClick = (categoryId: number) => {
    navigate(`/categories/${categoryId}`);
  };
  
  if (loading) {
    return (
      <Container>
        <LoadingState>Loading categories...</LoadingState>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <ErrorState>{error}</ErrorState>
      </Container>
    );
  }
  
  if (categories.length === 0) {
    return (
      <Container>
        <ErrorState>No categories available</ErrorState>
      </Container>
    );
  }
  
  return (
    <Container>
      <StyledSwiper
        modules={[Navigation]}
        spaceBetween={2}
        slidesPerView={2}
        navigation
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 2,
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 3,
          },
          768: {
            slidesPerView: 5,
            spaceBetween: 4,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 5,
          },
          1280: {
            slidesPerView: 8,
            spaceBetween: 6,
          },
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id}>
            <CategoryCard onClick={() => handleCategoryClick(category.id)}>
              <CategoryIcon>
                <img 
                  src={category.image_url || '/images/placeholder-category.png'} 
                  alt={category.name} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-category.png';
                  }}
                />
              </CategoryIcon>
              <CategoryName>{category.name}</CategoryName>
            </CategoryCard>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </Container>
  );
};

export default CategorySection;
