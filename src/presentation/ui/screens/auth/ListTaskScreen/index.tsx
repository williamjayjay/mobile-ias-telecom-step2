import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Animated, Alert, ScrollView } from 'react-native';
import { useAuth } from '@/presentation/ui/context/AuthContext';
import { theme } from '@/presentation/ui/styles/colorsTheme';
import { SafeAreaContainer } from '@/presentation/ui/components/SafeAreaContainer';
import { ITask } from '@/core/interfaces/tasks';
import { Ionicons } from '@expo/vector-icons';
import { TextCustom } from '@/presentation/ui/components/TextCustom';
import { CircleCheckBig, Trash2 } from 'lucide-react-native';
import { useStorageStore } from '@/core/stores/usersStore';
import { showMessageWarning } from '@/presentation/ui/utils/messages-toast';
import { TaskStatus } from '@/core/enums/task';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './style'

const TaskItem = React.memo(
  ({
    item,
    isSelectionMode,
    toggleSelectionMode,
    toggleTaskSelection,
    isSelected,
    getStatusStyle,
    userId,
    fetchTasks,
    setLoading,
    removeUserTask,
    completeUserTask,
    openUserTask: propOpenUserTask,
    updateTaskStatusLocally,
  }: {
    item: ITask;
    isSelectionMode: boolean;
    toggleSelectionMode: () => void;
    toggleTaskSelection: (taskId: string) => void;
    isSelected: boolean;
    getStatusStyle: (status: string) => { color: string };
    userId: string;
    fetchTasks: () => Promise<void>;
    setLoading: (loading: boolean) => void;
    removeUserTask: (userId: string, taskId: string) => Promise<void>;
    completeUserTask: (userId: string, taskId: string) => Promise<void>;
    openUserTask: (userId: string, taskId: string) => Promise<void>;
    updateTaskStatusLocally: (taskId: string, newStatus: TaskStatus) => void;
  }) => {
    const [isDescriptionVisible, setDescriptionVisible] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleLongPress = useCallback(() => {
      if (!isSelectionMode) {
        toggleSelectionMode();
      }
      toggleTaskSelection(item.id);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, [isSelectionMode, toggleSelectionMode, toggleTaskSelection, item.id, scaleAnim]);

    const handleOpenTaskAction = useCallback(async () => {
      setLoading(true);
      await propOpenUserTask(userId, item.id);
      updateTaskStatusLocally(item.id, TaskStatus.Aberta);
      setLoading(false);
    }, [propOpenUserTask, userId, item.id, updateTaskStatusLocally, setLoading]);

    const handlePress = useCallback(async () => {
      if (isSelectionMode) {
        toggleTaskSelection(item.id);
      } else {
        if (item.status === TaskStatus.Pendente && !isDescriptionVisible) {
          await handleOpenTaskAction();
        }
        setDescriptionVisible(prev => !prev);
      }
    }, [isSelectionMode, toggleTaskSelection, item.status, isDescriptionVisible, handleOpenTaskAction]);

    const handleDeleteTask = useCallback(async () => {
      setLoading(true);
      await removeUserTask(userId, item.id);
      await fetchTasks();
      setLoading(false);
    }, [setLoading, removeUserTask, userId, item.id, fetchTasks]);

    const handleCompleteTask = useCallback(async () => {
      setLoading(true);
      await completeUserTask(userId, item.id);
      await fetchTasks();
      setLoading(false);
    }, [setLoading, completeUserTask, userId, item.id, fetchTasks]);

    return (
      <Animated.View
        style={[
          styles.taskContainer,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor: isSelected ? theme.shape.surface : '#fff',
          },
        ]}
      >
        <TouchableOpacity onPress={handlePress} onLongPress={handleLongPress} activeOpacity={0.7}>
          <View style={styles.taskHeader}>
            <TextCustom style={styles.taskTitle}>{item.title}</TextCustom>
            {!isSelectionMode && (
              <Ionicons
                name={isDescriptionVisible ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={theme.text.primary}
              />
            )}
            {isSelectionMode && (
              <Ionicons
                name={isSelected ? 'checkbox' : 'square-outline'}
                size={24}
                color={theme.primary.main}
              />
            )}
          </View>
          <TextCustom style={styles.taskStatus}>
            Status: <TextCustom style={getStatusStyle(item.status)}> {item.status}</TextCustom>
          </TextCustom>
          <TextCustom style={styles.taskCreatedAt}>
            Criado em:{' '}
            {new Date(item.createdAt).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </TextCustom>
          {isDescriptionVisible && !isSelectionMode && (
            <View style={styles.expandedContent}>
              <TextCustom style={styles.taskDescription}>{item.description}</TextCustom>
              <View style={styles.buttonContainer}>
                {item.status !== TaskStatus.Concluida && (
                  <TouchableOpacity style={styles.button} onPress={handleCompleteTask}>
                    <CircleCheckBig size={24} color={theme.signal.success} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.button} onPress={handleDeleteTask}>
                  <Trash2 size={24} color={theme.signal.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

export const TaskListScreen = () => {
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
  const [filter, setFilter] = useState<'Todas' | 'Pendente' | 'Aberta' | 'Concluida'>('Todas');
  const scrollViewRef = useRef<ScrollView>(null);
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

  const fetchTasks = useCallback(async (currentFilter: 'Todas' | 'Pendente' | 'Aberta' | 'Concluida' = 'Todas') => {
    setLocalLoading(true);
    try {
      const newUserTasks = await getUserTasks(user.usuarioId.toString());

      let tasksToSet = [...newUserTasks];

      if (currentFilter === 'Todas') {
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
      setFilter('Todas');
      fetchTasks('Todas');
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
      case 'Pendente':
        return { color: theme.status.pending };
      case 'Aberta':
        return { color: theme.status.open };
      case 'Concluida':
        return { color: theme.status.completed };
      default:
        return { color: theme.text.primary };
    }
  }, []);

  const filteredAndSortedTasks = useMemo(() => {
    if (filter !== 'Todas') {
      return localTasks.filter(task => task.status === filter);
    }
    return localTasks;
  }, [localTasks, filter]);

  const renderFilterButton = (filterType: 'Todas' | 'Pendente' | 'Aberta' | 'Concluida') => (
    <TouchableOpacity
      key={filterType}
      style={[styles.filterButton, filter === filterType && styles.filterButtonActive]}
      onPress={() => {
        setFilter(filterType);

        if (filterType === 'Todas') {
          fetchTasks('Todas');
        }
        const xPosition = filterButtonPositions[filterType] || 0;
        scrollViewRef.current?.scrollTo({ x: xPosition - 16, animated: true });
      }}
      onLayout={(event) => {
        const { x } = event.nativeEvent.layout;
        setFilterButtonPositions(prev => ({ ...prev, [filterType]: x }));
      }}
    >
      <TextCustom
        style={[styles.filterButtonText, filter === filterType ? styles.filterButtonTextActive : {}]}
      >
        {filterType}
      </TextCustom>
    </TouchableOpacity>
  );

  const renderTaskItem = useCallback(({ item }: { item: ITask }) => (
    <TaskItem
      item={item}
      isSelectionMode={isSelectionMode}
      toggleSelectionMode={toggleSelectionMode}
      toggleTaskSelection={toggleTaskSelection}
      isSelected={selectedTasks.includes(item.id)}
      getStatusStyle={getStatusStyle}
      userId={user.usuarioId.toString()}
      fetchTasks={fetchTasks}
      setLoading={setLocalLoading}
      removeUserTask={removeUserTask}
      completeUserTask={completeUserTask}
      openUserTask={openUserTask}
      updateTaskStatusLocally={updateTaskStatusLocally}
    />
  ), [isSelectionMode, toggleSelectionMode, toggleTaskSelection, selectedTasks, getStatusStyle, user.usuarioId, fetchTasks, setLocalLoading, removeUserTask, completeUserTask, openUserTask, updateTaskStatusLocally]);

  return (
    <>
      {localLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
            backgroundColor: 'rgba(255,255,255,0.7)',
          }}
        >
          <ActivityIndicator size="large" color={theme.primary.main} />
        </View>
      )}
      <SafeAreaContainer
        customStyles={{
          backgroundColor: theme.shape.background,
          paddingBottom: 0,
        }}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View>
              <TextCustom style={styles.title}>Minhas Tarefas</TextCustom>
              <TextCustom>Quantidade: {filteredAndSortedTasks.length}</TextCustom>
            </View>
            {isSelectionMode && (
              <TouchableOpacity onPress={toggleSelectionMode}>
                <TextCustom style={styles.cancelButton}>Cancelar</TextCustom>
              </TouchableOpacity>
            )}
          </View>
          <View>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterContainer}
              contentContainerStyle={styles.filterContent}
            >
              {['Todas', 'Pendente', 'Aberta', 'Concluida'].map(filterType =>
                renderFilterButton(filterType as 'Todas' | 'Pendente' | 'Aberta' | 'Concluida')
              )}
            </ScrollView>
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredAndSortedTasks}
            renderItem={renderTaskItem}
            keyExtractor={item => item.id}
            style={styles.list}
            ListEmptyComponent={
              <TextCustom style={styles.emptyText}>Nenhuma tarefa encontrada</TextCustom>
            }
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => (
              { length: 110, offset: 110 * index, index }
            )}
          />
          {isSelectionMode && (
            <Animated.View
              style={[
                styles.actionBar,
                {
                  opacity: actionBarAnim,
                  transform: [
                    {
                      translateY: actionBarAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [100, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TextCustom style={styles.selectedCount}>
                {selectedTasks.length} selecionada{selectedTasks.length !== 1 ? 's' : ''}
              </TextCustom>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  disabled={selectedTasks.length === 0}
                  style={[styles.button, { opacity: selectedTasks.length === 0 ? 0.5 : 1 }]}
                  onPress={handleBulkComplete}
                >
                  <CircleCheckBig size={24} color={theme.signal.success} />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={selectedTasks.length === 0}
                  style={[styles.button, { opacity: selectedTasks.length === 0 ? 0.5 : 1 }]}
                  onPress={handleBulkDelete}
                >
                  <Trash2 size={24} color={theme.signal.danger} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>
      </SafeAreaContainer>
    </>
  );
};

