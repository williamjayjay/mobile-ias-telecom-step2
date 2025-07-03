import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessageError, showMessageSuccess } from '@/core/utils/messages-toast';
import { SCHEME_NAME_AUTH } from '@/core/constants/global';
import { rootEnv } from '@/core/configs/env.config';
import { useAuth } from '@/presentation/ui/context/AuthContext';
import { TokenResultRawResponse } from './types';
import { useStorageStore } from '@/core/stores/usersStore';

export const useWelcomeHook = () => {

  const { setDeviceAuthorizedLocalState } = useAuth();

  const { apiAuth, apiToken, clientId, clientSecret } = rootEnv;

  const discovery = {
    authorizationEndpoint: apiAuth,
    tokenEndpoint: apiToken,
  };

  const redirectUri = AuthSession.makeRedirectUri({ scheme: SCHEME_NAME_AUTH });

  const {
    setAuthorizedState,
    setUserData
  } = useStorageStore();

  const handleLogin = async () => {
    try {
      const authRequest = new AuthSession.AuthRequest({
        clientId,
        redirectUri,
        responseType: 'code',
        scopes: [],
      });

      const authorizeResult = await authRequest.promptAsync(discovery);

      if (authorizeResult.type === 'success') {
        const code = authorizeResult.params.code;

        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId,
            clientSecret,
            code,
            redirectUri,
            extraParams: { grant_type: 'authorization_code' },
          },
          discovery
        );

        if (tokenResult.accessToken) {
          await AsyncStorage.setItem('access_token', tokenResult.accessToken);

          showMessageSuccess('Login bem-sucedido!');

          const {
            access_token,
            refresh_token,
            login,
            usuarioId,
            usuarioNome
          }: TokenResultRawResponse = tokenResult.rawResponse ?? {};

          setDeviceAuthorizedLocalState(usuarioId?.toString() ?? '');

          await setAuthorizedState(usuarioId?.toString() ?? '');

          setUserData({
            access_token,
            refresh_token,
            login,
            usuarioId,
            usuarioNome
          });

          // setSaveDataUser({
          //   id: usuarioId,
          //   access_token,
          //   refresh_token,
          //   login,
          //   usuarioId,
          //   usuarioNome
          // })



          // setAuthrotized();

        } else {
          showMessageError('Falha ao obter o token de acesso.');
        }
      } else {
        showMessageError('O processo de login foi cancelado ou falhou.');
      }
    } catch (error) {
      console.error('Erro no processo de login:', error);
      showMessageError('Ocorreu um erro durante o login.');
      return false
    }
  };

  return { handleLogin, redirectUri };
};
