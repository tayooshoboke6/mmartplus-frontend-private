import { Voucher, VoucherNotification, Customer } from '../models/Voucher';

// Mock data for vouchers
const mockVouchers: Voucher[] = [
  {
    id: '1',
    code: 'WELCOME10',
    discount: 10,
    discountType: 'percentage',
    minPurchase: 50,
    maxDiscount: 100,
    startDate: '2025-03-01',
    endDate: '2025-04-01',
    status: 'active',
    assignedTo: 'all',
    usageLimit: 1,
    description: 'Welcome discount for new customers',
    createdAt: '2025-02-15T00:00:00Z',
    updatedAt: '2025-02-15T00:00:00Z'
  },
  {
    id: '2',
    code: 'SUMMER25',
    discount: 25,
    discountType: 'percentage',
    minPurchase: 100,
    maxDiscount: 250,
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'inactive',
    assignedTo: 'selected',
    selectedCustomers: ['1', '2', '3'],
    usageLimit: 3,
    description: 'Summer sale discount',
    createdAt: '2025-02-20T00:00:00Z',
    updatedAt: '2025-02-20T00:00:00Z'
  }
];

// Mock data for customers
const mockCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: '3', name: 'Robert Johnson', email: 'robert.johnson@example.com' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com' },
  { id: '5', name: 'Michael Wilson', email: 'michael.wilson@example.com' }
];

// In a real application, these functions would make API calls to a backend server
export const VoucherService = {
  // Get all vouchers
  getVouchers: async (): Promise<Voucher[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockVouchers);
      }, 500);
    });
  },

  // Get voucher by ID
  getVoucherById: async (id: string): Promise<Voucher | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const voucher = mockVouchers.find(v => v.id === id);
        resolve(voucher || null);
      }, 300);
    });
  },

  // Create a new voucher
  createVoucher: async (voucher: Omit<Voucher, 'id' | 'createdAt' | 'updatedAt'>): Promise<Voucher> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newVoucher: Voucher = {
          ...voucher,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockVouchers.push(newVoucher);
        resolve(newVoucher);
      }, 500);
    });
  },

  // Update an existing voucher
  updateVoucher: async (id: string, voucher: Partial<Voucher>): Promise<Voucher | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockVouchers.findIndex(v => v.id === id);
        if (index !== -1) {
          mockVouchers[index] = {
            ...mockVouchers[index],
            ...voucher,
            updatedAt: new Date().toISOString()
          };
          resolve(mockVouchers[index]);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  // Delete a voucher
  deleteVoucher: async (id: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockVouchers.findIndex(v => v.id === id);
        if (index !== -1) {
          mockVouchers.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },

  // Activate or deactivate a voucher
  toggleVoucherStatus: async (id: string, active: boolean): Promise<Voucher | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockVouchers.findIndex(v => v.id === id);
        if (index !== -1) {
          mockVouchers[index] = {
            ...mockVouchers[index],
            status: active ? 'active' : 'inactive',
            updatedAt: new Date().toISOString()
          };
          resolve(mockVouchers[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Get all customers
  getCustomers: async (): Promise<Customer[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCustomers);
      }, 500);
    });
  },

  // Send voucher notification
  sendVoucherNotification: async (notification: VoucherNotification): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real application, this would send notifications via the specified channels
        console.log('Sending voucher notification:', notification);
        resolve(true);
      }, 800);
    });
  },

  // Validate and apply voucher code
  validateVoucher: async (code: string, cartTotal: number): Promise<{ 
    valid: boolean; 
    voucher?: Voucher; 
    discountAmount?: number;
    errorMessage?: string;
  }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const voucher = mockVouchers.find(v => 
          v.code.toLowerCase() === code.toLowerCase() && 
          v.status === 'active'
        );

        if (!voucher) {
          resolve({ 
            valid: false, 
            errorMessage: 'Invalid voucher code or voucher is inactive' 
          });
          return;
        }

        // Check if voucher is valid based on dates
        const currentDate = new Date();
        const startDate = new Date(voucher.startDate);
        const endDate = new Date(voucher.endDate);

        if (currentDate < startDate || currentDate > endDate) {
          resolve({ 
            valid: false, 
            errorMessage: 'Voucher is not valid for current date' 
          });
          return;
        }

        // Check minimum purchase requirement
        if (cartTotal < voucher.minPurchase) {
          resolve({ 
            valid: false, 
            errorMessage: `Minimum purchase of ${voucher.minPurchase} required` 
          });
          return;
        }

        // Calculate discount amount
        let discountAmount = 0;
        if (voucher.discountType === 'percentage') {
          discountAmount = (cartTotal * voucher.discount) / 100;
          // Apply maximum discount if specified
          if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
            discountAmount = voucher.maxDiscount;
          }
        } else {
          // Fixed discount
          discountAmount = voucher.discount;
        }

        resolve({ 
          valid: true, 
          voucher, 
          discountAmount 
        });
      }, 500);
    });
  }
};

export default VoucherService;
