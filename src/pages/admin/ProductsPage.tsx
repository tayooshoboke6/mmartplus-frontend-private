import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AdminLayout from '../../components/admin/AdminLayout';
import { FlexBox, Text, Button, Tooltip } from '../../styles/GlobalComponents';
import { formatCurrency } from '../../utils/formatCurrency';

const SearchFiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  min-width: 200px;
`;

const FilterSelect = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 15px;
    text-align: left;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 500;
  }
  
  tr {
    border-bottom: 1px solid #eee;
  }
  
  tr:last-child {
    border-bottom: none;
  }
  
  tbody tr:hover {
    background-color: #f9f9f9;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #0066b2;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    text-decoration: underline;
  }
  
  &.delete {
    color: #dc3545;
  }
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const StockBadge = styled.span<{ inStock: boolean }>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 12px;
  background-color: ${props => props.inStock ? '#e6f7e6' : '#feebee'};
  color: ${props => props.inStock ? '#2e7d32' : '#b71c1c'};
`;

const ExpiryBadge = styled.span<{ daysLeft: number }>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 12px;
  background-color: ${props => {
    if (props.daysLeft <= 0) return '#feebee';
    if (props.daysLeft <= 7) return '#fff8e1';
    return '#e6f7e6';
  }};
  color: ${props => {
    if (props.daysLeft <= 0) return '#b71c1c';
    if (props.daysLeft <= 7) return '#f57f17';
    return '#2e7d32';
  }};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 15px;
  background-color: white;
  border-top: 1px solid #eee;
`;

const PageButton = styled.button<{ active?: boolean }>`
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  border: 1px solid ${props => props.active ? '#0066b2' : '#ddd'};
  border-radius: 4px;
  background-color: ${props => props.active ? '#0066b2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#0066b2' : '#f1f1f1'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const QuickFilter = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterTag = styled.button<{ active?: boolean }>`
  padding: 5px 12px;
  border: 1px solid ${props => props.active ? '#0066b2' : '#ddd'};
  border-radius: 20px;
  background-color: ${props => props.active ? '#e3f2fd' : 'white'};
  color: ${props => props.active ? '#0066b2' : '#666'};
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#e3f2fd' : '#f9f9f9'};
  }
`;

// Mock product data
const MOCK_PRODUCTS = [
  {
    id: 1,
    image: 'https://via.placeholder.com/50',
    name: 'Fresh Whole Milk',
    category: 'Dairy & Eggs',
    price: 1200,
    stock: 24,
    expiry: '2025-03-15',
    createdAt: '2025-02-15'
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/50',
    name: 'Premium Basmati Rice',
    category: 'Grains & Rice',
    price: 7500,
    stock: 12,
    expiry: '2025-12-18',
    createdAt: '2025-02-18'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/50',
    name: 'Organic Fresh Tomatoes',
    category: 'Fresh Produce',
    price: 1800,
    stock: 38,
    expiry: '2025-03-07',
    createdAt: '2025-02-20'
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/50',
    name: 'Frozen Chicken Breast',
    category: 'Meat & Seafood',
    price: 5500,
    stock: 45,
    expiry: '2025-06-22',
    createdAt: '2025-02-22'
  },
  {
    id: 5,
    image: 'https://via.placeholder.com/50',
    name: 'Premium Dish Soap',
    category: 'Household Supplies',
    price: 950,
    stock: 0,
    expiry: null,
    createdAt: '2025-02-25'
  },
  {
    id: 6,
    image: 'https://via.placeholder.com/50',
    name: 'Fresh Eggs (Crate of 30)',
    category: 'Dairy & Eggs',
    price: 3200,
    stock: 8,
    expiry: '2025-03-20',
    createdAt: '2025-02-26'
  },
  {
    id: 7,
    image: 'https://via.placeholder.com/50',
    name: 'Local Honey (500g)',
    category: 'Pantry Items',
    price: 4500,
    stock: 32,
    expiry: '2026-02-28',
    createdAt: '2025-02-28'
  },
  {
    id: 8,
    image: 'https://via.placeholder.com/50',
    name: 'Laundry Detergent (2kg)',
    category: 'Household Supplies',
    price: 3500,
    stock: 0,
    expiry: null,
    createdAt: '2025-03-01'
  }
];

const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [stockFilter, setStockFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState('all');
  
  // Categories derived from product data
  const categories = [
    'Fresh Produce', 
    'Dairy & Eggs', 
    'Meat & Seafood', 
    'Bakery', 
    'Pantry Items', 
    'Grains & Rice', 
    'Beverages',
    'Snacks', 
    'Frozen Foods', 
    'Household Supplies', 
    'Personal Care'
  ];
  
  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // In a real app, this would call an API to delete the product
      console.log(`Delete product with ID: ${productId}`);
    }
  };
  
  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string | null): number => {
    if (!expiryDate) return Infinity;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Filter products
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    // Search query filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (categoryFilter && product.category !== categoryFilter) {
      return false;
    }
    
    // Stock filter
    if (stockFilter === 'in_stock' && product.stock <= 0) {
      return false;
    }
    if (stockFilter === 'out_of_stock' && product.stock > 0) {
      return false;
    }
    if (stockFilter === 'low_stock' && product.stock > 10) {
      return false;
    }
    
    // Expiry filter
    const daysToExpiry = getDaysUntilExpiry(product.expiry);
    if (expiryFilter === 'expiring_soon' && daysToExpiry > 7) {
      return false;
    }
    if (expiryFilter === 'expired' && daysToExpiry > 0) {
      return false;
    }
    
    return true;
  });
  
  return (
    <AdminLayout title="Products">
      <FlexBox justify="space-between" align="center" style={{ marginBottom: '20px' }}>
        <Text size="xl" weight="bold">Manage Products</Text>
        <Link to="/admin/products/add">
          <Button variant="primary">Add New Product</Button>
        </Link>
      </FlexBox>
      
      <QuickFilter>
        <FilterTag 
          active={stockFilter === 'all'} 
          onClick={() => setStockFilter('all')}
        >
          All Products
        </FilterTag>

        <FilterTag 
          active={stockFilter === 'in_stock'} 
          onClick={() => setStockFilter('in_stock')}
        >
          In Stock
        </FilterTag>

        <FilterTag 
          active={stockFilter === 'out_of_stock'} 
          onClick={() => setStockFilter('out_of_stock')}
        >
          Out of Stock
        </FilterTag>

        <FilterTag 
          active={stockFilter === 'low_stock'} 
          onClick={() => setStockFilter('low_stock')}
        >
          Low Stock
        </FilterTag>

        <FilterTag 
          active={expiryFilter === 'expiring_soon'} 
          onClick={() => setExpiryFilter('expiring_soon')}
        >
          Expiring Soon
        </FilterTag>

        <FilterTag 
          active={expiryFilter === 'expired'} 
          onClick={() => setExpiryFilter('expired')}
        >
          Expired
        </FilterTag>
      </QuickFilter>
      
      <SearchFiltersContainer>
        <div style={{ position: 'relative', flex: 1 }}>
          <SearchInput 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        
        <div style={{ position: 'relative' }}>
          <FilterSelect 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </FilterSelect>
        </div>
        
        <div style={{ position: 'relative' }}>
          <FilterSelect 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_high">Price: High to Low</option>
            <option value="price_low">Price: Low to High</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
            <option value="expiry_soon">Expiry: Soonest First</option>
          </FilterSelect>
        </div>
      </SearchFiltersContainer>
      
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const daysToExpiry = getDaysUntilExpiry(product.expiry);
                return (
                  <tr key={product.id}>
                    <td>
                      <ProductImage src={product.image} alt={product.name} />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>
                      <StockBadge inStock={product.stock > 0}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                      </StockBadge>
                    </td>
                    <td>
                      {product.expiry ? (
                        <ExpiryBadge daysLeft={daysToExpiry}>
                          {daysToExpiry <= 0 
                            ? 'Expired' 
                            : daysToExpiry <= 7 
                              ? `Expiring in ${daysToExpiry} day${daysToExpiry === 1 ? '' : 's'}` 
                              : product.expiry}
                        </ExpiryBadge>
                      ) : (
                        <Text size="sm" color="#666">N/A</Text>
                      )}
                    </td>
                    <td>
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <ActionButton>Edit</ActionButton>
                      </Link>
                      <ActionButton 
                        className="delete" 
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </ActionButton>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px 15px' }}>
                  <Text size="md" color="#666">No products found matching your filters.</Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        
        {filteredProducts.length > 0 && (
          <Pagination>
            <PageButton disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
              &lt;
            </PageButton>
            
            {[1, 2, 3].map(page => (
              <PageButton 
                key={page} 
                active={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PageButton>
            ))}
            
            <PageButton onClick={() => setCurrentPage(prev => prev + 1)}>
              &gt;
            </PageButton>
          </Pagination>
        )}
      </TableContainer>
    </AdminLayout>
  );
};

export default ProductsPage;
