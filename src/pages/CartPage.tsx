import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button, SectionContainer, Spacer, Text } from '../styles/GlobalComponents';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import AddressSelector from '../components/cart/AddressSelector';
import { Address, AddressFormData } from '../models/Address';
import AddressForm from '../components/cart/AddressForm';
import { StoreAddress } from '../models/StoreAddress';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import { PaymentMethod } from '../models/PaymentMethod';

// Mock data for addresses
const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Home',
    addressLine1: '123 Main Street',
    addressLine2: 'Apt 4B',
    city: 'Lagos',
    state: 'Lagos',
    postalCode: '100001',
    country: 'Nigeria',
    phoneNumber: '+2341234567890',
    isDefault: true,
    latitude: 6.5244,
    longitude: 3.3792
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Office',
    addressLine1: '456 Business Avenue',
    addressLine2: 'Floor 3',
    city: 'Lagos',
    state: 'Lagos',
    postalCode: '100002',
    country: 'Nigeria',
    phoneNumber: '+2349876543210',
    isDefault: false,
    latitude: 6.4281,
    longitude: 3.4219
  }
];

// Mock data for store addresses
const MOCK_STORE_ADDRESSES: StoreAddress[] = [
  {
    id: '1',
    name: 'M-Mart Ikeja',
    address: '10 Allen Avenue',
    city: 'Ikeja',
    state: 'Lagos',
    zipCode: '100001',
    country: 'Nigeria',
    phone: '+2341234567890',
    email: 'ikeja@mmart.com',
    description: 'Our flagship store in Ikeja',
    openingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    pickupInstructions: 'Please come to the customer service desk with your order number and ID',
    pickupAvailable: true,
    latitude: 6.6018,
    longitude: 3.3515
  },
  {
    id: '2',
    name: 'M-Mart Lekki',
    address: '15 Admiralty Way',
    city: 'Lekki',
    state: 'Lagos',
    zipCode: '101001',
    country: 'Nigeria',
    phone: '+2349876543210',
    email: 'lekki@mmart.com',
    description: 'Our store in Lekki Phase 1',
    openingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    pickupInstructions: 'Please park in the designated pickup area and call our store number',
    pickupAvailable: true,
    latitude: 6.4281,
    longitude: 3.4219
  }
];

// Mock voucher validation function
const validateVoucher = (code: string) => {
  // Mock vouchers
  const vouchers = [
    { 
      code: 'WELCOME10', 
      discount: 10, 
      discountType: 'percentage' as const,
      minOrderAmount: 5000
    },
    { 
      code: 'FLAT1000', 
      discount: 1000, 
      discountType: 'fixed' as const,
      minOrderAmount: 10000
    }
  ];
  
  const voucher = vouchers.find(v => v.code === code);
  
  if (!voucher) {
    return { 
      valid: false, 
      message: 'Invalid voucher code' 
    };
  }
  
  return { 
    valid: true, 
    voucher 
  };
};

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
    const fetchSelectedAddress = () => {
      if (selectedAddressId) {
        const address = MOCK_ADDRESSES.find(addr => addr.id === selectedAddressId) || null;
        setSelectedAddress(address);
      }
    };

    fetchSelectedAddress();
  }, [selectedAddressId]);

  // Fetch default address on component mount
  useEffect(() => {
    const fetchDefaultAddress = () => {
      const defaultAddress = MOCK_ADDRESSES.find(addr => addr.isDefault) || null;
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setSelectedAddress(defaultAddress);
      }
    };

    fetchDefaultAddress();
  }, []);
  
  // Fetch pickup stores
  useEffect(() => {
    const fetchPickupStores = () => {
      if (deliveryOption === 'pickup') {
        setIsLoadingStores(true);
        
        // Simulate API delay
        setTimeout(() => {
          setPickupStores(MOCK_STORE_ADDRESSES);
          
          // Select the first store by default if none is selected
          if (MOCK_STORE_ADDRESSES.length > 0 && !selectedStoreId) {
            setSelectedStoreId(MOCK_STORE_ADDRESSES[0].id);
            setSelectedStore(MOCK_STORE_ADDRESSES[0]);
          }
          
          setIsLoadingStores(false);
        }, 500);
      }
    };

    fetchPickupStores();
  }, [deliveryOption, selectedStoreId]);
  
  // Update selected store when selectedStoreId changes
  useEffect(() => {
    if (selectedStoreId) {
      const store = pickupStores.find(store => store.id === selectedStoreId) || null;
      setSelectedStore(store);
    }
  }, [selectedStoreId, pickupStores]);
  
  // Calculate delivery fee based on customer location and selected address
  useEffect(() => {
    const calculateDeliveryFee = () => {
      if (deliveryOption === 'home' && selectedAddress) {
        setIsLoadingLocation(true);
        
        // Simulate API delay
        setTimeout(() => {
          // Mock delivery fee calculation
          // In a real app, this would be calculated based on distance
          const fee = 1500; // ₦1,500 delivery fee
          
          setDeliveryFeeDetails({
            fee,
            isDeliveryAvailable: true
          });
          
          setIsLoadingLocation(false);
        }, 500);
      }
    };
    
    calculateDeliveryFee();
  }, [deliveryOption, selectedAddress]);
  
  // Handle voucher code application
  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) {
      setVoucherMessage({ text: 'Please enter a voucher code', type: 'error' });
      return;
    }
    
    setIsApplyingVoucher(true);
    
    // Simulate API delay
    setTimeout(() => {
      const result = validateVoucher(voucherCode);
      
      if (result.valid && result.voucher) {
        // Check if order meets minimum amount
        if (subtotal < result.voucher.minOrderAmount) {
          setVoucherMessage({ 
            text: `Minimum order amount of ₦${formatCurrency(result.voucher.minOrderAmount)} required`, 
            type: 'error' 
          });
          setIsApplyingVoucher(false);
          return;
        }
        
        // Calculate discount amount
        let discountAmount = 0;
        if (result.voucher.discountType === 'percentage') {
          discountAmount = (subtotal * result.voucher.discount) / 100;
        } else {
          discountAmount = result.voucher.discount;
        }
        
        setAppliedVoucher({
          code: result.voucher.code,
          discount: result.voucher.discount,
          discountType: result.voucher.discountType,
          discountAmount
        });
        
        setVoucherMessage({ 
          text: 'Voucher applied successfully', 
          type: 'success' 
        });
      } else {
        setVoucherMessage({ 
          text: result.message || 'Invalid voucher code', 
          type: 'error' 
        });
      }
      
      setIsApplyingVoucher(false);
    }, 500);
  };
  
  // Handle removing applied voucher
  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    setVoucherMessage(null);
  };
  
  // Handle address form submission
  const handleAddressSubmit = (addressData: AddressFormData) => {
    setIsAddingAddress(true);
    
    // Simulate API delay
    setTimeout(() => {
      // In a real app, this would send the address to the server
      // For now, we'll just show a success message
      setAddressAddedMessage('Address added successfully');
      setIsAddingAddress(false);
      setActiveTab('select');
      
      // Reset the message after 3 seconds
      setTimeout(() => {
        setAddressAddedMessage(null);
      }, 3000);
    }, 500);
  };
  
  // Handle store selection
  const handleStoreSelect = (storeId: string) => {
    setSelectedStoreId(storeId);
  };
  
  // Handle payment method selection
  const handlePaymentSelection = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    
    // Build checkout URL with parameters
    let checkoutUrl = `/checkout?amount=${total}`;
    
    // Add delivery option
    checkoutUrl += `&deliveryOption=${deliveryOption}`;
    
    // Add address or store info
    if (deliveryOption === 'home' && selectedAddress) {
      checkoutUrl += `&addressId=${selectedAddress.id}`;
    } else if (deliveryOption === 'pickup' && selectedStore) {
      checkoutUrl += `&storeId=${selectedStore.id}`;
    }
    
    // Add payment method
    checkoutUrl += `&paymentMethod=${paymentMethod.id}`;
    
    // Add voucher if applied
    if (appliedVoucher) {
      checkoutUrl += `&voucherCode=${appliedVoucher.code}`;
    }
    
    // Navigate to checkout
    navigate(checkoutUrl);
  };
  
  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    // Validate that we have all required information
    if (deliveryOption === 'home' && !selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    
    if (deliveryOption === 'pickup' && !selectedStore) {
      alert('Please select a pickup store');
      return;
    }
    
    // Show payment method selector
    setShowCheckoutOptions(true);
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
                        <Button variant="outline" size="small">Select Address</Button>
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
                                {selectedStore.address}, {selectedStore.city}, {selectedStore.state}
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
                  onClick={handleProceedToCheckout}
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
