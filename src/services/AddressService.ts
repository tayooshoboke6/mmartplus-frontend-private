import { Address, AddressFormData } from '../models/Address';

// Mock data for addresses
const mockAddresses: Address[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'John Doe',
    phone: '+2348012345678',
    street: '123 Main Street',
    city: 'Lagos',
    state: 'Lagos',
    postalCode: '100001',
    country: 'Nigeria',
    isDefault: true,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    name: 'John Doe (Office)',
    phone: '+2348023456789',
    street: '456 Business Avenue',
    city: 'Abuja',
    state: 'FCT',
    postalCode: '900001',
    country: 'Nigeria',
    isDefault: false,
    createdAt: '2025-02-10T00:00:00Z',
    updatedAt: '2025-02-10T00:00:00Z'
  }
];

// In a real application, these functions would make API calls to a backend server
export const AddressService = {
  // Get all addresses for a user
  getUserAddresses: async (userId: string): Promise<Address[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const addresses = mockAddresses.filter(address => address.userId === userId);
        resolve(addresses);
      }, 500);
    });
  },

  // Get address by ID
  getAddressById: async (id: string): Promise<Address | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const address = mockAddresses.find(a => a.id === id);
        resolve(address || null);
      }, 300);
    });
  },

  // Get default address for a user
  getDefaultAddress: async (userId: string): Promise<Address | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const address = mockAddresses.find(a => a.userId === userId && a.isDefault);
        resolve(address || null);
      }, 300);
    });
  },

  // Create a new address
  createAddress: async (userId: string, addressData: AddressFormData): Promise<Address> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // If this is the first address or marked as default, set it as default
        const isFirstAddress = !mockAddresses.some(a => a.userId === userId);
        const isDefault = isFirstAddress || addressData.isDefault || false;
        
        // If setting this as default, unset any existing default
        if (isDefault) {
          mockAddresses.forEach(a => {
            if (a.userId === userId && a.isDefault) {
              a.isDefault = false;
            }
          });
        }
        
        const newAddress: Address = {
          ...addressData,
          id: Date.now().toString(),
          userId,
          isDefault,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        mockAddresses.push(newAddress);
        resolve(newAddress);
      }, 500);
    });
  },

  // Update an existing address
  updateAddress: async (id: string, addressData: Partial<AddressFormData>): Promise<Address | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockAddresses.findIndex(a => a.id === id);
        if (index !== -1) {
          // If setting this as default, unset any existing default
          if (addressData.isDefault) {
            const userId = mockAddresses[index].userId;
            mockAddresses.forEach(a => {
              if (a.userId === userId && a.isDefault && a.id !== id) {
                a.isDefault = false;
              }
            });
          }
          
          mockAddresses[index] = {
            ...mockAddresses[index],
            ...addressData,
            updatedAt: new Date().toISOString()
          };
          resolve(mockAddresses[index]);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  // Delete an address
  deleteAddress: async (id: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockAddresses.findIndex(a => a.id === id);
        if (index !== -1) {
          // Check if this was the default address
          const wasDefault = mockAddresses[index].isDefault;
          const userId = mockAddresses[index].userId;
          
          // Remove the address
          mockAddresses.splice(index, 1);
          
          // If this was the default and there are other addresses, set a new default
          if (wasDefault) {
            const userAddresses = mockAddresses.filter(a => a.userId === userId);
            if (userAddresses.length > 0) {
              userAddresses[0].isDefault = true;
            }
          }
          
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },

  // Set an address as default
  setDefaultAddress: async (id: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const address = mockAddresses.find(a => a.id === id);
        if (address) {
          const userId = address.userId;
          
          // Unset any existing default
          mockAddresses.forEach(a => {
            if (a.userId === userId) {
              a.isDefault = (a.id === id);
            }
          });
          
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }
};

export default AddressService;
