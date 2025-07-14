import { useCallback } from 'react';
import { Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/presentation/ui/context/AuthContext';
import { useStorageStore } from '@/core/stores/usersStore';
import { TaskStatus } from '@/core/enums/task';
import { ITask } from '@/core/interfaces/tasks';
import { TaskFormData, taskSchema } from '@/core/schemas/createTask';
import { showMessageError, showMessageSuccess } from '@/presentation/ui/utils/messages-toast';

export const useCreateTaskScreenHook = () => {
  const { contextUserData } = useAuth();
  const { user } = contextUserData || {
    user: {
      usuarioId: '',
      usuarioNome: '',
      login: '',
    },
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

  const onSubmit = useCallback(async (data: TaskFormData) => {
    if (!user?.usuarioId) {
      console.log('Erro', 'Usuário não está logado');
      showMessageError('Usuário não está logado. Por favor, faça login.');
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
      showMessageSuccess('Tarefa criada com sucesso!');
      Keyboard.dismiss(); // Close the keyboard on successful task creation
      reset();
      navigation.goBack();
    } catch (error) {
      console.error('Error creating task:', error);
      showMessageError('Falha ao criar a tarefa');
    }
  }, [user?.usuarioId, addUserTask, navigation, reset]);

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
  };
};
