import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity_sold: number;
}

interface PopularProductsTableProps {
  products: Product[];
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: #f8fafc;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
`;

const ProductCell = styled.div`
  display: flex;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
  background-color: #f1f5f9;
`;

const ProductName = styled(Link)`
  color: #1e293b;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #3b82f6;
  }
`;

const EmptyMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

const ValueBar = styled.div<{ value: number, max: number }>`
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: ${({ value, max }) => (value / max) * 100}%;
    max-width: 100%;
    height: 100%;
    background-color: #3b82f6;
    border-radius: 4px;
  }
`;

const BarContainer = styled.div`
  width: 100%;
`;

const PopularProductsTable: React.FC<PopularProductsTableProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return <EmptyMessage>No popular products found</EmptyMessage>;
  }

  // Find the product with highest quantity sold for the value bar
  const maxQuantitySold = Math.max(...products.map(product => product.quantity_sold));

  // Helper function to safely format the price
  const formatPrice = (price: any): string => {
    if (price === undefined || price === null) {
      return '₦0.00';
    }
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return isNaN(numPrice) ? '₦0.00' : `₦${numPrice.toLocaleString('en-NG', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  };

  // Default product image
  const defaultProductImage = '/images/product-placeholder.png';

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Product</Th>
          <Th>Price</Th>
          <Th>Sold</Th>
          <Th>Units Sold</Th>
        </tr>
      </Thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <Td>
              <ProductCell>
                <ProductImage 
                  src={product.image || defaultProductImage} 
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultProductImage;
                  }}
                />
                <ProductName to={`/admin/products/${product.id}`}>
                  {product.name}
                </ProductName>
              </ProductCell>
            </Td>
            <Td>{formatPrice(product.price)}</Td>
            <Td>
              <BarContainer>
                <ValueBar value={product.quantity_sold} max={maxQuantitySold} />
              </BarContainer>
            </Td>
            <Td>{product.quantity_sold}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PopularProductsTable;
