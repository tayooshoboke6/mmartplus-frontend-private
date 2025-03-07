import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AdminLayout from '../../components/layouts/AdminLayout';
import { FlexBox, Text, Button } from '../../styles/GlobalComponents';
import Tooltip from '../../components/common/Tooltip';
import productService from '../../services/productService';
import { toast } from 'react-toastify';
import categoryService, { Category } from '../../services/categoryService';
import { ProductFormData } from '../../types/Product';

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

interface Category {
  id: number;
  name: string;
}

interface Specification {
  id: number;
  name: string;
  value: string;
}

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const navigate = useNavigate();
  const isEditMode = id !== undefined && id !== 'new';
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Product Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [expiryDate, setExpiryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('Delivery in 2-4 business days');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [currentProductImages, setCurrentProductImages] = useState<string[]>([]);
  
  useEffect(() => {
    fetchCategories();
    
    if (isEditMode) {
      fetchProductDetails();
    }
  }, [id]);
  
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };
  
  const fetchProductDetails = async () => {
    if (!id || id === 'new') return;
    
    setLoading(true);
    try {
      const response = await productService.getProduct(id);
      const product = response.product;
      
      // Populate form with product data
      setName(product.name);
      setSlug(product.slug || '');
      setDescription(product.description || '');
      setShortDescription(product.short_description || '');
      setPrice(product.price.toString());
      setSku(product.sku);
      setStockQuantity(product.stock.toString());
      setCategoryId(product.category_id.toString());
      setIsFeatured(product.is_featured);
      setIsActive(product.is_active);
      setExpiryDate(product.expiry_date || '');
      setDeliveryTime(product.delivery_time || 'Delivery in 2-4 business days');
      
      // Handle images
      if (product.images && Array.isArray(product.images)) {
        setCurrentProductImages(product.images);
        setImagePreviewUrls(product.images);
      }
      
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  // Generate slug from product name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Update slug when product name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(generateSlug(newName));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = [...images, ...filesArray];
      setImages(newImages);
      
      // Generate preview URLs
      const newImagePreviewUrls = [...imagePreviewUrls];
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            newImagePreviewUrls.push(reader.result);
            setImagePreviewUrls([...newImagePreviewUrls]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const removeImage = (index: number) => {
    // Check if it's an existing image or a new upload
    if (index < currentProductImages.length) {
      setCurrentProductImages(currentProductImages.filter((_, i) => i !== index));
    } else {
      const adjustedIndex = index - currentProductImages.length;
      setImages(images.filter((_, i) => i !== adjustedIndex));
    }
    
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Append basic fields
      formData.append('name', name);
      formData.append('slug', slug || '');
      formData.append('description', description || '');
      formData.append('short_description', shortDescription || '');
      formData.append('price', price.toString());
      formData.append('stock', stockQuantity.toString());
      formData.append('category_id', categoryId.toString());
      formData.append('is_active', isActive ? '1' : '0');
      formData.append('is_featured', isFeatured ? '1' : '0');
      formData.append('delivery_time', deliveryTime);
      
      // Append expiry date if present
      if (expiryDate) {
        formData.append('expiry_date', expiryDate);
      }
      
      // Append existing images if editing
      if (id && currentProductImages.length > 0) {
        formData.append('existing_images', JSON.stringify(currentProductImages));
      }
      
      // Append new images
      if (images.length > 0) {
        images.forEach((file) => {
          formData.append('images[]', file);
        });
      }
      
      let response;
      
      if (id) {
        // Update existing product
        response = await productService.updateProduct(Number(id), formData);
        toast.success('Product updated successfully!');
      } else {
        // Create new product
        response = await productService.createProduct(formData);
        toast.success('Product created successfully!');
      }
      
      // Navigate back to products page after successful submission
      navigate('/admin/products');
      
    } catch (error: any) {
      console.error('Error submitting product form:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save product. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <Text size="24px" weight="500">Loading product details...</Text>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <FlexBox justify="space-between" align="center" gap="20px" style={{ marginBottom: '20px' }}>
        <Text size="24px" weight="500">{isEditMode ? 'Edit Product' : 'Add New Product'}</Text>
      </FlexBox>
      
      <form onSubmit={handleSubmit}>
        <FormContainer>
          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>
            <FormRow>
              <FormGroup>
                <Tooltip content="Enter the full name of the product" position="right">
                  <Label htmlFor="name">Product Name*</Label>
                </Tooltip>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Tooltip content="URL-friendly version of the product name" position="right">
                  <Label htmlFor="slug">Slug</Label>
                </Tooltip>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Tooltip content="Select the appropriate category for your product" position="right">
                  <Label htmlFor="category">Category*</Label>
                </Tooltip>
                <Select
                  id="category"
                  name="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Tooltip content="Date when the product expires (if applicable)" position="right">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                </Tooltip>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Tooltip content="Brief description of the product (used in listings)" position="right">
                <Label htmlFor="shortDescription">Short Description*</Label>
              </Tooltip>
              <Input
                id="shortDescription"
                name="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Tooltip content="Provide a detailed description of the product features and benefits" position="right">
                <Label htmlFor="description">Product Description*</Label>
              </Tooltip>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </FormGroup>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Pricing & Inventory</SectionTitle>
            <FormRow>
              <FormGroup>
                <Tooltip content="Set the selling price in Naira (₦)" position="right">
                  <Label htmlFor="price">Price (₦)*</Label>
                </Tooltip>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Tooltip content="Unique identifier code for inventory tracking" position="right">
                  <Label htmlFor="sku">SKU (Stock Keeping Unit)*</Label>
                </Tooltip>
                <Input
                  id="sku"
                  name="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Tooltip content="Number of units available for sale" position="right">
                  <Label htmlFor="stockQuantity">Stock Quantity*</Label>
                </Tooltip>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  min="0"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Tooltip content="Expected delivery timeframe for this product" position="right">
                  <Label htmlFor="deliveryTime">Delivery Time</Label>
                </Tooltip>
                <Select
                  id="deliveryTime"
                  name="deliveryTime"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                >
                  <option value="Delivery in minutes">Delivery in minutes</option>
                  <option value="Delivery in 24 hrs">Delivery in 24 hrs</option>
                  <option value="Delivery in 48 hrs">Delivery in 48 hrs</option>
                  <option value="Delivery in 2-4 business days">Delivery in 2-4 business days</option>
                </Select>
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <div style={{ marginTop: '30px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                    /> 
                    Featured Product
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    /> 
                    Active (Visible on store)
                  </label>
                </div>
              </FormGroup>
            </FormRow>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Product Images</SectionTitle>
            <ImageUploadArea>
              <UploadIcon>📷</UploadIcon>
              <p>Drag images here or click to upload product images</p>
              <Button type="button" onClick={() => document.getElementById('imageInput')?.click()}>
                Select Images
              </Button>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </ImageUploadArea>
            
            {imagePreviewUrls.length > 0 && (
              <ImagePreviewContainer>
                {imagePreviewUrls.map((url, index) => (
                  <ImagePreview key={index}>
                    <img src={url} alt={`Product preview ${index + 1}`} />
                    <button type="button" onClick={() => removeImage(index)}>×</button>
                  </ImagePreview>
                ))}
              </ImagePreviewContainer>
            )}
          </FormSection>
          
          <FlexBox justify="flex-end" gap="15px" style={{ marginTop: '30px' }}>
            <Button
              type="button"
              onClick={() => navigate('/admin/products')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              primary
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
            </Button>
          </FlexBox>
        </FormContainer>
      </form>
    </AdminLayout>
  );
};

export default ProductFormPage;
