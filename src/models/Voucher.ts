export interface Voucher {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minPurchase: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
  assignedTo: 'all' | 'selected';
  selectedCustomers?: string[];
  usageLimit: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VoucherNotification {
  voucherId: string;
  recipients: 'all' | 'selected';
  selectedRecipients?: string[];
  channels: ('email' | 'inbox')[];
  message?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}
