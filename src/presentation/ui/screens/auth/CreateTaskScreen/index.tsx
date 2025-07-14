// src/presentation/ui/screens/CreateTask/CreateTaskScreen.tsx
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { SafeAreaContainer } from '@/presentation/ui/components/SafeAreaContainer';
import { theme } from '@/presentation/ui/styles/colorsTheme';
import { TextCustom } from '@/presentation/ui/components/TextCustom';
import { useCreateTaskScreenHook } from './hooks';
import { styles } from './styles';

export const CreateTaskScreen = () => {
  const {
    control,
    handleSubmit,
    errors,
    onSubmit,
  } = useCreateTaskScreenHook();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaContainer
        customStyles={{
          backgroundColor: theme.shape.background,
        }}
      >
        <View style={styles.container}>
          <TextCustom style={styles.title}>Criar Nova Tarefa</TextCustom>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextCustom
                    style={[
                      styles.label,
                      { color: errors.title ? theme.signal.danger : theme.text.primary },
                    ]}
                  >
                    Título*
                  </TextCustom>
                  <TextInput
                    allowFontScaling={false}
                    style={[
                      styles.input,
                      errors.title && { borderColor: theme.signal.danger, borderWidth: 1 },
                    ]}
                    placeholder="Digite o título da tarefa"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </>
              )}
            />
            {errors.title && (
              <TextCustom style={styles.error}>{errors.title.message}</TextCustom>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextCustom
                    style={[
                      styles.label,
                      { color: errors.description ? theme.signal.danger : theme.text.primary },
                    ]}
                  >
                    Descrição*
                  </TextCustom>
                  <TextInput
                    allowFontScaling={false}
                    style={[
                      styles.input,
                      styles.descriptionInput,
                      errors.description && { borderColor: theme.signal.danger, borderWidth: 1 },
                    ]}
                    placeholder="Digite a descrição da tarefa"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                  />
                </>
              )}
            />
            {errors.description && (
              <TextCustom style={styles.error}>{errors.description.message}</TextCustom>
            )}
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: theme.primary.main,
              borderRadius: 4,
              height: 42,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleSubmit(onSubmit)}
          >
            <TextCustom
              style={{ color: theme.shape.surface, fontSize: 16, fontWeight: 'bold' }}
            >
              Criar Tarefa
            </TextCustom>
          </TouchableOpacity>
        </View>
      </SafeAreaContainer>
    </TouchableWithoutFeedback>
  );
};
