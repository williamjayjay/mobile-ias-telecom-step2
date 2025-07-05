import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useWelcomeHook } from './hooks';
import { theme } from '@/presentation/ui/styles/colorsTheme';
import { SafeAreaContainer } from '@/presentation/ui/components/SafeAreaContainer';
import IASLogo from '@/assets/logo-ias.svg';
import { TextCustom } from '@/presentation/ui/components/TextCustom';

export function WelcomeScreen() {
  const [loading, setLoading] = useState(false);

  const { handleLogin } = useWelcomeHook();

  const localHandleLogin = async () => {
    setLoading(true)
    const result = await handleLogin()

    if (!result) {
      setLoading(false)
      return;
    }
  }

  return (
    <SafeAreaContainer
      customStyles={{
        justifyContent: "space-between",
        backgroundColor: theme.shape.background
      }}
    >

      <View style={styles.container}>

        <IASLogo
          height={80}
          width={80}
          style={{ marginBottom: 20 }}
        />

        <TextCustom style={styles.title}>IAS Tarefas</TextCustom>
        <TextCustom style={styles.subtitle}>
          Você está acessando{'\n'}IAS [App de tarefas]
        </TextCustom>


        <TouchableOpacity
          disabled={loading}
          style={{
            backgroundColor: theme.primary.main, borderRadius: 4, height: 42, justifyContent: 'center', alignItems: 'center', width: 160,
            opacity: loading ? 0.7 : 1
          }}
          onPress={localHandleLogin}
        >
          {loading ? (
            <ActivityIndicator style={{}} size="small" color={theme.shape.surface} />
          ) : (
            <TextCustom style={{ color: theme.shape.surface, fontSize: 16, fontWeight: 'bold' }}>Fazer Login</TextCustom>
          )}
        </TouchableOpacity>

        <TextCustom style={styles.copyright}>© 2025 Interfocus Tecnologia. Todos os direitos reservados.</TextCustom>
      </View>
    </SafeAreaContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  lock: {
    fontSize: 30,
    color: theme.primary.main,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  copyright: {
    fontSize: 12,
    color: theme.text.secondary,
    position: 'absolute',
    bottom: 8,
    textAlign: 'center',
  },
});
