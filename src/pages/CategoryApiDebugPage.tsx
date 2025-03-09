import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { categories, getParentCategories, getChildCategories, getCategoryById, getCategoryBySlug } from '../data/categories';

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

const CategoryApiDebugPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [categoryId, setCategoryId] = useState<string>('');
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);
  const [includeChildren, setIncludeChildren] = useState<boolean>(false);
  const [parentId, setParentId] = useState<string>('');
  
  const clearResults = () => {
    setResult(null);
    setError(null);
    setSuccess(null);
  };
  
  const handleGetCategories = async () => {
    clearResults();
    setLoading(true);
    
    try {
      // Use mock data directly instead of API call
      const mockCategories = categories.filter(cat => {
        if (!includeInactive && !cat.is_active) return false;
        if (parentId && cat.parent_id !== parseInt(parentId)) return false;
        return true;
      });
      
      const mockResponse = {
        data: mockCategories,
        meta: {
          total: mockCategories.length,
          per_page: mockCategories.length,
          current_page: 1,
          last_page: 1,
          from: 1,
          to: mockCategories.length
        }
      };
      
      setResult(mockResponse);
      setSuccess('Categories fetched successfully from mock data');
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error fetching categories: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetCategoryById = async () => {
    if (!categoryId) {
      setError('Category ID is required');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Use mock data directly instead of API call
      const id = parseInt(categoryId);
      const category = getCategoryById(id);
      
      if (category) {
        setResult(category);
        setSuccess(`Category with ID ${id} fetched successfully from mock data`);
      } else {
        setError(`Category with ID ${id} not found in mock data`);
      }
    } catch (err) {
      console.error('Error fetching category by ID:', err);
      setError('Error fetching category by ID: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetCategoryBySlug = async () => {
    if (!categorySlug) {
      setError('Category slug is required');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Use mock data directly instead of API call
      const category = getCategoryBySlug(categorySlug);
      
      if (category) {
        setResult(category);
        setSuccess(`Category with slug '${categorySlug}' fetched successfully from mock data`);
      } else {
        setError(`Category with slug '${categorySlug}' not found in mock data`);
      }
    } catch (err) {
      console.error('Error fetching category by slug:', err);
      setError('Error fetching category by slug: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetCategoryProducts = async () => {
    if (!categoryId) {
      setError('Category ID is required');
      return;
    }
    
    clearResults();
    setLoading(true);
    
    try {
      // Mock response for category products
      const mockProducts = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1} in Category ${categoryId}`,
        price: Math.floor(Math.random() * 100) + 1,
        image_url: `https://via.placeholder.com/150?text=Product${i+1}`,
        category_id: parseInt(categoryId)
      }));
      
      const mockResponse = {
        data: mockProducts,
        meta: {
          total: mockProducts.length,
          per_page: mockProducts.length,
          current_page: 1,
          last_page: 1,
          from: 1,
          to: mockProducts.length
        }
      };
      
      setResult(mockResponse);
      setSuccess(`Products for category ID ${categoryId} fetched successfully from mock data`);
    } catch (err) {
      console.error('Error fetching category products:', err);
      setError('Error fetching category products: ' + (err instanceof Error ? err.message : String(err)));
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
          categories: categories.slice(0, 5)
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
        mockCategoriesCount: categories.length,
        mockCategoriesSample: categories.slice(0, 3),
        mockParentCategories: getParentCategories().length,
        mockChildCategoriesExample: getChildCategories(1)
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
        <PageTitle>Category API Debug Page</PageTitle>
        
        <DebugSection>
          <h2>Test Controls</h2>
          
          <ButtonGroup>
            <Button onClick={handleGetCategories} disabled={loading}>
              Test Get Categories
            </Button>
            <Button onClick={handleGetCategoryById} disabled={loading}>
              Test Get Category By ID
            </Button>
            <Button onClick={handleGetCategoryBySlug} disabled={loading}>
              Test Get Category By Slug
            </Button>
            <Button onClick={handleGetCategoryProducts} disabled={loading}>
              Test Get Category Products
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
              <label htmlFor="parentId">Parent ID (optional, empty for root categories):</label>
              <input
                type="text"
                id="parentId"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                placeholder="Leave empty for root categories"
              />
            </InputGroup>
            
            <InputGroup>
              <label>
                <input
                  type="checkbox"
                  checked={includeInactive}
                  onChange={(e) => setIncludeInactive(e.target.checked)}
                />
                Include Inactive Categories
              </label>
            </InputGroup>
            
            <InputGroup>
              <label>
                <input
                  type="checkbox"
                  checked={includeChildren}
                  onChange={(e) => setIncludeChildren(e.target.checked)}
                />
                Include Children
              </label>
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

export default CategoryApiDebugPage;
