import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FaHistory, 
  FaTrash, 
  FaShoppingCart, 
  FaHeart, 
  FaStar, 
  FaFilter,
  FaExclamationTriangle
} from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AccountSidebar from '../../components/account/AccountSidebar';
import { formatCurrency } from '../../utils/formatCurrency';
import recentlyViewedService, { RecentlyViewedProduct } from '../../services/recentlyViewedService';
import { useCart } from '../../contexts/CartContext';

// Types for recently viewed products
interface ViewedProduct {
  id: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  category: string;
  viewedAt: string;
  inStock: boolean;
  discount?: number;
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RecentlyViewedContent = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  padding: 20px;
`;

const ContentHeader = styled.div`
  background-color: #0066cc;
  color: white;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  svg {
    margin-right: 10px;
  }
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const ToolsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  color: #333;
`;

const ClearButton = styled.button`
  background-color: transparent;
  border: 1px solid #ddd;
  color: #333;
  padding: 8px 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  border: 1px solid #eee;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
`;

const ProductImage = styled(Link)`
  display: block;
  
  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
`;

const ViewDate = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
  padding: 5px 10px;
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e53935;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 8px;
  border-radius: 3px;
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductCategory = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
`;

const ProductName = styled(Link)`
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
  text-decoration: none;
  
  &:hover {
    color: #0066cc;
    text-decoration: underline;
  }
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  color: #ffb800;
  font-size: 14px;
  margin-bottom: 5px;
  
  span {
    color: #666;
    margin-left: 5px;
  }
`;

const ProductPrice = styled.div`
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 16px;
  
  span {
    color: #999;
    text-decoration: line-through;
    font-size: 14px;
    margin-right: 8px;
  }
`;

const ProductActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  flex: 1;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AddToCartButton = styled(ActionButton)`
  flex: 2;
  background-color: #0066cc;
  border-color: #0066cc;
  color: white;
  
  &:hover {
    background-color: #0055b3;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  width: 60px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  background-color: white;
  color: #333;
  border-radius: 4px;
  margin: 0 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNumber = styled.button<{ active?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.active ? '#0066cc' : '#ddd'};
  background-color: ${props => props.active ? '#0066cc' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  margin: 0 5px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#0055b3' : '#f5f5f5'};
  }
`;

const WishlistButton = styled(ActionButton)`
  flex: 1;
  background-color: white;
  border-color: #ddd;
  color: #333;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  color: #ccc;
  margin-bottom: 20px;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
`;

const EmptyText = styled.p`
  text-align: center;
  margin: 0 0 20px 0;
  color: #666;
`;

const ShopNowButton = styled(Link)`
  display: inline-block;
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    background-color: #0055b3;
  }
`;

const RecentlyViewedPage: React.FC = () => {
  const [viewedProducts, setViewedProducts] = useState<RecentlyViewedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { addItem } = useCart();
  const itemsPerPage = 6; // Show 6 items per page
  
  useEffect(() => {
    const fetchRecentlyViewedProducts = async () => {
      setLoading(true);
      try {
        const products = await recentlyViewedService.getRecentlyViewed();
        setViewedProducts(products);
      } catch (error) {
        console.error('Error fetching recently viewed products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentlyViewedProducts();
  }, []);
  
  const clearHistory = async () => {
    try {
      const success = await recentlyViewedService.clearRecentlyViewed();
      if (success) {
        setViewedProducts([]);
      }
    } catch (error) {
      console.error('Error clearing recently viewed history:', error);
    }
  };
  
  const addToCart = (product: RecentlyViewedProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };
  
  const formatViewTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
  };
  
  // Get unique categories
  const categories = ['all', ...new Set(viewedProducts.map(product => product.category))];
  
  // Filter products by category
  const filteredProducts = selectedCategory === 'all'
    ? viewedProducts
    : viewedProducts.filter(product => product.category === selectedCategory);
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <PageContainer>
      <title>Recently Viewed | M-Mart+</title>
      <Header />
      
      <MainContent>
        <PageTitle>My Account</PageTitle>
        
        <ContentContainer>
          <AccountSidebar />
          
          <RecentlyViewedContent>
            <ContentHeader>
              <FaHistory size={20} />
              <HeaderTitle>Recently Viewed Products</HeaderTitle>
            </ContentHeader>
            
            {loading ? (
              <div>Loading recently viewed products...</div>
            ) : viewedProducts.length > 0 ? (
              <>
                <ToolsRow>
                  <FilterContainer>
                    <FaFilter />
                    <FilterSelect 
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </FilterSelect>
                  </FilterContainer>
                  
                  <ClearButton onClick={clearHistory}>
                    <FaTrash size={14} />
                    Clear History
                  </ClearButton>
                </ToolsRow>
                
                <ProductGrid>
                  {currentItems.map(product => (
                    <ProductCard key={product.id}>
                      <ProductImageContainer>
                        <ProductImage to={`/product/${product.id}`}>
                          <img src={product.image} alt={product.name} />
                        </ProductImage>
                        
                        <ViewDate>
                          {formatViewTime(product.viewedAt)}
                        </ViewDate>
                        
                        {product.discount && (
                          <DiscountBadge>-{product.discount}%</DiscountBadge>
                        )}
                      </ProductImageContainer>
                      
                      <ProductInfo>
                        <ProductCategory>{product.category}</ProductCategory>
                        
                        <ProductName to={`/product/${product.id}`}>
                          {product.name}
                        </ProductName>
                        
                        <ProductRating>
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i}
                              color={i < Math.floor(product.rating) ? '#ffc107' : '#e4e5e9'}
                              size={14}
                            />
                          ))}
                          <span>{product.rating}</span>
                        </ProductRating>
                        
                        <ProductPrice>
                          {formatCurrency(product.price)}
                        </ProductPrice>
                        
                        <ProductActions>
                          <AddToCartButton disabled={!product.inStock} onClick={() => addToCart(product)}>
                            <FaShoppingCart size={14} style={{ marginRight: '5px' }} />
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </AddToCartButton>
                          
                          <WishlistButton>
                            <FaHeart size={14} />
                          </WishlistButton>
                        </ProductActions>
                      </ProductInfo>
                    </ProductCard>
                  ))}
                </ProductGrid>
                
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationButton 
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </PaginationButton>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PageNumber 
                        key={i}
                        active={currentPage === i + 1}
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </PageNumber>
                    ))}
                    
                    <PaginationButton 
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </PaginationButton>
                  </Pagination>
                )}
              </>
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <FaHistory />
                </EmptyIcon>
                <EmptyTitle>No recently viewed products</EmptyTitle>
                <EmptyText>
                  Products you view will appear here so you can easily revisit them later.
                </EmptyText>
                <ShopNowButton to="/">
                  Start Shopping
                </ShopNowButton>
              </EmptyState>
            )}
          </RecentlyViewedContent>
        </ContentContainer>
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default RecentlyViewedPage;
