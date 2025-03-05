/**
 * Type definitions for service modules to ensure consistent implementations
 */

/**
 * VoucherService API types
 */

export interface VoucherServiceType {
  getAllVouchers: () => Promise<Voucher[]>;
  getCustomers: () => Promise<Customer[]>;
  createVoucher: (voucherData: VoucherCreateParams) => Promise<VoucherResponse>;
  updateVoucher: (voucherId: number, voucherData: Partial<Voucher>) => Promise<VoucherResponse>;
  toggleVoucherStatus: (voucherId: number) => Promise<VoucherResponse>;
  deleteVoucher: (voucherId: number) => Promise<{ status: string; message: string }>;
  generateBulkVouchers: (data: BulkVoucherParams) => Promise<BulkVoucherResponse>;
  getVoucherStats: (voucherId: number) => Promise<VoucherStatsResponse>;
  validateVoucher: (code: string, cartTotal: number) => Promise<VoucherValidationResponse>;
  applyVoucher: (orderId: number, voucherCode: string) => Promise<ApplyVoucherResponse>;
  getUserVouchers: () => Promise<Voucher[]>;
  getVouchers: () => Promise<Voucher[]>;
  previewTargetedUsers: (segmentData: TargetSegmentParams) => Promise<TargetedUserPreviewResponse>;
  createTargetedVoucherCampaign: (campaignData: TargetedCampaignParams) => Promise<TargetedCampaignResponse>;
}

/**
 * This allows you to validate your service implementation against the interface:
 * 
 * // In VoucherService.ts
 * const VoucherService: VoucherServiceType = {
 *   // implementations
 * };
 * 
 * If any method signature doesn't match, TypeScript will show an error during development
 */

// Type parameters for the functions (simplified versions of what's in the actual service)
interface VoucherCreateParams {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number | null;
  start_date: string;
  end_date: string;
  usage_limit: number;
  active: boolean;
}

interface BulkVoucherParams {
  prefix: string;
  count: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number | null;
  start_date: string;
  end_date: string;
  usage_limit: number;
  active: boolean;
}

interface TargetSegmentParams {
  segment_type: string;
  segment_options: {
    newUserDays?: number;
    inactiveDays?: number;
    orderCount?: number;
    loyaltyPeriod?: number;
    minSpend?: string;
    spendPeriod?: number;
    abandonedDays?: number;
    categoryIds?: number[];
    categoryPurchasePeriod?: number;
    birthdayMonth?: number;
    [key: string]: any;
  };
}

interface TargetedCampaignParams {
  segment_type: string;
  segment_options: any;
  voucher_config: {
    prefix: string;
    type: 'percentage' | 'fixed';
    value: number;
    min_spend: number;
    expires_at: string | null;
    max_usage_per_user: number;
    max_total_usage: number | null;
    description: string;
    is_active: boolean;
  };
  distribution: {
    method: 'email' | 'sms' | 'app';
    emailTemplate?: string;
    emailSubject?: string;
    notifyUsers: boolean;
    scheduleDelivery: boolean;
    deliveryDate?: Date;
  };
}

// Response types
interface TargetedUserPreviewResponse {
  status: string;
  message?: string;
  data: {
    users: {
      id: number;
      name: string;
      email: string;
      phone?: string;
      last_order_date?: string;
      total_orders?: number;
      total_spent?: number;
    }[];
    total_count: number;
  };
}

interface TargetedCampaignResponse {
  status: string;
  message: string;
  data?: {
    campaign_id: number;
    vouchers_created: number;
    notifications_queued?: number;
  };
}
