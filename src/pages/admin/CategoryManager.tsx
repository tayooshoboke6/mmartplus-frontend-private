import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';

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

const Button = styled.button<{ variant?: 'contained' | 'outlined' | 'text', color?: string }>`
  padding: ${props => props.variant === 'text' ? '4px 8px' : '8px 16px'};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 14px;
  
  background-color: ${props => {
    if (props.variant === 'contained') {
      return props.color === 'secondary' ? '#f50057' : '#1976d2';
    }
    return 'transparent';
  }};
  
  color: ${props => {
    if (props.variant === 'contained') {
      return 'white';
    }
    return props.color === 'secondary' ? '#f50057' : '#1976d2';
  }};
  
  border: ${props => {
    if (props.variant === 'outlined') {
      return props.color === 'secondary' ? '1px solid #f50057' : '1px solid #1976d2';
    }
    return 'none';
  }};
  
  &:hover {
    background-color: ${props => {
      if (props.variant === 'contained') {
        return props.color === 'secondary' ? '#c51162' : '#115293';
      }
      return props.color === 'secondary' ? 'rgba(245, 0, 87, 0.1)' : 'rgba(25, 118, 210, 0.1)';
    }};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: ${props => props.children ? '8px' : '0'};
  }
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

const TextField = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #1976d2;
  animation: spin 1s ease-in-out infinite;
  margin: 24px auto;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 16px 0;
`;

// Icon Components
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

// Category interface
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: number | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Form data interface
interface CategoryFormData {
  name: string;
  description: string;
  parent_id: number | null;
  image_url: string | null;
  is_active: boolean;
}

/**
 * Admin page for managing categories
 */
const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    parent_id: null,
    image_url: null,
    is_active: true
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/categories');
      if (response.data.success) {
        setCategories(response.data.categories.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedCategory) {
        // Update existing category
        await api.put(`/api/categories/${selectedCategory.id}`, formData);
      } else {
        // Create new category
        await api.post('/api/categories', formData);
      }
      
      setOpenDialog(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parent_id: null,
      image_url: null,
      is_active: true
    });
    setSelectedCategory(null);
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parent_id: category.parent_id,
      image_url: category.image_url,
      is_active: category.is_active
    });
    setOpenDialog(true);
  };

  // Handle delete category
  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/api/categories/${id}`);
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
        <Button 
          variant="contained" 
          onClick={() => {
            setSelectedCategory(null);
            setFormData({
              name: '',
              description: '',
              parent_id: null,
              image_url: null,
              is_active: true
            });
            setOpenDialog(true);
          }}
          style={{ 
            backgroundColor: '#0071BC',
            padding: '10px 16px',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          Add New Category
        </Button>
      </HeaderContainer>
      
      {categories.length > 0 && (
        <StyledPaper>
          <Grid>
            {categories.map(category => (
              <Card key={category.id}>
                <CardMedia backgroundUrl={category.image_url || "https://via.placeholder.com/400x200?text=No+Image"} />
                <CardContent>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description || 'No description'}</CardDescription>
                  
                  <IconButton onClick={() => handleEditCategory(category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCategory(category.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </StyledPaper>
      )}
      
      {loading && (
        <LoadingSpinner />
      )}
      
      {/* Category Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogTitle>
            {selectedCategory ? `Edit Category: ${selectedCategory.name}` : 'Create New Category'}
          </DialogTitle>
          <DialogBody>
            <form onSubmit={handleFormSubmit}>
              <TextField
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Image URL"
                name="image_url"
                value={formData.image_url || ''}
                onChange={handleInputChange}
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" variant="contained">Save</Button>
              </DialogActions>
            </form>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

const Dialog = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.open ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: 600px) {
    max-width: 90%;
    margin: 0 auto;
  }
`;

const DialogTitle = styled.h2`
  margin: 0;
  padding: 20px;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 480px) {
    padding: 15px;
    font-size: 1.2rem;
  }
`;

const DialogBody = styled.div`
  padding: 20px;
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
  
  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 8px;
    
    button {
      width: 100%;
    }
  }
`;

export default CategoryManager;
