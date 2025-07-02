import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IRoute } from "../type";
import { WelcomeScreen } from "@/presentation/ui/screens/public/WelcomeScreen";
import { theme } from "@/presentation/ui/styles/colorsTheme";

const PublicStackRoutes = createNativeStackNavigator<IRoute.PublicStackRoutes>();

export const PublicRoutes = () => {

  return (
    <PublicStackRoutes.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.shape.background
        },
      }}>
      <PublicStackRoutes.Screen name="welcomeScreen" component={WelcomeScreen} />
    </PublicStackRoutes.Navigator>
  )
}
