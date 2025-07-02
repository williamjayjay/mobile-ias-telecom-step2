import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IRoute } from "../type";
import { theme } from "@/presentation/ui/styles/colorsTheme";
import { TabRoutes } from "../components/tabRoutes";

const AuthStackRoutes = createNativeStackNavigator<IRoute.AuthStackRoutes>();

export const AuthRoutes = () => {

  return (
    <AuthStackRoutes.Navigator screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: theme.shape.background
      },
    }}>
      <AuthStackRoutes.Screen name="tabScreen" component={TabRoutes} />
    </AuthStackRoutes.Navigator>
  )
}
