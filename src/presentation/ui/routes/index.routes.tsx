import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";
import { IRoute } from "./type";
import { AuthRoutes } from "./auth/index.auth.routes";
import { PublicRoutes } from "./public/index.public.routes";
import { useStorageStore } from "@/core/stores/usersStore";
import { useAuth } from "../context/AuthContext";
import { TextCustom } from "../components/TextCustom";
import { ActivityIndicator, View } from "react-native";
import { theme } from "../styles/colorsTheme";

const RootNavigator = createNativeStackNavigator<IRoute.RootStackParamList>();

const Routes = () => {
  const isFocused = useIsFocused();
  const [showSplash, setShowSplash] = useState(true);
  const { getAuthorizedState, setAuthorizedState } = useStorageStore();
  const { deviceAuthorizedLocalState, setDeviceAuthorizedLocalState } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        const state = await getAuthorizedState();
        if (state) {
          setDeviceAuthorizedLocalState("y");
          setAuthorizedState(state);
        }
      } catch (e) {
        console.warn("Erro durante a inicialização:", e);
      }
    };

    prepareApp();
  }, [isFocused, getAuthorizedState, setAuthorizedState]);


  if (showSplash) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.primary.main} />
        <TextCustom style={{ marginTop: 16, fontSize: 16, color: theme.text.primary }}>
          Carregando...
        </TextCustom>
      </View>
    );
  }

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
