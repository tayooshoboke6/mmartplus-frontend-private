import api from './api';
import { 
  StoreAddress, 
  GeofencePoint, 
  StoreDeliverySettings, 
  StoreAddressInput, 
  GeoCoordinates
} from '../models/StoreAddress';

// Response interfaces
export interface StoreAddressResponse {
  success: boolean;
  address: StoreAddress;
}

export interface StoreAddressesResponse {
  success: boolean;
  addresses: StoreAddress[];
}

// Store address service with real API endpoints
const StoreAddressService = {
  // Get all store addresses
  getStoreAddresses: async (): Promise<StoreAddress[]> => {
    try {
      const response = await api.get<StoreAddressesResponse>('/store-addresses');
      return response.data.addresses;
    } catch (error) {
      console.error('Error fetching store addresses:', error);
      return []; // Return empty array as fallback
    }
  },

  // Get only active store addresses
  getActiveStoreAddresses: async (): Promise<StoreAddress[]> => {
    try {
      const response = await api.get<StoreAddressesResponse>('/store-addresses', {
        params: { active: true }
      });
      return response.data.addresses;
    } catch (error) {
      console.error('Error fetching active store addresses:', error);
      return []; // Return empty array as fallback
    }
  },

  // Get store addresses that allow pickup
  getPickupStoreAddresses: async (): Promise<StoreAddress[]> => {
    try {
      const response = await api.get<StoreAddressesResponse>('/store-addresses', {
        params: { active: true, pickup: true }
      });
      return response.data.addresses;
    } catch (error) {
      console.error('Error fetching pickup store addresses:', error);
      return []; // Return empty array as fallback
    }
  },

  // Get store addresses that provide delivery to specific coordinates
  getDeliveryStoreAddresses: async (coordinates: GeoCoordinates): Promise<StoreAddress[]> => {
    try {
      const response = await api.get<StoreAddressesResponse>('/store-addresses/delivery', {
        params: { 
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        }
      });
      return response.data.addresses;
    } catch (error) {
      console.error('Error fetching delivery store addresses:', error);
      return []; // Return empty array as fallback
    }
  },

  // Get store address by ID
  getStoreAddressById: async (id: number): Promise<StoreAddress | null> => {
    try {
      const response = await api.get<StoreAddressResponse>(`/store-addresses/${id}`);
      return response.data.address;
    } catch (error) {
      console.error(`Error fetching store address #${id}:`, error);
      return null;
    }
  },

  // Create a new store address
  createStoreAddress: async (addressData: StoreAddressInput): Promise<StoreAddress> => {
    try {
      const response = await api.post<StoreAddressResponse>('/store-addresses', addressData);
      return response.data.address;
    } catch (error) {
      console.error('Error creating store address:', error);
      throw error;
    }
  },

  // Update an existing store address
  updateStoreAddress: async (id: number, addressData: Partial<StoreAddressInput>): Promise<StoreAddress> => {
    try {
      const response = await api.put<StoreAddressResponse>(`/store-addresses/${id}`, addressData);
      return response.data.address;
    } catch (error) {
      console.error(`Error updating store address #${id}:`, error);
      throw error;
    }
  },

  // Delete a store address
  deleteStoreAddress: async (id: number): Promise<void> => {
    try {
      await api.delete(`/store-addresses/${id}`);
    } catch (error) {
      console.error(`Error deleting store address #${id}:`, error);
      throw error;
    }
  },

  // Toggle a store address active status
  toggleStoreAddressStatus: async (id: number): Promise<StoreAddress> => {
    try {
      const response = await api.put<StoreAddressResponse>(`/store-addresses/${id}/toggle-status`);
      return response.data.address;
    } catch (error) {
      console.error(`Error toggling store address #${id} status:`, error);
      throw error;
    }
  },

  // Toggle pickup availability for a store address
  togglePickupAvailability: async (id: number): Promise<StoreAddress> => {
    try {
      const response = await api.put<StoreAddressResponse>(`/store-addresses/${id}/toggle-pickup`);
      return response.data.address;
    } catch (error) {
      console.error(`Error toggling pickup availability for store address #${id}:`, error);
      throw error;
    }
  },

  // Toggle delivery service for a store address
  toggleDeliveryService: async (id: number): Promise<StoreAddress> => {
    try {
      const response = await api.put<StoreAddressResponse>(`/store-addresses/${id}/toggle-delivery`);
      return response.data.address;
    } catch (error) {
      console.error(`Error toggling delivery service for store address #${id}:`, error);
      throw error;
    }
  },

  // Update delivery settings for a store address
  updateDeliverySettings: async (id: number, settings: Partial<StoreDeliverySettings>): Promise<StoreAddress> => {
    try {
      const response = await api.put<StoreAddressResponse>(`/store-addresses/${id}/delivery-settings`, settings);
      return response.data.address;
    } catch (error) {
      console.error(`Error updating delivery settings for store address #${id}:`, error);
      throw error;
    }
  },

  // Update geofence for a store address
  updateGeofence: async (id: number, geofencePoints: GeofencePoint[]): Promise<StoreAddress> => {
    try {
      const response = await api.put<StoreAddressResponse>(`/store-addresses/${id}/geofence`, {
        geofence: geofencePoints
      });
      return response.data.address;
    } catch (error) {
      console.error(`Error updating geofence for store address #${id}:`, error);
      throw error;
    }
  },

  // Check if a location is within any store's delivery zone
  isLocationWithinDeliveryZone: async (coordinates: GeoCoordinates): Promise<{
    withinZone: boolean;
    nearestStore?: StoreAddress;
    distance?: number;
  }> => {
    try {
      const response = await api.post('/store-addresses/check-delivery-zone', coordinates);
      return response.data;
    } catch (error) {
      console.error('Error checking if location is within delivery zone:', error);
      return { withinZone: false };
    }
  },

  // Calculate delivery fee based on coordinates and store address
  calculateDeliveryFee: async (storeId: number, coordinates: GeoCoordinates): Promise<{
    fee: number;
    distance: number;
    currency: string;
    estimatedTime: number;
  }> => {
    try {
      const response = await api.post(`/store-addresses/${storeId}/calculate-delivery-fee`, coordinates);
      return response.data;
    } catch (error) {
      console.error('Error calculating delivery fee:', error);
      throw error;
    }
  },

  // Get geocoordinates from address string using Google Maps API
  getCoordinatesFromAddress: async (address: string): Promise<GeoCoordinates> => {
    try {
      const response = await api.post('/geocode', { address });
      return response.data.coordinates;
    } catch (error) {
      console.error('Error getting coordinates from address:', error);
      // Fallback to default coordinates (e.g., center of Lagos)
      return { latitude: 6.5244, longitude: 3.3792 };
    }
  },

  // Get address from coordinates using Google Maps API
  getAddressFromCoordinates: async (coordinates: GeoCoordinates): Promise<{
    formattedAddress: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  }> => {
    try {
      const response = await api.post('/reverse-geocode', coordinates);
      return response.data.address;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      throw error;
    }
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
