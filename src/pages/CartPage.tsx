import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button, SectionContainer, Spacer, Text } from '../styles/GlobalComponents';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import VoucherService from '../services/VoucherService';
import AddressSelector from '../components/cart/AddressSelector';
import AddressService from '../services/AddressService';
import { Address, AddressFormData } from '../models/Address';
import AddressForm from '../components/cart/AddressForm';
import StoreAddressService from '../services/StoreAddressService';
import { StoreAddress } from '../models/StoreAddress';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import { PaymentMethod } from '../models/PaymentMethod';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px 0;
`;

const BreadcrumbNav = styled.div`
  display: flex;
  margin-bottom: 20px;
  font-size: 14px;
  
  a {
    color: var(--dark-gray);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 8px;
    color: var(--med-gray);
  }
`;

const CartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr 300px;
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const CartHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 1fr) 100px 150px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--light-gray);
  margin-bottom: 15px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 80px minmax(220px, 1fr) 100px 150px;
  gap: 15px;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--light-gray);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto auto;
    gap: 10px;
  }
`;

const ProductImage = styled.div`
  width: 80px;
  height: 80px;
  background-color: var(--light-gray);
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    grid-row: span 2;
  }
`;

const ProductInfo = styled.div`
  @media (max-width: 768px) {
    grid-column: 2;
  }
`;

const ProductName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const ProductMeta = styled.div`
  font-size: 13px;
  color: var(--dark-gray);
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-column: 2;
  }
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid var(--med-gray);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  
  &:first-child {
    border-radius: 4px 0 0 4px;
  }
  
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.div`
  width: 40px;
  height: 30px;
  border-top: 1px solid var(--med-gray);
  border-bottom: 1px solid var(--med-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
`;

const PriceContainer = styled.div`
  font-weight: 500;
  
  @media (max-width: 768px) {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    border-top: 1px dashed var(--light-gray);
    padding-top: 10px;
  }
`;

const ActionLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 5px;
  
  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

const ActionLink = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  
  &:hover {
    color: var(--dark-blue);
  }
`;

const SummarySection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: fit-content;
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const SummaryTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

interface TotalRowProps {
  final?: boolean;
}

const TotalRow = styled.div<TotalRowProps>`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: ${props => props.final ? 'none' : '1px solid var(--light-gray)'};
  
  &.grand-total {
    font-weight: 600;
    font-size: 1.1rem;
    margin-top: 10px;
  }
`;

const ShippingOptions = styled.div`
  margin-bottom: 20px;
`;

const ShippingOption = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  input {
    margin-right: 10px;
  }
`;

const ShippingPrice = styled.span`
  margin-left: auto;
  font-weight: 500;
`;

const DeliveryAddress = styled.div`
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.5;
`;

const ChangeLink = styled.button`
  background: none;
  border: none;
  color: #0071BC;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-top: 5px;
  text-decoration: underline;
  
  &:hover {
    color: #005a9e;
  }
`;

const AddressModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  
  svg {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
    color: var(--med-gray);
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const AddItemPrompt = styled.div`
  background-color: #f0f9ff;
  border: 1px dashed var(--primary-color);
  padding: 15px;
  margin-top: 20px;
  text-align: center;
  border-radius: 8px;
  
  p {
    margin-bottom: 10px;
  }
`;

const VoucherContainer = styled.div`
  margin: 20px 0;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const VoucherForm = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const VoucherInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--med-gray);
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #0071BC;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 113, 188, 0.2);
  }
`;

const VoucherMessage = styled.div<{ type: 'success' | 'error' }>`
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  background-color: ${props => props.type === 'success' ? '#e6f7e6' : '#ffebeb'};
  color: ${props => props.type === 'success' ? '#2e7d32' : '#d32f2f'};
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${props => props.type === 'success' ? '%232e7d32' : '%23d32f2f'}'%3E%3Cpath d='${props => props.type === 'success' ? 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' : 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'}'/%3E%3C/svg%3E");
    background-size: contain;
  }
`;

const AppliedVoucher = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 10px 12px;
  background-color: #e6f7e6;
  border-radius: 4px;
  border-left: 3px solid #2e7d32;
`;

const ModalTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
`;

const ModalTab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#0071BC' : 'transparent'};
  color: ${props => props.active ? '#0071BC' : '#666'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  cursor: pointer;
  
  &:hover {
    color: #0071BC;
  }
`;

const DeliveryOptionContainer = styled.div`
  margin-bottom: 20px;
`;

const DeliveryOptionTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const DeliveryOptions = styled.div`
  display: flex;
  flex-direction: column;
`;

const DeliveryOption = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid ${props => props.selected ? '#0071BC' : '#ddd'};
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  
  &:hover {
    border-color: #0071BC;
  }
`;

const DeliveryOptionRadio = styled.div`
  margin-right: 10px;
`;

const RadioButton = styled.div<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid ${props => props.selected ? '#0071BC' : '#ddd'};
  background-color: ${props => props.selected ? '#0071BC' : 'white'};
`;

const DeliveryOptionContent = styled.div`
  flex: 1;
`;

const DeliveryOptionLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const DeliveryOptionDescription = styled.div`
  font-size: 14px;
  color: #666;
`;

const AddressContainer = styled.div`
  margin-bottom: 20px;
`;

const AddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const AddressTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
`;

const ChangeButton = styled.button`
  background: none;
  border: none;
  color: #0071BC;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  
  &:hover {
    color: #005a9e;
  }
`;

const AddressCard = styled.div`
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 4px;
`;

const AddressDetails = styled.div`
  font-size: 14px;
  line-height: 1.5;
`;

const AddressName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const AddressText = styled.div`
  margin-bottom: 10px;
`;

const AddressPhone = styled.div`
  margin-bottom: 10px;
`;

const EmptyAddressCard = styled.div`
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 4px;
  text-align: center;
`;

const EmptyAddressText = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`;

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [deliveryOption, setDeliveryOption] = useState('home');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherMessage, setVoucherMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<{ 
    code: string, 
    discount: number, 
    discountType: 'percentage' | 'fixed',
    discountAmount: number 
  } | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'select' | 'add'>('select');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressAddedMessage, setAddressAddedMessage] = useState<string | null>(null);
  const [showCheckoutOptions, setShowCheckoutOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [pickupStores, setPickupStores] = useState<StoreAddress[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<StoreAddress | null>(null);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [customerLocation, setCustomerLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [deliveryFeeDetails, setDeliveryFeeDetails] = useState<{
    fee: number;
    isDeliveryAvailable: boolean;
    message?: string;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const navigate = useNavigate();
  
  // Mock user ID - In a real app, this would come from authentication context
  const userId = 'user1';
  
  // Calculate cart totals
  const subtotal = getCartTotal();
  const shipping = deliveryOption === 'home' 
    ? (deliveryFeeDetails?.isDeliveryAvailable ? deliveryFeeDetails.fee : 0) 
    : 0;
  
  // Calculate discount if voucher is applied
  const discount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  
  // Calculate final total
  const total = subtotal + shipping - discount;
  
  // Fetch selected address details when selectedAddressId changes
  useEffect(() => {
    const fetchSelectedAddress = async () => {
      if (selectedAddressId) {
        try {
          const address = await AddressService.getAddressById(selectedAddressId);
          setSelectedAddress(address);
        } catch (error) {
          console.error('Error fetching selected address:', error);
        }
      }
    };

    fetchSelectedAddress();
  }, [selectedAddressId]);

  // Fetch default address on component mount
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const defaultAddress = await AddressService.getDefaultAddress(userId);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setSelectedAddress(defaultAddress);
        }
      } catch (error) {
        console.error('Error fetching default address:', error);
      }
    };

    fetchDefaultAddress();
  }, [userId]);
  
  // Fetch pickup stores
  useEffect(() => {
    const fetchPickupStores = async () => {
      if (deliveryOption === 'pickup') {
        try {
          setIsLoadingStores(true);
          const stores = await StoreAddressService.getPickupStoreAddresses();
          setPickupStores(stores);
          
          // Select the first store by default if none is selected
          if (stores.length > 0 && !selectedStoreId) {
            setSelectedStoreId(stores[0].id);
            setSelectedStore(stores[0]);
          }
        } catch (error) {
          console.error('Error fetching pickup stores:', error);
        } finally {
          setIsLoadingStores(false);
        }
      }
    };
    
    fetchPickupStores();
  }, [deliveryOption, selectedStoreId]);

  // Handle store selection
  const handleStoreSelect = (storeId: string) => {
    const store = pickupStores.find(s => s.id === storeId);
    setSelectedStoreId(storeId);
    setSelectedStore(store || null);
    
    // Reset customer location when store changes
    setCustomerLocation(null);
  };

  // Get user location from address
  const getLocationFromAddress = async () => {
    if (!selectedAddress) return;
    
    try {
      setIsLoadingLocation(true);
      // Format the address as a string
      const addressString = formatAddressForDisplay(selectedAddress);
      
      // Use the StoreAddressService to get coordinates
      const coordinates = await StoreAddressService.getCoordinatesFromAddress(addressString);
      
      if (coordinates) {
        setCustomerLocation(coordinates);
      }
    } catch (error) {
      console.error('Error getting location from address:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Calculate delivery fee
  const calculateDeliveryFee = async () => {
    if (!selectedStoreId || !customerLocation || deliveryOption !== 'home') return;
    
    try {
      const store = await StoreAddressService.getStoreAddressById(selectedStoreId);
      if (!store) return;
      
      const feeDetails = StoreAddressService.calculateDeliveryFee(
        store, 
        subtotal,
        customerLocation.lat, 
        customerLocation.lng
      );
      
      setDeliveryFeeDetails(feeDetails);
    } catch (error) {
      console.error('Error calculating delivery fee:', error);
    }
  };

  // Calculate delivery fee based on current selections
  useEffect(() => {
    if (deliveryOption === 'home' && selectedAddress && selectedStoreId) {
      // If we have customer location from a previous calculation, use it
      if (customerLocation) {
        calculateDeliveryFee();
      } else {
        // Otherwise, try to get location from the address
        getLocationFromAddress();
      }
    } else {
      // Reset delivery fee details when not using home delivery
      setDeliveryFeeDetails(null);
    }
  }, [deliveryOption, selectedAddress, selectedStoreId, customerLocation, subtotal]);

  // Would normally handle images properly with imports or actual URLs
  const getImagePlaceholder = (image: string) => {
    return image || 'https://via.placeholder.com/80';
  };

  // Handle applying voucher code
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherMessage({
        text: 'Please enter a voucher code',
        type: 'error'
      });
      return;
    }

    setIsApplyingVoucher(true);
    setVoucherMessage(null);

    try {
      const result = await VoucherService.validateVoucher(voucherCode, subtotal);
      
      if (result.valid && result.voucher && result.discountAmount) {
        setAppliedVoucher({
          code: result.voucher.code,
          discount: result.voucher.discount,
          discountType: result.voucher.discountType,
          discountAmount: result.discountAmount
        });
        setVoucherMessage({
          text: 'Voucher applied successfully!',
          type: 'success'
        });
        setVoucherCode('');
      } else {
        setVoucherMessage({
          text: result.errorMessage || 'Invalid voucher code',
          type: 'error'
        });
      }
    } catch (error) {
      setVoucherMessage({
        text: 'Error applying voucher. Please try again.',
        type: 'error'
      });
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  // Handle removing applied voucher
  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherMessage(null);
  };

  // Format discount display text
  const getDiscountText = () => {
    if (!appliedVoucher) return '';
    
    if (appliedVoucher.discountType === 'percentage') {
      return `${appliedVoucher.discount}% off`;
    } else {
      return `${formatCurrency(appliedVoucher.discount)} off`;
    }
  };

  // Handle address selection
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    setShowAddressModal(false);
  };

  // Handle address form submission
  const handleAddressSubmit = async (addressData: AddressFormData) => {
    try {
      setIsAddingAddress(true);
      const newAddress = await AddressService.createAddress(userId, addressData);
      
      // Select the newly created address
      setSelectedAddressId(newAddress.id);
      setSelectedAddress(newAddress);
      
      // Show success message
      setAddressAddedMessage('Address added successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setAddressAddedMessage(null);
        // Close modal or switch back to select tab
        setActiveTab('select');
      }, 3000);
    } catch (error) {
      console.error('Error adding address:', error);
    } finally {
      setIsAddingAddress(false);
    }
  };

  // Format address for display
  const formatAddressForDisplay = (address: Address | null) => {
    if (!address) return 'No address selected';
    return `${address.name}, ${address.street}, ${address.city}, ${address.state}, ${address.postalCode}`;
  };

  // Handle checkout button click
  const handleCheckoutClick = () => {
    if (deliveryOption === 'home' && !selectedAddress) {
      // If home delivery is selected but no address is selected, show error
      return;
    }
    
    if (deliveryOption === 'pickup' && !selectedStoreId) {
      // If pickup is selected but no store is selected, show error
      return;
    }
    
    if (deliveryOption === 'home' && deliveryFeeDetails && !deliveryFeeDetails.isDeliveryAvailable) {
      // If delivery is not available to the selected address, show error
      return;
    }
    
    setShowCheckoutOptions(true);
  };

  // Handle payment method selection
  const handlePaymentSelection = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setShowCheckoutOptions(false);
    
    // Navigate to the checkout page with the selected payment method
    if (deliveryOption === 'home') {
      navigate(`/checkout?payment=${paymentMethod.code}&address=${selectedAddressId}&delivery=${deliveryOption}`);
    } else {
      navigate(`/checkout?payment=${paymentMethod.code}&store=${selectedStoreId}&delivery=${deliveryOption}`);
    }
  };

  // Handle delivery option change
  const handleDeliveryOptionChange = (option: 'home' | 'pickup') => {
    setDeliveryOption(option);
    
    // When switching to home delivery, make sure we have a store selected for delivery calculation
    if (option === 'home' && !selectedStoreId && pickupStores.length > 0) {
      // Select the first store by default
      setSelectedStoreId(pickupStores[0].id);
      setSelectedStore(pickupStores[0]);
    }
    
    // Reset delivery fee details when changing delivery option
    setDeliveryFeeDetails(null);
  };

  return (
    <PageContainer>
      <Header />
      
      <MainContent>
        <SectionContainer>
          <BreadcrumbNav>
            <Link to="/">Home</Link>
            <span>›</span>
            <Text>Cart</Text>
          </BreadcrumbNav>
          
          <PageTitle>Cart</PageTitle>
          
          {cartItems.length === 0 ? (
            <EmptyCartMessage>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <Text size="lg">Your cart is empty</Text>
              <Spacer size={20} />
              <Button variant="primary" as={Link} to="/">Continue Shopping</Button>
            </EmptyCartMessage>
          ) : (
            <CartContainer>
              <CartItemsSection>
                <CartHeader>
                  <div>Products</div>
                  <div>Quantity</div>
                  <div>Price</div>
                </CartHeader>
                
                {cartItems.map(item => (
                  <CartItem key={item.id}>
                    <ProductImage>
                      <img 
                        src={getImagePlaceholder(item.image)} 
                        alt={item.name} 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                        }}
                      />
                    </ProductImage>
                    
                    <ProductInfo>
                      <ProductName>
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </ProductName>
                      <ProductMeta>
                        Item #: {1000 + item.id}
                      </ProductMeta>
                      <ActionLinks>
                        <ActionLink onClick={() => removeFromCart(item.id)}>
                          Remove
                        </ActionLink>
                      </ActionLinks>
                    </ProductInfo>
                    
                    <QuantitySelector>
                      <QuantityButton 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        -
                      </QuantityButton>
                      <QuantityValue>{item.quantity}</QuantityValue>
                      <QuantityButton 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </QuantityButton>
                    </QuantitySelector>
                    
                    <PriceContainer>
                      <div>Price:</div>
                      <Text weight="500">{formatCurrency(item.price * item.quantity)}</Text>
                    </PriceContainer>
                  </CartItem>
                ))}
                
                <AddItemPrompt>
                  <p>Add product worth at least {formatCurrency(50000)} and get free shipping</p>
                  <Button variant="outline" as={Link} to="/" size="small">
                    Continue Shopping
                  </Button>
                </AddItemPrompt>
              </CartItemsSection>
              
              <SummarySection>
                <SummaryTitle>Cart Total</SummaryTitle>
                
                <SummaryRow>
                  <Text>Sub Total</Text>
                  <Text weight="500">{formatCurrency(subtotal)}</Text>
                </SummaryRow>
                
                {appliedVoucher && (
                  <SummaryRow>
                    <Text>Discount</Text>
                    <Text weight="500" style={{ color: '#2e7d32' }}>- {formatCurrency(discount)}</Text>
                  </SummaryRow>
                )}
                
                {deliveryOption === 'home' && (
                  <SummaryRow>
                    <Text>Delivery Fee</Text>
                    {isLoadingLocation ? (
                      <Text weight="500">Calculating...</Text>
                    ) : deliveryFeeDetails ? (
                      <Text weight="500">{deliveryFeeDetails.isDeliveryAvailable ? formatCurrency(deliveryFeeDetails.fee) : 'Not available'}</Text>
                    ) : (
                      <Text weight="500">{formatCurrency(shipping)}</Text>
                    )}
                  </SummaryRow>
                )}
                
                {deliveryOption === 'home' && deliveryFeeDetails && deliveryFeeDetails.message && (
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: deliveryFeeDetails.isDeliveryAvailable ? '#fff8e1' : '#ffebee', 
                    borderRadius: '4px', 
                    marginBottom: '15px',
                    fontSize: '14px'
                  }}>
                    {deliveryFeeDetails.message}
                  </div>
                )}
                
                <DeliveryOptionContainer>
                  <DeliveryOptionTitle>Delivery Options</DeliveryOptionTitle>
                  <DeliveryOptions>
                    <DeliveryOption 
                      selected={deliveryOption === 'home'}
                      onClick={() => handleDeliveryOptionChange('home')}
                    >
                      <DeliveryOptionRadio>
                        <RadioButton selected={deliveryOption === 'home'} />
                      </DeliveryOptionRadio>
                      <DeliveryOptionContent>
                        <DeliveryOptionLabel>Home Delivery</DeliveryOptionLabel>
                        <DeliveryOptionDescription>Delivered to your address</DeliveryOptionDescription>
                      </DeliveryOptionContent>
                    </DeliveryOption>
                    
                    <DeliveryOption 
                      selected={deliveryOption === 'pickup'}
                      onClick={() => handleDeliveryOptionChange('pickup')}
                    >
                      <DeliveryOptionRadio>
                        <RadioButton selected={deliveryOption === 'pickup'} />
                      </DeliveryOptionRadio>
                      <DeliveryOptionContent>
                        <DeliveryOptionLabel>Pick up at Store</DeliveryOptionLabel>
                        <DeliveryOptionDescription>Collect from your nearest M-Mart store</DeliveryOptionDescription>
                      </DeliveryOptionContent>
                    </DeliveryOption>
                  </DeliveryOptions>
                </DeliveryOptionContainer>
                
                {deliveryOption === 'home' ? (
                  <AddressContainer>
                    <AddressHeader>
                      <AddressTitle>Delivery Address</AddressTitle>
                      <ChangeButton onClick={() => setShowAddressModal(true)}>
                        {selectedAddress ? 'Change' : 'Select Address'}
                      </ChangeButton>
                    </AddressHeader>
                    
                    {selectedAddress ? (
                      <AddressCard>
                        <AddressDetails>
                          <AddressName>{selectedAddress.name}</AddressName>
                          <AddressText>{formatAddressForDisplay(selectedAddress)}</AddressText>
                          <AddressPhone>{selectedAddress.phone}</AddressPhone>
                        </AddressDetails>
                      </AddressCard>
                    ) : (
                      <EmptyAddressCard onClick={() => setShowAddressModal(true)}>
                        <EmptyAddressText>No address selected</EmptyAddressText>
                        <Button variant="outline" size="sm">Select Address</Button>
                      </EmptyAddressCard>
                    )}
                  </AddressContainer>
                ) : (
                  <AddressContainer>
                    <AddressHeader>
                      <AddressTitle>Pickup Store</AddressTitle>
                    </AddressHeader>
                    
                    {isLoadingStores ? (
                      <div style={{ padding: '20px', textAlign: 'center' }}>Loading stores...</div>
                    ) : pickupStores.length === 0 ? (
                      <EmptyAddressCard>
                        <EmptyAddressText>No pickup stores available</EmptyAddressText>
                      </EmptyAddressCard>
                    ) : (
                      <>
                        <div style={{ marginBottom: '15px' }}>
                          <select 
                            value={selectedStoreId || ''} 
                            onChange={(e) => handleStoreSelect(e.target.value)}
                            style={{ 
                              width: '100%', 
                              padding: '10px', 
                              borderRadius: '4px',
                              border: '1px solid #ddd'
                            }}
                          >
                            {pickupStores.map(store => (
                              <option key={store.id} value={store.id}>
                                {store.name} - {store.city}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {selectedStore && (
                          <AddressCard>
                            <AddressDetails>
                              <AddressName>{selectedStore.name}</AddressName>
                              <AddressText>
                                {selectedStore.street}, {selectedStore.city}, {selectedStore.state}
                              </AddressText>
                              <AddressPhone>{selectedStore.phone}</AddressPhone>
                              {selectedStore.openingHours && (
                                <div style={{ fontSize: '14px', marginTop: '8px', color: '#666' }}>
                                  <strong>Opening Hours:</strong> {getStoreHoursForToday(selectedStore)}
                                </div>
                              )}
                              {selectedStore.pickupInstructions && (
                                <div style={{ fontSize: '14px', marginTop: '8px', color: '#666' }}>
                                  <strong>Pickup Instructions:</strong> {selectedStore.pickupInstructions}
                                </div>
                              )}
                            </AddressDetails>
                          </AddressCard>
                        )}
                      </>
                    )}
                  </AddressContainer>
                )}
                
                <VoucherContainer>
                  <Text weight="500" style={{ marginBottom: '10px' }}>Apply Voucher</Text>
                  <VoucherForm>
                    <VoucherInput 
                      type="text" 
                      placeholder="Enter voucher code" 
                      value={voucherCode} 
                      onChange={(e) => setVoucherCode(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyVoucher()}
                    />
                    <Button 
                      variant="primary" 
                      size="small" 
                      onClick={handleApplyVoucher} 
                      disabled={isApplyingVoucher || !voucherCode.trim()}
                    >
                      {isApplyingVoucher ? 'Applying...' : 'Apply'}
                    </Button>
                  </VoucherForm>
                  {voucherMessage && (
                    <VoucherMessage type={voucherMessage.type}>
                      {voucherMessage.text}
                    </VoucherMessage>
                  )}
                  {appliedVoucher && (
                    <AppliedVoucher>
                      <Text>Applied: <strong>{appliedVoucher.code}</strong> ({getDiscountText()})</Text>
                      <Button variant="outline" size="small" onClick={handleRemoveVoucher}>
                        Remove
                      </Button>
                    </AppliedVoucher>
                  )}
                </VoucherContainer>
                
                <TotalRow className="grand-total" final>
                  <Text>Total</Text>
                  <Text>{formatCurrency(total)}</Text>
                </TotalRow>
                
                <Button 
                  variant="primary" 
                  fullWidth={true}
                  disabled={(deliveryOption === 'home' && !selectedAddress) || 
                           (deliveryOption === 'pickup' && !selectedStoreId) ||
                           (deliveryOption === 'home' && deliveryFeeDetails && !deliveryFeeDetails.isDeliveryAvailable)}
                  onClick={handleCheckoutClick}
                >
                  Proceed to checkout
                </Button>
                {deliveryOption === 'home' && !selectedAddress && (
                  <Text size="sm" style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}>
                    Please select a delivery address
                  </Text>
                )}
                {deliveryOption === 'pickup' && !selectedStoreId && (
                  <Text size="sm" style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}>
                    Please select a pickup store
                  </Text>
                )}
                {deliveryOption === 'home' && deliveryFeeDetails && !deliveryFeeDetails.isDeliveryAvailable && (
                  <Text size="sm" style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}>
                    Delivery is not available to this address
                  </Text>
                )}
              </SummarySection>
            </CartContainer>
          )}
        </SectionContainer>
      </MainContent>
      
      {/* Address Selection Modal */}
      {showAddressModal && (
        <AddressModal>
          <ModalContent>
            <ModalHeader>
              <Text size="lg" weight="500">
                {activeTab === 'select' ? 'Select Delivery Address' : 'Add New Address'}
              </Text>
              <CloseButton onClick={() => setShowAddressModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <ModalTabs>
              <ModalTab 
                active={activeTab === 'select'} 
                onClick={() => setActiveTab('select')}
              >
                Select Address
              </ModalTab>
              <ModalTab 
                active={activeTab === 'add'} 
                onClick={() => setActiveTab('add')}
              >
                Add New Address
              </ModalTab>
            </ModalTabs>
            
            {addressAddedMessage && (
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#e6f7e6', 
                borderRadius: '4px', 
                marginBottom: '15px',
                color: '#2e7d32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>{addressAddedMessage}</span>
                <button 
                  onClick={() => setAddressAddedMessage(null)} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#2e7d32'
                  }}
                >
                  &times;
                </button>
              </div>
            )}
            
            {activeTab === 'select' ? (
              <AddressSelector 
                userId={userId}
                selectedAddressId={selectedAddressId}
                onAddressSelect={handleAddressSelect}
                onAddNewClick={() => setActiveTab('add')}
              />
            ) : (
              <AddressForm 
                onSubmit={handleAddressSubmit}
                onCancel={() => setActiveTab('select')}
              />
            )}
          </ModalContent>
        </AddressModal>
      )}
      
      {/* Checkout Options Modal */}
      {showCheckoutOptions && (
        <PaymentMethodSelector
          visible={showCheckoutOptions}
          onCancel={() => setShowCheckoutOptions(false)}
          onSelect={handlePaymentSelection}
          orderTotal={total}
        />
      )}
      
      <Footer />
    </PageContainer>
  );
};

// Helper function to get store hours for today
const getStoreHoursForToday = (store: StoreAddress) => {
  if (!store.openingHours) return 'Not available';
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const hours = store.openingHours[today as keyof typeof store.openingHours];
  
  if (!hours.isOpen) return 'Closed today';
  return `${hours.open} - ${hours.close}`;
};

export default CartPage;
