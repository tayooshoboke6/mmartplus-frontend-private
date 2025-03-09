import { Banner, NotificationBar } from '../models/Promotion';

// Response interfaces
export interface BannerResponse {
  status: string;
  message?: string;
  banner: Banner;
}

export interface BannersResponse {
  status: string;
  banners: Banner[];
}

export interface NotificationBarResponse {
  status: string;
  message?: string;
  notificationBar: NotificationBar;
}

// Mock data for banners and notification bars
const MOCK_BANNERS: Banner[] = [
  {
    id: 1,
    active: true,
    label: 'Monthly Promotion',
    title: 'SHOP & SAVE BIG',
    description: 'Get up to 30% off on all groceries and household essentials',
    image: '/images/banner-image.png',
    bgColor: '#0066b2',
    imgBgColor: '#e0f2ff',
    link: '/promotions'
  },
  {
    id: 2,
    active: false,
    label: 'New Users',
    title: 'WELCOME OFFER',
    description: 'First-time shoppers get extra 15% off with code WELCOME15',
    image: '/images/banner-image.png',
    bgColor: '#e6f7ff',
    imgBgColor: '#ffffff',
    link: '/welcome'
  },
  {
    id: 3,
    active: true,
    label: 'Flash Sale',
    title: 'WEEKEND FLASH SALE',
    description: 'Up to 50% off on electronics and appliances this weekend only',
    image: '/images/banner-image.png',
    bgColor: '#ff4757',
    imgBgColor: '#ffebee',
    link: '/flash-sale'
  },
  {
    id: 4,
    active: true,
    label: 'Holiday Special',
    title: 'HOLIDAY SEASON DEALS',
    description: 'Prepare for the holidays with our special discounts on festive items',
    image: '/images/banner-image.png',
    bgColor: '#2ed573',
    imgBgColor: '#e6fff0',
    link: '/holiday-specials'
  }
];

const MOCK_NOTIFICATION_BAR: NotificationBar = {
  id: 1,
  active: true,
  message: 'Free shipping on all orders above $50',
  linkText: 'Shop Now',
  linkUrl: '/shop',
  bgColor: '#ffdd57'
};

// Promotion service class with mock data
export class PromotionService {
  // Get all banners
  static async getBanners(): Promise<Banner[]> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve([...MOCK_BANNERS]);
      }, 500);
    });
  }
  
  // Get all active banners
  static async getActiveBanners(): Promise<Banner[]> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const activeBanners = MOCK_BANNERS.filter(banner => banner.active);
        resolve(activeBanners);
      }, 500);
    });
  }
  
  // Get notification bar
  static async getNotificationBar(): Promise<NotificationBar | null> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve({...MOCK_NOTIFICATION_BAR});
      }, 300);
    });
  }
  
  // Get active notification bar for storefront
  static async getActiveNotificationBar(): Promise<NotificationBar | null> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve(MOCK_NOTIFICATION_BAR.active ? {...MOCK_NOTIFICATION_BAR} : null);
      }, 300);
    });
  }
  
  // Update banner
  static async updateBanner(banner: Banner): Promise<Banner> {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const bannerIndex = MOCK_BANNERS.findIndex(b => b.id === banner.id);
        
        if (bannerIndex === -1) {
          reject(new Error(`Banner with ID ${banner.id} not found`));
          return;
        }
        
        // Update the banner
        MOCK_BANNERS[bannerIndex] = {...banner};
        
        resolve({...banner});
      }, 700);
    });
  }
  
  // Create banner
  static async createBanner(banner: Omit<Banner, 'id'>): Promise<Banner> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Create a new ID
        const newId = Math.max(...MOCK_BANNERS.map(b => b.id)) + 1;
        
        // Create the new banner
        const newBanner: Banner = {
          ...banner,
          id: newId
        };
        
        // Add to mock data
        MOCK_BANNERS.push(newBanner);
        
        resolve({...newBanner});
      }, 700);
    });
  }
  
  // Delete banner
  static async deleteBanner(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const bannerIndex = MOCK_BANNERS.findIndex(b => b.id === id);
        
        if (bannerIndex === -1) {
          reject(new Error(`Banner with ID ${id} not found`));
          return;
        }
        
        // Remove the banner
        MOCK_BANNERS.splice(bannerIndex, 1);
        
        resolve();
      }, 500);
    });
  }
  
  // Toggle banner active status
  static async toggleBannerStatus(id: number): Promise<Banner> {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const bannerIndex = MOCK_BANNERS.findIndex(b => b.id === id);
        
        if (bannerIndex === -1) {
          reject(new Error(`Banner with ID ${id} not found`));
          return;
        }
        
        // Toggle the active status
        const updatedBanner = {
          ...MOCK_BANNERS[bannerIndex],
          active: !MOCK_BANNERS[bannerIndex].active
        };
        
        // Update in mock data
        MOCK_BANNERS[bannerIndex] = updatedBanner;
        
        resolve({...updatedBanner});
      }, 500);
    });
  }
  
  // Update notification bar
  static async updateNotificationBar(notificationBar: NotificationBar): Promise<NotificationBar> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Update the notification bar
        MOCK_NOTIFICATION_BAR.active = notificationBar.active;
        MOCK_NOTIFICATION_BAR.message = notificationBar.message;
        MOCK_NOTIFICATION_BAR.linkText = notificationBar.linkText;
        MOCK_NOTIFICATION_BAR.linkUrl = notificationBar.linkUrl;
        MOCK_NOTIFICATION_BAR.bgColor = notificationBar.bgColor;
        
        resolve({...MOCK_NOTIFICATION_BAR});
      }, 500);
    });
  }
  
  // Toggle notification bar active status
  static async toggleNotificationBarStatus(): Promise<NotificationBar> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Toggle the active status
        MOCK_NOTIFICATION_BAR.active = !MOCK_NOTIFICATION_BAR.active;
        
        resolve({...MOCK_NOTIFICATION_BAR});
      }, 300);
    });
  }
}

export default PromotionService;
