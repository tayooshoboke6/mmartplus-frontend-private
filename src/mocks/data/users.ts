import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  password: string; // In a real app, this would be hashed
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export const users: User[] = [
  {
    id: '1',
    email: 'admin@mmart.com',
    password: 'admin123', // In a real app, this would be hashed
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString()
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'password123', // In a real app, this would be hashed
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString()
  }
];

// Helper functions for user operations
export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  const newUser: User = {
    ...userData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  return newUser;
};

export const updateUser = (id: string, userData: Partial<User>): User | null => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;
  
  users[index] = {
    ...users[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  return users[index];
};
