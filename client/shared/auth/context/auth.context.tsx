import { useMutation } from '@tanstack/react-query';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { IAuthContext } from '../../../types';
import {
  ICredentials,
  ILoginUser,
  IUserDetails,
} from '../interfaces/UserDetails';
import { login } from '../requests';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

export const AuthContext = createContext<IAuthContext>({
  userDetails: undefined,
  jwt: undefined,
  isLoggedIn: false,
  isLoggingIn: false,
  isActive: false,
  onLogin: () => null,
  onLogout: () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const appState = useRef(AppState.currentState);
  const [userDetails, setUserDetails] = useState<IUserDetails>();
  const [jwt, setJwt] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const loginMutation = useMutation(
    (loginUser: ILoginUser) => login(loginUser),
    {
      onSuccess: (credentials) => {
        setUserDetails(credentials.user);
        setJwt(credentials.token);
        setIsLoggedIn(true);
        _storeCredentials(credentials);
        setIsLoggingIn(false);
      },
      onError: (err) => {
        setIsLoggingIn(false);
      },
    },
  );

  const _storeCredentials = async (credentials: ICredentials) => {
    try {
      await AsyncStorage.setItem('credentials', JSON.stringify(credentials));
    } catch (error) {
      console.log(error);
    }
  };

  const loginHandler = (loginUser: ILoginUser) => {
    setIsLoggingIn(true);
    loginMutation.mutate(loginUser);
  };

  const logoutHandler = () => {
    setUserDetails(undefined);
    setJwt(undefined);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        jwt,
        isLoggedIn,
        isLoggingIn,
        isActive: isLoggedIn && appStateVisible === 'active',
        onLogin: loginHandler,
        onLogout: logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
