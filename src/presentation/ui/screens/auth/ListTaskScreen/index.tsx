import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '@/presentation/ui/context/AuthContext';
import { theme } from '@/presentation/ui/styles/colorsTheme';
import { SafeAreaContainer } from '@/presentation/ui/components/SafeAreaContainer';
import { ITask } from '@/core/interfaces/tasks';
import { Ionicons } from '@expo/vector-icons';
import { TextCustom } from '@/presentation/ui/components/TextCustom';

export const TaskListScreen = () => {
  const { userTasks } = useAuth();

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

    return (
      <View style={styles.taskContainer}>
        <View style={styles.taskHeader}>
          <TextCustom style={styles.taskTitle}>{item.title}</TextCustom>
          <TouchableOpacity onPress={() => setDescriptionVisible(!isDescriptionVisible)}>
            <Ionicons
              name={isDescriptionVisible ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.text.primary}
            />
          </TouchableOpacity>
        </View>
        <TextCustom style={[styles.taskStatus]}>
          Status:
          <TextCustom style={getStatusStyle(item.status)}>
            {" "}{item.status}
          </TextCustom>
        </TextCustom>
        <TextCustom style={styles.taskCreatedAt}>
          Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </TextCustom>
        {isDescriptionVisible && (
          <TextCustom style={styles.taskDescription}>{item.description}</TextCustom>
        )}
      </View>
    );
  };

  return (
    <>
      {!userTasks && (
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
          <TextCustom style={styles.title}>Minhas Tarefas</TextCustom>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={userTasks}
            renderItem={({ item }) => <TaskItem item={item} />}
            keyExtractor={item => item.id}
            style={styles.list}
            ListEmptyComponent={
              <TextCustom style={styles.emptyText}>Nenhuma tarefa encontrada</TextCustom>
            }
          />
        </View>
      </SafeAreaContainer>
    </>
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
  },
  taskStatus: {
    fontSize: 14,
    marginBottom: 4,
  },
  taskCreatedAt: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
  },
});
