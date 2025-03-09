import React, { useState, useEffect, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layouts/AdminLayout';
import { FlexBox, Text, Button, Tooltip } from '../../styles/GlobalComponents';
import categoryService from '../../services/categoryService';
import { AuthContext } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface CategoryFormData {
  id: number | null;
  name: string;
  slug: string;
  parentId: number | null;
  description: string;
  image: File | null;
  color: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  description: string;
  image_url: string | null;
  color: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const Container = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CategoryForm = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 350px;
  align-self: flex-start;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;

const CategoryList = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    border-color: #0066b2;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  
  &:focus {
    border-color: #0066b2;
    outline: none;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    border-color: #0066b2;
    outline: none;
  }
`;

const ImageUploadPreview = styled.div`
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
  }
  
  &.empty {
    color: #aaa;
    font-size: 14px;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: white;
  }
`;

const CategoryTable = styled.table`
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
  
  tr:hover {
    background-color: #f8f9fa;
  }
  
  @media (max-width: 768px) {
    th, td {
      padding: 10px;
    }
  }
  
  @media (max-width: 480px) {
    th:nth-child(3), 
    td:nth-child(3) {
      display: none; /* Hide Parent column on small screens */
    }
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: inline-block;
  text-align: center;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  &.edit {
    color: #0066b2;
    margin-right: 8px;
  }
  
  &.delete {
    color: #dc3545;
  }
  
  @media (max-width: 768px) {
    padding: 5px 8px;
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    display: block;
    margin-bottom: 5px;
    width: 100%;
    
    &.edit {
      margin-right: 0;
      margin-bottom: 5px;
    }
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CategoryImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 20px;
`;

const CategoryColorBadge = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-left: 10px;
  vertical-align: middle;
`;

const NoImagePlaceholder = styled.div`
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 12px;
`;

const ProductCount = styled.span`
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: #666;
`;

const Alert = styled.div<{ type: 'success' | 'error' }>`
  padding: 10px 15px;
  margin-bottom: 15px;
  border-radius: 4px;
  color: white;
  background-color: ${props => props.type === 'success' ? '#4caf50' : '#f44336'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
`;

const DevelopmentPanel = styled.div`
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 8px;
  
  h3 {
    margin-top: 0;
    color: #333;
  }
  
  p {
    margin-bottom: 16px;
    color: #666;
  }
  
  small {
    display: block;
    margin-top: 12px;
    color: #999;
    font-style: italic;
  }
`;

const DevControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 16px;
  margin-top: 16px;
`;

const DevControlCard = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 16px;
  
  h4 {
    margin-top: 0;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
  }
  
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
  }
`;

const DevButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 12px;
  
  &:hover {
    background: #5a6268;
  }
`;

const CategoriesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    id: null,
    name: '',
    slug: '',
    parentId: null,
    description: '',
    image: null,
    color: '#4CAF50'
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // Access auth context for admin login
  const { loginAsAdmin } = useContext(AuthContext);

  const handleAdminLogin = async () => {
    try {
      if (loginAsAdmin) {
        const result = await loginAsAdmin();
        
        if (result.success) {
          // Force a CSRF token refresh
          await getCsrfCookie();
          
          // Set a success message
          setAlert({ 
            type: 'success', 
            message: 'Admin token set successfully. Refreshing data...' 
          });
          
          // Add a small delay to ensure token is processed
          setTimeout(() => {
            // Fetch fresh data immediately with the new token
            fetchCategories(true);
          }, 500);
        } else {
          setAlert({ 
            type: 'error', 
            message: result.error || 'Failed to set admin token' 
          });
        }
      }
    } catch (err: any) {
      console.error('Error setting admin token:', err);
      setAlert({ 
        type: 'error', 
        message: 'Error setting admin token: ' + (err.message || 'Unknown error') 
      });
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryService.getCategories({ forceRefresh });
      console.log('Categories API response:', response);
      
      // Handle different possible response formats
      if (response.status === 'success') {
        if (Array.isArray(response.data)) {
          // API returns { status: 'success', data: [...categories] }
          console.log('Setting categories from array data:', response.data.length);
          setCategories(response.data);
        } else if (response.data && typeof response.data === 'object') {
          // API might return nested data object
          const dataArray = Array.isArray(response.data.data) ? response.data.data : [];
          console.log('Setting categories from nested data:', dataArray.length);
          setCategories(dataArray);
        } else {
          setError('Unexpected API response format: data is not an array');
          console.error('Unexpected API response data format:', response.data);
        }
      } else {
        setError('Failed to fetch categories: ' + (response.message || 'Unknown error'));
        console.error('Failed to fetch categories:', response);
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      slug: '',
      parentId: null,
      description: '',
      image: null,
      color: '#4CAF50'
    });
    setImagePreview(null);
    setEditMode(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'name' && !formData.slug) {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData({
        ...formData,
        name: value,
        slug
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file
      });
      
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };
  
  const removeImage = () => {
    setFormData({
      ...formData,
      image: null
    });
    
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };
  
  const handleEdit = (category: Category) => {
    const parentId = category.parent_id;
    
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentId: parentId,
      description: category.description || '',
      image: null,
      color: category.color || '#4CAF50'
    });
    
    setImagePreview(category.image_url);
    
    setEditMode(true);
    setAlert(null);
  };
  
  const handleDelete = async (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setLoading(true);
      try {
        await categoryService.deleteCategory(categoryId);
        
        // Remove category from state
        setCategories(prevCategories => 
          prevCategories.filter(cat => cat.id !== categoryId)
        );
        
        setAlert({ type: 'success', message: 'Category deleted successfully' });
        fetchCategories(true);
      } catch (err: any) {
        console.error(`Error deleting category ${categoryId}:`, err);
        setAlert({ type: 'error', message: `Error deleting category: ${err.message || 'Unknown error'}` });
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('slug', formData.slug);
      formDataObj.append('description', formData.description || '');
      
      if (formData.parentId !== null) {
        formDataObj.append('parent_id', formData.parentId.toString());
      }
      
      if (formData.color) {
        formDataObj.append('color', formData.color);
      }
      
      formDataObj.append('is_active', 'true');
      
      if (formData.image instanceof File) {
        formDataObj.append('image', formData.image);
      }
      
      let response;
      if (editMode && formData.id) {
        response = await categoryService.updateCategory(formData.id, formDataObj);
        if (response.status === 'success') {
          setAlert({ type: 'success', message: 'Category updated successfully' });
        } else {
          throw new Error(response.message || 'Failed to update category');
        }
      } else {
        response = await categoryService.createCategory(formDataObj);
        if (response.status === 'success') {
          setAlert({ type: 'success', message: 'Category created successfully' });
        } else {
          throw new Error(response.message || 'Failed to create category');
        }
      }
      
      fetchCategories(true);
      
      resetForm();
    } catch (err: any) {
      console.error('Error saving category:', err);
      setError(err.message || 'An error occurred while saving the category.');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredCategories = categories.filter(category =>
    category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );
  
  return (
    <AdminLayout title="Categories">
      {alert && (
        <Alert type={alert.type}>
          {alert.message}
          <CloseButton onClick={() => setAlert(null)}>×</CloseButton>
        </Alert>
      )}
      
      <FlexBox style={{ marginBottom: '20px' }}>
        <Text size="xl" weight="bold">Category Management</Text>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button 
            onClick={() => handleAdminLogin()}
            variant="outline"
          >
            Set Admin Token
          </Button>
          {editMode && (
            <Button 
              variant="outline"
              type="button" 
              onClick={resetForm}
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </FlexBox>
      
      <Container>
        <CategoryForm>
          <Text size="lg" weight="bold" style={{ marginBottom: '20px' }}>
            {editMode ? 'Edit Category' : 'Create a New Category'}
          </Text>
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">
                <Tooltip 
                  content="Enter a descriptive name for the category"
                  position="right"
                >
                  Category Name*
                </Tooltip>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="slug">
                <Tooltip 
                  content="URL-friendly version of the name. Will auto-generate if empty"
                  position="right"
                >
                  Slug*
                </Tooltip>
              </Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="parentId">
                <Tooltip 
                  content="Select a parent category or leave as 'None' for top-level categories"
                  position="right"
                >
                  Parent Category
                </Tooltip>
              </Label>
              <Select
                id="parentId"
                name="parentId"
                value={formData.parentId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  parentId: e.target.value ? Number(e.target.value) : null
                })}
              >
                <option value="">None (Top Level)</option>
                {categories.filter(cat => cat.parent_id === null).map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="color">
                <Tooltip 
                  content="Color to represent this category in the UI"
                  position="right"
                >
                  Category Color
                </Tooltip>
              </Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({
                    ...formData,
                    color: e.target.value
                  })}
                  style={{ width: '50px', padding: '2px' }}
                />
                <Text size="sm" color="#666">
                  Choose a color for category identification
                </Text>
              </div>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">
                <Tooltip 
                  content="Short description of what products are in this category"
                  position="right"
                >
                  Description
                </Tooltip>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="image">
                <Tooltip 
                  content="Image representing this category (JPG, PNG, WebP - 500x500px recommended)"
                  position="right"
                >
                  Category Image
                </Tooltip>
              </Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <ImageUploadPreview className={!imagePreview ? 'empty' : ''}>
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Category" />
                    <RemoveImageButton onClick={removeImage}>✕</RemoveImageButton>
                  </>
                ) : (
                  'No image selected'
                )}
              </ImageUploadPreview>
            </FormGroup>
            
            <FlexBox gap="10px" justify="space-between">
              {editMode ? (
                <>
                  <Button 
                    type="button" 
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Update Category
                  </Button>
                </>
              ) : (
                <Button 
                  type="submit" 
                  style={{ width: '100%' }}
                >
                  Create Category
                </Button>
              )}
            </FlexBox>
          </form>
        </CategoryForm>
        
        <CategoryList>
          <FlexBox style={{ marginBottom: '20px' }}>
            <Text size="lg" weight="bold">All Categories</Text>
            <SearchInput
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </FlexBox>
          
          {loading && <LoadingSpinner />}
          
          {error && (
            <div style={{ marginBottom: '20px', color: 'red' }}>
              {error}
            </div>
          )}
          
          {!loading && !error && (
            filteredCategories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Text color="gray">No categories found. Create your first category.</Text>
              </div>
            ) : (
              <CategoryTable>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}></th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Parent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map(category => (
                    <tr key={category.id}>
                      <td>
                        {category.image_url ? (
                          <CategoryImage 
                            src={`${category.image_url}`}
                            alt={category.name} 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40?text=No+Image';
                            }}
                          />
                        ) : (
                          <NoImagePlaceholder>No img</NoImagePlaceholder>
                        )}
                      </td>
                      <td>
                        {category.name}
                        <CategoryColorBadge style={{ backgroundColor: category.color || '#4CAF50' }} />
                      </td>
                      <td>{category.slug}</td>
                      <td>
                        {category.parent_id 
                          ? categories.find(c => c.id === category.parent_id)?.name || 'Unknown' 
                          : 'None'}
                      </td>
                      <td>
                        <span style={{ 
                          color: category.is_active ? 'green' : 'red',
                          fontWeight: 'bold'
                        }}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <ActionButtonsContainer>
                          <ActionButton 
                            className="edit" 
                            onClick={() => handleEdit(category)}
                          >
                            Edit
                          </ActionButton>
                          <ActionButton 
                            className="delete" 
                            onClick={() => handleDelete(category.id)}
                          >
                            Delete
                          </ActionButton>
                        </ActionButtonsContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </CategoryTable>
            )
          )}
        </CategoryList>
      </Container>
    </AdminLayout>
  );
};

export default CategoriesPage;
