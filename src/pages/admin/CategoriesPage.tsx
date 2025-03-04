import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { FlexBox, Text, Button, Tooltip } from '../../styles/GlobalComponents';

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

const CategoryBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 12px;
  background-color: ${props => props.color};
  color: white;
  margin-left: 8px;
`;

// Mock Category Data
const MOCK_CATEGORIES = [
  // Main Categories
  {
    id: 1,
    name: 'Food & Groceries',
    slug: 'food-groceries',
    parentId: null,
    image: 'https://via.placeholder.com/40',
    description: 'All food and grocery items',
    productCount: 150,
    color: '#4CAF50'
  },
  {
    id: 2,
    name: 'Household Essentials & Cleaning',
    slug: 'household-essentials',
    parentId: null,
    image: 'https://via.placeholder.com/40',
    description: 'Household and cleaning products',
    productCount: 80,
    color: '#2196F3'
  },
  {
    id: 3,
    name: 'Kitchen & Home Needs',
    slug: 'kitchen-home',
    parentId: null,
    image: 'https://via.placeholder.com/40',
    description: 'Kitchen and home products',
    productCount: 60,
    color: '#FF9800'
  },
  {
    id: 4,
    name: 'Baby & Family Care',
    slug: 'baby-family',
    parentId: null,
    image: 'https://via.placeholder.com/40',
    description: 'Products for babies and family care',
    productCount: 45,
    color: '#E91E63'
  },
  {
    id: 5,
    name: 'Drinks & Alcohol',
    slug: 'drinks-alcohol',
    parentId: null,
    image: 'https://via.placeholder.com/40',
    description: 'Beverages and alcoholic drinks',
    productCount: 70,
    color: '#9C27B0'
  },
  {
    id: 6,
    name: 'Office & General Supplies',
    slug: 'office-general',
    parentId: null,
    image: 'https://via.placeholder.com/40',
    description: 'Office supplies and general products',
    productCount: 50,
    color: '#607D8B'
  },
  
  // Food & Groceries subcategories
  {
    id: 7,
    name: 'Staples & Grains',
    slug: 'staples-grains',
    parentId: 1,
    image: 'https://via.placeholder.com/40',
    description: 'Rice, Beans, Garri, Semovita, Wheat, Yam, etc.',
    productCount: 30,
    color: '#4CAF50'
  },
  {
    id: 8,
    name: 'Cooking Essentials',
    slug: 'cooking-essentials',
    parentId: 1,
    image: 'https://via.placeholder.com/40',
    description: 'Flour, Baking Needs, Oils, Spices, Seasonings, Tomato Paste, etc.',
    productCount: 25,
    color: '#4CAF50'
  },
  {
    id: 9,
    name: 'Packaged & Frozen Foods',
    slug: 'packaged-frozen',
    parentId: 1,
    image: 'https://via.placeholder.com/40',
    description: 'Noodles, Pasta, Canned Foods, Sardines, Frozen Chicken, Fish, etc.',
    productCount: 35,
    color: '#4CAF50'
  },
  {
    id: 10,
    name: 'Snacks & Beverages',
    slug: 'snacks-beverages',
    parentId: 1,
    image: 'https://via.placeholder.com/40',
    description: 'Biscuits, Chocolates, Juice, Soft Drinks, Tea, Coffee, Milo, etc.',
    productCount: 40,
    color: '#4CAF50'
  },
  {
    id: 11,
    name: 'Dairy & Breakfast',
    slug: 'dairy-breakfast',
    parentId: 1,
    image: 'https://via.placeholder.com/40',
    description: 'Milk, Yogurt, Eggs, Cereals, Custard, etc.',
    productCount: 20,
    color: '#4CAF50'
  },
  {
    id: 12,
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    parentId: 1,
    image: 'https://via.placeholder.com/40',
    description: 'Fresh & Frozen Produce',
    productCount: 30,
    color: '#4CAF50'
  },
  
  // Household Essentials & Cleaning subcategories
  {
    id: 13,
    name: 'Cleaning & Laundry',
    slug: 'cleaning-laundry',
    parentId: 2,
    image: 'https://via.placeholder.com/40',
    description: 'Detergents, Soaps, Bleach, Mopping Liquids, Air Fresheners, etc.',
    productCount: 30,
    color: '#2196F3'
  },
  {
    id: 14,
    name: 'Toiletries & Personal Care',
    slug: 'toiletries-personal',
    parentId: 2,
    image: 'https://via.placeholder.com/40',
    description: 'Toothpaste, Tissue, Sanitary Pads, Deodorants, Perfumes, etc.',
    productCount: 35,
    color: '#2196F3'
  },
  {
    id: 15,
    name: 'Pest Control & Safety',
    slug: 'pest-safety',
    parentId: 2,
    image: 'https://via.placeholder.com/40',
    description: 'Insecticides, Mosquito Repellents, First Aid, Disinfectants, etc.',
    productCount: 15,
    color: '#2196F3'
  },
  
  // Kitchen & Home Needs subcategories
  {
    id: 16,
    name: 'Cookware & Storage',
    slug: 'cookware-storage',
    parentId: 3,
    image: 'https://via.placeholder.com/40',
    description: 'Pots, Pans, Plates, Cutlery, Bowls, Food Containers, Coolers, etc.',
    productCount: 30,
    color: '#FF9800'
  },
  {
    id: 17,
    name: 'Small Appliances',
    slug: 'small-appliances',
    parentId: 3,
    image: 'https://via.placeholder.com/40',
    description: 'Blenders, Kettles, Toasters, Fans, Irons, Rechargeable Lamps, etc.',
    productCount: 30,
    color: '#FF9800'
  },
  
  // Baby & Family Care subcategories
  {
    id: 18,
    name: 'Baby Food & Diapers',
    slug: 'baby-food-diapers',
    parentId: 4,
    image: 'https://via.placeholder.com/40',
    description: 'Formula, Wipes, Baby Toiletries, Clothing, etc.',
    productCount: 25,
    color: '#E91E63'
  },
  {
    id: 19,
    name: 'Health & Wellness',
    slug: 'health-wellness',
    parentId: 4,
    image: 'https://via.placeholder.com/40',
    description: 'Medicines, Multivitamins, Sanitary Products, Bandages, etc.',
    productCount: 20,
    color: '#E91E63'
  },
  
  // Drinks & Alcohol subcategories
  {
    id: 20,
    name: 'Soft Drinks & Juices',
    slug: 'soft-drinks-juices',
    parentId: 5,
    image: 'https://via.placeholder.com/40',
    description: 'Coke, Fanta, Chivita, Hollandia, etc.',
    productCount: 25,
    color: '#9C27B0'
  },
  {
    id: 21,
    name: 'Alcoholic Drinks',
    slug: 'alcoholic-drinks',
    parentId: 5,
    image: 'https://via.placeholder.com/40',
    description: 'Beer, Wine, Spirits, etc.',
    productCount: 30,
    color: '#9C27B0'
  },
  {
    id: 22,
    name: 'Water & Energy Drinks',
    slug: 'water-energy-drinks',
    parentId: 5,
    image: 'https://via.placeholder.com/40',
    description: 'Bottled water and energy drinks',
    productCount: 15,
    color: '#9C27B0'
  },
  
  // Office & General Supplies subcategories
  {
    id: 23,
    name: 'Stationery & Packaging',
    slug: 'stationery-packaging',
    parentId: 6,
    image: 'https://via.placeholder.com/40',
    description: 'Pens, Notebooks, Cartons, Cellotape, Nylon Bags, etc.',
    productCount: 30,
    color: '#607D8B'
  },
  {
    id: 24,
    name: 'Pet & Livestock Needs',
    slug: 'pet-livestock',
    parentId: 6,
    image: 'https://via.placeholder.com/40',
    description: 'Pet Food, Animal Care Essentials',
    productCount: 20,
    color: '#607D8B'
  }
];

interface CategoryFormData {
  id: number | null;
  name: string;
  slug: string;
  parentId: number | null;
  description: string;
  image: string | null;
  color?: string;
}

const CategoriesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    id: null,
    name: '',
    slug: '',
    parentId: null,
    description: '',
    image: null,
    color: '#4CAF50'
  });
  
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
    setEditMode(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from name if slug field hasn't been manually edited
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
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setFormData({
        ...formData,
        image: imageUrl
      });
    }
  };
  
  const removeImage = () => {
    setFormData({
      ...formData,
      image: null
    });
  };
  
  const handleEditCategory = (category: any) => {
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentId: category.parentId,
      description: category.description,
      image: category.image,
      color: category.color
    });
    setEditMode(true);
  };
  
  const handleDeleteCategory = (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      // In a real app, this would call an API to delete the category
      console.log(`Delete category with ID: ${categoryId}`);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would call an API to create/update the category
    console.log('Form data:', formData);
    
    // Reset form after submission
    resetForm();
  };
  
  // Filter categories by search query
  const filteredCategories = MOCK_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Categories">
      <FlexBox style={{ marginBottom: '20px' }}>
        <Text size="xl" weight="bold">Category Management</Text>
        <div style={{ display: 'flex', gap: '10px' }}>
          {editMode && (
            <Button 
              variant="outlined"
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
                {MOCK_CATEGORIES.filter(cat => cat.parentId === null).map(category => (
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
                  value={formData.color || '#4CAF50'}
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
              <ImageUploadPreview className={!formData.image ? 'empty' : ''}>
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Category" />
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
          <Text size="lg" weight="bold" style={{ marginBottom: '20px' }}>
            All Categories
          </Text>
          
          <SearchInput
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <CategoryTable>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Parent</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(category => (
                <tr key={category.id}>
                  <td>
                    <CategoryImage src={category.image} alt={category.name} />
                  </td>
                  <td>
                    {category.name}
                    <CategoryBadge color={category.color || '#4CAF50'}></CategoryBadge>
                  </td>
                  <td>
                    {category.parentId 
                      ? MOCK_CATEGORIES.find(c => c.id === category.parentId)?.name 
                      : 'None'}
                  </td>
                  <td>{category.productCount}</td>
                  <td>
                    <ActionButtonsContainer>
                      <ActionButton 
                        className="edit" 
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </ActionButton>
                      <ActionButton 
                        className="delete" 
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </ActionButton>
                    </ActionButtonsContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </CategoryTable>
        </CategoryList>
      </Container>
    </AdminLayout>
  );
};

export default CategoriesPage;
