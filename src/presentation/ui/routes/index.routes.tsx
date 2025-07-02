import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";
import { IRoute } from "./type";
import { AuthRoutes } from "./auth/index.auth.routes";
import { PublicRoutes } from "./public/index.public.routes";
import { useStorageStore } from "@/core/stores/usersStore";
import { useAuth } from "../context/AuthContext";

const RootNavigator = createNativeStackNavigator<IRoute.RootStackParamList>();

const logCurrentTime = (name?: string) => {
  const now = new Date();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
};

const Routes = () => {
  const isFocused = useIsFocused();
  const [showSplash, setShowSplash] = useState(true);
  const { authorizedState, getAuthorizedState, setAuthorizedState } = useStorageStore();

  const { deviceAuthorizedLocalState } = useAuth()


  // Derive isAuthenticated from authorizedState
  const isAuthenticated = !!authorizedState; // true if authorizedState is non-null/non-undefined

  // useEffect(() => {
  //   const timer = setTimeout(() => setShowSplash(false), 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  // useEffect(() => {
  //   const prepareApp = async () => {
  //     logCurrentTime("prepareApp__1");

  //     try {
  //       const state = await getAuthorizedState();
  //       if (state) {
  //         // Optionally, you can call setAuthorizedState(state) if you need to sync the store
  //         // setAuthorizedState(state); // Uncomment if needed to ensure state is set
  //       } else {
  //         await setAuthorizedState(""); // Set to empty string or handle as needed
  //       }
  //     } catch (e) {
  //       console.warn("Erro durante a inicialização:", e);
  //     } finally {
  //       logCurrentTime("prepareApp__fin3");
  //     }
  //   };

  //   prepareApp();
  // }, [isFocused, getAuthorizedState, setAuthorizedState]);

  return (
    <RootNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={deviceAuthorizedLocalState ? "auth" : "public"}
    >
      {deviceAuthorizedLocalState ? (
        <RootNavigator.Screen
          name="auth"
          component={AuthRoutes}
          initialParams={
            {
              screen: "tabScreen",
            } as IRoute.RootStackParamList["auth"]
          }
        />
      ) : (
        <RootNavigator.Screen
          name="public"
          component={PublicRoutes}
          initialParams={
            {
              screen: "welcomeScreen",
            } as IRoute.RootStackParamList["public"]
          }
        />
      )}
    </RootNavigator.Navigator>
  );
};

export { Routes };
