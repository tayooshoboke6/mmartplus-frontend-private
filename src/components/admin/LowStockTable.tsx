import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  image: string;
  current_stock: number;
  min_stock: number;
}

interface LowStockTableProps {
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

const StockBadge = styled.span<{ stock: number, threshold: number }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ stock, threshold }) => 
    stock === 0 ? '#fef2f2' : 
    stock < threshold / 2 ? '#fff7ed' : 
    '#f0fdf4'
  };
  color: ${({ stock, threshold }) => 
    stock === 0 ? '#ef4444' : 
    stock < threshold / 2 ? '#f97316' : 
    '#10b981'
  };
`;

const LowStockTable: React.FC<LowStockTableProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return <EmptyMessage>No low stock products found</EmptyMessage>;
  }

  // Default product image
  const defaultProductImage = '/images/product-placeholder.png';

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Product</Th>
          <Th>Current Stock</Th>
          <Th>Status</Th>
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
            <Td>{product.current_stock}</Td>
            <Td>
              <StockBadge 
                stock={product.current_stock} 
                threshold={product.min_stock}
              >
                {product.current_stock === 0 ? 'Out of Stock' : 
                 product.current_stock < product.min_stock / 2 ? 'Critical' : 
                 'Low Stock'}
              </StockBadge>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LowStockTable;
