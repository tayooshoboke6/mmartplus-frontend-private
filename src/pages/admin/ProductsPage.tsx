import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AdminLayout from '../../components/layouts/AdminLayout';
import { FlexBox, Text, Button, Tooltip } from '../../styles/GlobalComponents';
import { formatCurrency } from '../../utils/formatCurrency';
import productService from '../../services/productService';
import { toast } from 'react-toastify';
import { Product, ProductsResponse } from '../../types/Product';

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

const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [stockFilter, setStockFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  
  // Categories derived from product data
  const [categories, setCategories] = useState<string[]>([
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
    'Health & Beauty',
    'Baby & Child',
    'Pet Supplies' 
  ]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Create sorting parameters
      let sortField: string;
      let sortOrder: 'asc' | 'desc' = 'desc';
      
      switch (sortBy) {
        case 'newest':
          sortField = 'created_at';
          sortOrder = 'desc';
          break;
        case 'oldest':
          sortField = 'created_at';
          sortOrder = 'asc';
          break;
        case 'price_high':
          sortField = 'price';
          sortOrder = 'desc';
          break;
        case 'price_low':
          sortField = 'price';
          sortOrder = 'asc';
          break;
        case 'name_asc':
          sortField = 'name';
          sortOrder = 'asc';
          break;
        case 'name_desc':
          sortField = 'name';
          sortOrder = 'desc';
          break;
        default:
          sortField = 'created_at';
          sortOrder = 'desc';
      }
      
      const response = await productService.getProducts({
        page: currentPage,
        per_page: 10,
        sort_by: sortField as any,
        sort_order: sortOrder,
        search: searchQuery || undefined,
        category_id: categoryFilter ? parseInt(categoryFilter) : undefined
      });
      
      // Handle the updated API response structure
      if (response && response.success && response.products) {
        setProducts(response.products.data);
        setTotalPages(response.products.last_page);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(response.products.data.map(product => product.category?.name))
        ).filter(Boolean) as string[];
        
        if (uniqueCategories.length > 0) {
          setCategories(uniqueCategories);
        }
      } else if (response && response.status === 'success' && response.data) {
        // Alternative API response format
        setProducts(response.data.data);
        setTotalPages(response.data.last_page);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(response.data.data.map(product => product.category?.name))
        ).filter(Boolean) as string[];
        
        if (uniqueCategories.length > 0) {
          setCategories(uniqueCategories);
        }
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      
      // Handle different error cases
      if (error.isRecentLoginError) {
        // If this is happening right after login, show a more helpful message
        console.log('Authentication still initializing, using mock data temporarily');
        toast.info('Initializing product data...');
        
        // Use mock data and retry after a delay
        setTimeout(() => {
          console.log('Retrying product fetch after initialization delay');
          fetchProducts();
        }, 3000);
      } else if (error.response && error.response.status === 401) {
        // Handle unauthorized error
        toast.error('Session authentication error. Please refresh the page.');
      } else {
        // Default error for other issues
        toast.error('Failed to load products');
      }
      
      // Use mock data for development/testing
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Fresh Whole Milk",
          slug: "fresh-whole-milk",
          description: "Farm fresh whole milk, pasteurized and homogenized for the best taste.",
          short_description: "Farm fresh whole milk",
          price: 450,
          stock: 100,
          sku: "MILK001",
          is_active: true,
          is_featured: true,
          category_id: 1,
          images: ["https://via.placeholder.com/400x400?text=Fresh+Milk"],
          expiry_date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
          created_at: "2025-03-05T00:00:00.000000Z",
          updated_at: "2025-03-05T00:00:00.000000Z",
          category: {
            id: 1,
            name: "Dairy",
            parent_id: null
          }
        },
        {
          id: 2,
          name: "Premium Basmati Rice",
          slug: "premium-basmati-rice",
          description: "Premium long-grain basmati rice, aged for the perfect aroma and taste.",
          short_description: "Premium aged basmati rice",
          price: 2500,
          stock: 50,
          sku: "RICE001",
          is_active: true,
          is_featured: false,
          category_id: 2,
          images: ["https://via.placeholder.com/400x400?text=Basmati+Rice"],
          expiry_date: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString().split('T')[0],
          created_at: "2025-03-05T00:00:00.000000Z",
          updated_at: "2025-03-05T00:00:00.000000Z",
          category: {
            id: 2,
            name: "Grains",
            parent_id: null
          }
        }
      ];
      
      setProducts(mockProducts);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // First check if the user is properly authenticated
        const token = localStorage.getItem('mmartToken');
        
        if (!token) {
          toast.error('You must be logged in to delete products. Please log in again.');
          return;
        }
        
        // Check if token is our development token (which always works)
        const isDevelopmentToken = token.includes('dev-admin-token');
        
        // For development mode, allow the operation to proceed with mock data
        if (isDevelopmentToken && process.env.NODE_ENV === 'development') {
          console.log('Development mode: simulating successful product deletion');
          setProducts(products.filter(product => product.id !== id));
          toast.success('Product deleted successfully');
          return;
        }
        
        // Proceed with the actual API call
        const response = await productService.deleteProduct(id);
        
        if (response && response.success) {
          toast.success('Product deleted successfully');
          fetchProducts(); // Refresh the product list
        } else {
          toast.error(response?.message || 'Failed to delete product');
        }
      } catch (error: any) {
        console.error('Error deleting product:', error);
        
        // Handle different error cases
        if (error.isRecentLoginError) {
          // This error happens if we just logged in and the session is still initializing
          toast.info('Authentication is initializing. Please try again in a moment.');
          
          // Retry after a short delay
          setTimeout(() => {
            toast.info('Retrying product deletion...');
            handleDeleteProduct(id);
          }, 3000);
        } else if (error.response) {
          switch (error.response.status) {
            case 401:
              toast.error('Authentication error. Please log in again.');
              break;
            case 403:
              toast.error('You do not have permission to delete this product.');
              break;
            case 409:
              toast.error('This product cannot be deleted because it is associated with one or more orders.');
              break;
            default:
              toast.error(`Failed to delete product: ${error.response.data?.message || 'Unknown error'}`);
          }
        } else {
          toast.error('Failed to delete product. Please try again later.');
        }
      }
    }
  };

  // Filter the products
  const filteredProducts = products.filter(product => {
    // Apply search filter if any
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply category filter if any
    if (categoryFilter && product.category?.name !== categoryFilter) {
      return false;
    }
    
    // Apply stock filter
    if (stockFilter === 'in_stock' && product.stock <= 0) {
      return false;
    }
    
    if (stockFilter === 'out_of_stock' && product.stock > 0) {
      return false;
    }
    
    if (stockFilter === 'low_stock' && product.stock > 10) {
      return false;
    }
    
    // Apply expiry filter
    if (expiryFilter === 'expiring_soon') {
      const daysUntilExpiry = getDaysUntilExpiry(product.expiry_date);
      if (daysUntilExpiry === null || daysUntilExpiry > 7) {
        return false;
      }
    }
    
    if (expiryFilter === 'expired') {
      const daysUntilExpiry = getDaysUntilExpiry(product.expiry_date);
      if (daysUntilExpiry === null || daysUntilExpiry >= 0) {
        return false;
      }
    }
    
    return true;
  });

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string | null): number => {
    if (!expiryDate) return Infinity;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <AdminLayout>
      <FlexBox justify="space-between" align="center" gap="20px" style={{ marginBottom: '20px' }}>
        <Text size="24px" weight="500">Manage Products</Text>
        <Link to="/admin/products/new">
          <Button primary>Add New Product</Button>
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
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const daysToExpiry = getDaysUntilExpiry(product.expiry_date);
                return (
                  <tr key={product.id}>
                    <td>
                      <ProductImage 
                        src={Array.isArray(product.images) && product.images.length > 0 
                          ? product.images[0] 
                          : 'https://via.placeholder.com/50'} 
                        alt={product.name} 
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category?.name || '-'}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>
                      <StockBadge inStock={product.stock > 0}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                      </StockBadge>
                    </td>
                    <td>
                      {product.expiry_date ? (
                        <ExpiryBadge daysLeft={daysToExpiry || 0}>
                          {daysToExpiry !== null ? (
                            daysToExpiry < 0 ? 
                              'Expired' : 
                              daysToExpiry === 0 ? 
                                'Expires Today' : 
                                `${daysToExpiry} days left`
                          ) : 'N/A'}
                        </ExpiryBadge>
                      ) : (
                        <span>N/A</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/admin/products/${product.id}`}>
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
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                  No products found matching the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>
    </AdminLayout>
  );
};

export default ProductsPage;
