import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AdminLayout from '../../components/admin/AdminLayout';
import { FlexBox, Text, Button } from '../../styles/GlobalComponents';

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const FormSection = styled.div`
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  
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
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  
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
  font-size: 14px;
  background-color: white;
  
  &:focus {
    border-color: #0066b2;
    outline: none;
  }
`;

const SpecificationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: 500;
    background-color: #f8f9fa;
  }
`;

const ImageUploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #0066b2;
    background-color: #f9f9f9;
  }
  
  input {
    display: none;
  }
`;

const UploadIcon = styled.div`
  color: #aaa;
  font-size: 36px;
  margin-bottom: 10px;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
`;

const ImagePreview = styled.div`
  width: 120px;
  height: 120px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  button {
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
  }
`;

// Interface for specification items
interface Specification {
  id: number;
  name: string;
  value: string;
}

const ProductFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    sku: '',
    brand: '',
    weight: '',
    dimensions: '',
    featured: false,
    discount: '',
    taxable: true
  });
  
  // Specifications state
  const [specifications, setSpecifications] = useState<Specification[]>([
    { id: 1, name: '', value: '' }
  ]);
  
  // Mock categories
  const categories = ['Electronics', 'Computers', 'Footwear', 'Home & Kitchen', 'Gaming', 'Clothing', 'Beauty'];
  
  // Mock images for preview
  const [images, setImages] = useState<string[]>([]);
  
  useEffect(() => {
    // If in edit mode, fetch product data
    if (isEditMode) {
      // This would be an API call in a real app
      // For now, we'll use mock data
      if (id === '1') {
        setFormData({
          name: 'Samsung Galaxy S21',
          price: '450000',
          description: 'The latest Samsung Galaxy smartphone with amazing camera and performance.',
          category: 'Electronics',
          stock: '24',
          sku: 'SAM-GS21-BLK',
          brand: 'Samsung',
          weight: '171g',
          dimensions: '151.7 x 71.2 x 7.9 mm',
          featured: true,
          discount: '10',
          taxable: true
        });
        
        setSpecifications([
          { id: 1, name: 'Display', value: '6.2 inches, Dynamic AMOLED 2X' },
          { id: 2, name: 'Processor', value: 'Exynos 2100 / Snapdragon 888' },
          { id: 3, name: 'RAM', value: '8GB' },
          { id: 4, name: 'Storage', value: '128GB' },
          { id: 5, name: 'Battery', value: '4000mAh' }
        ]);
        
        setImages(['https://via.placeholder.com/150', 'https://via.placeholder.com/150']);
      }
    }
  }, [isEditMode, id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleSpecificationChange = (id: number, field: 'name' | 'value', value: string) => {
    setSpecifications(specs =>
      specs.map(spec =>
        spec.id === id ? { ...spec, [field]: value } : spec
      )
    );
  };
  
  const addSpecification = () => {
    const newId = Math.max(0, ...specifications.map(s => s.id)) + 1;
    setSpecifications([...specifications, { id: newId, name: '', value: '' }]);
  };
  
  const removeSpecification = (id: number) => {
    setSpecifications(specs => specs.filter(spec => spec.id !== id));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const newImages = fileArray.map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the data to an API
    console.log('Form Data:', formData);
    console.log('Specifications:', specifications);
    console.log('Images:', images);
    
    // Redirect back to products list
    navigate('/admin/products');
  };
  
  return (
    <AdminLayout title={isEditMode ? 'Edit Product' : 'Add New Product'}>
      <form onSubmit={handleSubmit}>
        <FormContainer>
          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label htmlFor="name">Product Name*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="category">Category*</Label>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label htmlFor="description">Product Description*</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="price">Price (₦)*</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                />
              </FormGroup>
            </FormRow>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Inventory</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label htmlFor="sku">SKU (Stock Keeping Unit)*</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="stock">Stock Quantity*</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleCheckboxChange}
                />
                {' '}Featured Product
              </Label>
            </FormGroup>
            
            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  name="taxable"
                  checked={formData.taxable}
                  onChange={handleCheckboxChange}
                />
                {' '}Taxable
              </Label>
            </FormGroup>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Product Details</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder="e.g. 10 x 15 x 5 cm"
              />
            </FormGroup>
            
            <FormGroup>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Label>Specifications</Label>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={addSpecification}
                  style={{ padding: '5px 10px' }}
                >
                  Add Specification
                </Button>
              </div>
              
              <SpecificationTable>
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Name</th>
                    <th style={{ width: '50%' }}>Value</th>
                    <th style={{ width: '10%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {specifications.map(spec => (
                    <tr key={spec.id}>
                      <td>
                        <Input
                          value={spec.name}
                          onChange={(e) => handleSpecificationChange(spec.id, 'name', e.target.value)}
                          placeholder="e.g. CPU"
                        />
                      </td>
                      <td>
                        <Input
                          value={spec.value}
                          onChange={(e) => handleSpecificationChange(spec.id, 'value', e.target.value)}
                          placeholder="e.g. Intel Core i5"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeSpecification(spec.id)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#dc3545',
                            cursor: 'pointer' 
                          }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </SpecificationTable>
            </FormGroup>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Product Images</SectionTitle>
            <Label>Upload Images</Label>
            <ImageUploadArea>
              <label htmlFor="image-upload">
                <UploadIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg>
                </UploadIcon>
                <Text size="md">Drag and drop images here or click to browse</Text>
                <Text size="sm" color="#666" style={{ marginTop: '5px' }}>
                  Supported formats: JPG, PNG, GIF. Max size: 5MB per image.
                </Text>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
            </ImageUploadArea>
            
            {images.length > 0 && (
              <ImagePreviewContainer>
                {images.map((image, index) => (
                  <ImagePreview key={index}>
                    <img src={image} alt={`Preview ${index}`} />
                    <button type="button" onClick={() => removeImage(index)}>
                      ✕
                    </button>
                  </ImagePreview>
                ))}
              </ImagePreviewContainer>
            )}
          </FormSection>
          
          <FormGroup style={{ marginTop: '30px' }}>
            <FlexBox gap="10px" justify="flex-end">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {isEditMode ? 'Update Product' : 'Create Product'}
              </Button>
            </FlexBox>
          </FormGroup>
        </FormContainer>
      </form>
    </AdminLayout>
  );
};

export default ProductFormPage;
