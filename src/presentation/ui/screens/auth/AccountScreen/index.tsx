import { useStorageStore } from '@/core/stores/usersStore';
import { ListItem } from '@/presentation/ui/components/ListItemCustom';
import { SafeAreaContainer } from '@/presentation/ui/components/SafeAreaContainer';
import { TextCustom } from '@/presentation/ui/components/TextCustom';
import { useAuth } from '@/presentation/ui/context/AuthContext';
import { theme } from '@/presentation/ui/styles/colorsTheme';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { View, ScrollView, Alert } from 'react-native';

export function AccountScreen() {

  const { contextUserData, logoutUser } = useAuth();

  const { user } = contextUserData || {
    user: {
      usuarioId: '',
      usuarioNome: '',
      login: ''
    }
  };

  console.log("caaaontextUserData", contextUserData)

  const {
    removeAuthorizedState,
    getAuthorizedState,
    getUserData,
    clearUserData,
    getUsersData
  } = useStorageStore();

  const [auth, setAuth] = React.useState<string | null>(null);

  // React.useEffect(() => {
  //   const loadAuthState = async () => {
  //     try {
  //       const state = await getAuthorizedState();

  //       const ALLSTATE = await getUsersData();

  //       console.log("ALLSTATE", ALLSTATE)

  //       if (!state) {
  //         setUnAuthrotized();
  //         return;
  //       }
  //       console.log("USERIDstate", state)

  //       const userData = await getUserData(state);

  //       console.log("userDatasuserData", userData)

  //       if (!userData) {
  //         setUnAuthrotized();
  //         return;
  //       }

  //       console.log("userDatauserData2222", userData)



  //       setAuth(state);
  //     } catch (error) {
  //       console.error('Error loading auth state:', error);
  //     }
  //   };

  //   loadAuthState();
  // }, []);


  const versionApp = 'v1.0.0 (1)'

  return (
    <SafeAreaContainer
      customStyles={{
        backgroundColor: theme.shape.background
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <TextCustom
          style={{ color: theme.text.primary, fontSize: 24, fontWeight: "bold" }}
        >
          Minha Conta
        </TextCustom>

      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <TextCustom
          style={{
            color: theme.text.primary,
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 16
          }}
        >
          Usuário: {user?.usuarioNome || "N/A"}
        </TextCustom>


        <TextCustom
          style={{
            color: theme.text.secondary,
            fontSize: 16,
          }}
        >
          Id: {user?.usuarioId || "N/A"}
        </TextCustom>

        <TextCustom
          style={{
            color: theme.text.secondary,
            fontSize: 16,
          }}
        >
          Email: {user?.login || "N/A"}
        </TextCustom>

        <TextCustom
          style={{
            color: theme.text.primary,
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 24,
          }}
        >
          Avançado
        </TextCustom>

        <ListItem
          onPress={() => {
            Alert.alert(
              "Sair do aplicativo",
              "Tem certeza que deseja sair do aplicativo?",
              [
                {
                  text: "Cancelar",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                {
                  text: "Sair", onPress: () => {
                    logoutUser()

                  }
                }
              ]
            );
          }}
          marginTop={16}
          title={'Sair'}
          customTitleStyle={{ color: theme.signal.danger }}
          rightIcon={
            <ChevronRight
              color={theme.text.primary}
              size={22}
              strokeWidth={1.5}
            />
          }
        />
        {/*
        <ListItem
          onPress={() => {
            clearUserData()
          }}
          marginTop={16}
          title={'ZERAR'}
          customTitleStyle={{ color: theme.signal.danger }}
          rightIcon={
            <ChevronRight
              color={theme.text.primary}
              size={22}
              strokeWidth={1.5}
            />
          }
        /> */}

        <TextCustom
          style={{
            color: theme.text.primary,
            fontSize: 14,
            marginTop: 32,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {versionApp}
        </TextCustom>
      </ScrollView>

    </SafeAreaContainer>
  )
}
