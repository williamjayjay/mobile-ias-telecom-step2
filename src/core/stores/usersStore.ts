import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TokenResultRawResponse } from '@/presentation/ui/screens/public/WelcomeScreen/types';
import { ITask } from '@/core/interfaces/tasks';
import { TaskStatus } from '@/core/enums/task';
import { USER_AUTHORIZED_KEY, USERS_KEY } from '@/core/constants/stores';

interface UserData {
  user: TokenResultRawResponse;
  tasks: ITask[];
}

interface StorageState {
  authorizedState: string | null;
  users: UserData[];
  setAuthorizedState: (state: string) => Promise<void>;
  getAuthorizedState: () => Promise<string | null>;
  removeAuthorizedState: () => Promise<void>;
  setUserData: (user: TokenResultRawResponse) => Promise<void>;
  getUsersData: () => Promise<UserData[]>;
  getUserData: (userId: string) => Promise<UserData | null>;
  setUserTasks: (userId: string, tasks: ITask[]) => Promise<void>;
  getUserTasks: (userId: string) => Promise<ITask[]>;
  addUserTask: (userId: string, task: ITask) => Promise<void>;
  removeUserTask: (userId: string, taskId: string) => Promise<void>;
  completeUserTask: (userId: string, taskId: string) => Promise<void>;
  openUserTask: (userId: string, taskId: string) => Promise<void>;
  completeUserTasksBulk: (userId: string, taskIds: string[]) => Promise<void>;
  removeUserTasksBulk: (userId: string, taskIds: string[]) => Promise<void>;
  clearUserData: () => Promise<void>;
}



export const useStorageStore = create<StorageState>()(
  persist(
    (set, get) => ({
      authorizedState: null,
      users: [],

      async setAuthorizedState(state: string) {
        try {
          await AsyncStorage.setItem(USER_AUTHORIZED_KEY, state);
          set({ authorizedState: state });
        } catch (error) {
          console.error('Error setting authorized state:', error);
          throw error;
        }
      },

      async getAuthorizedState() {
        try {
          const state = await AsyncStorage.getItem(USER_AUTHORIZED_KEY);
          set({ authorizedState: state });
          return state;
        } catch (error) {
          console.error('Error retrieving authorized state:', error);
          throw error;
        }
      },

      async removeAuthorizedState() {
        try {
          await AsyncStorage.removeItem(USER_AUTHORIZED_KEY);
          set({ authorizedState: null });
        } catch (error) {
          console.error('Error removing authorized state:', error);
          throw error;
        }
      },

      async setUserData(user: TokenResultRawResponse) {
        try {
          const users = get().users;
          const existingUserIndex = users.findIndex(u => u.user.usuarioId === user.usuarioId);

          let updatedUsers: UserData[];

          if (existingUserIndex !== -1) {
            updatedUsers = [...users];
            updatedUsers[existingUserIndex].user = user;
          } else {
            updatedUsers = [...users, { user, tasks: [] }];
          }

          await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
          set({ users: updatedUsers });
        } catch (error) {
          console.error('Error saving user data:', error);
          throw error;
        }
      },

      async getUsersData() {
        try {
          const usersJson = await AsyncStorage.getItem(USERS_KEY);
          const users = usersJson ? JSON.parse(usersJson) : [];
          set({ users });
          return users;
        } catch (error) {
          console.error('Error retrieving users data:', error);
          throw error;
        }
      },

      async getUserData(userId: string) {
        try {
          const users = get().users;
          const user = users.find(u => u.user.usuarioId?.toString() === userId);
          return user || null;
        } catch (error) {
          console.error('Error retrieving user data:', error);
          throw error;
        }
      },

      async setUserTasks(userId: string, tasks: ITask[]) {
        try {
          const users = get().users;
          const userIndex = users.findIndex(u => u.user.usuarioId?.toString() === userId);
          if (userIndex !== -1) {
            const updatedUsers = [...users];
            updatedUsers[userIndex].tasks = tasks;
            await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
            set({ users: updatedUsers });
          } else {
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Error saving user tasks:', error);
          throw error;
        }
      },

      async getUserTasks(userId: string) {
        try {
          const user = await get().getUserData(userId);
          return user ? user.tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
        } catch (error) {
          console.error('Error retrieving user tasks:', error);
          throw error;
        }
      },

      async addUserTask(userId: string, task: ITask) {
        try {
          const users = get().users;
          const userIndex = users.findIndex(u => u.user.usuarioId?.toString() === userId);
          if (userIndex !== -1) {
            const updatedUsers = [...users];
            updatedUsers[userIndex].tasks.push(task);
            await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
            set({ users: updatedUsers });
          } else {
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Error adding user task:', error);
          throw error;
        }
      },

      async removeUserTask(userId: string, taskId: string) {
        try {
          const users = get().users;
          const userIndex = users.findIndex(u => u.user.usuarioId?.toString() === userId);
          if (userIndex !== -1) {
            const updatedUsers = [...users];
            updatedUsers[userIndex].tasks = updatedUsers[userIndex].tasks.filter(
              t => t.id !== taskId,
            );
            await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
            set({ users: updatedUsers });
          } else {
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Error removing user task:', error);
          throw error;
        }
      },

      async completeUserTask(userId: string, taskId: string) {
        try {
          const users = get().users;
          const userIndex = users.findIndex(u => u.user.usuarioId?.toString() === userId);
          if (userIndex !== -1) {
            const updatedUsers = [...users];
            const taskIndex = updatedUsers[userIndex].tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
              updatedUsers[userIndex].tasks[taskIndex] = {
                ...updatedUsers[userIndex].tasks[taskIndex],
                status: TaskStatus.Concluida
              };
              await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
              set({ users: updatedUsers });
            } else {
              throw new Error('Task not found');
            }
          } else {
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Error completing user task:', error);
          throw error;
        }
      },

      async openUserTask(userId: string, taskId: string) {
        try {
          const users = get().users;
          const userIndex = users.findIndex(u => u.user.usuarioId?.toString() === userId);
          if (userIndex !== -1) {
            const updatedUsers = [...users];
            const taskIndex = updatedUsers[userIndex].tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
              updatedUsers[userIndex].tasks[taskIndex] = {
                ...updatedUsers[userIndex].tasks[taskIndex],
                status: TaskStatus.Aberta
              };
              await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
              set({ users: updatedUsers });
            } else {
              throw new Error('Task not found');
            }
          } else {
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Error completing user task:', error);
          throw error;
        }
      },



      async completeUserTasksBulk(userId: string, taskIds: string[]) {
        try {
          const users = get().users;
          const userIndex = users.findIndex(u => u.user.usuarioId?.toString() === userId);
          if (userIndex !== -1) {
            const updatedUsers = [...users];
            updatedUsers[userIndex].tasks = updatedUsers[userIndex].tasks.map(task =>
              taskIds.includes(task.id?.toString()) ? { ...task, status: TaskStatus.Concluida } : task,
            );
            await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
            set({ users: updatedUsers });
          } else {
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Error completing user tasks in bulk:', error);
          throw error;
        }
      },

      async removeUserTasksBulk(userId: string, taskIds: string[]) {
        try {
          const users = get().users;
          const userIndex = users.findIndex(u => u.user.usuarioId?.toString() === userId);
          if (userIndex !== -1) {
            const updatedUsers = [...users];
            updatedUsers[userIndex].tasks = updatedUsers[userIndex].tasks.filter(
              t => !taskIds.includes(t.id?.toString()),
            );
            await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
            set({ users: updatedUsers });
          } else {
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Error removing user tasks in bulk:', error);
          throw error;
        }
      },

      async clearUserData() {
        try {
          await AsyncStorage.removeItem(USERS_KEY);
          set({ users: [] });
        } catch (error) {
          console.error('Error clearing user data:', error);
          throw error;
        }
      },
    }),
    {
      name: 'storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        authorizedState: state.authorizedState,
        users: state.users,
      }),
    },
  ),
);
