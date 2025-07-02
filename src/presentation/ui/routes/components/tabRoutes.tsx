import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CircleUser, List, SquarePlus } from "lucide-react-native";
import { theme } from "@/presentation/ui/styles/colorsTheme";
import { AccountScreen } from "@/presentation/ui/screens/auth/AccountScreen";
import { TaskListScreen } from "@/presentation/ui/screens/auth/ListTaskScreen";
import { CreateTaskScreen } from "@/presentation/ui/screens/auth/CreateTaskScreen";

const TabNavigator = createBottomTabNavigator();
const TabRoutes = () => {

  return (
    <TabNavigator.Navigator
      initialRouteName="routeList"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.primary.main,
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
        component={TaskListScreen}
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
        name="routeCreateTask"
        component={CreateTaskScreen}
        options={{
          headerTitleStyle: {
            fontSize: 22,
          },
          headerTintColor: theme.shape.background,
          tabBarIcon: ({ color }) => <SquarePlus size={22} color={color} />,
          tabBarLabel: "Criar Tarefa"
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
