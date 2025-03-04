import React, { useState } from 'react';
import styled from 'styled-components';
import { AddressFormData } from '../../models/Address';
import AddressAutocomplete from '../auth/AddressAutocomplete';

interface AddressFormProps {
  onSubmit: (addressData: AddressFormData) => void;
  onCancel: () => void;
}

const FormContainer = styled.div`
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0071BC;
    box-shadow: 0 0 0 1px #0071BC;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'outline' }>`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' 
    ? `
      background-color: #0071BC;
      color: white;
      border: 1px solid #0071BC;
      
      &:hover {
        background-color: #005a9e;
      }
    ` 
    : `
      background-color: white;
      color: #0071BC;
      border: 1px solid #ddd;
      
      &:hover {
        border-color: #0071BC;
      }
    `
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 12px;
  margin-top: 5px;
`;

const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<AddressFormData>({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
    isDefault: false
  });
  
  const [fullAddress, setFullAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddressSelect = (address: string) => {
    setFullAddress(address);
    
    // Try to parse the Google address components
    // This is a simple implementation - in a real app, you might use the Google Places API
    // to get more structured data
    try {
      // Simple parsing logic - this would be more robust in a real implementation
      const parts = address.split(',').map(part => part.trim());
      
      if (parts.length >= 3) {
        // Assume the first part is the street
        const street = parts[0];
        
        // Assume the second part is the city
        const city = parts[1];
        
        // Assume the third part contains state and maybe postal code
        const stateWithPostal = parts[2];
        const stateMatch = stateWithPostal.match(/([A-Za-z\s]+)(?:\s+(\d+))?/);
        
        let state = '';
        let postalCode = '';
        
        if (stateMatch) {
          state = stateMatch[1].trim();
          postalCode = stateMatch[2] || '';
        }
        
        // Assume the last part is the country
        const country = parts[parts.length - 1] === 'Nigeria' ? 'Nigeria' : (parts[parts.length - 1] || 'Nigeria');
        
        setFormData(prev => ({
          ...prev,
          street,
          city,
          state,
          postalCode,
          country
        }));
      }
    } catch (error) {
      console.error('Error parsing address:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="fullAddress">Address</Label>
          <AddressAutocomplete
            value={fullAddress}
            onChange={handleAddressSelect}
            placeholder="Start typing your address"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+234"
          />
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="street">Street Address</Label>
          <Input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
          />
          {errors.street && <ErrorMessage>{errors.street}</ErrorMessage>}
        </FormGroup>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <FormGroup style={{ flex: 1 }}>
            <Label htmlFor="city">City</Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
            {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup style={{ flex: 1 }}>
            <Label htmlFor="state">State</Label>
            <Input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
            />
            {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
          </FormGroup>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <FormGroup style={{ flex: 1 }}>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <FormGroup style={{ flex: 1 }}>
            <Label htmlFor="country">Country</Label>
            <Input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              readOnly
            />
          </FormGroup>
        </div>
        
        <FormGroup>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              style={{ marginRight: '8px' }}
            />
            Set as default address
          </label>
        </FormGroup>
        
        <ButtonGroup>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Address
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default AddressForm;
