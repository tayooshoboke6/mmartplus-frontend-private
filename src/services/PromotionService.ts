import api from './api';
import { Banner, NotificationBar } from '../models/Promotion';

// Response interfaces
export interface BannerResponse {
  success: boolean;
  banner: Banner;
}

export interface BannersResponse {
  success: boolean;
  banners: Banner[];
}

export interface NotificationBarResponse {
  success: boolean;
  notificationBar: NotificationBar;
}

// Initial banners data
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
    active: true,
    label: 'Flash Sale',
    title: 'FRESH PRODUCE DEALS',
    description: 'Limited time offer on fresh fruits and vegetables',
    image: '/banners/fresh-produce.png',
    bgColor: '#4CAF50',
    imgBgColor: '#e8f5e9',
    link: '/flash-sale'
  },
  {
    id: 3,
    active: true,
    label: 'New Arrivals',
    title: 'PREMIUM HOME ESSENTIALS',
    description: 'Discover our new range of kitchen and household products',
    image: '/banners/home-essentials.png',
    bgColor: '#FF9800',
    imgBgColor: '#fff3e0',
    link: '/new-arrivals'
  }
];

// Initial notification bar data
const initialNotificationBar: NotificationBar = {
  id: 1,
  active: true,
  message: 'Free delivery on orders above ₦25,000! Shop now for great deals on groceries.',
  linkText: 'See Offers',
  linkUrl: '/promotions',
  bgColor: '#e25822'
};

// Promotion service with real API endpoints
export const PromotionService = {
  // Banner service methods
  getBanners: async (): Promise<Banner[]> => {
    try {
      const response = await api.get<BannersResponse>('/banners');
      return response.data.banners;
    } catch (error) {
      console.error('Error fetching banners:', error);
      // Return initial data as fallback if API fails
      return initialBanners;
    }
  },

  getActiveBanners: async (): Promise<Banner[]> => {
    try {
      const response = await api.get<BannersResponse>('/banners', {
        params: { active: true }
      });
      return response.data.banners;
    } catch (error) {
      console.error('Error fetching active banners:', error);
      // Return active initial data as fallback
      return initialBanners.filter(banner => banner.active);
    }
  },

  updateBanner: async (updatedBanner: Banner): Promise<Banner> => {
    try {
      const response = await api.put<BannerResponse>(`/banners/${updatedBanner.id}`, updatedBanner);
      return response.data.banner;
    } catch (error) {
      console.error(`Error updating banner #${updatedBanner.id}:`, error);
      throw error;
    }
  },

  toggleBannerStatus: async (id: number): Promise<Banner> => {
    try {
      const response = await api.put<BannerResponse>(`/banners/${id}/toggle-status`);
      return response.data.banner;
    } catch (error) {
      console.error(`Error toggling banner #${id} status:`, error);
      throw error;
    }
  },

  // Notification bar service methods
  getNotificationBar: async (): Promise<NotificationBar> => {
    try {
      const response = await api.get<NotificationBarResponse>('/notification-bar');
      return response.data.notificationBar;
    } catch (error) {
      console.error('Error fetching notification bar:', error);
      // Return initial data as fallback
      return initialNotificationBar;
    }
  },

  updateNotificationBar: async (updatedNotificationBar: NotificationBar): Promise<NotificationBar> => {
    try {
      const response = await api.put<NotificationBarResponse>('/notification-bar', updatedNotificationBar);
      return response.data.notificationBar;
    } catch (error) {
      console.error('Error updating notification bar:', error);
      throw error;
    }
  },

  toggleNotificationBarStatus: async (): Promise<NotificationBar> => {
    try {
      const response = await api.put<NotificationBarResponse>('/notification-bar/toggle-status');
      return response.data.notificationBar;
    } catch (error) {
      console.error('Error toggling notification bar status:', error);
      throw error;
    }
  }
};

// Export individual functions to maintain compatibility with existing imports
export const getBanners = PromotionService.getBanners;
export const getActiveBanners = PromotionService.getActiveBanners;
export const updateBanner = PromotionService.updateBanner;
export const toggleBannerStatus = PromotionService.toggleBannerStatus;
export const getNotificationBar = PromotionService.getNotificationBar;
export const updateNotificationBar = PromotionService.updateNotificationBar;
export const toggleNotificationBarStatus = PromotionService.toggleNotificationBarStatus;

export default PromotionService;
