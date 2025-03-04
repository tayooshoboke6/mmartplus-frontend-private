import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Address } from '../../models/Address';
import AddressService from '../../services/AddressService';

interface AddressSelectorProps {
  userId: string;
  selectedAddressId: string | null;
  onAddressSelect: (addressId: string) => void;
  onAddNewClick?: () => void;
}

const AddressSelectorContainer = styled.div`
  margin-bottom: 20px;
`;

const AddressList = styled.div`
  margin-top: 10px;
  max-height: 300px;
  overflow-y: auto;
`;

const AddressCard = styled.div<{ selected: boolean }>`
  padding: 12px;
  border: 1px solid ${props => props.selected ? '#0071BC' : '#ddd'};
  border-radius: 6px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: ${props => props.selected ? '#f0f7ff' : 'white'};
  position: relative;
  
  &:hover {
    border-color: ${props => props.selected ? '#0071BC' : '#bbb'};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const AddressDetails = styled.div`
  font-size: 14px;
  line-height: 1.5;
`;

const AddressName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const AddressText = styled.div`
  color: #555;
`;

const AddressPhone = styled.div`
  color: #555;
  margin-top: 4px;
`;

const DefaultBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #0071BC;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
`;

const AddressActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #0071BC;
  font-size: 14px;
  text-decoration: none;
  padding: 0;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LinkButton = styled(Link)`
  color: #0071BC;
  font-size: 14px;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const NoAddressMessage = styled.div`
  padding: 15px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 10px;
`;

const AddressSelector: React.FC<AddressSelectorProps> = ({ 
  userId, 
  selectedAddressId, 
  onAddressSelect,
  onAddNewClick
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const userAddresses = await AddressService.getUserAddresses(userId);
        setAddresses(userAddresses);
        
        // If no address is selected yet and we have addresses, select the default one
        if (!selectedAddressId && userAddresses.length > 0) {
          const defaultAddress = userAddresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            onAddressSelect(defaultAddress.id);
          } else {
            onAddressSelect(userAddresses[0].id);
          }
        }
      } catch (err) {
        setError('Failed to load addresses. Please try again.');
        console.error('Error fetching addresses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId, selectedAddressId, onAddressSelect]);

  if (loading) {
    return <AddressSelectorContainer>Loading addresses...</AddressSelectorContainer>;
  }

  if (error) {
    return <AddressSelectorContainer>{error}</AddressSelectorContainer>;
  }

  return (
    <AddressSelectorContainer>
      {addresses.length === 0 ? (
        <NoAddressMessage>
          <p>You don't have any saved addresses.</p>
          {onAddNewClick ? (
            <ActionButton onClick={onAddNewClick}>Add a new address</ActionButton>
          ) : (
            <LinkButton to="/account/addresses/new">Add a new address</LinkButton>
          )}
        </NoAddressMessage>
      ) : (
        <AddressList>
          {addresses.map((address) => (
            <AddressCard 
              key={address.id} 
              selected={selectedAddressId === address.id}
              onClick={() => onAddressSelect(address.id)}
            >
              {address.isDefault && <DefaultBadge>Default</DefaultBadge>}
              <AddressDetails>
                <AddressName>{address.name}</AddressName>
                <AddressText>
                  {address.street}, {address.city}, {address.state}, {address.postalCode}
                </AddressText>
                <AddressPhone>{address.phone}</AddressPhone>
              </AddressDetails>
            </AddressCard>
          ))}
        </AddressList>
      )}
      
      <AddressActions>
        <LinkButton to="/account/addresses">Manage addresses</LinkButton>
        {onAddNewClick ? (
          <ActionButton onClick={onAddNewClick}>Add new address</ActionButton>
        ) : (
          <LinkButton to="/account/addresses/new">Add new address</LinkButton>
        )}
      </AddressActions>
    </AddressSelectorContainer>
  );
};

export default AddressSelector;
