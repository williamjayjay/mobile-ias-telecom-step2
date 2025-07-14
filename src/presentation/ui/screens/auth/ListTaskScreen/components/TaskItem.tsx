import React, { useState, useCallback, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextCustom } from '@/presentation/ui/components/TextCustom';
import { CircleCheckBig, Trash2 } from 'lucide-react-native';
import { ITask } from '@/core/interfaces/tasks';
import { TaskStatus } from '@/core/enums/task';
import { theme } from '@/presentation/ui/styles/colorsTheme';
import { styles } from '../style';

interface TaskItemProps {
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
}

export const TaskItem = React.memo(
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
  }: TaskItemProps) => {
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
