import api from './api';

// Define types
export interface MessageRecipient {
  id: string;
  all?: boolean;
  userIds?: string[];
  userSegment?: string; // premium, new, inactive, etc.
}

export interface CampaignMessage {
  id?: string;
  title: string;
  subject: string;
  content: string;
  recipients: MessageRecipient;
  sendToEmail: boolean;
  sendToInbox: boolean;
  scheduledDate?: string;
  status?: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  sentAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CampaignMessageResponse {
  status: string;
  data: CampaignMessage[];
}

export interface CampaignMessageDetailResponse {
  status: string;
  data: CampaignMessage;
}

// Constants for user segments
export const USER_SEGMENTS = {
  ALL: 'all',
  PREMIUM: 'premium',
  NEW: 'new_users',
  INACTIVE: 'inactive',
  FREQUENT: 'frequent_shoppers',
};

const adminMessageService = {
  // Get all campaign messages
  getAllCampaignMessages: async (): Promise<CampaignMessage[]> => {
    try {
      const response = await api.get<CampaignMessageResponse>('/admin/messages/campaigns');
      if (response.data.status === 'success') {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching campaign messages:', error);
      throw error;
    }
  },

  // Get campaign message by ID
  getCampaignMessageById: async (id: string): Promise<CampaignMessage | null> => {
    try {
      const response = await api.get<CampaignMessageDetailResponse>(`/admin/messages/campaigns/${id}`);
      if (response.data.status === 'success') {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching campaign message with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new campaign message
  createCampaignMessage: async (message: CampaignMessage): Promise<CampaignMessage | null> => {
    try {
      const response = await api.post<CampaignMessageDetailResponse>('/admin/messages/campaigns', message);
      if (response.data.status === 'success') {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating campaign message:', error);
      throw error;
    }
  },

  // Update campaign message
  updateCampaignMessage: async (id: string, message: Partial<CampaignMessage>): Promise<CampaignMessage | null> => {
    try {
      const response = await api.put<CampaignMessageDetailResponse>(`/admin/messages/campaigns/${id}`, message);
      if (response.data.status === 'success') {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error(`Error updating campaign message with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete campaign message
  deleteCampaignMessage: async (id: string): Promise<boolean> => {
    try {
      const response = await api.delete(`/admin/messages/campaigns/${id}`);
      return response.data.status === 'success';
    } catch (error) {
      console.error(`Error deleting campaign message with ID ${id}:`, error);
      throw error;
    }
  },

  // Send campaign message immediately
  sendCampaignMessage: async (id: string): Promise<boolean> => {
    try {
      const response = await api.post(`/admin/messages/campaigns/${id}/send`);
      return response.data.status === 'success';
    } catch (error) {
      console.error(`Error sending campaign message with ID ${id}:`, error);
      throw error;
    }
  },

  // Get user segments
  getUserSegments: async (): Promise<string[]> => {
    try {
      const response = await api.get('/admin/users/segments');
      if (response.data.status === 'success') {
        return response.data.data;
      }
      return Object.values(USER_SEGMENTS);
    } catch (error) {
      console.error('Error fetching user segments:', error);
      // Return default segments if API fails
      return Object.values(USER_SEGMENTS);
    }
  }
};

export default adminMessageService;
