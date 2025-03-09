import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import productService, { Product as ProductType } from '../../services/productService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Styled components for the slider
const SliderContainer = styled.div`
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

const SliderTitle = styled.h2`
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

const Container = styled.div`
  margin: 0 0 30px 0;
  position: relative;
`;

const ProductCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    max-width: 200px;
  }
  
  @media (max-width: 480px) {
    max-width: 175px;
    border-radius: 6px;
  }
`;

const ProductImage = styled.div`
  height: 180px;
  overflow: hidden;
  background-color: #f5f5f5;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s;
  }
  
  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    height: 140px;
  }
  
  @media (max-width: 480px) {
    height: 120px;
  }
`;

const ProductDetails = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 220px;
  
  @media (max-width: 768px) {
    padding: 12px;
    min-height: 200px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    min-height: 180px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  
  @media (max-width: 480px) {
    gap: 5px;
  }
`;

const CategoryName = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 1.2em;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    margin-bottom: 3px;
  }
`;

const ProductName = styled.h3`
  font-size: 0.9rem;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      color: #0066c0;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 6px;
    -webkit-line-clamp: 2;
    min-height: 2.8em;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
  min-height: 24px;
  
  @media (max-width: 480px) {
    margin-bottom: 6px;
    min-height: 20px;
  }
`;

const Price = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #0066c0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const OldPrice = styled.span`
  font-size: 0.9rem;
  text-decoration: line-through;
  color: #999;
  margin-left: 8px;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-left: 5px;
  }
`;

const DiscountBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e41e3f;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 1;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 2px 6px;
    top: 5px;
    right: 5px;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  min-height: 20px;
  
  .stars {
    color: #ffc107;
    margin-right: 5px;
  }
  
  .count {
    font-size: 0.8rem;
    color: #777;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 6px;
    min-height: 18px;
    
    .stars {
      font-size: 0.9rem;
    }
    
    .count {
      font-size: 0.7rem;
    }
  }
`;

const DeliveryInfo = styled.div`
  font-size: 0.8rem;
  color: #4caf50;
  margin-bottom: 10px;
  font-weight: 500;
  min-height: 16px;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    margin-bottom: 6px;
    min-height: 14px;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  padding: 8px 0;
  background-color: #0066c0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background-color: #004d99;
  }
  
  &:focus {
    outline: none;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  @media (max-width: 768px) {
    padding: 7px 0;
    font-size: 0.9rem;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 6px 0;
    font-size: 0.8rem;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  
  &:hover {
    color: #0066c0;
  }
  
  @media (max-width: 480px) {
    padding: 3px;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #e41e3f;
  text-align: center;
  padding: 0 20px;
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
  
  .swiper-pagination {
    display: none;
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

interface FeaturedProductsSliderProps {
  title?: string;
  onAddToCart?: (productId: number) => void;
}

const FeaturedProductsSlider: React.FC<FeaturedProductsSliderProps> = ({ 
  title = "Featured Products",
  onAddToCart 
}) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const featuredProducts = await productService.getFeaturedProducts();
        setProducts(featuredProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        setError('Failed to load featured products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <Container>
        {title && <SliderTitle>{title}</SliderTitle>}
        <LoadingContainer>
          <div>Loading...</div>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        {title && <SliderTitle>{title}</SliderTitle>}
        <ErrorContainer>
          <div>{error}</div>
        </ErrorContainer>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container>
        {title && <SliderTitle>{title}</SliderTitle>}
        <ErrorContainer>
          <div>No featured products available at this time.</div>
        </ErrorContainer>
      </Container>
    );
  }
  
  return (
    <SliderContainer>
      {title && <SliderTitle>{title}</SliderTitle>}
      <StyledSwiper
        modules={[Navigation, Pagination]}
        spaceBetween={2}
        slidesPerView={2}
        navigation
        pagination={{ clickable: true, el: null }}
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
            slidesPerView: 4,
            spaceBetween: 4,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 5,
          },
          1280: {
            slidesPerView: 6,
            spaceBetween: 6,
          },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard>
              {product.discount_price && (
                <DiscountBadge>
                  SAVE {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                </DiscountBadge>
              )}
              <ProductImage>
                <img 
                  src={product.images?.[0] || "https://dummyimage.com/300x200/"}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://dummyimage.com/300x200/?text=No+Image';
                  }}
                />
              </ProductImage>
              <ProductDetails>
                {product.category && (
                  <CategoryName>{product.category.name}</CategoryName>
                )}
                <ProductName>
                  <Link to={`/products/${product.slug}`}>
                    {product.name}
                  </Link>
                </ProductName>
                <PriceContainer>
                  <Price>{formatCurrency(product.discount_price || product.price)}</Price>
                  {product.discount_price && (
                    <OldPrice>{formatCurrency(product.price)}</OldPrice>
                  )}
                </PriceContainer>
                {product.rating && (
                  <Rating>
                    <div className="stars">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    {product.review_count !== undefined ? (
                      <div className="count">({product.review_count})</div>
                    ) : (
                      <div className="count">(0)</div>
                    )}
                  </Rating>
                )}
                <DeliveryInfo>Delivery in minutes</DeliveryInfo>
                <ButtonsContainer>
                  <AddToCartButton onClick={() => onAddToCart && onAddToCart(product.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    Add to Cart
                  </AddToCartButton>
                  <ActionButton title="More options">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    </svg>
                  </ActionButton>
                </ButtonsContainer>
              </ProductDetails>
            </ProductCard>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </SliderContainer>
  );
};

export default FeaturedProductsSlider;
