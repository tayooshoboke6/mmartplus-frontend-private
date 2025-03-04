import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminLayout from '../../components/admin/AdminLayout';
import { FlexBox, Text, Button } from '../../styles/GlobalComponents';
import Tooltip from '../../components/common/Tooltip';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SettingsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 25px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
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
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: #0066b2;
    outline: none;
  }
`;

const SwitchLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const SwitchInput = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  position: absolute;
`;

const SwitchSlider = styled.span<{ checked: boolean }>`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  background-color: ${props => props.checked ? '#0066b2' : '#ccc'};
  border-radius: 20px;
  margin-right: 10px;
  transition: background-color 0.3s;
  
  &:before {
    content: '';
    position: absolute;
    height: 16px;
    width: 16px;
    left: ${props => props.checked ? '21px' : '2px'};
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.3s;
  }
`;

const ColorBox = styled.div<{ color: string }>`
  width: 30px;
  height: 30px;
  background-color: ${props => props.color};
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  border: 2px solid #eee;
  
  &.selected {
    border-color: #0066b2;
  }
`;

const SettingsPage: React.FC = () => {
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'M-Mart+',
    storeEmail: 'contact@mmart-plus.com',
    storePhone: '+234 800 123 4567',
    storeAddress: '123 Commerce Street, Lagos, Nigeria',
    currencySymbol: '₦',
    defaultLanguage: 'en',
    timeZone: 'Africa/Lagos'
  });
  
  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    paymentMethods: {
      creditCard: true,
      paypal: false,
      bankTransfer: true,
      cashOnDelivery: true
    },
    taxRate: 7.5
  });
  
  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: '#0066b2',
    secondaryColor: '#ffd700',
    accentColor: '#28a745',
    darkMode: false,
    sliderSensitivity: 50 // Default value (50% sensitivity)
  });
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderStatusUpdate: true,
    lowStockAlert: true,
    newsletterSubscription: false,
    marketingEmails: false
  });
  
  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value
    });
  };
  
  const handlePaymentMethodToggle = (method: string) => {
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        [method]: !paymentSettings.paymentMethods[method as keyof typeof paymentSettings.paymentMethods]
      }
    });
  };
  
  const handleNotificationToggle = (notification: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [notification]: !notificationSettings[notification as keyof typeof notificationSettings]
    });
  };
  
  const handleColorChange = (colorType: string, color: string) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [colorType]: color
    });
  };
  
  const handleDarkModeToggle = () => {
    setAppearanceSettings({
      ...appearanceSettings,
      darkMode: !appearanceSettings.darkMode
    });
  };
  
  const handleSliderSensitivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAppearanceSettings({
      ...appearanceSettings,
      sliderSensitivity: value
    });
    
    // Save to localStorage for immediate use by sliders
    localStorage.setItem('sliderSensitivity', value.toString());
  };
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would save settings to the backend
    console.log('General Settings:', generalSettings);
    console.log('Payment Settings:', paymentSettings);
    console.log('Appearance Settings:', appearanceSettings);
    console.log('Notification Settings:', notificationSettings);
    
    alert('Settings saved successfully!');
  };
  
  // Load slider sensitivity from localStorage on component mount
  useEffect(() => {
    const storedSensitivity = localStorage.getItem('sliderSensitivity');
    if (storedSensitivity) {
      setAppearanceSettings(prev => ({
        ...prev,
        sliderSensitivity: parseInt(storedSensitivity)
      }));
    }
  }, []);
  
  return (
    <AdminLayout title="Settings">
      <SettingsContainer>
        {/* General Settings */}
        <SettingsCard>
          <CardHeader>
            <Text size="lg" weight="bold">General Settings</Text>
          </CardHeader>
          
          <form>
            <FormRow>
              <FormGroup>
                <Tooltip content="Name of your store displayed to customers" position="right">
                  <Label htmlFor="storeName">Store Name</Label>
                </Tooltip>
                <Input
                  id="storeName"
                  name="storeName"
                  value={generalSettings.storeName}
                  onChange={handleGeneralSettingsChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Tooltip content="Official email address for customer communications" position="right">
                  <Label htmlFor="storeEmail">Store Email</Label>
                </Tooltip>
                <Input
                  id="storeEmail"
                  name="storeEmail"
                  type="email"
                  value={generalSettings.storeEmail}
                  onChange={handleGeneralSettingsChange}
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Tooltip content="Contact phone number for customer support" position="right">
                  <Label htmlFor="storePhone">Store Phone</Label>
                </Tooltip>
                <Input
                  id="storePhone"
                  name="storePhone"
                  value={generalSettings.storePhone}
                  onChange={handleGeneralSettingsChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Tooltip content="Currency symbol displayed with prices (e.g., ₦, $, €)" position="right">
                  <Label htmlFor="currencySymbol">Currency Symbol</Label>
                </Tooltip>
                <Input
                  id="currencySymbol"
                  name="currencySymbol"
                  value={generalSettings.currencySymbol}
                  onChange={handleGeneralSettingsChange}
                />
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Tooltip content="Physical address of your business location" position="right">
                <Label htmlFor="storeAddress">Store Address</Label>
              </Tooltip>
              <Textarea
                id="storeAddress"
                name="storeAddress"
                value={generalSettings.storeAddress}
                onChange={handleGeneralSettingsChange}
              />
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <Tooltip content="Default language for the store interface" position="right">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                </Tooltip>
                <Select
                  id="defaultLanguage"
                  name="defaultLanguage"
                  value={generalSettings.defaultLanguage}
                  onChange={handleGeneralSettingsChange}
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="yo">Yoruba</option>
                  <option value="ha">Hausa</option>
                  <option value="ig">Igbo</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="timeZone">Time Zone</Label>
                <Select
                  id="timeZone"
                  name="timeZone"
                  value={generalSettings.timeZone}
                  onChange={handleGeneralSettingsChange}
                >
                  <option value="Africa/Lagos">Africa/Lagos</option>
                  <option value="Africa/Cairo">Africa/Cairo</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                </Select>
              </FormGroup>
            </FormRow>
          </form>
        </SettingsCard>
        
        {/* Payment Settings */}
        <SettingsCard>
          <CardHeader>
            <Text size="lg" weight="bold">Payment Settings</Text>
          </CardHeader>
          
          <form>
            <FormGroup>
              <Label>Available Payment Methods</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <SwitchLabel>
                  <SwitchInput 
                    type="checkbox" 
                    checked={paymentSettings.paymentMethods.creditCard} 
                    onChange={() => handlePaymentMethodToggle('creditCard')} 
                  />
                  <SwitchSlider checked={paymentSettings.paymentMethods.creditCard} />
                  Credit/Debit Card
                </SwitchLabel>
                
                <SwitchLabel>
                  <SwitchInput 
                    type="checkbox" 
                    checked={paymentSettings.paymentMethods.paypal} 
                    onChange={() => handlePaymentMethodToggle('paypal')} 
                  />
                  <SwitchSlider checked={paymentSettings.paymentMethods.paypal} />
                  PayPal
                </SwitchLabel>
                
                <SwitchLabel>
                  <SwitchInput 
                    type="checkbox" 
                    checked={paymentSettings.paymentMethods.bankTransfer} 
                    onChange={() => handlePaymentMethodToggle('bankTransfer')} 
                  />
                  <SwitchSlider checked={paymentSettings.paymentMethods.bankTransfer} />
                  Bank Transfer
                </SwitchLabel>
                
                <SwitchLabel>
                  <SwitchInput 
                    type="checkbox" 
                    checked={paymentSettings.paymentMethods.cashOnDelivery} 
                    onChange={() => handlePaymentMethodToggle('cashOnDelivery')} 
                  />
                  <SwitchSlider checked={paymentSettings.paymentMethods.cashOnDelivery} />
                  Cash on Delivery
                </SwitchLabel>
              </div>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={paymentSettings.taxRate}
                onChange={(e) => setPaymentSettings({
                  ...paymentSettings,
                  taxRate: parseFloat(e.target.value)
                })}
              />
            </FormGroup>
          </form>
        </SettingsCard>
        
        {/* Appearance Settings */}
        <SettingsCard>
          <CardHeader>
            <Text size="lg" weight="bold">Appearance Settings</Text>
          </CardHeader>
          
          <form>
            <FormGroup>
              <Label>Primary Color</Label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex' }}>
                  {['#0066b2', '#1565c0', '#2196f3', '#03a9f4', '#00bcd4'].map(color => (
                    <ColorBox 
                      key={color} 
                      color={color} 
                      className={appearanceSettings.primaryColor === color ? 'selected' : ''}
                      onClick={() => handleColorChange('primaryColor', color)}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={appearanceSettings.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  style={{ marginLeft: '10px', width: '50px' }}
                />
              </div>
            </FormGroup>
            
            <FormGroup>
              <Label>Secondary Color</Label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex' }}>
                  {['#ffd700', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'].map(color => (
                    <ColorBox 
                      key={color} 
                      color={color} 
                      className={appearanceSettings.secondaryColor === color ? 'selected' : ''}
                      onClick={() => handleColorChange('secondaryColor', color)}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={appearanceSettings.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  style={{ marginLeft: '10px', width: '50px' }}
                />
              </div>
            </FormGroup>
            
            <FormGroup>
              <Label>Accent Color</Label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex' }}>
                  {['#28a745', '#4caf50', '#8bc34a', '#cddc39', '#009688'].map(color => (
                    <ColorBox 
                      key={color} 
                      color={color} 
                      className={appearanceSettings.accentColor === color ? 'selected' : ''}
                      onClick={() => handleColorChange('accentColor', color)}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={appearanceSettings.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  style={{ marginLeft: '10px', width: '50px' }}
                />
              </div>
            </FormGroup>
            
            <FormGroup>
              <SwitchLabel>
                <SwitchInput 
                  type="checkbox" 
                  checked={appearanceSettings.darkMode} 
                  onChange={handleDarkModeToggle} 
                />
                <SwitchSlider checked={appearanceSettings.darkMode} />
                Dark Mode
              </SwitchLabel>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="sliderSensitivity">
                Touch Slider Sensitivity
                <Tooltip content="Higher values make sliders more responsive to touch gestures" position="right">
                  <span style={{ marginLeft: '5px', cursor: 'help' }}>ⓘ</span>
                </Tooltip>
              </Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <input
                    id="sliderSensitivity"
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={appearanceSettings.sliderSensitivity}
                    onChange={handleSliderSensitivityChange}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ width: '40px', textAlign: 'center' }}>
                  {appearanceSettings.sliderSensitivity}%
                </div>
              </div>
            </FormGroup>
          </form>
        </SettingsCard>
        
        {/* Notification Settings */}
        <SettingsCard>
          <CardHeader>
            <Text size="lg" weight="bold">Notification Settings</Text>
          </CardHeader>
          
          <form>
            <FormGroup>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <SwitchLabel>
                  <SwitchInput 
                    type="checkbox" 
                    checked={notificationSettings.orderConfirmation} 
                    onChange={() => handleNotificationToggle('orderConfirmation')} 
                  />
                  <SwitchSlider checked={notificationSettings.orderConfirmation} />
                  Order Confirmation Emails
                </SwitchLabel>
                
                <SwitchLabel>
                  <SwitchInput 
                    type="checkbox" 
                    checked={notificationSettings.orderStatusUpdate} 
                    onChange={() => handleNotificationToggle('orderStatusUpdate')} 
                  />
                  <SwitchSlider checked={notificationSettings.orderStatusUpdate} />
                  Order Status Update Emails
                </SwitchLabel>
                
                <SwitchLabel>
                  <SwitchInput 
                    type="checkbox" 
                    checked={notificationSettings.lowStockAlert} 
                    onChange={() => handleNotificationToggle('lowStockAlert')} 
                  />
                  <SwitchSlider checked={notificationSettings.lowStockAlert} />
                  Low Stock Alerts
                </SwitchLabel>
                
                <SwitchLabel>
                  <SwitchInput 
                    type="checkbox" 
                    checked={notificationSettings.newsletterSubscription} 
                    onChange={() => handleNotificationToggle('newsletterSubscription')} 
                  />
                  <SwitchSlider checked={notificationSettings.newsletterSubscription} />
                  Newsletter Subscription Notifications
                </SwitchLabel>
                
                <SwitchLabel>
                  <SwitchInput 
                    type="checkbox" 
                    checked={notificationSettings.marketingEmails} 
                    onChange={() => handleNotificationToggle('marketingEmails')} 
                  />
                  <SwitchSlider checked={notificationSettings.marketingEmails} />
                  Marketing Emails
                </SwitchLabel>
              </div>
            </FormGroup>
          </form>
        </SettingsCard>
        
        <FlexBox justify="flex-end">
          <Button variant="primary" onClick={handleSaveSettings}>
            Save All Settings
          </Button>
        </FlexBox>
      </SettingsContainer>
    </AdminLayout>
  );
};

export default SettingsPage;
