import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Animated, Alert } from 'react-native';
import { useAuth } from '@/presentation/ui/context/AuthContext';
import { theme } from '@/presentation/ui/styles/colorsTheme';
import { SafeAreaContainer } from '@/presentation/ui/components/SafeAreaContainer';
import { ITask } from '@/core/interfaces/tasks';
import { Ionicons } from '@expo/vector-icons';
import { TextCustom } from '@/presentation/ui/components/TextCustom';
import { CircleCheckBig, Trash2 } from 'lucide-react-native';
import { useStorageStore } from '@/core/stores/usersStore';
import { showMessageWarning } from '@/presentation/ui/utils/messages-toast';

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

  const { removeUserTask, getUserTasks, completeUserTask, removeUserTasksBulk, completeUserTasksBulk } = useStorageStore();

  const fetchTasks = async () => {
    const newUserTasks = await getUserTasks(user.usuarioId.toString());

    setLocalTasks(newUserTasks)
  };

  useEffect(() => {
    fetchTasks();
  }, [user.usuarioId, getUserTasks]);


  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      setSelectedTasks([]);
    }
    setIsSelectionMode(!isSelectionMode);
    Animated.timing(actionBarAnim, {
      toValue: isSelectionMode ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleTaskSelection = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
      if (selectedTasks.length === 1) {
        toggleSelectionMode();
      }
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleBulkComplete = () => {
    toggleSelectionMode();

    if (selectedTasks.length <= 1) {
      showMessageWarning('Selecione pelo menos duas tarefas para concluir.')
      return
    };

    Alert.alert(
      'Concluir tarefas',
      `Deseja concluir ${selectedTasks.length} tarefa(s)?`,
      [
        {
          text: 'Não',
          style: 'cancel'
        },
        {
          text: 'Concluir',
          onPress: async () => {
            setLocalLoading(true)

            setTimeout(async () => {
              await completeUserTasksBulk(user.usuarioId.toString(), selectedTasks);

              await fetchTasks()

              setLocalLoading(false)
            }, 1000);
          }
        }
      ]
    );
  };

  const handleBulkDelete = () => {
    toggleSelectionMode();

    if (selectedTasks.length <= 1) {
      showMessageWarning('Selecione pelo menos duas tarefas para excluir.')
      return
    };

    Alert.alert(
      'Excluir tarefas',
      `Deseja excluir ${selectedTasks.length} tarefa(s)?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          onPress: async () => {
            setLocalLoading(true)

            setTimeout(async () => {
              await removeUserTasksBulk(user.usuarioId.toString(), selectedTasks);

              await fetchTasks()

              setLocalLoading(false)
            }, 1000);
          }
        }
      ]
    );

  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pendente':
        return { color: theme.status.pending };
      case 'Aberta':
        return { color: theme.status.open };
      case 'Concluída':
        return { color: theme.status.completed };
      default:
        return { color: theme.text.primary };
    }
  };

  const TaskItem = ({ item }: { item: ITask }) => {
    const [isDescriptionVisible, setDescriptionVisible] = useState(false);
    const scaleAnim = useState(new Animated.Value(1))[0];

    const handleLongPress = () => {
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
    };

    const handlePress = () => {
      if (isSelectionMode) {
        toggleTaskSelection(item.id);
      } else {
        setDescriptionVisible(!isDescriptionVisible);
      }
    };

    const handleDeleteTask = async () => {
      setLocalLoading(true)

      setTimeout(async () => {
        await removeUserTask(user.usuarioId.toString(), item.id);

        await fetchTasks()

        setLocalLoading(false)
      }, 1000);
    };

    const handleCompleteTask = () => {

      setLocalLoading(true)


      setTimeout(async () => {
        await completeUserTask(user.usuarioId.toString(), item.id);

        await fetchTasks()

        setLocalLoading(false)
      }, 1000);


    };

    return (
      <Animated.View style={[styles.taskContainer, {
        transform: [{ scale: scaleAnim }],
        backgroundColor: selectedTasks.includes(item.id) ? theme.shape.surface : '#fff',
      }]}>
        <TouchableOpacity
          onPress={handlePress}
          onLongPress={handleLongPress}
          activeOpacity={0.7}
        >
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
                name={selectedTasks.includes(item.id) ? 'checkbox' : 'square-outline'}
                size={24}
                color={theme.primary.main}
              />
            )}
          </View>
          <TextCustom style={styles.taskStatus}>
            Status: <TextCustom style={getStatusStyle(item.status)}> {item.status}</TextCustom>
          </TextCustom>
          <TextCustom style={styles.taskCreatedAt}>
            Criado em: {new Date(item.createdAt).toLocaleString('pt-BR', {
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

                <TouchableOpacity style={styles.button} onPress={handleCompleteTask}>
                  <CircleCheckBig size={24} color={theme.signal.success} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}
                  onPress={() => handleDeleteTask()}>
                  <Trash2 size={24} color={theme.signal.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const reorganizedTAsks = localTasks ? localTasks?.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  }) : []

  return (
    <>
      {!reorganizedTAsks || localLoading && (
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
              <TextCustom >Quantidade: {reorganizedTAsks?.length}</TextCustom>

            </View>

            {isSelectionMode && (
              <TouchableOpacity onPress={toggleSelectionMode}>
                <TextCustom style={styles.cancelButton}>Cancelar</TextCustom>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={reorganizedTAsks}
            renderItem={({ item }) => <TaskItem item={item} />}
            keyExtractor={item => item.id}
            style={styles.list}
            ListEmptyComponent={
              <TextCustom style={styles.emptyText}>Nenhuma tarefa encontrada</TextCustom>
            }
          />
          {isSelectionMode && (
            <Animated.View style={[styles.actionBar, {
              opacity: actionBarAnim,
              transform: [{
                translateY: actionBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              }],
            }]}>
              <TextCustom style={styles.selectedCount}>
                {selectedTasks.length} selecionada{selectedTasks.length !== 1 ? 's' : ''}
              </TextCustom>
              <View style={styles.actionButtons}>


                <TouchableOpacity
                  disabled={selectedTasks.length === 0}
                  style={[styles.button, {
                    opacity: selectedTasks.length === 0 ? 0.5 : 1
                  }]}
                  onPress={handleBulkComplete}>

                  <CircleCheckBig size={24} color={theme.signal.success} />
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={selectedTasks.length === 0}
                  style={[
                    styles.button,
                    {
                      opacity: selectedTasks.length === 0 ? 0.5 : 1
                    }
                  ]}
                  onPress={handleBulkDelete}>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
    color: theme.signal.danger,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  taskContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  taskDescription: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 8,
    marginBottom: 12,
  },
  taskStatus: {
    fontSize: 14,
    marginBottom: 4,
  },
  taskCreatedAt: {
    fontSize: 14,
    color: '#6b7280',
  },
  expandedContent: {
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  button: {
    borderRadius: 6,
    height: 38,
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(107,114,128,0.5)',
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
  },
  actionBar: {
    backgroundColor: theme.shape.background,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCount: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    opacity: 0.9,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
