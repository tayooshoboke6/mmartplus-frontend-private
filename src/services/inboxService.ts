import api from './api';

// Define types
export interface InboxMessage {
  id: number;
  subject: string;
  content: string;
  sender: string;
  date: string;
  read: boolean;
  starred: boolean;
  campaignId?: string;
  messageType?: 'system' | 'campaign' | 'notification';
}

interface InboxResponse {
  status: string;
  data: InboxMessage[];
}

const LOCAL_STORAGE_KEY = 'mmartplus_inbox';

const inboxService = {
  // Get user inbox messages
  getInboxMessages: async (): Promise<InboxMessage[]> => {
    try {
      // Try to get from API first
      try {
        const response = await api.get<InboxResponse>('/user/inbox');
        if (response.data.status === 'success') {
          return response.data.data.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        }
      } catch (error) {
        console.log('Using local storage for inbox as fallback');
      }

      // Fallback to localStorage during development
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!storedItems) {
        // For new users, only show welcome message
        const welcomeMessage: InboxMessage = {
          id: 1,
          subject: 'Welcome to M-Mart+',
          content: 'Thank you for creating an account with M-Mart+. We are excited to have you on board!',
          sender: 'M-Mart+ Team',
          date: new Date().toISOString().slice(0, 10),
          read: false,
          starred: false,
          messageType: 'system'
        };
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([welcomeMessage]));
        return [welcomeMessage];
      }
      
      const messages: InboxMessage[] = JSON.parse(storedItems);
      return messages.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error('Error fetching inbox messages:', error);
      return [];
    }
  },

  // Mark message as read
  markAsRead: async (messageId: number): Promise<boolean> => {
    try {
      // Try API first
      try {
        const response = await api.patch(`/user/inbox/${messageId}/read`);
        if (response.data.status === 'success') {
          return true;
        }
      } catch (error) {
        console.log('Using local storage for inbox as fallback');
      }

      // Fallback to localStorage
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!storedItems) return false;
      
      const messages: InboxMessage[] = JSON.parse(storedItems);
      const updatedMessages = messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      );
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMessages));
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  },

  // Delete message
  deleteMessage: async (messageId: number): Promise<boolean> => {
    try {
      // Try API first
      try {
        const response = await api.delete(`/user/inbox/${messageId}`);
        if (response.data.status === 'success') {
          return true;
        }
      } catch (error) {
        console.log('Using local storage for inbox as fallback');
      }

      // Fallback to localStorage
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!storedItems) return false;
      
      const messages: InboxMessage[] = JSON.parse(storedItems);
      const updatedMessages = messages.filter(msg => msg.id !== messageId);
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMessages));
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  },

  // Clear inbox
  clearInbox: async (): Promise<boolean> => {
    try {
      // Try API first
      try {
        const response = await api.delete('/user/inbox/clear');
        if (response.data.status === 'success') {
          return true;
        }
      } catch (error) {
        console.log('Using local storage for inbox as fallback');
      }

      // Fallback to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error clearing inbox:', error);
      return false;
    }
  },

  // Add campaign message to inbox (used for testing)
  addCampaignMessage: async (message: { 
    subject: string; 
    content: string;
    campaignId?: string;
  }): Promise<boolean> => {
    try {
      // Try API first
      try {
        const response = await api.post('/user/inbox', {
          ...message,
          messageType: 'campaign'
        });
        if (response.data.status === 'success') {
          return true;
        }
      } catch (error) {
        console.log('Using local storage for inbox as fallback');
      }

      // Fallback to localStorage
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      const messages: InboxMessage[] = storedItems ? JSON.parse(storedItems) : [];

      const newMessage: InboxMessage = {
        id: Date.now(), // Use timestamp as a unique ID
        subject: message.subject,
        content: message.content,
        sender: 'M-Mart+ Marketing',
        date: new Date().toISOString().slice(0, 10),
        read: false,
        starred: false,
        campaignId: message.campaignId || undefined,
        messageType: 'campaign'
      };

      const updatedMessages = [...messages, newMessage];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMessages));
      return true;
    } catch (error) {
      console.error('Error adding campaign message:', error);
      return false;
    }
  }
};

export default inboxService;
