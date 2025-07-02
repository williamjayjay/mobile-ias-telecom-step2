import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useWelcomeHook } from './hooks';
import { theme } from '@/presentation/ui/styles/colorsTheme';
import { SafeAreaContainer } from '@/presentation/ui/components/SafeAreaContainer';
import IASLogo from '@/assets/logo-ias.svg';

export function WelcomeScreen() {
  const [loading, setLoading] = useState(false);

  const { handleLogin } = useWelcomeHook();

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

        <Text style={styles.title}>IAS Tarefas</Text>
        <Text style={styles.subtitle}>
          Você está acessando{'\n'}IAS [App de tarefas]
        </Text>
        <Button title="Acessar" onPress={handleLogin} disabled={loading} />
        {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
        <Text style={styles.copyright}>© 2025 Interfocus Tecnologia. Todos os direitos reservados.</Text>
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
