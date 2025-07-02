import React from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { z } from 'zod';

import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/presentation/ui/context/AuthContext';
import { useStorageStore } from '@/core/stores/usersStore';
import { SafeAreaContainer } from '@/presentation/ui/components/SafeAreaContainer';
import { theme } from '@/presentation/ui/styles/colorsTheme';
import { TaskStatus } from '@/core/enums/task';
import { ITask } from '@/core/interfaces/tasks';
import { TaskFormData, taskSchema } from '@/core/schemas/createTask';

export const CreateTaskScreen = () => {

  const { contextUserData } = useAuth();

  const { user } = contextUserData || {
    user: {
      usuarioId: '',
      usuarioNome: '',
      login: ''
    }
  };

  const { addUserTask } = useStorageStore();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    if (!user?.usuarioId) {
      console.log('Erro', 'Usuário não está logado');
      return;
    }

    const newUUID = uuid.v4();

    try {
      const newTask: ITask = {
        id: newUUID,
        title: data.title,
        description: data.description,
        status: TaskStatus.Pendente,
        createdAt: new Date().toISOString(),
      };

      await addUserTask(user.usuarioId.toString(), newTask);
      Alert.alert('Sucesso', 'Tarefa criada com sucesso!');
      reset();
      navigation.goBack();
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Erro', 'Falha ao criar a tarefa');
    }
  };

  return (
    <SafeAreaContainer
      customStyles={{
        backgroundColor: theme.shape.background
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Criar Nova Tarefa</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Título</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Digite o título da tarefa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.title && (
            <Text style={styles.error}>{errors.title.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descrição</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Digite a descrição da tarefa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
              />
            )}
          />
          {errors.description && (
            <Text style={styles.error}>{errors.description.message}</Text>
          )}
        </View>

        <Button title="Criar Tarefa" onPress={handleSubmit(onSubmit)} />
      </View>
    </SafeAreaContainer>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    height: 96,
    textAlignVertical: 'top',
  },
  error: {
    color: '#ef4444',
    marginTop: 4,
  },
});

