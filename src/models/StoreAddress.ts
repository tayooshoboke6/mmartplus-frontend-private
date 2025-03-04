export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface GeofencePolygon {
  coordinates: GeoCoordinate[];
}

export interface OrderValueAdjustment {
  orderValueThreshold: number; // Order value threshold in cents
  adjustmentType: 'percentage' | 'fixed';
  adjustmentValue: number; // Percentage (0-100) or fixed amount in cents
}

export interface DeliverySettings {
  baseFee: number; // Base delivery fee in cents
  perKmCharge: number; // Additional fee per km in cents
  orderValueAdjustments: OrderValueAdjustment[]; // Adjustments based on order value
  maxDeliveryDistanceKm: number; // Maximum allowable delivery distance outside geofence in km
  outsideGeofenceFee: number; // Additional fee for delivery outside geofence in cents
  enableDelivery: boolean; // Whether this store offers delivery
}

export interface DayHours {
  isOpen: boolean;
  open: string; // Format: "HH:MM"
  close: string; // Format: "HH:MM"
}

export interface OpeningHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export const defaultOpeningHours: OpeningHours = {
  monday: { isOpen: true, open: '09:00', close: '18:00' },
  tuesday: { isOpen: true, open: '09:00', close: '18:00' },
  wednesday: { isOpen: true, open: '09:00', close: '18:00' },
  thursday: { isOpen: true, open: '09:00', close: '18:00' },
  friday: { isOpen: true, open: '09:00', close: '18:00' },
  saturday: { isOpen: true, open: '10:00', close: '17:00' },
  sunday: { isOpen: false, open: '10:00', close: '17:00' }
};

export const defaultDeliverySettings: DeliverySettings = {
  baseFee: 500, // $5.00
  perKmCharge: 100, // $1.00 per km
  orderValueAdjustments: [
    {
      orderValueThreshold: 5000, // $50.00
      adjustmentType: 'percentage',
      adjustmentValue: 50 // 50% off delivery fee
    },
    {
      orderValueThreshold: 10000, // $100.00
      adjustmentType: 'fixed',
      adjustmentValue: 0 // Free delivery
    }
  ],
  maxDeliveryDistanceKm: 10, // 10km maximum delivery distance
  outsideGeofenceFee: 300, // $3.00 additional fee outside geofence
  enableDelivery: true
};

export interface StoreAddress {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  openingHours?: OpeningHours;
  isActive: boolean;
  allowsPickup: boolean;
  pickupInstructions?: string;
  deliverySettings: DeliverySettings;
  geofence?: GeofencePolygon;
  createdAt: string;
  updatedAt: string;
}

export interface StoreAddressFormData {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  latitude?: number;
  longitude?: number;
  openingHours?: OpeningHours;
  isActive: boolean;
  allowsPickup: boolean;
  pickupInstructions?: string;
  deliverySettings: DeliverySettings;
  geofence?: GeofencePolygon;
}
