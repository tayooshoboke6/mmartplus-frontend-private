import { Banner, NotificationBar } from '../models/Promotion';

// Mock data - in a real application, this would be stored in a database
// and accessed via API calls

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

// Local storage keys
const BANNERS_STORAGE_KEY = 'mmart_banners';
const NOTIFICATION_BAR_STORAGE_KEY = 'mmart_notification_bar';

// Helper to get data from localStorage with fallback to initial data
const getStoredData = <T>(key: string, initialData: T): T => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : initialData;
};

// Helper to save data to localStorage
const saveData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Banner service methods
export const getBanners = (): Banner[] => {
  return getStoredData<Banner[]>(BANNERS_STORAGE_KEY, initialBanners);
};

export const getActiveBanners = (): Banner[] => {
  const banners = getBanners();
  return banners.filter(banner => banner.active);
};

export const updateBanner = (updatedBanner: Banner): Banner[] => {
  const banners = getBanners();
  const updatedBanners = banners.map(banner => 
    banner.id === updatedBanner.id ? updatedBanner : banner
  );
  saveData(BANNERS_STORAGE_KEY, updatedBanners);
  return updatedBanners;
};

export const toggleBannerStatus = (id: number): Banner[] => {
  const banners = getBanners();
  const updatedBanners = banners.map(banner => 
    banner.id === id ? { ...banner, active: !banner.active } : banner
  );
  saveData(BANNERS_STORAGE_KEY, updatedBanners);
  return updatedBanners;
};

// Notification bar service methods
export const getNotificationBar = (): NotificationBar => {
  return getStoredData<NotificationBar>(NOTIFICATION_BAR_STORAGE_KEY, initialNotificationBar);
};

export const updateNotificationBar = (updatedNotificationBar: NotificationBar): NotificationBar => {
  saveData(NOTIFICATION_BAR_STORAGE_KEY, updatedNotificationBar);
  return updatedNotificationBar;
};

export const toggleNotificationBarStatus = (): NotificationBar => {
  const notificationBar = getNotificationBar();
  const updatedNotificationBar = { 
    ...notificationBar, 
    active: !notificationBar.active 
  };
  saveData(NOTIFICATION_BAR_STORAGE_KEY, updatedNotificationBar);
  return updatedNotificationBar;
};
