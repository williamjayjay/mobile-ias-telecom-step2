import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import FlashMessage from "react-native-flash-message";
import { Routes } from "@/presentation/ui/routes/index.routes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useKeepAwake } from "expo-keep-awake";
import { AuthProvider } from "@/presentation/ui/context/AuthContext";
import { theme } from "@/presentation/ui/styles/colorsTheme";

export const Main = () => {

  useKeepAwake();

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthProvider >
          <SafeAreaProvider
            style={{ flex: 1, backgroundColor: theme.shape.background }}
          >
            <View
              style={{ flex: 1, backgroundColor: theme.shape.background }}
            >
              <Routes />

              <StatusBar
                style="dark"
                translucent={true}
              />

              <FlashMessage position="top" />
            </View>
          </SafeAreaProvider>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>

  );
};
