import React from "react";
import { useWindowDimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CircleUser, List } from "lucide-react-native";
import { theme } from "@/presentation/ui/styles/colorsTheme";
import { AccountScreen } from "@/presentation/ui/screens/auth/AccountScreen";
import { HomeScreen } from "@/presentation/ui/screens/auth/HomeScreen";

const TabNavigator = createBottomTabNavigator();
const TabRoutes = () => {
  const { height } = useWindowDimensions();

  const heightIsMajorOrEqual840 = height >= 840;

  return (
    <TabNavigator.Navigator
      initialRouteName="routeList"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.primary.dark,
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.shape.background,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <TabNavigator.Screen
        name="routeList"
        component={HomeScreen}
        options={{
          headerTitleStyle: {
            fontSize: 22,
          },
          headerTintColor: theme.shape.background,
          tabBarIcon: ({ color }) => <List size={22} color={color} />,
          tabBarLabel: "Lista"
        }}
      />

      <TabNavigator.Screen
        name="routeAccount"
        component={AccountScreen}
        options={{
          headerTitleStyle: {
            fontSize: 22,
          },
          headerTintColor: theme.shape.background,
          tabBarIcon: ({ color }) => <CircleUser size={22} color={color} />,
          tabBarLabel: "Conta"
        }}
      />
    </TabNavigator.Navigator>
  );
};

export { TabRoutes };
