import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaTrash, 
  FaShoppingCart, 
  FaShare, 
  FaStar, 
  FaExclamationTriangle
} from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AccountSidebar from '../../components/account/AccountSidebar';
import { formatCurrency } from '../../utils/formatCurrency';

// Types for wishlist items
interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  inStock: boolean;
  dateAdded: string;
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

const WishlistContent = styled.div`
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

const WishlistTools = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ItemCount = styled.div`
  font-size: 14px;
  color: #666;
`;

const ActionButton = styled.button`
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

const AddAllButton = styled(ActionButton)`
  background-color: #0066cc;
  border-color: #0066cc;
  color: white;
  
  &:hover {
    background-color: #0055b3;
  }
`;

const WishlistTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

const TableHead = styled.thead`
  background-color: #f9f9f9;
  
  th {
    padding: 12px 15px;
    text-align: left;
    font-weight: 500;
    color: #333;
    border-bottom: 1px solid #eee;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #eee;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
  
  td {
    padding: 15px;
    vertical-align: middle;
  }
`;

const ProductCell = styled.td`
  display: flex;
  align-items: center;
`;

const ProductImage = styled(Link)`
  display: block;
  width: 80px;
  height: 80px;
  margin-right: 15px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const ProductInfo = styled.div``;

const ProductName = styled(Link)`
  display: block;
  font-weight: 500;
  color: #333;
  text-decoration: none;
  margin-bottom: 5px;
  
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
  
  span {
    color: #666;
    margin-left: 5px;
  }
`;

const StockStatus = styled.div<{ inStock: boolean }>`
  color: ${props => props.inStock ? '#2e7d32' : '#d32f2f'};
  font-size: 14px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
`;

const ItemAction = styled.div`
  display: flex;
  gap: 8px;
`;

const ItemButton = styled.button`
  background-color: transparent;
  border: 1px solid #ddd;
  color: #333;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const AddToCartButton = styled(ItemButton)`
  background-color: #0066cc;
  border-color: #0066cc;
  color: white;
  
  &:hover {
    background-color: #0055b3;
  }
`;

const DateAddedCell = styled.td`
  color: #666;
  font-size: 14px;
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

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch wishlist items
    setTimeout(() => {
      setWishlistItems([
        {
          id: 1,
          productId: 101,
          name: 'Golden Penny Semovita - 1kg',
          image: '/images/products/golden-penny-semovita.jpg',
          price: 1200,
          rating: 4.5,
          inStock: true,
          dateAdded: '2025-02-15'
        },
        {
          id: 2,
          productId: 102,
          name: 'Dano Milk Powder - 400g',
          image: '/images/products/dano-milk.jpg',
          price: 1800,
          rating: 4.2,
          inStock: true,
          dateAdded: '2025-02-18'
        },
        {
          id: 3,
          productId: 103,
          name: 'Indomie Chicken Flavor - Pack of 40',
          image: '/images/products/indomie-chicken.jpg',
          price: 5500,
          rating: 4.8,
          inStock: false,
          dateAdded: '2025-02-20'
        },
        {
          id: 4,
          productId: 104,
          name: 'Devon King\'s Vegetable Oil - 5L',
          image: '/images/products/devon-kings-oil.jpg',
          price: 7500,
          rating: 4.6,
          inStock: true,
          dateAdded: '2025-03-01'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };
  
  const clearWishlist = () => {
    setWishlistItems([]);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <PageContainer>
      <title>My Wishlist | M-Mart+</title>
      <Header />
      
      <MainContent>
        <PageTitle>My Account</PageTitle>
        
        <ContentContainer>
          <AccountSidebar />
          
          <WishlistContent>
            <ContentHeader>
              <FaHeart size={20} />
              <HeaderTitle>My Wishlist</HeaderTitle>
            </ContentHeader>
            
            {loading ? (
              <div>Loading wishlist...</div>
            ) : wishlistItems.length > 0 ? (
              <>
                <WishlistTools>
                  <ItemCount>
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                  </ItemCount>
                  <div>
                    <ActionButton onClick={clearWishlist}>
                      <FaTrash size={14} />
                      Clear Wishlist
                    </ActionButton>
                    <AddAllButton style={{ marginLeft: '10px' }}>
                      <FaShoppingCart size={14} />
                      Add All to Cart
                    </AddAllButton>
                  </div>
                </WishlistTools>
                
                <WishlistTable>
                  <TableHead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock Status</th>
                      <th>Date Added</th>
                      <th>Actions</th>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {wishlistItems.map(item => (
                      <tr key={item.id}>
                        <ProductCell>
                          <ProductImage to={`/product/${item.productId}`}>
                            <img src={item.image} alt={item.name} />
                          </ProductImage>
                          <ProductInfo>
                            <ProductName to={`/product/${item.productId}`}>
                              {item.name}
                            </ProductName>
                            <ProductRating>
                              <FaStar />
                              <span>{item.rating}</span>
                            </ProductRating>
                          </ProductInfo>
                        </ProductCell>
                        <td>{formatCurrency(item.price)}</td>
                        <td>
                          <StockStatus inStock={item.inStock}>
                            {item.inStock ? (
                              'In Stock'
                            ) : (
                              <>
                                <FaExclamationTriangle size={14} />
                                Out of Stock
                              </>
                            )}
                          </StockStatus>
                        </td>
                        <DateAddedCell>{formatDate(item.dateAdded)}</DateAddedCell>
                        <td>
                          <ItemAction>
                            <AddToCartButton 
                              disabled={!item.inStock}
                              title={item.inStock ? 'Add to Cart' : 'Out of Stock'}
                            >
                              <FaShoppingCart size={14} />
                            </AddToCartButton>
                            <ItemButton title="Share">
                              <FaShare size={14} />
                            </ItemButton>
                            <ItemButton 
                              title="Remove" 
                              onClick={() => removeFromWishlist(item.id)}
                            >
                              <FaTrash size={14} />
                            </ItemButton>
                          </ItemAction>
                        </td>
                      </tr>
                    ))}
                  </TableBody>
                </WishlistTable>
              </>
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <FaHeart />
                </EmptyIcon>
                <EmptyTitle>Your wishlist is empty</EmptyTitle>
                <EmptyText>
                  Add your favorite products to wishlist. Review them anytime and easily move them to cart.
                </EmptyText>
                <ShopNowButton to="/">
                  Continue Shopping
                </ShopNowButton>
              </EmptyState>
            )}
          </WishlistContent>
        </ContentContainer>
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default WishlistPage;
