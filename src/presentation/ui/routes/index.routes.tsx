import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useIsFocused } from "@react-navigation/native";

import { IRoute } from "./type";
import { AuthRoutes } from "./auth/index.auth.routes";
import { PublicRoutes } from "./public/index.public.routes";

import { useAuth } from "@/presentation/ui/context/AuthContext";

const RootNavigator = createNativeStackNavigator<IRoute.RootStackParamList>();

const logCurrentTime = (name?: string) => {
  const now = new Date();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

};

const Routes = () => {
  const isFocused = useIsFocused();

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const {
    isAuthenticated,
    setIsAuthenticated,
    userAuthorizedState
  } = useAuth();


  useEffect(() => {
    const prepareApp = async () => {
      logCurrentTime("prepareApp__1");

      try {

        if (userAuthorizedState) {
          return setIsAuthenticated(true);
        }

        return setIsAuthenticated(false);
      } catch (e) {
        console.warn("Erro durante a inicialização:", e);
      } finally {
        logCurrentTime("prepareApp__fin3");

      }
    };

    prepareApp();
  }, [isFocused, userAuthorizedState]);

  return (

    <RootNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={isAuthenticated ? "auth" : "public"}
    >
      {isAuthenticated ? (
        <RootNavigator.Screen
          name="auth"
          component={AuthRoutes}
          initialParams={
            {
              screen: "tabScreen"
            } as IRoute.RootStackParamList["auth"]
          }
        />

      ) : (
        <RootNavigator.Screen
          name="public"
          component={PublicRoutes}
          initialParams={
            {
              screen: "welcomeScreen"
            } as IRoute.RootStackParamList["public"]
          }
        />
      )}


    </RootNavigator.Navigator>

  );
};

export { Routes };
