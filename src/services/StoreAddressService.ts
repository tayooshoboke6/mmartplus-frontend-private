import { 
  StoreAddress, 
  GeofencePolygon, 
  DeliverySettings, 
  GeoCoordinate,
  OpeningHours
} from '../models/StoreAddress';

// Response interfaces
export interface StoreAddressResponse {
  status: string;
  message?: string;
  data: StoreAddress;
}

export interface StoreAddressesResponse {
  status: string;
  data: StoreAddress[];
}

// Mock store addresses data
const MOCK_STORE_ADDRESSES: StoreAddress[] = [
  {
    id: "1",
    name: 'M-Mart Ikeja',
    street: '10 Allen Avenue',
    city: 'Ikeja',
    state: 'Lagos',
    postalCode: '100001',
    country: 'Nigeria',
    phone: '+2341234567890',
    email: 'ikeja@mmart.com',
    openingHours: {
      monday: { isOpen: true, open: '08:00', close: '20:00' },
      tuesday: { isOpen: true, open: '08:00', close: '20:00' },
      wednesday: { isOpen: true, open: '08:00', close: '20:00' },
      thursday: { isOpen: true, open: '08:00', close: '20:00' },
      friday: { isOpen: true, open: '08:00', close: '20:00' },
      saturday: { isOpen: true, open: '09:00', close: '18:00' },
      sunday: { isOpen: true, open: '10:00', close: '16:00' }
    },
    pickupInstructions: 'Please come to the customer service desk with your order number and ID',
    allowsPickup: true,
    isActive: true,
    latitude: 6.6018,
    longitude: 3.3515,
    geofence: {
      type: 'Polygon',
      coordinates: [[[3.3415, 6.5918], [3.3415, 6.6118], [3.3615, 6.6118], [3.3615, 6.5918], [3.3415, 6.5918]]]
    },
    deliverySettings: {
      baseFee: 1500,
      perKmCharge: 100,
      maxDeliveryDistanceKm: 10,
      outsideGeofenceFee: 500,
      enableDelivery: true,
      orderValueAdjustments: [
        {
          orderValueThreshold: 5000,
          adjustmentType: 'percentage',
          adjustmentValue: 50
        },
        {
          orderValueThreshold: 15000,
          adjustmentType: 'fixed',
          adjustmentValue: 0
        }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: 'M-Mart Lekki',
    street: '15 Admiralty Way',
    city: 'Lekki',
    state: 'Lagos',
    postalCode: '101001',
    country: 'Nigeria',
    phone: '+2349876543210',
    email: 'lekki@mmart.com',
    openingHours: {
      monday: { isOpen: true, open: '08:00', close: '20:00' },
      tuesday: { isOpen: true, open: '08:00', close: '20:00' },
      wednesday: { isOpen: true, open: '08:00', close: '20:00' },
      thursday: { isOpen: true, open: '08:00', close: '20:00' },
      friday: { isOpen: true, open: '08:00', close: '20:00' },
      saturday: { isOpen: true, open: '09:00', close: '18:00' },
      sunday: { isOpen: true, open: '10:00', close: '16:00' }
    },
    pickupInstructions: 'Please park in the designated pickup area and call our store number',
    allowsPickup: true,
    isActive: true,
    latitude: 6.4281,
    longitude: 3.4219,
    geofence: {
      type: 'Polygon',
      coordinates: [[[3.4119, 6.4181], [3.4119, 6.4381], [3.4319, 6.4381], [3.4319, 6.4181], [3.4119, 6.4181]]]
    },
    deliverySettings: {
      baseFee: 1500,
      perKmCharge: 100,
      maxDeliveryDistanceKm: 10,
      outsideGeofenceFee: 500,
      enableDelivery: true,
      orderValueAdjustments: [
        {
          orderValueThreshold: 5000,
          adjustmentType: 'percentage',
          adjustmentValue: 50
        },
        {
          orderValueThreshold: 15000,
          adjustmentType: 'fixed',
          adjustmentValue: 0
        }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: 'M-Mart Victoria Island',
    street: '25 Adeola Odeku Street',
    city: 'Victoria Island',
    state: 'Lagos',
    postalCode: '101001',
    country: 'Nigeria',
    phone: '+2348765432109',
    email: 'vi@mmart.com',
    openingHours: {
      monday: { isOpen: true, open: '08:00', close: '21:00' },
      tuesday: { isOpen: true, open: '08:00', close: '21:00' },
      wednesday: { isOpen: true, open: '08:00', close: '21:00' },
      thursday: { isOpen: true, open: '08:00', close: '21:00' },
      friday: { isOpen: true, open: '08:00', close: '21:00' },
      saturday: { isOpen: true, open: '09:00', close: '21:00' },
      sunday: { isOpen: true, open: '10:00', close: '18:00' }
    },
    pickupInstructions: 'Please use the dedicated pickup counter on the ground floor',
    allowsPickup: true,
    isActive: true,
    latitude: 6.4305,
    longitude: 3.4219,
    geofence: {
      type: 'Polygon',
      coordinates: [[[3.4119, 6.4205], [3.4119, 6.4405], [3.4319, 6.4405], [3.4319, 6.4205], [3.4119, 6.4205]]]
    },
    deliverySettings: {
      baseFee: 1500,
      perKmCharge: 100,
      maxDeliveryDistanceKm: 10,
      outsideGeofenceFee: 500,
      enableDelivery: true,
      orderValueAdjustments: [
        {
          orderValueThreshold: 5000,
          adjustmentType: 'percentage',
          adjustmentValue: 50
        },
        {
          orderValueThreshold: 15000,
          adjustmentType: 'fixed',
          adjustmentValue: 0
        }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Store address service with mock data
const StoreAddressService = {
  // Get all store addresses
  getStoreAddresses: async (): Promise<StoreAddress[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve([...MOCK_STORE_ADDRESSES]);
      }, 500);
    });
  },

  // Get only active store addresses
  getActiveStoreAddresses: async (): Promise<StoreAddress[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const activeStores = MOCK_STORE_ADDRESSES.filter(store => store.isActive);
        resolve(activeStores);
      }, 500);
    });
  },

  // Get store addresses that allow pickup
  getPickupStoreAddresses: async (): Promise<StoreAddress[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const pickupStores = MOCK_STORE_ADDRESSES.filter(
          store => store.isActive && store.allowsPickup
        );
        resolve(pickupStores);
      }, 500);
    });
  },

  // Get store addresses that provide delivery to specific coordinates
  getDeliveryStoreAddresses: async (coordinates: GeoCoordinate): Promise<StoreAddress[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Mock implementation - return stores that offer delivery and are active
        const deliveryStores = MOCK_STORE_ADDRESSES.filter(
          store => store.isActive && store.deliverySettings.enableDelivery
        );
        
        // In a real implementation, we would check if the coordinates are within each store's delivery zone
        // For mock purposes, we'll return all delivery-enabled stores
        resolve(deliveryStores);
      }, 700);
    });
  },

  // Get store address by ID
  getStoreAddressById: async (id: string): Promise<StoreAddress | null> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const store = MOCK_STORE_ADDRESSES.find(store => store.id === id) || null;
        resolve(store);
      }, 300);
    });
  },

  // Create a new store address
  createStoreAddress: async (addressData: any): Promise<StoreAddress> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Create a new store with a unique ID
        const newId = (Math.max(...MOCK_STORE_ADDRESSES.map(store => parseInt(store.id))) + 1).toString();
        
        // Create the new store with default values for any missing fields
        const newStore: StoreAddress = {
          id: newId,
          name: addressData.name || 'New Store',
          street: addressData.street || '',
          city: addressData.city || '',
          state: addressData.state || '',
          postalCode: addressData.postalCode || '',
          country: addressData.country || '',
          phone: addressData.phone || '',
          email: addressData.email || '',
          latitude: addressData.latitude || 0,
          longitude: addressData.longitude || 0,
          openingHours: addressData.openingHours || {
            monday: { isOpen: true, open: '09:00', close: '18:00' },
            tuesday: { isOpen: true, open: '09:00', close: '18:00' },
            wednesday: { isOpen: true, open: '09:00', close: '18:00' },
            thursday: { isOpen: true, open: '09:00', close: '18:00' },
            friday: { isOpen: true, open: '09:00', close: '18:00' },
            saturday: { isOpen: true, open: '10:00', close: '17:00' },
            sunday: { isOpen: false, open: '10:00', close: '17:00' }
          },
          isActive: addressData.isActive !== undefined ? addressData.isActive : true,
          allowsPickup: addressData.allowsPickup !== undefined ? addressData.allowsPickup : true,
          pickupInstructions: addressData.pickupInstructions || 'Please come to the customer service desk with your order number and ID',
          deliverySettings: addressData.deliverySettings || {
            baseFee: 1500,
            perKmCharge: 100,
            maxDeliveryDistanceKm: 10,
            outsideGeofenceFee: 500,
            enableDelivery: true,
            orderValueAdjustments: [
              {
                orderValueThreshold: 5000,
                adjustmentType: 'percentage',
                adjustmentValue: 50
              },
              {
                orderValueThreshold: 15000,
                adjustmentType: 'fixed',
                adjustmentValue: 0
              }
            ]
          },
          geofence: addressData.geofence || {
            type: 'Polygon',
            coordinates: [[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]]
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Add to mock data
        MOCK_STORE_ADDRESSES.push(newStore);
        
        resolve(newStore);
      }, 700);
    });
  },

  // Update an existing store address
  updateStoreAddress: async (id: string, addressData: any): Promise<StoreAddress> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // Find the store to update
        const storeIndex = MOCK_STORE_ADDRESSES.findIndex(store => store.id === id);
        
        if (storeIndex === -1) {
          reject(new Error(`Store with ID ${id} not found`));
          return;
        }
        
        // Update the store with the new data
        const updatedStore = {
          ...MOCK_STORE_ADDRESSES[storeIndex],
          ...addressData,
          updatedAt: new Date().toISOString()
        };
        
        // Replace the old store in the mock data
        MOCK_STORE_ADDRESSES[storeIndex] = updatedStore;
        
        resolve(updatedStore);
      }, 700);
    });
  },

  // Delete a store address
  deleteStoreAddress: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // Find the store to delete
        const storeIndex = MOCK_STORE_ADDRESSES.findIndex(store => store.id === id);
        
        if (storeIndex === -1) {
          reject(new Error(`Store with ID ${id} not found`));
          return;
        }
        
        // Remove the store from the mock data
        MOCK_STORE_ADDRESSES.splice(storeIndex, 1);
        
        resolve();
      }, 500);
    });
  },

  // Toggle a store address active status
  toggleStoreAddressStatus: async (id: string): Promise<StoreAddress> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // Find the store to update
        const storeIndex = MOCK_STORE_ADDRESSES.findIndex(store => store.id === id);
        
        if (storeIndex === -1) {
          reject(new Error(`Store with ID ${id} not found`));
          return;
        }
        
        // Toggle the active status
        const updatedStore = {
          ...MOCK_STORE_ADDRESSES[storeIndex],
          isActive: !MOCK_STORE_ADDRESSES[storeIndex].isActive,
          updatedAt: new Date().toISOString()
        };
        
        // Replace the old store in the mock data
        MOCK_STORE_ADDRESSES[storeIndex] = updatedStore;
        
        resolve(updatedStore);
      }, 500);
    });
  },

  // Toggle pickup availability for a store address
  togglePickupAvailability: async (id: string): Promise<StoreAddress> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // Find the store to update
        const storeIndex = MOCK_STORE_ADDRESSES.findIndex(store => store.id === id);
        
        if (storeIndex === -1) {
          reject(new Error(`Store with ID ${id} not found`));
          return;
        }
        
        // Toggle the pickup availability
        const updatedStore = {
          ...MOCK_STORE_ADDRESSES[storeIndex],
          allowsPickup: !MOCK_STORE_ADDRESSES[storeIndex].allowsPickup,
          updatedAt: new Date().toISOString()
        };
        
        // Replace the old store in the mock data
        MOCK_STORE_ADDRESSES[storeIndex] = updatedStore;
        
        resolve(updatedStore);
      }, 500);
    });
  },

  // Toggle delivery service for a store address
  toggleDeliveryService: async (id: string): Promise<StoreAddress> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // Find the store to update
        const storeIndex = MOCK_STORE_ADDRESSES.findIndex(store => store.id === id);
        
        if (storeIndex === -1) {
          reject(new Error(`Store with ID ${id} not found`));
          return;
        }
        
        // Toggle the delivery service
        const updatedStore = {
          ...MOCK_STORE_ADDRESSES[storeIndex],
          deliverySettings: {
            ...MOCK_STORE_ADDRESSES[storeIndex].deliverySettings,
            enableDelivery: !MOCK_STORE_ADDRESSES[storeIndex].deliverySettings.enableDelivery
          },
          updatedAt: new Date().toISOString()
        };
        
        // Replace the old store in the mock data
        MOCK_STORE_ADDRESSES[storeIndex] = updatedStore;
        
        resolve(updatedStore);
      }, 500);
    });
  },

  // Update delivery settings for a store address
  updateDeliverySettings: async (id: string, settings: any): Promise<StoreAddress> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // Find the store to update
        const storeIndex = MOCK_STORE_ADDRESSES.findIndex(store => store.id === id);
        
        if (storeIndex === -1) {
          reject(new Error(`Store with ID ${id} not found`));
          return;
        }
        
        // Update the delivery settings
        const updatedStore = {
          ...MOCK_STORE_ADDRESSES[storeIndex],
          deliverySettings: {
            ...MOCK_STORE_ADDRESSES[storeIndex].deliverySettings,
            ...settings
          },
          updatedAt: new Date().toISOString()
        };
        
        // Replace the old store in the mock data
        MOCK_STORE_ADDRESSES[storeIndex] = updatedStore;
        
        resolve(updatedStore);
      }, 500);
    });
  },

  // Update geofence for a store address
  updateGeofence: async (id: string, geofencePoints: any): Promise<StoreAddress> => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // Find the store to update
        const storeIndex = MOCK_STORE_ADDRESSES.findIndex(store => store.id === id);
        
        if (storeIndex === -1) {
          reject(new Error(`Store with ID ${id} not found`));
          return;
        }
        
        // Update the geofence
        const updatedStore = {
          ...MOCK_STORE_ADDRESSES[storeIndex],
          geofence: geofencePoints,
          updatedAt: new Date().toISOString()
        };
        
        // Replace the old store in the mock data
        MOCK_STORE_ADDRESSES[storeIndex] = updatedStore;
        
        resolve(updatedStore);
      }, 500);
    });
  },

  // Check if a location is within any store's delivery zone
  isLocationWithinDeliveryZone: async (coordinates: GeoCoordinate): Promise<{
    withinZone: boolean;
    nearestStore?: StoreAddress;
    distance?: number;
  }> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Mock implementation - return a random result
        const withinZone = Math.random() < 0.5;
        const nearestStore = withinZone ? MOCK_STORE_ADDRESSES[0] : undefined;
        const distance = withinZone ? Math.random() * 10 : undefined;
        
        resolve({ withinZone, nearestStore, distance });
      }, 500);
    });
  },

  // Calculate delivery fee based on coordinates and store address
  calculateDeliveryFee: async (storeId: string, coordinates: GeoCoordinate): Promise<{
    fee: number;
    distance: number;
    currency: string;
    estimatedTime: number;
  }> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Mock implementation - return a random result
        const fee = Math.random() * 1000;
        const distance = Math.random() * 10;
        const currency = 'NGN';
        const estimatedTime = Math.random() * 60;
        
        resolve({ fee, distance, currency, estimatedTime });
      }, 500);
    });
  },

  // Get geocoordinates from address string using Google Maps API
  getCoordinatesFromAddress: async (address: string): Promise<GeoCoordinate> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Mock implementation - return a random result
        resolve({
          lat: Math.random() * 10,
          lng: Math.random() * 10
        });
      }, 500);
    });
  },

  // Get address from coordinates using Google Maps API
  getAddressFromCoordinates: async (coordinates: GeoCoordinate): Promise<{
    formattedAddress: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  }> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Mock implementation - return a random result
        const formattedAddress = 'Random Address';
        const city = 'Random City';
        const state = 'Random State';
        const country = 'Random Country';
        const postalCode = 'Random Postal Code';
        
        resolve({ formattedAddress, city, state, country, postalCode });
      }, 500);
    });
  }
};

// Export individual functions to maintain compatibility with existing imports
export const getStoreAddresses = StoreAddressService.getStoreAddresses;
export const getActiveStoreAddresses = StoreAddressService.getActiveStoreAddresses;
export const getPickupStoreAddresses = StoreAddressService.getPickupStoreAddresses;
export const getDeliveryStoreAddresses = StoreAddressService.getDeliveryStoreAddresses;
export const getStoreAddressById = StoreAddressService.getStoreAddressById;
export const createStoreAddress = StoreAddressService.createStoreAddress;
export const updateStoreAddress = StoreAddressService.updateStoreAddress;
export const deleteStoreAddress = StoreAddressService.deleteStoreAddress;
export const toggleStoreAddressStatus = StoreAddressService.toggleStoreAddressStatus;
export const togglePickupAvailability = StoreAddressService.togglePickupAvailability;
export const toggleDeliveryService = StoreAddressService.toggleDeliveryService;
export const updateDeliverySettings = StoreAddressService.updateDeliverySettings;
export const updateGeofence = StoreAddressService.updateGeofence;
export const isLocationWithinDeliveryZone = StoreAddressService.isLocationWithinDeliveryZone;
export const calculateDeliveryFee = StoreAddressService.calculateDeliveryFee;
export const getCoordinatesFromAddress = StoreAddressService.getCoordinatesFromAddress;
export const getAddressFromCoordinates = StoreAddressService.getAddressFromCoordinates;

export default StoreAddressService;
