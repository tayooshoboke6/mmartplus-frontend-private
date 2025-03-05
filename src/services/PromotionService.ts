import api from './api';
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
    label: 'New Users',
    title: 'WELCOME OFFER',
    description: 'First-time shoppers get extra 15% off with code WELCOME15',
    image: '/banners/welcome-banner.png',
    bgColor: '#e6f7ff',
    imgBgColor: '#ffffff',
    link: '/welcome'
  }
];

const initialNotificationBar: NotificationBar = {
  id: 1,
  active: true,
  message: 'Free shipping on all orders above $50',
  linkText: 'Shop Now',
  linkUrl: '/shop',
  bgColor: '#ffdd57'
};

// Promotion service class with all API methods
export class PromotionService {
  // Get all banners
  static async getBanners(): Promise<Banner[]> {
    try {
      // For production, use the actual API call
      if (process.env.NODE_ENV === 'production') {
        const response = await api.get<BannersResponse>('/admin/banners');
        return response.data.banners;
      }
      
      // Try to call the backend API in development but fallback to mock data
      try {
        const response = await api.get<BannersResponse>('/admin/banners');
        return response.data.banners;
      } catch (error) {
        console.warn('Using mock banner data in development mode');
        return Promise.resolve(initialBanners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  }
  
  // Get all active banners
  static async getActiveBanners(): Promise<Banner[]> {
    try {
      // For production, use the actual API call
      if (process.env.NODE_ENV === 'production') {
        const response = await api.get<BannersResponse>('/banners');
        return response.data.banners;
      }
      
      // Try to call the backend API in development but fallback to mock data
      try {
        const response = await api.get<BannersResponse>('/banners');
        return response.data.banners;
      } catch (error) {
        console.warn('Using mock active banner data in development mode');
        // For development/testing, filter dummy data
        const activeBanners = initialBanners.filter(banner => banner.active);
        return Promise.resolve(activeBanners);
      }
    } catch (error) {
      console.error('Error fetching active banners:', error);
      return [];
    }
  }
  
  // Get notification bar
  static async getNotificationBar(): Promise<NotificationBar | null> {
    try {
      // For production, use the actual API call
      if (process.env.NODE_ENV === 'production') {
        const response = await api.get<NotificationBarResponse>('/admin/notification-bar');
        return response.data.notificationBar;
      }
      
      // Try to call the backend API in development but fallback to mock data
      try {
        const response = await api.get<NotificationBarResponse>('/admin/notification-bar');
        return response.data.notificationBar;
      } catch (error) {
        console.warn('Using mock notification bar data in development mode');
        return Promise.resolve(initialNotificationBar);
      }
    } catch (error) {
      console.error('Error fetching notification bar:', error);
      return null;
    }
  }
  
  // Get active notification bar for storefront
  static async getActiveNotificationBar(): Promise<NotificationBar | null> {
    try {
      // For production, use the actual API call
      if (process.env.NODE_ENV === 'production') {
        const response = await api.get<NotificationBarResponse>('/notification-bar');
        return response.data.notificationBar;
      }
      
      // Try to call the backend API in development but fallback to mock data
      try {
        const response = await api.get<NotificationBarResponse>('/notification-bar');
        return response.data.notificationBar;
      } catch (error) {
        console.warn('Using mock active notification bar data in development mode');
        return initialNotificationBar.active ? initialNotificationBar : null;
      }
    } catch (error) {
      console.error('Error fetching active notification bar:', error);
      return null;
    }
  }
  
  // Update banner
  static async updateBanner(banner: Banner): Promise<Banner> {
    try {
      // For production, use the actual API call
      if (process.env.NODE_ENV === 'production') {
        const response = await api.put<BannerResponse>(`/admin/banners/${banner.id}`, banner);
        return response.data.banner;
      }
      
      // Try to call the backend API in development but fallback to mock data
      try {
        const response = await api.put<BannerResponse>(`/admin/banners/${banner.id}`, banner);
        return response.data.banner;
      } catch (error) {
        console.warn('Using mock update in development mode');
        // For development/testing, update dummy data
        const updatedBanner = { ...banner };
        return Promise.resolve(updatedBanner);
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  }
  
  // Create banner
  static async createBanner(banner: Omit<Banner, 'id'>): Promise<Banner> {
    try {
      // For production, use the actual API call
      if (process.env.NODE_ENV === 'production') {
        const response = await api.post<BannerResponse>('/admin/banners', banner);
        return response.data.banner;
      }
      
      // Try to call the backend API in development but fallback to mock data
      try {
        const response = await api.post<BannerResponse>('/admin/banners', banner);
        return response.data.banner;
      } catch (error) {
        console.warn('Using mock creation in development mode');
        // For development/testing, create dummy banner
        const newBanner = { 
          ...banner, 
          id: Math.floor(Math.random() * 1000) + 100 
        } as Banner;
        return Promise.resolve(newBanner);
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  }
  
  // Delete banner
  static async deleteBanner(id: number): Promise<boolean> {
    try {
      // For production, use the actual API call
      if (process.env.NODE_ENV === 'production') {
        await api.delete(`/admin/banners/${id}`);
        return true;
      }
      
      // Try to call the backend API in development but fallback to mock response
      try {
        await api.delete(`/admin/banners/${id}`);
        return true;
      } catch (error) {
        console.warn('Using mock deletion in development mode');
        return Promise.resolve(true);
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  }
  
  // Update notification bar
  static async updateNotificationBar(notificationBar: NotificationBar): Promise<NotificationBar> {
    try {
      // For production, use the actual API call
      if (process.env.NODE_ENV === 'production') {
        const response = await api.put<NotificationBarResponse>('/admin/notification-bar', notificationBar);
        return response.data.notificationBar;
      }
      
      // Try to call the backend API in development but fallback to mock data
      try {
        const response = await api.put<NotificationBarResponse>('/admin/notification-bar', notificationBar);
        return response.data.notificationBar;
      } catch (error) {
        console.warn('Using mock update in development mode');
        // For development/testing, update dummy data
        const updatedNotificationBar = { ...notificationBar };
        return Promise.resolve(updatedNotificationBar);
      }
    } catch (error) {
      console.error('Error updating notification bar:', error);
      throw error;
    }
  }
  
  // Toggle banner status
  static async toggleBannerStatus(id: number): Promise<Banner> {
    try {
      // For production, use the actual API call
      if (process.env.NODE_ENV === 'production') {
        const response = await api.put<BannerResponse>(`/admin/banners/${id}/toggle-status`);
        return response.data.banner;
      }
      
      // Try to call the backend API in development but fallback to mock data
      try {
        const response = await api.put<BannerResponse>(`/admin/banners/${id}/toggle-status`);
        return response.data.banner;
      } catch (error) {
        console.warn('Using mock toggle in development mode');
        // For development/testing, toggle status in dummy data
        const banner = initialBanners.find(b => b.id === id);
        if (!banner) throw new Error('Banner not found');
        
        const updatedBanner = { ...banner, active: !banner.active };
        return Promise.resolve(updatedBanner);
      }
    } catch (error) {
      console.error('Error toggling banner status:', error);
      throw error;
    }
  }
  
  // Toggle notification bar status
  static async toggleNotificationBarStatus(): Promise<NotificationBar> {
    try {
      // For production, use the actual API call
      if (process.env.NODE_ENV === 'production') {
        const response = await api.put<NotificationBarResponse>('/admin/notification-bar/toggle-status');
        return response.data.notificationBar;
      }
      
      // Try to call the backend API in development but fallback to mock data
      try {
        const response = await api.put<NotificationBarResponse>('/admin/notification-bar/toggle-status');
        return response.data.notificationBar;
      } catch (error) {
        console.warn('Using mock toggle in development mode');
        // For development/testing, toggle status in dummy data
        const updatedNotificationBar = { 
          ...initialNotificationBar, 
          active: !initialNotificationBar.active 
        };
        return Promise.resolve(updatedNotificationBar);
      }
    } catch (error) {
      console.error('Error toggling notification bar status:', error);
      throw error;
    }
  }
}
