import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../contexts/CartContext';
import wishlistService from '../../services/wishlistService';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import StarRating from './StarRating';

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  salePrice?: number;
  discount?: boolean;
  rating?: number;
  reviewCount?: number;
  deliveryTime?: string;
  category?: string;
  slug?: string;
  inStock?: boolean;
}

const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: white;
  transition: box-shadow 0.3s, transform 0.3s;
  height: 380px;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    height: 350px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    height: 320px;
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e53935;
  color: white;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: bold;
  
  @media (max-width: 480px) {
    font-size: 10px;
    padding: 2px 6px;
    top: 5px;
    right: 5px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 180px;
  margin-bottom: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 4px;
  }
  
  @media (max-width: 1024px) {
    height: 150px;
  }
  
  @media (max-width: 768px) {
    height: 120px;
  }
  
  @media (max-width: 480px) {
    height: 100px;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CategoryLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
  height: 14px;
  
  @media (max-width: 480px) {
    font-size: 10px;
    height: 12px;
  }
`;

const ProductName = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 10px 0;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
  height: 40px;
  line-height: 1.3;
  
  &:hover {
    color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    height: 36px;
    margin: 0 0 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    height: 32px;
    margin: 0 0 5px;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 5px;
`;

const Price = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #0066b2;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const OldPrice = styled.span`
  font-size: 14px;
  color: #999;
  margin-left: 8px;
  text-decoration: line-through;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
    margin-left: 5px;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  margin-top: 8px;
`;

const Rating = styled.div`
  font-size: 12px;
  color: #666;
  height: 18px;
  width: 100%;
  
  @media (max-width: 480px) {
    font-size: 10px;
    height: 16px;
  }
  
  /* Override star colors directly */
  svg {
    color: #f59e0b !important; /* Amber-500 color (gold) */
    margin-right: 2px;
  }
  
  span {
    margin-left: 6px; /* Increase spacing for review count */
  }
`;

const DeliveryInfo = styled.div`
  font-size: 12px;
  color: #009900;
  margin-bottom: 15px;
  
  @media (max-width: 480px) {
    font-size: 10px;
    margin-bottom: 10px;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
`;

const AddToCartButton = styled.button`
  background-color: #0066b2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;
  
  &:hover {
    background-color: #004f8a;
  }
  
  @media (max-width: 768px) {
    padding: 7px 10px;
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 8px;
    font-size: 12px;
  }
`;

const MoreOptionsButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: 768px) {
    padding: 5px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 4px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const OptionsMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  width: 160px;
  margin-top: 5px;
`;

const OptionItem = styled.div<{ disabled?: boolean }>`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.disabled ? 'transparent' : '#f5f5f5'};
  }
  
  svg {
    margin-right: 8px;
    color: #e53935;
  }
`;

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  oldPrice,
  salePrice,
  discount,
  rating = 4.0,
  reviewCount = 0,
  deliveryTime = "Delivery in 2-4 business days",
  category,
  slug,
  inStock = true
}: ProductCardProps) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useContext(AuthContext);
  
  const displayOldPrice = oldPrice || (salePrice ? price : undefined);
  const displayPrice = salePrice || price;
  
  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (isAuthenticated) {
        try {
          const inWishlist = await wishlistService.isInWishlist(id);
          setIsInWishlist(inWishlist);
        } catch (error) {
          console.error("Error checking wishlist status:", error);
        }
      } else {
        setIsInWishlist(false);
      }
    };
    
    checkWishlistStatus();
  }, [id, isAuthenticated]);
  
  const handleProductClick = () => {
    if (slug) {
      navigate(`/product/${slug}`);
    } else {
      navigate(`/product/${id}`);
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addItem({
      id,
      name,
      price: salePrice || price,
      image,
      quantity: 1
    });
    
    toast.success(`${name} added to cart!`);
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.info("Please log in to add items to your wishlist");
      navigate('/login');
      return;
    }

    setIsInWishlist(prevState => !prevState);
    
    if (isInWishlist) {
      toast.success(`${name} removed from wishlist`);
    } else {
      toast.success(`${name} added to wishlist`);
    }
    
    setOptionsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      setOptionsOpen(false);
    };

    if (optionsOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [optionsOpen]);

  return (
    <Card>
      {(discount || salePrice) && <DiscountBadge>SAVE {Math.round(((displayOldPrice! - displayPrice) / displayOldPrice!) * 100)}%</DiscountBadge>}
      
      <ImageContainer onClick={handleProductClick}>
        <img src={image} alt={name} />
      </ImageContainer>
      
      <ProductInfo>
        {category && <CategoryLabel>{category}</CategoryLabel>}
        <ProductName onClick={handleProductClick}>{name}</ProductName>
        
        <PriceContainer>
          <Price>{formatCurrency(displayPrice)}</Price>
          {displayOldPrice && <OldPrice>{formatCurrency(displayOldPrice)}</OldPrice>}
        </PriceContainer>
        
        <RatingContainer>
          <Rating>
            <StarRating rating={rating} size="sm" showCount={true} count={reviewCount} />
          </Rating>
        </RatingContainer>
        
        <DeliveryInfo>{deliveryTime}</DeliveryInfo>
        
        <ActionContainer>
          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={!inStock}
            style={{ opacity: inStock ? 1 : 0.6 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </AddToCartButton>
          
          <MoreOptionsButton onClick={(e) => {
            e.stopPropagation();
            setOptionsOpen(!optionsOpen);
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
            <OptionsMenu isOpen={optionsOpen} onClick={(e) => e.stopPropagation()}>
              <OptionItem onClick={handleAddToWishlist}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  {isInWishlist ? (
                    // Filled heart icon
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                  ) : (
                    // Empty heart icon
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                  )}
                </svg>
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </OptionItem>
            </OptionsMenu>
          </MoreOptionsButton>
        </ActionContainer>
      </ProductInfo>
    </Card>
  );
};

export default ProductCard;
