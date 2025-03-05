import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import productService, { Product, ProductsResponse } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useCart } from '../contexts/CartContext';
import Layout from '../components/layout/Layout';

const SearchResultsContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchHeader = styled.div`
  margin-bottom: 20px;
`;

const SearchTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const SearchStats = styled.p`
  color: #666;
  font-size: 14px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 40px 0;
  
  h2 {
    margin-bottom: 15px;
    font-weight: 500;
  }
  
  p {
    color: #666;
    margin-bottom: 20px;
  }
`;

const LoadMoreButton = styled.button`
  background-color: #0066b2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin: 30px auto;
  display: block;
  
  &:hover {
    background-color: #005091;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
  
  select {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 14px;
    margin-right: 10px;
  }
`;

interface SearchParams {
  q: string;
  page?: string;
  sort?: string;
}

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });
  const [sortOption, setSortOption] = useState('newest');
  
  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const sortMapping: Record<string, { sort_by: string, sort_order: string }> = {
          newest: { sort_by: 'created_at', sort_order: 'desc' },
          price_asc: { sort_by: 'price', sort_order: 'asc' },
          price_desc: { sort_by: 'price', sort_order: 'desc' },
          name_asc: { sort_by: 'name', sort_order: 'asc' }
        };
        
        const sortParams = sortMapping[sortOption] || sortMapping.newest;
        
        const result: ProductsResponse = await productService.getProducts({
          search: query,
          page: page,
          per_page: 12,
          sort_by: sortParams.sort_by as any,
          sort_order: sortParams.sort_order as any
        });
        
        if (result.success) {
          setProducts(result.products.data);
          setPagination({
            currentPage: result.products.current_page,
            lastPage: result.products.last_page,
            total: result.products.total
          });
          
          // Redirect to product-not-found if no results on first page
          if (page === 1 && result.products.data.length === 0) {
            navigate(`/product-not-found?q=${encodeURIComponent(query)}`);
          }
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        if (page === 1) {
          navigate(`/product-not-found?q=${encodeURIComponent(query)}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query, page, sortOption, navigate]);
  
  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.lastPage) {
      const newPage = pagination.currentPage + 1;
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set('page', newPage.toString());
      navigate(`${location.pathname}?${newSearchParams.toString()}`);
    }
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    // Reset to page 1 when changing sort
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('page', '1');
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };
  
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.image_urls[0] || '',
      quantity: 1
    });
  };
  
  if (loading) {
    return (
      <Layout>
        <SearchResultsContainer>
          <LoadingSpinner />
        </SearchResultsContainer>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <SearchResultsContainer>
        <SearchHeader>
          <SearchTitle>Search Results for "{query}"</SearchTitle>
          <SearchStats>
            {pagination.total} products found
          </SearchStats>
        </SearchHeader>
        
        {products.length > 0 ? (
          <>
            <FilterSection>
              <select value={sortOption} onChange={handleSortChange}>
                <option value="newest">Sort by: Newest</option>
                <option value="price_asc">Sort by: Price (Low to High)</option>
                <option value="price_desc">Sort by: Price (High to Low)</option>
                <option value="name_asc">Sort by: Name</option>
              </select>
            </FilterSection>
            
            <ProductGrid>
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </ProductGrid>
            
            {pagination.currentPage < pagination.lastPage && (
              <LoadMoreButton onClick={handleLoadMore}>
                Load More Products
              </LoadMoreButton>
            )}
          </>
        ) : (
          <NoResults>
            <h2>No products found</h2>
            <p>We couldn't find any products matching "{query}"</p>
            <p>Try using more general terms or check for spelling mistakes</p>
          </NoResults>
        )}
      </SearchResultsContainer>
    </Layout>
  );
};

export default SearchResultsPage;
