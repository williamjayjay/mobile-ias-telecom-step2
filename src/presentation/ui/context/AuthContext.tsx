import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TokenResultRawResponse } from '@/presentation/ui/screens/public/WelcomeScreen/types';
import { useStorageStore } from '@/core/stores/usersStore';
import { ITask } from '@/core/interfaces/tasks';

interface UserData {
  user: TokenResultRawResponse;
  tasks: ITask[];
}

interface AuthContextType {
  authorizedState: string | null;
  users: UserData[] | null;
  contextUserData: UserData | null;
  userTasks: ITask[];
  setAuthorizedState: (state: string) => Promise<void>;
  setUserData: (user: TokenResultRawResponse) => Promise<void>;
  setUserTasks: (userId: string, tasks: ITask[]) => Promise<void>;
  addUserTask: (userId: string, task: ITask) => Promise<void>;
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

  const [contextAuthorizedState, setContextAuthorizedState] = useState<string | null>(authorizedState);

  const [contextUsers, setContextUsers] = useState<UserData[] | null>(users);
  const [contextUserData, setContextUserData] = useState<UserData | null>(null);

  const [contextUserTasks, setContextUserTasks] = useState<ITask[]>([]);

  const [deviceAuthorizedLocalState, setDeviceAuthorizedLocalState] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {

      try {
        const authState = await getAuthorizedState();

        setContextAuthorizedState(authState);

        const usersData = await getUsersData();
        setContextUsers(usersData);

        if (authState) {
          const userId = authState;

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
