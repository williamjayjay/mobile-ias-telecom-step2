import { useState, useMemo, useCallback, useRef } from 'react';
import { Animated, Alert } from 'react-native';
import { useAuth } from '@/presentation/ui/context/AuthContext';
import { ITask } from '@/core/interfaces/tasks';
import { useStorageStore } from '@/core/stores/usersStore';
import { showMessageWarning } from '@/presentation/ui/utils/messages-toast';
import { TaskStatus } from '@/core/enums/task';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '@/presentation/ui/styles/colorsTheme';

export const useTaskListScreenHook = () => {
  const { contextUserData } = useAuth();
  const { user } = contextUserData || {
    user: {
      usuarioId: '',
      usuarioNome: '',
      login: '',
    },
  };

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [localTasks, setLocalTasks] = useState<ITask[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [actionBarAnim] = useState(new Animated.Value(0));
  const [filter, setFilter] = useState<TaskStatus>(TaskStatus.Todas);
  const scrollViewRef = useRef<any>(null);

  const [filterButtonPositions, setFilterButtonPositions] = useState<{ [key: string]: number }>({});

  const { removeUserTask, getUserTasks, completeUserTask, removeUserTasksBulk, completeUserTasksBulk, openUserTask } = useStorageStore();

  const statusPriority: { [key: string]: number } = useMemo(() => ({
    Pendente: 1,
    Aberta: 2,
    Concluida: 3,
  }), []);

  const updateTaskStatusLocally = useCallback((taskId: string, newStatus: TaskStatus) => {
    setLocalTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  const fetchTasks = useCallback(async (currentFilter: TaskStatus.Aberta | TaskStatus.Concluida | TaskStatus.Pendente | TaskStatus.Todas = TaskStatus.Todas) => {
    setLocalLoading(true);
    try {
      const newUserTasks = await getUserTasks(user.usuarioId.toString());

      let tasksToSet = [...newUserTasks];

      if (currentFilter === TaskStatus.Todas) {
        tasksToSet.sort((a, b) => {
          const priorityA = statusPriority[a.status] || 4;
          const priorityB = statusPriority[b.status] || 4;

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      } else {
        tasksToSet.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      }
      setLocalTasks(tasksToSet);
    } finally {
      setLocalLoading(false);
    }
  }, [user.usuarioId, getUserTasks, statusPriority]);

  useFocusEffect(
    useCallback(() => {
      setFilter(TaskStatus.Todas);
      fetchTasks(TaskStatus.Todas);
    }, [fetchTasks])
  );

  const toggleSelectionMode = useCallback(() => {
    if (isSelectionMode) {
      setSelectedTasks([]);
    }
    setIsSelectionMode(prev => !prev);
    Animated.timing(actionBarAnim, {
      toValue: isSelectionMode ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSelectionMode, actionBarAnim]);

  const toggleTaskSelection = useCallback((taskId: string) => {
    setSelectedTasks(prev => {
      const newSelected = prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId];
      if (prev.length === 1 && prev.includes(taskId) && newSelected.length === 0) {
        setIsSelectionMode(false);
        Animated.timing(actionBarAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (prev.length === 0 && newSelected.length === 1) {
        setIsSelectionMode(true);
        Animated.timing(actionBarAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
      return newSelected;
    });
  }, [actionBarAnim]);

  const handleBulkComplete = useCallback(() => {
    if (selectedTasks.length <= 1) {
      showMessageWarning('Selecione pelo menos duas tarefas para concluir.');
      return;
    }

    Alert.alert(
      'Concluir tarefas',
      `Deseja concluir ${selectedTasks.length} tarefa(s)?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Concluir',
          onPress: async () => {
            setLocalLoading(true);
            await completeUserTasksBulk(user.usuarioId.toString(), selectedTasks);
            await fetchTasks(filter);
            toggleSelectionMode();
            setLocalLoading(false);
          },
        },
      ]
    );
  }, [selectedTasks, user.usuarioId, completeUserTasksBulk, fetchTasks, toggleSelectionMode, filter]);

  const handleBulkDelete = useCallback(() => {
    if (selectedTasks.length <= 1) {
      showMessageWarning('Selecione pelo menos duas tarefas para excluir.');
      return;
    }

    Alert.alert(
      'Excluir tarefas',
      `Deseja excluir ${selectedTasks.length} tarefa(s)?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            setLocalLoading(true);
            await removeUserTasksBulk(user.usuarioId.toString(), selectedTasks);
            await fetchTasks(filter);
            toggleSelectionMode();
            setLocalLoading(false);
          },
        },
      ]
    );
  }, [selectedTasks, user.usuarioId, removeUserTasksBulk, fetchTasks, toggleSelectionMode, filter]);

  const getStatusStyle = useCallback((status: string) => {
    switch (status) {
      case TaskStatus.Pendente:
        return { color: theme.status.pending };
      case TaskStatus.Aberta:
        return { color: theme.status.open };
      case TaskStatus.Concluida:
        return { color: theme.status.completed };
      default:
        return { color: theme.text.primary };
    }
  }, []);

  const filteredAndSortedTasks = useMemo(() => {
    if (filter !== TaskStatus.Todas) {
      return localTasks.filter(task => task.status === filter);
    }
    return localTasks;
  }, [localTasks, filter]);

  return {
    user,
    selectedTasks,
    localTasks,
    isSelectionMode,
    localLoading,
    actionBarAnim,
    filter,
    scrollViewRef,
    filterButtonPositions,
    setFilter,
    setFilterButtonPositions,
    updateTaskStatusLocally,
    fetchTasks,
    toggleSelectionMode,
    toggleTaskSelection,
    handleBulkComplete,
    handleBulkDelete,
    getStatusStyle,
    filteredAndSortedTasks,
    removeUserTask,
    completeUserTask,
    openUserTask,
    setLocalLoading,
  };
};
