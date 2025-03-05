import api from './api';
import { Banner, NotificationBar } from '../models/Promotion';

// Response interfaces
export interface BannerResponse {
  success: boolean;
  data: {
    banner: Banner;
  };
}

export interface BannersResponse {
  success: boolean;
  data: {
    banners: Banner[];
  };
}

export interface NotificationBarResponse {
  success: boolean;
  data: {
    notificationBar: NotificationBar;
  };
}

// Example dummy data for development/testing
const initialBanners: Banner[] = [
  {
    id: 1,
    active: true,
    label: 'Monthly Promotion',
    title: 'SHOP & SAVE BIG',
    description: 'Get up to 30% off on all groceries and household essentials',
    image: '/banners/groceries-banner.png',
    bgColor: '#0066b2',
    imgBgColor: '#e0f2ff',
    link: '/promotions'
  },
  {
    id: 2,
    active: false,
    label: 'New Arrivals',
    title: 'FRESH SEASONAL PRODUCE',
    description: 'Locally sourced fruits and vegetables just arrived!',
    image: '/banners/produce-banner.png',
    bgColor: '#2e7d32',
    imgBgColor: '#e8f5e9',
    link: '/fresh-produce'
  }
];

const initialNotificationBar: NotificationBar = {
  id: 1,
  active: true,
  message: 'Free shipping on orders over $50! Limited time offer.',
  linkText: 'Shop Now',
  linkUrl: '/shop',
  bgColor: '#ff9800'
};

// Promotion service class with all API methods
export class PromotionService {
  // Get all banners
  static async getBanners(): Promise<Banner[]> {
    try {
      // For production, use the actual API call
      // const response = await api.get<BannersResponse>('/promotions/banners');
      // return response.data.data.banners;
      
      // For development/testing, return dummy data
      return Promise.resolve(initialBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  }
  
  // Get all active banners
  static async getActiveBanners(): Promise<Banner[]> {
    try {
      // For production, use the actual API call
      // const response = await api.get<BannersResponse>('/promotions/banners/active');
      // return response.data.data.banners;
      
      // For development/testing, filter dummy data
      const activeBanners = initialBanners.filter(banner => banner.active);
      return Promise.resolve(activeBanners);
    } catch (error) {
      console.error('Error fetching active banners:', error);
      return [];
    }
  }
  
  // Get notification bar
  static async getNotificationBar(): Promise<NotificationBar | null> {
    try {
      // For production, use the actual API call
      // const response = await api.get<NotificationBarResponse>('/promotions/notification-bar');
      // return response.data.data.notificationBar;
      
      // For development/testing, return dummy data
      return Promise.resolve(initialNotificationBar);
    } catch (error) {
      console.error('Error fetching notification bar:', error);
      return null;
    }
  }
  
  // Update banner
  static async updateBanner(banner: Banner): Promise<Banner> {
    try {
      // For production, use the actual API call
      // const response = await api.put<BannerResponse>(`/promotions/banners/${banner.id}`, banner);
      // return response.data.data.banner;
      
      // For development/testing, update dummy data
      const updatedBanner = { ...banner };
      return Promise.resolve(updatedBanner);
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  }
  
  // Update notification bar
  static async updateNotificationBar(notificationBar: NotificationBar): Promise<NotificationBar> {
    try {
      // For production, use the actual API call
      // const response = await api.put<NotificationBarResponse>('/promotions/notification-bar', notificationBar);
      // return response.data.data.notificationBar;
      
      // For development/testing, update dummy data
      const updatedNotificationBar = { ...notificationBar };
      return Promise.resolve(updatedNotificationBar);
    } catch (error) {
      console.error('Error updating notification bar:', error);
      throw error;
    }
  }
  
  // Toggle banner status
  static async toggleBannerStatus(id: number): Promise<Banner> {
    try {
      // For production, use the actual API call
      // const response = await api.patch<BannerResponse>(`/promotions/banners/${id}/toggle`);
      // return response.data.data.banner;
      
      // For development/testing, update dummy data
      const banner = initialBanners.find(b => b.id === id);
      if (!banner) throw new Error('Banner not found');
      
      const updatedBanner = { ...banner, active: !banner.active };
      return Promise.resolve(updatedBanner);
    } catch (error) {
      console.error('Error toggling banner status:', error);
      throw error;
    }
  }
  
  // Toggle notification bar status
  static async toggleNotificationBarStatus(): Promise<NotificationBar> {
    try {
      // For production, use the actual API call
      // const response = await api.patch<NotificationBarResponse>('/promotions/notification-bar/toggle');
      // return response.data.data.notificationBar;
      
      // For development/testing, update dummy data
      const updatedNotificationBar = { 
        ...initialNotificationBar, 
        active: !initialNotificationBar.active 
      };
      return Promise.resolve(updatedNotificationBar);
    } catch (error) {
      console.error('Error toggling notification bar status:', error);
      throw error;
    }
  }
}
