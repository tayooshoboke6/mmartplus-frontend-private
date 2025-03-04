import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChromePicker } from 'react-color';
import { toast } from 'react-toastify';
import { 
  getProductSections, 
  getAllProducts, 
  createProductSection, 
  updateProductSection, 
  deleteProductSection, 
  toggleProductSectionStatus,
  reorderProductSections
} from '../../services/ProductSectionService';
import { ProductSection, ProductSectionType } from '../../models/ProductSection';
import { Product } from '../../types/Product';
import Tooltip from '../../components/common/Tooltip';
import AdminLayout from '../../components/admin/AdminLayout';

// Styled components
const PageContainer = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0071BC;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0071BC;
  }
`;

const Button = styled.button`
  background: #0071BC;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  
  &:hover {
    background: #005a9c;
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(Button)`
  background: #dc3545;
  
  &:hover {
    background: #c82333;
  }
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#4CAF50' : '#f44336'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#43a047' : '#e53935'};
  }
`;

const ColorPickerContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: ${props => props.color};
  cursor: pointer;
  border: 1px solid #ddd;
`;

const ColorPickerPopover = styled.div`
  position: absolute;
  z-index: 2;
  top: 40px;
`;

const ColorPickerCover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const PresetColorsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
`;

const PresetColor = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${props => props.color};
  cursor: pointer;
  border: 1px solid #ddd;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

const SectionsList = styled.div`
  margin-top: 20px;
`;

const SectionItem = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionInfo = styled.div`
  flex: 1;
`;

const SectionTitle = styled.h3`
  margin: 0 0 5px;
  font-size: 16px;
`;

const SectionMeta = styled.div`
  font-size: 12px;
  color: #666;
`;

const SectionActions = styled.div`
  display: flex;
  gap: 8px;
`;

const OrderButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;

const OrderButton = styled.button`
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 2px 0;
  
  &:hover {
    background: #e0e0e0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProductSelectionContainer = styled.div`
  margin-top: 15px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
`;

const ProductCheckboxItem = styled.div`
  padding: 8px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProductCheckbox = styled.input`
  margin-right: 10px;
`;

const ProductName = styled.span`
  flex: 1;
`;

const ProductPrice = styled.span`
  font-weight: 500;
  color: #0071BC;
`;

const SectionPreview = styled.div<{ bgColor: string, textColor: string }>`
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
  
  h3 {
    margin: 0 0 10px;
  }
`;

// Default styling that matches the featured products section
const initialFormState: Omit<ProductSection, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  type: ProductSectionType.FEATURED,
  active: true,
  displayOrder: 999, // Will be set correctly when saving
  productIds: [],
  backgroundColor: '#f7f7f7', // Light gray background like featured products
  textColor: '#333333'  // Dark gray text for readability
};

// Flashy color presets for admins to choose from
const bgColorPresets = [
  '#f7f7f7', // Default light gray
  '#e0f7fa', // Light cyan
  '#e8f5e9', // Light green
  '#fff3e0', // Light orange
  '#fce4ec', // Light pink
  '#f3e5f5', // Light purple
  '#ffebee', // Light red
  '#e1f5fe', // Light blue
  '#fffde7', // Light yellow
  '#0071BC', // Primary blue
  '#4CAF50', // Vibrant green
  '#FF9800', // Vibrant orange
  '#E91E63', // Vibrant pink
  '#9C27B0', // Vibrant purple
  '#F44336', // Vibrant red
  '#2196F3', // Vibrant blue
  '#FFEB3B'  // Vibrant yellow
];

const textColorPresets = [
  '#333333', // Default dark gray
  '#ffffff', // White
  '#000000', // Black
  '#0071BC', // Primary blue
  '#4CAF50', // Vibrant green
  '#FF9800', // Vibrant orange
  '#E91E63', // Vibrant pink
  '#9C27B0', // Vibrant purple
  '#F44336', // Vibrant red
  '#2196F3'  // Vibrant blue
];

const ProductSectionsPage: React.FC = () => {
  const [sections, setSections] = useState<ProductSection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Omit<ProductSection, 'id' | 'createdAt' | 'updatedAt'>>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);

  useEffect(() => {
    // Load product sections and products
    setSections(getProductSections());
    setProducts(getAllProducts());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBgColorChange = (color: any) => {
    setFormData({
      ...formData,
      backgroundColor: color.hex
    });
  };

  const handleTextColorChange = (color: any) => {
    setFormData({
      ...formData,
      textColor: color.hex
    });
  };

  const handlePresetBgColorSelect = (color: string) => {
    setFormData({
      ...formData,
      backgroundColor: color
    });
    setShowBgColorPicker(false);
  };

  const handlePresetTextColorSelect = (color: string) => {
    setFormData({
      ...formData,
      textColor: color
    });
    setShowTextColorPicker(false);
  };

  const handleProductSelection = (productId: number, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        productIds: [...formData.productIds, productId]
      });
    } else {
      setFormData({
        ...formData,
        productIds: formData.productIds.filter(id => id !== productId)
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.title.trim() === '') {
      toast.error('Section title is required');
      return;
    }
    
    if (formData.productIds.length === 0) {
      toast.error('Please select at least one product');
      return;
    }
    
    if (editingId) {
      // Update existing section
      updateProductSection({
        ...formData,
        id: editingId,
        createdAt: new Date(), // This will be overwritten by the service
        updatedAt: new Date()
      });
      toast.success('Product section updated successfully!');
    } else {
      // Create new section
      createProductSection(formData);
      toast.success('Product section created successfully!');
    }
    
    // Reset form and refresh sections
    setFormData(initialFormState);
    setEditingId(null);
    setSections(getProductSections());
  };

  const handleEdit = (section: ProductSection) => {
    setFormData({
      title: section.title,
      type: section.type,
      active: section.active,
      displayOrder: section.displayOrder,
      productIds: section.productIds,
      backgroundColor: section.backgroundColor || '#f9f9f9',
      textColor: section.textColor || '#333333'
    });
    setEditingId(section.id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      deleteProductSection(id);
      toast.info('Product section deleted');
      setSections(getProductSections());
    }
  };

  const handleToggleStatus = (id: number) => {
    toggleProductSectionStatus(id);
    setSections(getProductSections());
    toast.info('Section status updated');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    
    // Update the display order
    const orderedIds = newSections.map(section => section.id);
    reorderProductSections(orderedIds);
    
    // Update the state
    setSections(newSections);
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    
    // Update the display order
    const orderedIds = newSections.map(section => section.id);
    reorderProductSections(orderedIds);
    
    // Update the state
    setSections(newSections);
  };

  const cancelEdit = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  return (
    <AdminLayout title="Product Sections">
      <PageContainer>
        <Card>
          <CardTitle>
            {editingId ? 'Edit Product Section' : 'Create New Product Section'}
            {editingId && <Button onClick={cancelEdit}>Cancel</Button>}
          </CardTitle>
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Tooltip content="The title displayed above the product section" position="right">
                <Label htmlFor="title">Section Title</Label>
              </Tooltip>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Hot Deals, New Arrivals, About to Expire"
              />
            </FormGroup>
            
            <FormGroup>
              <Tooltip content="The type of product section, which can be used for filtering or special styling" position="right">
                <Label htmlFor="type">Section Type</Label>
              </Tooltip>
              <Select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value={ProductSectionType.FEATURED}>Featured Products</option>
                <option value={ProductSectionType.HOT_DEALS}>Hot Deals</option>
                <option value={ProductSectionType.NEW_ARRIVALS}>New Arrivals</option>
                <option value={ProductSectionType.EXPIRING_SOON}>Expiring Soon</option>
                <option value={ProductSectionType.BEST_SELLERS}>Best Sellers</option>
                <option value={ProductSectionType.CUSTOM}>Custom Section</option>
              </Select>
            </FormGroup>
            
            <div style={{ display: 'flex', gap: '20px' }}>
              <ColorPickerContainer>
                <Tooltip content="Background color of the section" position="right">
                  <Label>Background Color</Label>
                </Tooltip>
                <ColorPreview 
                  color={formData.backgroundColor || '#f7f7f7'}
                  onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                />
                {showBgColorPicker && (
                  <ColorPickerPopover>
                    <ColorPickerCover onClick={() => setShowBgColorPicker(false)} />
                    <ChromePicker 
                      color={formData.backgroundColor}
                      onChange={handleBgColorChange}
                    />
                    <PresetColorsContainer>
                      {bgColorPresets.map(color => (
                        <PresetColor 
                          key={color} 
                          color={color} 
                          onClick={() => handlePresetBgColorSelect(color)}
                          title={color}
                        />
                      ))}
                    </PresetColorsContainer>
                  </ColorPickerPopover>
                )}
              </ColorPickerContainer>
              
              <ColorPickerContainer>
                <Tooltip content="Text color for the section title" position="right">
                  <Label>Text Color</Label>
                </Tooltip>
                <ColorPreview 
                  color={formData.textColor || '#333333'}
                  onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                />
                {showTextColorPicker && (
                  <ColorPickerPopover>
                    <ColorPickerCover onClick={() => setShowTextColorPicker(false)} />
                    <ChromePicker 
                      color={formData.textColor}
                      onChange={handleTextColorChange}
                    />
                    <PresetColorsContainer>
                      {textColorPresets.map(color => (
                        <PresetColor 
                          key={color} 
                          color={color} 
                          onClick={() => handlePresetTextColorSelect(color)}
                          title={color}
                        />
                      ))}
                    </PresetColorsContainer>
                  </ColorPickerPopover>
                )}
              </ColorPickerContainer>
            </div>
            
            <FormGroup>
              <Tooltip content="Select products to display in this section" position="right">
                <Label>Select Products</Label>
              </Tooltip>
              <ProductSelectionContainer>
                {products.map(product => (
                  <ProductCheckboxItem key={product.id}>
                    <ProductCheckbox
                      type="checkbox"
                      id={`product-${product.id}`}
                      checked={formData.productIds.includes(product.id)}
                      onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                    />
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>₦{product.price.toLocaleString()}</ProductPrice>
                  </ProductCheckboxItem>
                ))}
              </ProductSelectionContainer>
            </FormGroup>
            
            <SectionPreview 
              bgColor={formData.backgroundColor || '#f7f7f7'} 
              textColor={formData.textColor || '#333333'}
            >
              <h3>{formData.title || 'Section Preview'}</h3>
              <p>Selected {formData.productIds.length} products</p>
            </SectionPreview>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit">
                {editingId ? 'Update Section' : 'Create Section'}
              </Button>
            </div>
          </form>
        </Card>
        
        <Card>
          <CardTitle>Manage Product Sections</CardTitle>
          <p>Use the up and down arrows to reorder sections. Toggle sections on/off or edit their content.</p>
          
          <SectionsList>
            {sections.map((section, index) => (
              <SectionItem key={section.id}>
                <OrderButtons>
                  <OrderButton 
                    onClick={() => handleMoveUp(index)} 
                    disabled={index === 0}
                  >
                    ▲
                  </OrderButton>
                  <OrderButton 
                    onClick={() => handleMoveDown(index)} 
                    disabled={index === sections.length - 1}
                  >
                    ▼
                  </OrderButton>
                </OrderButtons>
                
                <SectionInfo>
                  <SectionTitle>{section.title}</SectionTitle>
                  <SectionMeta>
                    Type: {section.type} | Products: {section.productIds.length} | Order: {section.displayOrder}
                  </SectionMeta>
                </SectionInfo>
                
                <SectionActions>
                  <ToggleButton 
                    active={section.active}
                    onClick={() => handleToggleStatus(section.id)}
                  >
                    {section.active ? 'Active' : 'Inactive'}
                  </ToggleButton>
                  <Button onClick={() => handleEdit(section)}>Edit</Button>
                  <DeleteButton onClick={() => handleDelete(section.id)}>Delete</DeleteButton>
                </SectionActions>
              </SectionItem>
            ))}
          </SectionsList>
        </Card>
      </PageContainer>
    </AdminLayout>
  );
};

export default ProductSectionsPage;
