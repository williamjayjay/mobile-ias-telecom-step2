import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TokenResultRawResponse } from '@/presentation/ui/screens/public/WelcomeScreen/types';
import { useStorageStore } from '@/core/stores/usersStore';

interface UserData {
  user: TokenResultRawResponse;
  tasks: any[]; // Replace 'any' with your task type if defined
}

interface AuthContextType {
  authorizedState: string | null;
  users: UserData[] | null;
  contextUserData: UserData | null;
  userTasks: any[];
  setAuthorizedState: (state: string) => Promise<void>;
  setUserData: (user: TokenResultRawResponse) => Promise<void>;
  setUserTasks: (userId: string, tasks: any[]) => Promise<void>;
  addUserTask: (userId: string, task: any) => Promise<void>;
  removeUserTask: (userId: string, taskId: string) => Promise<void>;
  removeAuthorizedState: () => Promise<void>;
  clearUserData: () => Promise<void>;
  deviceAuthorizedLocalState: string | null
  setDeviceAuthorizedLocalState: (state: string | null) => void
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const {
    authorizedState,
    users,
    getAuthorizedState,
    getUsersData,
    getUserData,
    getUserTasks,
    setAuthorizedState,
    setUserData,
    setUserTasks,
    addUserTask,
    removeUserTask,
    removeAuthorizedState,
    clearUserData,
  } = useStorageStore();

  // Local state to store fetched data
  const [contextAuthorizedState, setContextAuthorizedState] = useState<string | null>(authorizedState);

  const [contextUsers, setContextUsers] = useState<UserData[] | null>(users);
  const [contextUserData, setContextUserData] = useState<UserData | null>(null);

  const [contextUserTasks, setContextUserTasks] = useState<any[]>([]);

  const [deviceAuthorizedLocalState, setDeviceAuthorizedLocalState] = useState<string | null>(null);

  // Fetch data on app startup
  useEffect(() => {
    const fetchInitialData = async () => {

      try {
        // Fetch authorized state
        const authState = await getAuthorizedState();
        setContextAuthorizedState(authState);

        // Fetch all users
        const usersData = await getUsersData();
        setContextUsers(usersData);

        // Fetch user data and tasks for the logged-in user (if available)
        if (authState) {
          // Assuming authState contains or can be used to derive userId
          // Replace with your logic to get the logged-in userId
          const userId = authState; // Adjust based on how you store userId
          if (userId) {
            const user = await getUserData(userId);
            setContextUserData(user);

            const tasks = await getUserTasks(userId);
            setContextUserTasks(tasks);
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }

    };

    fetchInitialData();
  }, [deviceAuthorizedLocalState]);

  const logoutUser = async () => {
    setDeviceAuthorizedLocalState(null)
    removeAuthorizedState()

    setContextAuthorizedState(null)
    setContextUsers(null)
    setContextUserData(null)
    setContextUserTasks([])
  }

  return (
    <AuthContext.Provider
      value={{
        authorizedState: contextAuthorizedState,
        users: contextUsers,
        contextUserData,
        userTasks: contextUserTasks,
        setAuthorizedState,
        setUserData,
        setUserTasks,
        addUserTask,
        removeUserTask,
        removeAuthorizedState,
        clearUserData,
        deviceAuthorizedLocalState,
        setDeviceAuthorizedLocalState,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
