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

// Mock campaign messages data
const MOCK_CAMPAIGN_MESSAGES: CampaignMessage[] = [
  {
    id: '1',
    title: 'Welcome to M-Mart+',
    subject: 'Welcome to M-Mart+ - Your Shopping Journey Begins!',
    content: '<p>Dear Customer,</p><p>Welcome to M-Mart+! We\'re excited to have you join our community of shoppers.</p><p>Explore our wide range of products and enjoy a seamless shopping experience.</p><p>Happy shopping!</p><p>The M-Mart+ Team</p>',
    recipients: {
      id: '1',
      userSegment: USER_SEGMENTS.NEW
    },
    sendToEmail: true,
    sendToInbox: true,
    status: 'sent',
    sentAt: '2025-02-15T10:30:00Z',
    createdAt: '2025-02-14T15:45:00Z',
    updatedAt: '2025-02-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Special Discount for Premium Members',
    subject: 'Exclusive 20% Off for Our Premium Members',
    content: '<p>Dear Premium Member,</p><p>As a valued premium customer, we\'re offering you an exclusive 20% discount on all products.</p><p>Use code <strong>PREMIUM20</strong> at checkout.</p><p>Offer valid until March 31, 2025.</p><p>The M-Mart+ Team</p>',
    recipients: {
      id: '2',
      userSegment: USER_SEGMENTS.PREMIUM
    },
    sendToEmail: true,
    sendToInbox: true,
    status: 'scheduled',
    scheduledDate: '2025-03-15T08:00:00Z',
    createdAt: '2025-03-10T14:20:00Z',
    updatedAt: '2025-03-10T14:20:00Z'
  },
  {
    id: '3',
    title: 'We Miss You!',
    subject: 'We Miss You - Come Back and Get 15% Off',
    content: '<p>Dear Customer,</p><p>We\'ve noticed you haven\'t shopped with us in a while.</p><p>We miss you! Come back and enjoy 15% off your next purchase.</p><p>Use code <strong>COMEBACK15</strong> at checkout.</p><p>The M-Mart+ Team</p>',
    recipients: {
      id: '3',
      userSegment: USER_SEGMENTS.INACTIVE
    },
    sendToEmail: true,
    sendToInbox: false,
    status: 'draft',
    createdAt: '2025-03-05T11:15:00Z',
    updatedAt: '2025-03-05T11:15:00Z'
  },
  {
    id: '4',
    title: 'Thank You for Your Loyalty',
    subject: 'Thank You for Being a Loyal Customer',
    content: '<p>Dear Valued Customer,</p><p>We want to thank you for your continued loyalty to M-Mart+.</p><p>As a token of our appreciation, we\'re offering you a special gift with your next purchase over $100.</p><p>The M-Mart+ Team</p>',
    recipients: {
      id: '4',
      userSegment: USER_SEGMENTS.FREQUENT
    },
    sendToEmail: true,
    sendToInbox: true,
    status: 'sent',
    sentAt: '2025-02-28T09:45:00Z',
    createdAt: '2025-02-25T16:30:00Z',
    updatedAt: '2025-02-28T09:45:00Z'
  },
  {
    id: '5',
    title: 'New Product Launch',
    subject: 'Exciting New Products Just Arrived!',
    content: '<p>Dear Customer,</p><p>We\'re excited to announce the launch of our new product line!</p><p>Be among the first to explore these amazing products.</p><p>Shop now and enjoy early bird discounts.</p><p>The M-Mart+ Team</p>',
    recipients: {
      id: '5',
      all: true
    },
    sendToEmail: true,
    sendToInbox: true,
    status: 'draft',
    createdAt: '2025-03-08T13:10:00Z',
    updatedAt: '2025-03-08T13:10:00Z'
  }
];

const adminMessageService = {
  // Get all campaign messages
  getAllCampaignMessages: async (): Promise<CampaignMessage[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve([...MOCK_CAMPAIGN_MESSAGES]);
      }, 300);
    });
  },

  // Get campaign message by ID
  getCampaignMessageById: async (id: string): Promise<CampaignMessage | null> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const message = MOCK_CAMPAIGN_MESSAGES.find(msg => msg.id === id);
        resolve(message || null);
      }, 300);
    });
  },

  // Create new campaign message
  createCampaignMessage: async (message: CampaignMessage): Promise<CampaignMessage | null> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Generate a new ID
        const newId = (Math.max(...MOCK_CAMPAIGN_MESSAGES.map(msg => parseInt(msg.id || '0'))) + 1).toString();
        
        // Create new message with timestamps
        const newMessage: CampaignMessage = {
          ...message,
          id: newId,
          status: message.scheduledDate ? 'scheduled' : 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Add to mock data
        MOCK_CAMPAIGN_MESSAGES.push(newMessage);
        
        resolve({...newMessage});
      }, 500);
    });
  },

  // Update campaign message
  updateCampaignMessage: async (id: string, message: Partial<CampaignMessage>): Promise<CampaignMessage | null> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const index = MOCK_CAMPAIGN_MESSAGES.findIndex(msg => msg.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        // Update the message
        const updatedMessage: CampaignMessage = {
          ...MOCK_CAMPAIGN_MESSAGES[index],
          ...message,
          updatedAt: new Date().toISOString()
        };
        
        // Update in mock data
        MOCK_CAMPAIGN_MESSAGES[index] = updatedMessage;
        
        resolve({...updatedMessage});
      }, 500);
    });
  },

  // Delete campaign message
  deleteCampaignMessage: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const index = MOCK_CAMPAIGN_MESSAGES.findIndex(msg => msg.id === id);
        
        if (index === -1) {
          resolve(false);
          return;
        }
        
        // Remove from mock data
        MOCK_CAMPAIGN_MESSAGES.splice(index, 1);
        
        resolve(true);
      }, 300);
    });
  },

  // Send campaign message immediately
  sendCampaignMessage: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const index = MOCK_CAMPAIGN_MESSAGES.findIndex(msg => msg.id === id);
        
        if (index === -1) {
          resolve(false);
          return;
        }
        
        // Update the message status
        MOCK_CAMPAIGN_MESSAGES[index] = {
          ...MOCK_CAMPAIGN_MESSAGES[index],
          status: 'sent',
          sentAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        resolve(true);
      }, 500);
    });
  },

  // Get user segments
  getUserSegments: async (): Promise<string[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve(Object.values(USER_SEGMENTS));
      }, 200);
    });
  }
};

export default adminMessageService;
