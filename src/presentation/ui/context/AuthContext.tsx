import { USER_AUTHORIZED } from '@/core/constants/contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TokenResultRawResponse } from '../screens/public/WelcomeScreen/types';

interface AuthContextType {
  isAuthenticated: boolean | null;
  setAuthrotized: () => void;
  setUnAuthrotized: () => void;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
  userAuthorizedState: string | undefined;
  appIsReady: boolean;
  setAppIsReady: React.Dispatch<React.SetStateAction<boolean>>;
  user: TokenResultRawResponse | null;
  setSaveDataUser: (user: TokenResultRawResponse) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [userAuthorizedState, setUserAuthorizedState] = useState<string | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const [user, setUser] = useState<TokenResultRawResponse | null>(null);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem(USER_AUTHORIZED);

        console.log('Stored auth state:', storedAuth);

        if (storedAuth !== null && isAuthenticated === null) {
          setUserAuthorizedState(storedAuth);
          setIsAuthenticated(true);

          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser !== null) {
            setUser(JSON.parse(storedUser));
          }

        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        setIsAuthenticated(false);
      }
    };

    loadAuthState();
  }, []);

  const setSaveDataUser = async (user: TokenResultRawResponse) => {
    try {
      setUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const setAuthrotized = async () => {
    try {
      setIsAuthenticated(true);
      setUserAuthorizedState('y');
      await AsyncStorage.setItem(USER_AUTHORIZED, 'y');
    } catch (error) {
      console.error('Error setting authorized state:', error);
    }
  };

  const setUnAuthrotized = async () => {
    try {
      setIsAuthenticated(null);
      setUserAuthorizedState(undefined);
      await AsyncStorage.removeItem(USER_AUTHORIZED);
    } catch (error) {
      console.error('Error setting unauthorized state:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthrotized,
        setUnAuthrotized,
        setIsAuthenticated,
        appIsReady,
        setAppIsReady,
        userAuthorizedState,
        setSaveDataUser,
        user
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
