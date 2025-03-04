import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, Input, Button, Switch, Tabs, TimePicker, Row, Col, Divider, Space } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, InfoCircleOutlined, CompassOutlined, DollarOutlined } from '@ant-design/icons';
import { StoreAddress, StoreAddressFormData, OpeningHours, DayHours, defaultDeliverySettings, GeofencePolygon, DeliverySettings } from '../../models/StoreAddress';
import dayjs from 'dayjs';
import DeliverySettingsForm from './DeliverySettingsForm';
import GeofenceMapEditor from './GeofenceMapEditor';

const { TabPane } = Tabs;
const { TextArea } = Input;

interface StoreAddressFormProps {
  initialValues: Partial<StoreAddressFormData>;
  onSubmit: (values: StoreAddressFormData) => void;
  onCancel: () => void;
}

const FormContainer = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
`;

const StyledDivider = styled(Divider)`
  margin: 16px 0;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  gap: 12px;
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const SwitchLabel = styled.span`
  margin-left: 8px;
`;

const DayRow = styled(Row)`
  margin-bottom: 16px;
  align-items: center;
`;

const DayLabel = styled.div`
  font-weight: 500;
`;

const formatTimeForForm = (timeString?: string) => {
  if (!timeString) return undefined;
  return dayjs(timeString, 'HH:mm');
};

const formatTimeForSubmit = (time?: dayjs.Dayjs) => {
  if (!time) return '09:00';
  return time.format('HH:mm');
};

const StoreAddressForm: React.FC<StoreAddressFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('basic');
  
  // Track open status for each day
  const [dayOpenStatus, setDayOpenStatus] = useState({
    monday: initialValues.openingHours?.monday.isOpen ?? true,
    tuesday: initialValues.openingHours?.tuesday.isOpen ?? true,
    wednesday: initialValues.openingHours?.wednesday.isOpen ?? true,
    thursday: initialValues.openingHours?.thursday.isOpen ?? true,
    friday: initialValues.openingHours?.friday.isOpen ?? true,
    saturday: initialValues.openingHours?.saturday.isOpen ?? true,
    sunday: initialValues.openingHours?.sunday.isOpen ?? false,
  });

  // Track delivery settings
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(
    initialValues.deliverySettings || {...defaultDeliverySettings}
  );

  // Track geofence data
  const [geofence, setGeofence] = useState<GeofencePolygon | undefined>(
    initialValues.geofence
  );

  const handleDayOpenChange = (day: keyof typeof dayOpenStatus, isOpen: boolean) => {
    setDayOpenStatus(prev => ({ ...prev, [day]: isOpen }));
  };

  const handleDeliverySettingsChange = (newSettings: DeliverySettings) => {
    setDeliverySettings(newSettings);
  };

  const handleGeofenceChange = (newGeofence: GeofencePolygon) => {
    setGeofence(newGeofence);
  };

  const handleFinish = (values: any) => {
    // Process opening hours
    const openingHours: OpeningHours = {
      monday: {
        isOpen: dayOpenStatus.monday,
        open: formatTimeForSubmit(values.mondayOpen),
        close: formatTimeForSubmit(values.mondayClose)
      },
      tuesday: {
        isOpen: dayOpenStatus.tuesday,
        open: formatTimeForSubmit(values.tuesdayOpen),
        close: formatTimeForSubmit(values.tuesdayClose)
      },
      wednesday: {
        isOpen: dayOpenStatus.wednesday,
        open: formatTimeForSubmit(values.wednesdayOpen),
        close: formatTimeForSubmit(values.wednesdayClose)
      },
      thursday: {
        isOpen: dayOpenStatus.thursday,
        open: formatTimeForSubmit(values.thursdayOpen),
        close: formatTimeForSubmit(values.thursdayClose)
      },
      friday: {
        isOpen: dayOpenStatus.friday,
        open: formatTimeForSubmit(values.fridayOpen),
        close: formatTimeForSubmit(values.fridayClose)
      },
      saturday: {
        isOpen: dayOpenStatus.saturday,
        open: formatTimeForSubmit(values.saturdayOpen),
        close: formatTimeForSubmit(values.saturdayClose)
      },
      sunday: {
        isOpen: dayOpenStatus.sunday,
        open: formatTimeForSubmit(values.sundayOpen),
        close: formatTimeForSubmit(values.sundayClose)
      }
    };

    // Prepare form data
    const formData: StoreAddressFormData = {
      name: values.name,
      street: values.street,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
      phone: values.phone,
      email: values.email,
      latitude: values.latitude ? parseFloat(values.latitude) : undefined,
      longitude: values.longitude ? parseFloat(values.longitude) : undefined,
      openingHours,
      isActive: values.isActive,
      allowsPickup: values.allowsPickup,
      pickupInstructions: values.pickupInstructions,
      deliverySettings: deliverySettings,
      geofence: geofence
    };

    onSubmit(formData);
  };

  // Prepare initial values for the form
  const formInitialValues = {
    name: initialValues.name || '',
    street: initialValues.street || '',
    city: initialValues.city || '',
    state: initialValues.state || '',
    postalCode: initialValues.postalCode || '',
    country: initialValues.country || 'Nigeria',
    phone: initialValues.phone || '',
    email: initialValues.email || '',
    latitude: initialValues.latitude?.toString() || '',
    longitude: initialValues.longitude?.toString() || '',
    isActive: initialValues.isActive !== undefined ? initialValues.isActive : true,
    allowsPickup: initialValues.allowsPickup !== undefined ? initialValues.allowsPickup : true,
    pickupInstructions: initialValues.pickupInstructions || '',
    
    // Opening hours
    mondayOpen: formatTimeForForm(initialValues.openingHours?.monday.open),
    mondayClose: formatTimeForForm(initialValues.openingHours?.monday.close),
    tuesdayOpen: formatTimeForForm(initialValues.openingHours?.tuesday.open),
    tuesdayClose: formatTimeForForm(initialValues.openingHours?.tuesday.close),
    wednesdayOpen: formatTimeForForm(initialValues.openingHours?.wednesday.open),
    wednesdayClose: formatTimeForForm(initialValues.openingHours?.wednesday.close),
    thursdayOpen: formatTimeForForm(initialValues.openingHours?.thursday.open),
    thursdayClose: formatTimeForForm(initialValues.openingHours?.thursday.close),
    fridayOpen: formatTimeForForm(initialValues.openingHours?.friday.open),
    fridayClose: formatTimeForForm(initialValues.openingHours?.friday.close),
    saturdayOpen: formatTimeForForm(initialValues.openingHours?.saturday.open),
    saturdayClose: formatTimeForForm(initialValues.openingHours?.saturday.close),
    sundayOpen: formatTimeForForm(initialValues.openingHours?.sunday.open),
    sundayClose: formatTimeForForm(initialValues.openingHours?.sunday.close),
  };

  return (
    <FormContainer>
      <Form
        form={form}
        layout="vertical"
        initialValues={formInitialValues}
        onFinish={handleFinish}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Basic Information" key="basic">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Store Name"
                  rules={[{ required: true, message: 'Please enter store name' }]}
                >
                  <Input placeholder="Enter store name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="street"
                  label="Street Address"
                  rules={[{ required: true, message: 'Please enter street address' }]}
                >
                  <Input placeholder="Enter street address" prefix={<EnvironmentOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true, message: 'Please enter city' }]}
                >
                  <Input placeholder="Enter city" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true, message: 'Please enter state' }]}
                >
                  <Input placeholder="Enter state" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="postalCode"
                  label="Postal Code"
                  rules={[{ required: true, message: 'Please enter postal code' }]}
                >
                  <Input placeholder="Enter postal code" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="country"
                  label="Country"
                  rules={[{ required: true, message: 'Please enter country' }]}
                >
                  <Input placeholder="Enter country" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="Enter phone number" prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input placeholder="Enter email address (optional)" prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <StyledDivider />

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="latitude"
                  label="Latitude"
                  rules={[
                    { pattern: /^-?([0-8]?[0-9]|90)(\.[0-9]{1,6})?$/, message: 'Please enter a valid latitude' }
                  ]}
                >
                  <Input placeholder="Enter latitude (optional)" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="longitude"
                  label="Longitude"
                  rules={[
                    { pattern: /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,6})?$/, message: 'Please enter a valid longitude' }
                  ]}
                >
                  <Input placeholder="Enter longitude (optional)" />
                </Form.Item>
              </Col>
            </Row>

            <StyledDivider />

            <Row gutter={16}>
              <Col span={12}>
                <SwitchContainer>
                  <Form.Item name="isActive" valuePropName="checked" noStyle>
                    <Switch />
                  </Form.Item>
                  <SwitchLabel>Store Active</SwitchLabel>
                </SwitchContainer>
              </Col>
              <Col span={12}>
                <SwitchContainer>
                  <Form.Item name="allowsPickup" valuePropName="checked" noStyle>
                    <Switch />
                  </Form.Item>
                  <SwitchLabel>Allow In-Store Pickup</SwitchLabel>
                </SwitchContainer>
              </Col>
            </Row>

            <Form.Item
              name="pickupInstructions"
              label="Pickup Instructions"
            >
              <TextArea 
                placeholder="Enter instructions for customers picking up orders (optional)" 
                rows={4}
              />
            </Form.Item>
          </TabPane>

          <TabPane tab="Hours & Pickup" key="hours" icon={<ClockCircleOutlined />}>
            <p style={{ marginBottom: '20px' }}>Set the opening and closing hours for each day of the week.</p>

            <DayRow gutter={16}>
              <Col span={6}>
                <DayLabel>Monday</DayLabel>
              </Col>
              <Col span={6}>
                <Switch 
                  checked={dayOpenStatus.monday} 
                  onChange={(checked) => handleDayOpenChange('monday', checked)} 
                />
                <SwitchLabel>{dayOpenStatus.monday ? 'Open' : 'Closed'}</SwitchLabel>
              </Col>
              {dayOpenStatus.monday && (
                <>
                  <Col span={6}>
                    <Form.Item name="mondayOpen" noStyle>
                      <TimePicker format="HH:mm" placeholder="Open" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="mondayClose" noStyle>
                      <TimePicker format="HH:mm" placeholder="Close" />
                    </Form.Item>
                  </Col>
                </>
              )}
            </DayRow>

            <DayRow gutter={16}>
              <Col span={6}>
                <DayLabel>Tuesday</DayLabel>
              </Col>
              <Col span={6}>
                <Switch 
                  checked={dayOpenStatus.tuesday} 
                  onChange={(checked) => handleDayOpenChange('tuesday', checked)} 
                />
                <SwitchLabel>{dayOpenStatus.tuesday ? 'Open' : 'Closed'}</SwitchLabel>
              </Col>
              {dayOpenStatus.tuesday && (
                <>
                  <Col span={6}>
                    <Form.Item name="tuesdayOpen" noStyle>
                      <TimePicker format="HH:mm" placeholder="Open" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="tuesdayClose" noStyle>
                      <TimePicker format="HH:mm" placeholder="Close" />
                    </Form.Item>
                  </Col>
                </>
              )}
            </DayRow>

            <DayRow gutter={16}>
              <Col span={6}>
                <DayLabel>Wednesday</DayLabel>
              </Col>
              <Col span={6}>
                <Switch 
                  checked={dayOpenStatus.wednesday} 
                  onChange={(checked) => handleDayOpenChange('wednesday', checked)} 
                />
                <SwitchLabel>{dayOpenStatus.wednesday ? 'Open' : 'Closed'}</SwitchLabel>
              </Col>
              {dayOpenStatus.wednesday && (
                <>
                  <Col span={6}>
                    <Form.Item name="wednesdayOpen" noStyle>
                      <TimePicker format="HH:mm" placeholder="Open" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="wednesdayClose" noStyle>
                      <TimePicker format="HH:mm" placeholder="Close" />
                    </Form.Item>
                  </Col>
                </>
              )}
            </DayRow>

            <DayRow gutter={16}>
              <Col span={6}>
                <DayLabel>Thursday</DayLabel>
              </Col>
              <Col span={6}>
                <Switch 
                  checked={dayOpenStatus.thursday} 
                  onChange={(checked) => handleDayOpenChange('thursday', checked)} 
                />
                <SwitchLabel>{dayOpenStatus.thursday ? 'Open' : 'Closed'}</SwitchLabel>
              </Col>
              {dayOpenStatus.thursday && (
                <>
                  <Col span={6}>
                    <Form.Item name="thursdayOpen" noStyle>
                      <TimePicker format="HH:mm" placeholder="Open" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="thursdayClose" noStyle>
                      <TimePicker format="HH:mm" placeholder="Close" />
                    </Form.Item>
                  </Col>
                </>
              )}
            </DayRow>

            <DayRow gutter={16}>
              <Col span={6}>
                <DayLabel>Friday</DayLabel>
              </Col>
              <Col span={6}>
                <Switch 
                  checked={dayOpenStatus.friday} 
                  onChange={(checked) => handleDayOpenChange('friday', checked)} 
                />
                <SwitchLabel>{dayOpenStatus.friday ? 'Open' : 'Closed'}</SwitchLabel>
              </Col>
              {dayOpenStatus.friday && (
                <>
                  <Col span={6}>
                    <Form.Item name="fridayOpen" noStyle>
                      <TimePicker format="HH:mm" placeholder="Open" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="fridayClose" noStyle>
                      <TimePicker format="HH:mm" placeholder="Close" />
                    </Form.Item>
                  </Col>
                </>
              )}
            </DayRow>

            <DayRow gutter={16}>
              <Col span={6}>
                <DayLabel>Saturday</DayLabel>
              </Col>
              <Col span={6}>
                <Switch 
                  checked={dayOpenStatus.saturday} 
                  onChange={(checked) => handleDayOpenChange('saturday', checked)} 
                />
                <SwitchLabel>{dayOpenStatus.saturday ? 'Open' : 'Closed'}</SwitchLabel>
              </Col>
              {dayOpenStatus.saturday && (
                <>
                  <Col span={6}>
                    <Form.Item name="saturdayOpen" noStyle>
                      <TimePicker format="HH:mm" placeholder="Open" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="saturdayClose" noStyle>
                      <TimePicker format="HH:mm" placeholder="Close" />
                    </Form.Item>
                  </Col>
                </>
              )}
            </DayRow>

            <DayRow gutter={16}>
              <Col span={6}>
                <DayLabel>Sunday</DayLabel>
              </Col>
              <Col span={6}>
                <Switch 
                  checked={dayOpenStatus.sunday} 
                  onChange={(checked) => handleDayOpenChange('sunday', checked)} 
                />
                <SwitchLabel>{dayOpenStatus.sunday ? 'Open' : 'Closed'}</SwitchLabel>
              </Col>
              {dayOpenStatus.sunday && (
                <>
                  <Col span={6}>
                    <Form.Item name="sundayOpen" noStyle>
                      <TimePicker format="HH:mm" placeholder="Open" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="sundayClose" noStyle>
                      <TimePicker format="HH:mm" placeholder="Close" />
                    </Form.Item>
                  </Col>
                </>
              )}
            </DayRow>
          </TabPane>

          <TabPane tab={<span><DollarOutlined /> Delivery Settings</span>} key="delivery">
            <DeliverySettingsForm
              initialValues={deliverySettings}
              onChange={handleDeliverySettingsChange}
            />
          </TabPane>

          <TabPane tab={<span><CompassOutlined /> Delivery Area</span>} key="geofence">
            {(initialValues.latitude && initialValues.longitude) ? (
              <GeofenceMapEditor
                storeLatitude={parseFloat(initialValues.latitude.toString())}
                storeLongitude={parseFloat(initialValues.longitude.toString())}
                initialGeofence={geofence}
                onChange={handleGeofenceChange}
              />
            ) : (
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Latitude and Longitude Required</h3>
                <p className="text-yellow-700">
                  Please enter the store's latitude and longitude in the Basic Information tab before setting up the delivery area.
                </p>
              </div>
            )}
          </TabPane>
        </Tabs>
        
        <ButtonsContainer>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {initialValues.name ? 'Update Store' : 'Add Store'}
          </Button>
        </ButtonsContainer>
      </Form>
    </FormContainer>
  );
};

export default StoreAddressForm;
