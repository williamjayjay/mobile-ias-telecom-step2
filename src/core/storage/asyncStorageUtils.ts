import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenResultRawResponse } from '@/presentation/ui/screens/public/WelcomeScreen/types';

interface UserData {
  user: TokenResultRawResponse;
  tasks: any[]; // Replace 'any' with your task type if defined
}

interface StorageProvider {
  setAuthorizedState: (state: string) => Promise<void>;
  getAuthorizedState: () => Promise<string | null>;
  removeAuthorizedState: () => Promise<void>;
  setUserData: (user: TokenResultRawResponse) => Promise<void>;
  getUsersData: () => Promise<UserData[]>;
  getUserData: (userId: string) => Promise<UserData | null>;
  setUserTasks: (userId: string, tasks: any[]) => Promise<void>;
  getUserTasks: (userId: string) => Promise<any[]>;
  addUserTask: (userId: string, task: any) => Promise<void>;
  removeUserTask: (userId: string, taskId: string) => Promise<void>;
  clearUserData: () => Promise<void>;
}

const USER_AUTHORIZED_KEY = 'user_authorized';
const USERS_KEY = 'users';

export const asyncStorageProvider: StorageProvider = {
  // Store the authorized state
  async setAuthorizedState(state: string) {
    try {
      await AsyncStorage.setItem(USER_AUTHORIZED_KEY, state);
    } catch (error) {
      console.error('Error setting authorized state:', error);
      throw error;
    }
  },

  // Retrieve the authorized state
  async getAuthorizedState() {
    try {
      return await AsyncStorage.getItem(USER_AUTHORIZED_KEY);
    } catch (error) {
      console.error('Error retrieving authorized state:', error);
      throw error;
    }
  },

  // Remove the authorized state
  async removeAuthorizedState() {
    try {
      await AsyncStorage.removeItem(USER_AUTHORIZED_KEY);
    } catch (error) {
      console.error('Error removing authorized state:', error);
      throw error;
    }
  },

  // Store a single user's data
  async setUserData(user: TokenResultRawResponse) {
    try {
      const users = await this.getUsersData();
      const existingUserIndex = users.findIndex(u => u.user.id === user.id); // Adjust 'id' based on your TokenResultRawResponse structure
      if (existingUserIndex !== -1) {
        // Update existing user
        users[existingUserIndex].user = user;
      } else {
        // Add new user with empty tasks
        users.push({ user, tasks: [] });
      }
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  // Retrieve all users' data
  async getUsersData(): Promise<UserData[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error retrieving users data:', error);
      throw error;
    }
  },

  // Retrieve a specific user's data by ID
  async getUserData(userId: string): Promise<UserData | null> {
    try {
      const users = await this.getUsersData();
      return users.find(u => u.user.id === userId) || null; // Adjust 'id' based on your TokenResultRawResponse structure
    } catch (error) {
      console.error('Error retrieving user data:', error);
      throw error;
    }
  },

  // Store tasks for a specific user
  async setUserTasks(userId: string, tasks: any[]) {
    try {
      const users = await this.getUsersData();
      const userIndex = users.findIndex(u => u.user.id === userId); // Adjust 'id' based on your TokenResultRawResponse structure
      if (userIndex !== -1) {
        users[userIndex].tasks = tasks;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error saving user tasks:', error);
      throw error;
    }
  },

  // Retrieve tasks for a specific user
  async getUserTasks(userId: string): Promise<any[]> {
    try {
      const user = await this.getUserData(userId);
      return user ? user.tasks : [];
    } catch (error) {
      console.error('Error retrieving user tasks:', error);
      throw error;
    }
  },

  // Add a single task for a specific user
  async addUserTask(userId: string, task: any) {
    try {
      const users = await this.getUsersData();
      const userIndex = users.findIndex(u => u.user.id === userId); // Adjust 'id' based on your TokenResultRawResponse structure
      if (userIndex !== -1) {
        users[userIndex].tasks.push(task);
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error adding user task:', error);
      throw error;
    }
  },

  // Remove a specific task for a user
  async removeUserTask(userId: string, taskId: string) {
    try {
      const users = await this.getUsersData();
      const userIndex = users.findIndex(u => u.user.id === userId); // Adjust 'id' based on your TokenResultRawResponse structure
      if (userIndex !== -1) {
        users[userIndex].tasks = users[userIndex].tasks.filter(t => t.id !== taskId); // Adjust 'id' based on your task structure
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error removing user task:', error);
      throw error;
    }
  },

  // Clear all user data
  async clearUserData() {
    try {
      await AsyncStorage.removeItem(USERS_KEY);
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw error;
    }
  },
};

// Export individual functions for convenience
export const {
  setAuthorizedState,
  getAuthorizedState,
  removeAuthorizedState,
  setUserData,
  getUsersData,
  getUserData,
  setUserTasks,
  getUserTasks,
  addUserTask,
  removeUserTask,
  clearUserData,
} = asyncStorageProvider;
