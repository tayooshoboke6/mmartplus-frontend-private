import { StoreAddress, StoreAddressFormData, defaultOpeningHours, defaultDeliverySettings } from '../models/StoreAddress';
import { v4 as uuidv4 } from 'uuid';

// Mock store addresses data
const mockStoreAddresses: StoreAddress[] = [
  {
    id: '1',
    name: 'M-Mart Headquarters',
    street: '123 Main Street',
    city: 'Lagos',
    state: 'Lagos',
    postalCode: '100001',
    country: 'Nigeria',
    phone: '+234 123 456 7890',
    email: 'lagos@mmart.com',
    latitude: 6.5244,
    longitude: 3.3792,
    openingHours: defaultOpeningHours,
    deliverySettings: defaultDeliverySettings,
    geofence: {
      coordinates: [
        { lat: 6.5244, lng: 3.3792 },
        { lat: 6.5244, lng: 3.3892 },
        { lat: 6.5144, lng: 3.3892 },
        { lat: 6.5144, lng: 3.3792 }
      ]
    },
    isActive: true,
    allowsPickup: true,
    pickupInstructions: 'Please come to the customer service desk with your order number and ID.',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'M-Mart Abuja Branch',
    street: '456 Central Avenue',
    city: 'Abuja',
    state: 'FCT',
    postalCode: '900001',
    country: 'Nigeria',
    phone: '+234 987 654 3210',
    email: 'abuja@mmart.com',
    latitude: 9.0765,
    longitude: 7.3986,
    openingHours: {
      ...defaultOpeningHours,
      sunday: { isOpen: true, open: "12:00", close: "16:00" }
    },
    deliverySettings: {
      ...defaultDeliverySettings,
      baseFee: 400, // $4.00 base fee for Abuja branch
      maxDeliveryDistanceKm: 8, // 8km max delivery distance
    },
    geofence: {
      coordinates: [
        { lat: 9.0765, lng: 7.3986 },
        { lat: 9.0765, lng: 7.4086 },
        { lat: 9.0665, lng: 7.4086 },
        { lat: 9.0665, lng: 7.3986 }
      ]
    },
    isActive: true,
    allowsPickup: true,
    pickupInstructions: 'Please visit our pickup counter on the ground floor.',
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'M-Mart Port Harcourt',
    street: '789 Riverside Road',
    city: 'Port Harcourt',
    state: 'Rivers',
    postalCode: '500001',
    country: 'Nigeria',
    phone: '+234 555 123 4567',
    email: 'ph@mmart.com',
    latitude: 4.8156,
    longitude: 7.0498,
    openingHours: defaultOpeningHours,
    deliverySettings: defaultDeliverySettings,
    geofence: {
      coordinates: [
        { lat: 4.8156, lng: 7.0498 },
        { lat: 4.8156, lng: 7.0598 },
        { lat: 4.8056, lng: 7.0598 },
        { lat: 4.8056, lng: 7.0498 }
      ]
    },
    isActive: false,
    allowsPickup: false,
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-03-01T00:00:00Z'
  }
];

// In a real application, these functions would make API calls to a backend server
export const StoreAddressService = {
  // Get all store addresses
  getStoreAddresses: async (): Promise<StoreAddress[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockStoreAddresses]);
      }, 500);
    });
  },

  // Get active store addresses
  getActiveStoreAddresses: async (): Promise<StoreAddress[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockStoreAddresses.filter(address => address.isActive));
      }, 500);
    });
  },

  // Get pickup-enabled store addresses
  getPickupStoreAddresses: async (): Promise<StoreAddress[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockStoreAddresses.filter(address => address.isActive && address.allowsPickup));
      }, 500);
    });
  },

  // Get store addresses that offer delivery
  getDeliveryStoreAddresses: async (): Promise<StoreAddress[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockStoreAddresses.filter(
          address => address.isActive && address.deliverySettings.enableDelivery
        ));
      }, 500);
    });
  },

  // Get store address by ID
  getStoreAddressById: async (id: string): Promise<StoreAddress | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const address = mockStoreAddresses.find(a => a.id === id);
        resolve(address || null);
      }, 300);
    });
  },

  // Create a new store address
  createStoreAddress: async (addressData: StoreAddressFormData): Promise<StoreAddress> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAddress: StoreAddress = {
          id: uuidv4(),
          ...addressData,
          deliverySettings: addressData.deliverySettings || {...defaultDeliverySettings},
          geofence: addressData.geofence || { coordinates: [] },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        mockStoreAddresses.push(newAddress);
        resolve(newAddress);
      }, 700);
    });
  },

  // Update an existing store address
  updateStoreAddress: async (id: string, addressData: StoreAddressFormData): Promise<StoreAddress> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockStoreAddresses.findIndex(a => a.id === id);
        if (index === -1) {
          reject(new Error('Store address not found'));
          return;
        }
        
        const updatedAddress: StoreAddress = {
          ...mockStoreAddresses[index],
          ...addressData,
          deliverySettings: addressData.deliverySettings || mockStoreAddresses[index].deliverySettings,
          geofence: addressData.geofence || mockStoreAddresses[index].geofence,
          updatedAt: new Date().toISOString()
        };
        
        mockStoreAddresses[index] = updatedAddress;
        resolve(updatedAddress);
      }, 700);
    });
  },

  // Delete a store address
  deleteStoreAddress: async (id: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockStoreAddresses.findIndex(a => a.id === id);
        if (index === -1) {
          reject(new Error('Store address not found'));
          return;
        }
        
        mockStoreAddresses.splice(index, 1);
        resolve(true);
      }, 500);
    });
  },

  // Toggle store address active status
  toggleStoreAddressStatus: async (id: string): Promise<StoreAddress> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockStoreAddresses.findIndex(a => a.id === id);
        if (index === -1) {
          reject(new Error('Store address not found'));
          return;
        }
        
        const updatedAddress = {
          ...mockStoreAddresses[index],
          isActive: !mockStoreAddresses[index].isActive,
          updatedAt: new Date().toISOString()
        };
        
        mockStoreAddresses[index] = updatedAddress;
        resolve(updatedAddress);
      }, 300);
    });
  },

  // Toggle store address pickup status
  toggleStoreAddressPickup: async (id: string): Promise<StoreAddress> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockStoreAddresses.findIndex(a => a.id === id);
        if (index === -1) {
          reject(new Error('Store address not found'));
          return;
        }
        
        const updatedAddress = {
          ...mockStoreAddresses[index],
          allowsPickup: !mockStoreAddresses[index].allowsPickup,
          updatedAt: new Date().toISOString()
        };
        
        mockStoreAddresses[index] = updatedAddress;
        resolve(updatedAddress);
      }, 300);
    });
  },

  // Toggle store address delivery status
  toggleStoreAddressDelivery: async (id: string): Promise<StoreAddress> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockStoreAddresses.findIndex(a => a.id === id);
        if (index === -1) {
          reject(new Error('Store address not found'));
          return;
        }
        
        const updatedAddress = {
          ...mockStoreAddresses[index],
          deliverySettings: {
            ...mockStoreAddresses[index].deliverySettings,
            enableDelivery: !mockStoreAddresses[index].deliverySettings.enableDelivery
          },
          updatedAt: new Date().toISOString()
        };
        
        mockStoreAddresses[index] = updatedAddress;
        resolve(updatedAddress);
      }, 300);
    });
  },

  // Calculate delivery fee based on store settings and distance
  calculateDeliveryFee(
    storeAddress: StoreAddress, 
    orderValue: number, 
    customerLat: number, 
    customerLng: number
  ): { 
    fee: number, 
    isDeliveryAvailable: boolean, 
    message?: string 
  } {
    // Check if delivery is enabled for this store
    if (!storeAddress.isActive || !storeAddress.deliverySettings.enableDelivery) {
      return { fee: 0, isDeliveryAvailable: false, message: 'Delivery is not available from this store.' };
    }

    // Calculate distance in kilometers using Haversine formula
    const distanceKm = this.calculateDistance(
      storeAddress.latitude, 
      storeAddress.longitude, 
      customerLat, 
      customerLng
    );

    // Check if address is within geofence (if geofence exists)
    let isWithinGeofence = true;
    if (storeAddress.geofence && storeAddress.geofence.coordinates.length > 2) {
      isWithinGeofence = this.isPointInPolygon(
        { lat: customerLat, lng: customerLng }, 
        storeAddress.geofence.coordinates
      );
    }

    // If outside geofence, check if within maximum allowed distance
    if (!isWithinGeofence) {
      // Calculate distance to nearest point on geofence
      let distanceToGeofence = 0;
      if (storeAddress.geofence) {
        // For simplicity, we just use the direct distance minus an estimate
        // In a real implementation, we would calculate actual distance to geofence
        distanceToGeofence = distanceKm - 1; // Crude approximation
        if (distanceToGeofence < 0) distanceToGeofence = 0;
      } else {
        distanceToGeofence = distanceKm;
      }

      // Check if beyond maximum delivery distance
      if (distanceToGeofence > storeAddress.deliverySettings.maxDeliveryDistanceKm) {
        return { 
          fee: 0, 
          isDeliveryAvailable: false, 
          message: `This address is outside our delivery area. Maximum delivery distance is ${storeAddress.deliverySettings.maxDeliveryDistanceKm}km.` 
        };
      }
    }

    // Calculate base delivery fee
    let fee = storeAddress.deliverySettings.baseFee;

    // Add distance-based fee
    fee += Math.round(distanceKm * storeAddress.deliverySettings.perKmCharge);

    // Add outside geofence fee if applicable
    if (!isWithinGeofence) {
      fee += storeAddress.deliverySettings.outsideGeofenceFee;
    }

    // Apply order value adjustments (sorted by threshold descending to apply best discount)
    const adjustments = [...storeAddress.deliverySettings.orderValueAdjustments]
      .sort((a, b) => b.orderValueThreshold - a.orderValueThreshold);
    
    for (const adjustment of adjustments) {
      if (orderValue >= adjustment.orderValueThreshold) {
        if (adjustment.adjustmentType === 'fixed') {
          fee = adjustment.adjustmentValue;
        } else { // percentage
          fee = Math.round(fee * (1 - adjustment.adjustmentValue / 100));
        }
        break; // Apply only the first applicable adjustment
      }
    }

    // Ensure fee is never negative
    if (fee < 0) fee = 0;

    return {
      fee,
      isDeliveryAvailable: true,
      message: isWithinGeofence ? undefined : 'Additional fee applied for delivery outside our standard delivery area.'
    };
  },

  // Helper function to calculate distance between two points using Haversine formula
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  },

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  },

  // Check if a point is inside a polygon using ray casting algorithm
  isPointInPolygon(point: { lat: number, lng: number }, polygon: { lat: number, lng: number }[]): boolean {
    // Ray casting algorithm
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const intersect = (
        (polygon[i].lng > point.lng) !== (polygon[j].lng > point.lng)
      ) && (
        point.lat < (polygon[j].lat - polygon[i].lat) * (point.lng - polygon[i].lng) / (polygon[j].lng - polygon[i].lng) + polygon[i].lat
      );
      
      if (intersect) inside = !inside;
    }
    
    return inside;
  },

  // Get coordinates from address (mock implementation)
  getCoordinatesFromAddress: async (address: string): Promise<{ lat: number, lng: number } | null> => {
    // In a real app, this would make a call to a geocoding API like Google Maps Geocoding API
    // Here we're just simulating with mock coordinates near Lagos
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate random coordinates in Nigeria (near Lagos)
        const mockLat = 6.5244 + (Math.random() * 0.1 - 0.05);
        const mockLng = 3.3792 + (Math.random() * 0.1 - 0.05);
        
        resolve({ lat: mockLat, lng: mockLng });
      }, 500);
    });
  }
};

export default StoreAddressService;
