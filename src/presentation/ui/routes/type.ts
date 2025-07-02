

export namespace IRoute {

  export interface Input {
    initialRoute: {
      rootStack: "public" | "auth";
      rootStackScreen: "tabScreen" | "loginScreen"
    };
  }

  export type RootStackParamList = {
    auth: {
      screen: "tabScreen"
    }

    public: {
      screen: "welcomeScreen"
    }
  }

  export type PublicStackRoutes = {
    "welcomeScreen": undefined;
  };

  export type AuthStackRoutes = {
    "tabScreen": undefined;
  };

}




