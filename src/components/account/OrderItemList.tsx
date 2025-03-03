import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { OrderItem } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const Container = styled.div`
  margin: 20px 0;
`;

const Title = styled.h4`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
`;

const ItemsTable = styled.div`
  border: 1px solid #eee;
  border-radius: 5px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(250px, 4fr) 1fr 1fr 1fr;
  padding: 12px 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
  font-weight: 500;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const TableBody = styled.div``;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: minmax(250px, 4fr) 1fr 1fr 1fr;
  padding: 15px;
  border-bottom: 1px solid #eee;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    display: block;
    position: relative;
    padding-bottom: 40px;
  }
`;

const ProductCell = styled.div`
  display: flex;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-right: 15px;
`;

const ProductInfo = styled.div``;

const ProductName = styled(Link)`
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    color: #0066cc;
  }
`;

const QuantityCell = styled.div`
  text-align: center;
  
  @media (max-width: 768px) {
    display: inline-block;
    margin-right: 15px;
    margin-top: 10px;
    
    &::before {
      content: 'Qty: ';
      font-weight: 500;
    }
  }
`;

const PriceCell = styled.div`
  text-align: center;
  
  @media (max-width: 768px) {
    display: inline-block;
    margin-top: 10px;
    
    &::before {
      content: 'Price: ';
      font-weight: 500;
    }
  }
`;

const SubtotalCell = styled.div`
  text-align: center;
  font-weight: 500;
  color: #0066cc;
  
  @media (max-width: 768px) {
    display: inline-block;
    margin-left: 15px;
    margin-top: 10px;
    
    &::before {
      content: 'Subtotal: ';
      font-weight: 500;
    }
  }
`;

const ItemActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 10px;
  
  @media (max-width: 768px) {
    position: absolute;
    bottom: 10px;
    right: 15px;
  }
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
  
  svg {
    margin-right: 5px;
  }
`;

const OrderSummary = styled.div`
  margin-top: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 15px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 10px;
    border-top: 1px dashed #ddd;
    font-weight: 600;
  }
`;

const SummaryLabel = styled.div`
  color: #555;
`;

const SummaryValue = styled.div``;

const TotalValue = styled.div`
  color: #0066cc;
  font-size: 18px;
`;

interface OrderItemListProps {
  items: OrderItem[];
  shippingFee: number;
  total: number;
}

const OrderItemList: React.FC<OrderItemListProps> = ({ 
  items, 
  shippingFee,
  total 
}) => {
  // Calculate subtotal (sum of all item subtotals)
  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.subtotal, 0);
  };
  
  // Add item to wishlist
  const handleAddToWishlist = (productId: number) => {
    console.log(`Added product #${productId} to wishlist`);
    // Implementation will depend on your wishlist functionality
  };
  
  // Add item to cart
  const handleAddToCart = (productId: number) => {
    console.log(`Added product #${productId} to cart`);
    // Implementation will depend on your cart functionality
  };
  
  return (
    <Container>
      <Title>Order Items</Title>
      
      <ItemsTable>
        <TableHeader>
          <div>Product</div>
          <div>Quantity</div>
          <div>Price</div>
          <div>Subtotal</div>
        </TableHeader>
        
        <TableBody>
          {items.map((item) => (
            <ItemRow key={item.id}>
              <ProductCell>
                <ProductImage 
                  src={item.product_image || '/images/placeholder.jpg'} 
                  alt={item.product_name}
                />
                <ProductInfo>
                  <ProductName to={`/products/${item.product_id}`}>
                    {item.product_name}
                  </ProductName>
                  <ItemActions>
                    <ActionButton onClick={() => handleAddToWishlist(item.product_id)}>
                      <FaHeart size={12} />
                      Wishlist
                    </ActionButton>
                    <ActionButton onClick={() => handleAddToCart(item.product_id)}>
                      <FaShoppingCart size={12} />
                      Buy Again
                    </ActionButton>
                  </ItemActions>
                </ProductInfo>
              </ProductCell>
              
              <QuantityCell>{item.quantity}</QuantityCell>
              <PriceCell>{formatCurrency(item.price)}</PriceCell>
              <SubtotalCell>{formatCurrency(item.subtotal)}</SubtotalCell>
            </ItemRow>
          ))}
        </TableBody>
      </ItemsTable>
      
      <OrderSummary>
        <SummaryRow>
          <SummaryLabel>Subtotal</SummaryLabel>
          <SummaryValue>{formatCurrency(calculateSubtotal())}</SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>Shipping Fee</SummaryLabel>
          <SummaryValue>{formatCurrency(shippingFee)}</SummaryValue>
        </SummaryRow>
        
        <SummaryRow>
          <SummaryLabel>Total</SummaryLabel>
          <TotalValue>{formatCurrency(total)}</TotalValue>
        </SummaryRow>
      </OrderSummary>
    </Container>
  );
};

export default OrderItemList;
