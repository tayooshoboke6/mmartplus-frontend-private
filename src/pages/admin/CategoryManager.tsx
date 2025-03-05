import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import styled from 'styled-components';
import api, { getCsrfCookie } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Styled Components
const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 24px;
  color: #333;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const StyledPaper = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const Card = styled.div`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: white;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardMedia = styled.div<{ backgroundUrl?: string }>`
  height: 140px;
  background-image: ${props => props.backgroundUrl ? `url(${props.backgroundUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  background-color: ${props => props.backgroundUrl ? 'transparent' : '#f5f5f5'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
`;

const CardDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0 0 16px 0;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px 16px;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #666;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

// Dialog styled components
const Dialog = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${props => props.open ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const DialogTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 24px;
  color: #333;
  font-size: 24px;
  font-weight: 500;
`;

const DialogBody = styled.div``;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  gap: 12px;
`;

const FormTextField = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 16px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #0071BC;
  }
  
  &[type="textarea"] {
    min-height: 100px;
    resize: vertical;
  }
`;

const StyledButton = styled.button<{ variant?: string }>`
  padding: 10px 16px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ variant }) => 
    variant === 'contained' ? `
      background-color: #0071BC;
      color: white;
      border: none;
      
      &:hover {
        background-color: #005ea3;
      }
    ` : `
      background-color: transparent;
      color: #0071BC;
      border: 1px solid #0071BC;
      
      &:hover {
        background-color: rgba(0, 113, 188, 0.08);
      }
    `}
    
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #666;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const ColorPickerContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: ${props => props.color || '#ffffff'};
  border: 1px solid #ddd;
`;

const ImagePreviewContainer = styled.div`
  margin-top: 8px;
  max-width: 100%;
  overflow: hidden;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 16px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #0071BC;
  }
`;

// Define the Category interface to match backend response
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id: number | null;
  image_url: string | null;
  color: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Define form data interface with appropriate field names
interface FormData {
  name: string;
  description: string;
  parent_id: number | null;
  color: string;
  order: number;
  is_active: boolean;
  image: File | null;
  image_url?: string | null;
}

/**
 * Admin page for managing categories
 */
const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    parent_id: null,
    color: '#0071BC',
    order: 0,
    is_active: true,
    image: null,
    image_url: null
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use public categories endpoint since admin GET category endpoint seems to be missing
      const response = await api.get('/categories');
      console.log('Categories API response:', response);
      if (response.data && response.data.data) {
        setCategories(response.data.data);
      } else if (response.data) {
        // Handle case where response might not have the expected structure
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please refresh the page or try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parent_id: null,
      color: '#0071BC',
      order: 0,
      is_active: true,
      image: null,
      image_url: null
    });
    setImagePreview(null);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else if (name === 'parent_id') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? null : Number(value)
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Preview the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // More detailed validation
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    try {
      // Get CSRF cookie before form submission
      await getCsrfCookie();
      
      const formDataToSubmit = new FormData();
      
      // Add all form fields to FormData with consistent naming
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'image' && key !== 'image_url') {
          formDataToSubmit.append(key, String(value));
          console.log(`Form data - ${key}:`, value);
        }
      });
      
      // Add image if it exists
      if (formData.image) {
        formDataToSubmit.append('image', formData.image);
        console.log('Form data - image:', formData.image.name);
      }
      
      // Debug all form data keys
      console.log('Form submission - data keys:', [...formDataToSubmit.keys()]);
      
      let response;
      if (selectedCategory) {
        // Update existing category
        console.log(`Updating category with ID: ${selectedCategory.id}`);
        
        // Use HTTP method override since FormData doesn't support PUT
        formDataToSubmit.append('_method', 'PUT');
        response = await api.post(`/admin/categories/${selectedCategory.id}`, formDataToSubmit, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''
          }
        });
        console.log('Category updated successfully:', response.data);
      } else {
        // Create new category
        console.log('Creating new category');
        response = await api.post('/admin/categories', formDataToSubmit, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''
          }
        });
        console.log('Category created successfully:', response.data);
      }
      
      // Show success message
      setError(null);
      alert(selectedCategory ? 'Category updated successfully!' : 'Category created successfully!');
      
      // Close dialog and refresh categories
      setOpenDialog(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      
      // Handle special case for authentication errors in category management
      if (error.isCategoryError) {
        setError(`Authentication issue: ${error.message}. Your changes weren't saved. Please refresh the page and try again.`);
      } else {
        // Show more detailed error to the user
        if (error.response) {
          setError(`${error.response.status} - ${error.response.data?.message || 'An error occurred'}`);
        } else {
          setError('Failed to save category. Please check the console for details.');
        }
      }
    }
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parent_id: category.parent_id,
      color: category.color,
      order: category.order,
      is_active: category.is_active,
      image: null,
      image_url: category.image_url
    });
    setImagePreview(category.image_url ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}/${category.image_url}` : null);
    setOpenDialog(true);
  };

  // Handle delete category
  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/admin/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <Container>
      <HeaderContainer>
        <Title>Category Management</Title>
        <StyledButton 
          variant="contained" 
          onClick={() => {
            setSelectedCategory(null);
            resetForm();
            setError(null);
            setOpenDialog(true);
          }}
        >
          Add New Category
        </StyledButton>
      </HeaderContainer>
      
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '16px',
          border: '1px solid #ef9a9a'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {categories.length > 0 && (
        <StyledPaper>
          <Grid>
            {categories.map(category => (
              <Card key={category.id}>
                <CardMedia backgroundUrl={category.image_url ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}/${category.image_url}` : undefined}>
                  {!category.image_url && (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 15L16 10L5 21" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </CardMedia>
                <CardContent>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>
                    {category.description?.length > 100
                      ? `${category.description.substring(0, 100)}...`
                      : category.description || 'No description'}
                  </CardDescription>
                  <div style={{ 
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '16px',
                    alignItems: 'center'
                  }}>
                    {category.color && (
                      <div style={{ 
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        backgroundColor: category.color,
                        border: '1px solid #ddd'
                      }}></div>
                    )}
                    <span style={{ 
                      fontSize: '12px',
                      color: category.is_active ? '#4CAF50' : '#F44336',
                      fontWeight: 'bold'
                    }}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {category.order > 0 && (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        Order: {category.order}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleEditCategory(category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCategory(category.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Grid>
        </StyledPaper>
      )}
      
      {loading && <LoadingSpinner />}
      
      {!loading && categories.length === 0 && (
        <EmptyState>
          <h3>No categories found</h3>
          <p>Click on 'Add New Category' to create your first category.</p>
        </EmptyState>
      )}
      
      {/* Category Form Dialog */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogTitle>
            {selectedCategory ? `Edit Category: ${selectedCategory.name}` : 'Add New Category'}
          </DialogTitle>
          <DialogBody>
            {error && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '12px 16px',
                borderRadius: '4px',
                marginBottom: '16px',
                border: '1px solid #ef9a9a'
              }}>
                <strong>Error:</strong> {error}
              </div>
            )}
            <form onSubmit={handleFormSubmit}>
              <FormTextField
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Category Name"
                required
              />
              
              <FormTextField
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
              />
              
              <FormGroup>
                <Label>Parent Category</Label>
                <Select 
                  name="parent_id"
                  value={formData.parent_id || ''}
                  onChange={handleInputChange}
                >
                  <option value="">None (Top Level)</option>
                  {categories
                    .filter(cat => selectedCategory ? cat.id !== selectedCategory.id : true)
                    .map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))
                  }
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Category Color</Label>
                <ColorPickerContainer>
                  <ColorPreview color={formData.color} />
                  <FormTextField
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </ColorPickerContainer>
              </FormGroup>
              
              <FormGroup>
                <Label>Display Order</Label>
                <FormTextField
                  type="number"
                  name="order"
                  min="0"
                  value={formData.order}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Image</Label>
                <FormTextField
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <ImagePreviewContainer>
                    <ImagePreview src={imagePreview} alt="Category preview" />
                    <button 
                      type="button" 
                      style={{
                        marginTop: '8px',
                        padding: '4px 8px',
                        fontSize: '14px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({
                          ...prev,
                          image: null
                        }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      Remove Image
                    </button>
                  </ImagePreviewContainer>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <FormTextField
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    style={{ width: 'auto', marginRight: '8px' }}
                  />
                  Active
                </Label>
              </FormGroup>
              
              <DialogActions>
                <StyledButton onClick={() => setOpenDialog(false)}>Cancel</StyledButton>
                <StyledButton type="submit" variant="contained">Save</StyledButton>
              </DialogActions>
            </form>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CategoryManager;
