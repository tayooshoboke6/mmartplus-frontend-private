import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { products, getProductById, getProductBySlug, getProductsByCategory, getProductsByCategorySlug, getFeaturedProducts, getNewArrivals, getBestSellers, searchProducts } from '../data/products';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  padding-top: 120px; /* Add padding to accommodate fixed header */
  
  @media (max-width: 768px) {
    padding-top: 110px;
  }
  
  @media (max-width: 480px) {
    padding-top: 100px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px 40px;
  
  @media (max-width: 1024px) {
    max-width: 100%;
    padding: 0 15px 30px;
  }
  
  @media (max-width: 768px) {
    padding: 0 15px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 0 10px 15px;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const DebugSection = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    
    h2 {
      font-size: 18px;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  
  label {
    font-size: 14px;
    margin-bottom: 5px;
    font-weight: 500;
  }
  
  input, select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    max-width: 300px;
  }
  
  @media (max-width: 480px) {
    input, select {
      max-width: 100%;
    }
  }
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  pre {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    overflow-x: auto;
    font-family: monospace;
    font-size: 13px;
    max-height: 400px;
    overflow-y: auto;
  }
`;

const ErrorMessage = styled.div`
  color: #e53935;
  margin-top: 10px;
  font-size: 14px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  color: #43a047;
  margin-top: 10px;
  font-size: 14px;
  padding: 10px;
  background-color: #e8f5e9;
  border-radius: 4px;
`;

const ProductApiDebugPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [productId, setProductId] = useState<string>('');
  const [productSlug, setProductSlug] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  const clearResults = () => {
    setResult(null);
    setError(null);
    setSuccess(null);
  };
  
  const handleGetProductById = async () => {
    if (!productId) {
      setError('Product ID is required');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Use mock data directly instead of API call
      const id = parseInt(productId);
      const product = getProductById(id);
      
      if (product) {
        setResult(product);
        setSuccess(`Product with ID ${id} fetched successfully from mock data`);
      } else {
        setError(`Product with ID ${id} not found in mock data`);
      }
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      setError('Error fetching product by ID: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetProductBySlug = async () => {
    if (!productSlug) {
      setError('Product slug is required');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Use mock data directly instead of API call
      const product = getProductBySlug(productSlug);
      
      if (product) {
        setResult(product);
        setSuccess(`Product with slug '${productSlug}' fetched successfully from mock data`);
      } else {
        setError(`Product with slug '${productSlug}' not found in mock data`);
      }
    } catch (err) {
      console.error('Error fetching product by slug:', err);
      setError('Error fetching product by slug: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetProductsByCategory = async () => {
    if (!categoryId) {
      setError('Category ID is required');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Use mock data directly instead of API call
      const id = parseInt(categoryId);
      const categoryProducts = getProductsByCategory(id);
      
      const mockResponse = {
        data: categoryProducts,
        meta: {
          total: categoryProducts.length,
          per_page: categoryProducts.length,
          current_page: 1,
          last_page: 1,
          from: 1,
          to: categoryProducts.length
        }
      };
      
      setResult(mockResponse);
      setSuccess(`Products for category ID ${id} fetched successfully from mock data`);
    } catch (err) {
      console.error('Error fetching products by category ID:', err);
      setError('Error fetching products by category ID: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetProductsByCategorySlug = async () => {
    if (!categorySlug) {
      setError('Category slug is required');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Use mock data directly instead of API call
      const categoryProducts = getProductsByCategorySlug(categorySlug);
      
      const mockResponse = {
        data: categoryProducts,
        meta: {
          total: categoryProducts.length,
          per_page: categoryProducts.length,
          current_page: 1,
          last_page: 1,
          from: 1,
          to: categoryProducts.length
        }
      };
      
      setResult(mockResponse);
      setSuccess(`Products for category slug '${categorySlug}' fetched successfully from mock data`);
    } catch (err) {
      console.error('Error fetching products by category slug:', err);
      setError('Error fetching products by category slug: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchProducts = async () => {
    if (!searchQuery) {
      setError('Search query is required');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Use mock data directly instead of API call
      const searchResults = searchProducts(searchQuery);
      
      // Filter by price if provided
      let filteredResults = searchResults;
      if (minPrice) {
        filteredResults = filteredResults.filter(p => p.price >= parseFloat(minPrice));
      }
      if (maxPrice) {
        filteredResults = filteredResults.filter(p => p.price <= parseFloat(maxPrice));
      }
      
      // Sort results
      if (sortBy === 'price_asc') {
        filteredResults.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        filteredResults.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'newest') {
        // For mock data, we'll just use the current order
      }
      
      const mockResponse = {
        data: filteredResults,
        meta: {
          total: filteredResults.length,
          per_page: filteredResults.length,
          current_page: 1,
          last_page: 1,
          from: 1,
          to: filteredResults.length
        }
      };
      
      setResult(mockResponse);
      setSuccess(`Search results for '${searchQuery}' fetched successfully from mock data`);
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Error searching products: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetFeaturedProducts = async () => {
    clearResults();
    setLoading(true);
    
    try {
      // Use mock data directly instead of API call
      const featuredProducts = getFeaturedProducts();
      
      const mockResponse = {
        data: featuredProducts,
        meta: {
          total: featuredProducts.length,
          per_page: featuredProducts.length,
          current_page: 1,
          last_page: 1,
          from: 1,
          to: featuredProducts.length
        }
      };
      
      setResult(mockResponse);
      setSuccess('Featured products fetched successfully from mock data');
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError('Error fetching featured products: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetNewArrivals = async () => {
    clearResults();
    setLoading(true);
    
    try {
      // Use mock data directly instead of API call
      const newArrivals = getNewArrivals();
      
      const mockResponse = {
        data: newArrivals,
        meta: {
          total: newArrivals.length,
          per_page: newArrivals.length,
          current_page: 1,
          last_page: 1,
          from: 1,
          to: newArrivals.length
        }
      };
      
      setResult(mockResponse);
      setSuccess('New arrivals fetched successfully from mock data');
    } catch (err) {
      console.error('Error fetching new arrivals:', err);
      setError('Error fetching new arrivals: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetBestSellers = async () => {
    clearResults();
    setLoading(true);
    
    try {
      // Use mock data directly instead of API call
      const bestSellers = getBestSellers();
      
      const mockResponse = {
        data: bestSellers,
        meta: {
          total: bestSellers.length,
          per_page: bestSellers.length,
          current_page: 1,
          last_page: 1,
          from: 1,
          to: bestSellers.length
        }
      };
      
      setResult(mockResponse);
      setSuccess('Best sellers fetched successfully from mock data');
    } catch (err) {
      console.error('Error fetching best sellers:', err);
      setError('Error fetching best sellers: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleDirectApiCall = async () => {
    clearResults();
    setLoading(true);
    
    try {
      // Mock direct API call response
      const mockResponse = {
        success: true,
        message: 'Mock API call successful',
        timestamp: new Date().toISOString(),
        data: {
          products: products.slice(0, 5)
        }
      };
      
      setResult(mockResponse);
      setSuccess('Direct API call simulated successfully with mock data');
    } catch (err) {
      console.error('Error making direct API call:', err);
      setError('Error making direct API call: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckMockApiSetup = () => {
    clearResults();
    
    try {
      // Check if mock data is properly set up
      setResult({
        mockProductsCount: products.length,
        mockProductsSample: products.slice(0, 3),
        mockFeaturedProducts: getFeaturedProducts().length,
        mockNewArrivals: getNewArrivals().length,
        mockBestSellers: getBestSellers().length
      });
      setSuccess('Mock API setup checked successfully');
    } catch (err) {
      console.error('Error checking mock API setup:', err);
      setError('Error checking mock API setup: ' + (err instanceof Error ? err.message : String(err)));
    }
  };
  
  return (
    <PageContainer>
      <Header />
      
      <MainContent>
        <PageTitle>Product API Debug Page</PageTitle>
        
        <DebugSection>
          <h2>Test Controls</h2>
          
          <ButtonGroup>
            <Button onClick={handleGetProductById} disabled={loading}>
              Test Get Product By ID
            </Button>
            <Button onClick={handleGetProductBySlug} disabled={loading}>
              Test Get Product By Slug
            </Button>
            <Button onClick={handleGetProductsByCategory} disabled={loading}>
              Test Get Products By Category ID
            </Button>
            <Button onClick={handleGetProductsByCategorySlug} disabled={loading}>
              Test Get Products By Category Slug
            </Button>
            <Button onClick={handleSearchProducts} disabled={loading}>
              Test Search Products
            </Button>
            <Button onClick={handleGetFeaturedProducts} disabled={loading}>
              Test Get Featured Products
            </Button>
            <Button onClick={handleGetNewArrivals} disabled={loading}>
              Test Get New Arrivals
            </Button>
            <Button onClick={handleGetBestSellers} disabled={loading}>
              Test Get Best Sellers
            </Button>
            <Button onClick={handleDirectApiCall} disabled={loading}>
              Test Direct API Call
            </Button>
            <Button onClick={handleCheckMockApiSetup} disabled={loading}>
              Check Mock API Setup
            </Button>
          </ButtonGroup>
          
          <div>
            <InputGroup>
              <label htmlFor="productId">Product ID:</label>
              <input
                type="text"
                id="productId"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="productSlug">Product Slug:</label>
              <input
                type="text"
                id="productSlug"
                value={productSlug}
                onChange={(e) => setProductSlug(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="categoryId">Category ID:</label>
              <input
                type="text"
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="categorySlug">Category Slug:</label>
              <input
                type="text"
                id="categorySlug"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="searchQuery">Search Query:</label>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="minPrice">Min Price:</label>
              <input
                type="text"
                id="minPrice"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Optional"
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="maxPrice">Max Price:</label>
              <input
                type="text"
                id="maxPrice"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Optional"
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="sortBy">Sort By:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="popular">Popularity</option>
              </select>
            </InputGroup>
          </div>
        </DebugSection>
        
        {loading && <div>Loading...</div>}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        {result && (
          <ResultContainer>
            <h3>API Response:</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </ResultContainer>
        )}
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default ProductApiDebugPage;
