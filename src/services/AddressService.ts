import axios from 'axios';
import config from '../config';
import { Address, AddressFormData } from '../models/Address';

// Response interfaces
export interface AddressResponse {
  success: boolean;
  address: Address;
}

export interface AddressesResponse {
  success: boolean;
  addresses: Address[];
}

// Address service with real API endpoints
const AddressService = {
  // Get all addresses for a user
  getUserAddresses: async (userId: string): Promise<Address[]> => {
    try {
      const response = await axios.get<AddressesResponse>(`${config.api.baseUrl}/users/${userId}/addresses`, {
        withCredentials: true
      });
      return response.data.addresses;
    } catch (error) {
      console.error(`Error fetching addresses for user #${userId}:`, error);
      return []; // Return empty array as fallback
    }
  },

  // Get a specific address by ID
  getAddressById: async (id: string): Promise<Address | null> => {
    try {
      const response = await axios.get<AddressResponse>(`${config.api.baseUrl}/addresses/${id}`, {
        withCredentials: true
      });
      return response.data.address;
    } catch (error) {
      console.error(`Error fetching address #${id}:`, error);
      return null;
    }
  },

  // Get the default address for a user
  getDefaultAddress: async (userId: string): Promise<Address | null> => {
    try {
      const response = await axios.get<AddressResponse>(`${config.api.baseUrl}/users/${userId}/addresses/default`, {
        withCredentials: true
      });
      return response.data.address;
    } catch (error) {
      console.error(`Error fetching default address for user #${userId}:`, error);
      return null;
    }
  },

  // Create a new address
  createAddress: async (userId: string, addressData: Omit<AddressFormData, 'id' | 'userId'>): Promise<Address> => {
    try {
      const response = await axios.post<AddressResponse>(`${config.api.baseUrl}/users/${userId}/addresses`, {
        ...addressData,
        userId
      }, {
        withCredentials: true
      });
      return response.data.address;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  },

  // Update an existing address
  updateAddress: async (id: string, addressData: Partial<AddressFormData>): Promise<Address> => {
    try {
      const response = await axios.put<AddressResponse>(`${config.api.baseUrl}/addresses/${id}`, addressData, {
        withCredentials: true
      });
      return response.data.address;
    } catch (error) {
      console.error(`Error updating address #${id}:`, error);
      throw error;
    }
  },

  // Delete an address
  deleteAddress: async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`${config.api.baseUrl}/addresses/${id}`, {
        withCredentials: true
      });
      return true;
    } catch (error) {
      console.error(`Error deleting address #${id}:`, error);
      return false;
    }
  },

  // Make an address the default for a user
  setDefaultAddress: async (id: string): Promise<Address> => {
    try {
      const response = await axios.put<AddressResponse>(`${config.api.baseUrl}/addresses/${id}/set-default`, {}, {
        withCredentials: true
      });
      return response.data.address;
    } catch (error) {
      console.error(`Error setting address #${id} as default:`, error);
      throw error;
    }
  }
};

// Export individual functions to maintain compatibility with existing imports
export const getUserAddresses = AddressService.getUserAddresses;
export const getAddressById = AddressService.getAddressById;
export const getDefaultAddress = AddressService.getDefaultAddress;
export const createAddress = AddressService.createAddress;
export const updateAddress = AddressService.updateAddress;
export const deleteAddress = AddressService.deleteAddress;
export const setDefaultAddress = AddressService.setDefaultAddress;

export default AddressService;
