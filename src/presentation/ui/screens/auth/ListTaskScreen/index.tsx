import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStorageStore } from '@/core/stores/usersStore';
import { useAuth } from '@/presentation/ui/context/AuthContext';
import { theme } from '@/presentation/ui/styles/colorsTheme';
import { SafeAreaContainer } from '@/presentation/ui/components/SafeAreaContainer';

// Define the task type
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Aberta' | 'Concluída' | 'Pendente';
  createdAt: string;
}

export const TaskListScreen: React.FC = () => {

  const { userTasks } = useAuth();

  // Render each task item
  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription}>{item.description}</Text>
      <Text style={styles.taskStatus}>Status: {item.status}</Text>
      <Text style={styles.taskCreatedAt}>
        Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
      </Text>
    </View>
  );

  return (
    <>
      {
        !userTasks &&
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
          }}
        >
          <ActivityIndicator size="large" color={theme.primary.main} />
        </View>
      }
      <SafeAreaContainer
        customStyles={{
          backgroundColor: theme.shape.background,
          paddingBottom: 0
        }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Minhas Tarefas</Text>


          <FlatList
            showsVerticalScrollIndicator={false}
            data={userTasks}
            renderItem={renderTask}
            keyExtractor={item => item.id}
            style={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma tarefa encontrada</Text>}
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
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 4,
  },
  taskStatus: {
    fontSize: 14,
    color: '#6b7280',
  },
  taskCreatedAt: {
    fontSize: 14,
    color: '#6b7280',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
  },
});
