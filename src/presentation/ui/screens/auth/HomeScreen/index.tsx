import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '@/presentation/ui/context/AuthContext';
import { theme } from '@/presentation/ui/styles/colorsTheme';

// Mock data generation (permanece inalterado)
const generateMockTasks = () => {
  const statuses = ['Aberta', 'Concluída', 'Pendente'];
  const titles = ['Comprar mantimentos', 'Estudar React', 'Reunião equipe', 'Fazer exercícios', 'Limpar casa',
    'Enviar e-mail', 'Atualizar projeto', 'Planejar viagem', 'Ler livro', 'Organizar documentos'];
  return Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: titles[index],
    description: `Descrição da tarefa ${index + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(2025, 6, 1 + Math.floor(Math.random() * 28),
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60)).toISOString(),
  }));
};

export function HomeScreen() {
  const { setUnAuthrotized } = useAuth();
  const [tasks, setTasks] = useState(generateMockTasks());
  const [filter, setFilter] = useState('Pendente');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  // Sort tasks by creation date
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Filter tasks based on status
  const filteredTasks = filter === 'Todos'
    ? sortedTasks
    : sortedTasks.filter(task => task.status === filter);

  const handleAddTask = () => {
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newTask = {
      id: tasks.length + 1,
      title: newTitle,
      description: newDescription,
      status: 'Pendente',
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    setNewTitle('');
    setNewDescription('');
    setIsMultiSelect(false);
    setSelectedTasks([]);
  };

  const handleDeleteTask = (taskId) => {
    setIsDeleting(true);
    setTimeout(() => {
      setTasks(tasks.filter(task => task.id !== taskId));
      setIsDeleting(false);
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
      if (selectedTasks.length === 1) setIsMultiSelect(false);
    }, 1000);
  };

  const handleDeleteSelectedTasks = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setTasks(tasks.filter(task => !selectedTasks.includes(task.id)));
      setIsDeleting(false);
      setSelectedTasks([]);
      setIsMultiSelect(false);
    }, 1000);
  };

  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: 'Concluída' } : task
    ));
    setExpandedTaskId(null);
  };

  const handleCompleteSelectedTasks = () => {
    setTasks(tasks.map(task =>
      selectedTasks.includes(task.id) ? { ...task, status: 'Concluída' } : task
    ));
    setSelectedTasks([]);
    setIsMultiSelect(false);
  };

  const toggleExpandTask = (taskId) => {
    if (isMultiSelect) {
      toggleSelectTask(taskId);
    } else {
      const task = tasks.find(t => t.id === taskId);
      if (task.status === 'Pendente') {
        setTasks(tasks.map(t =>
          t.id === taskId ? { ...t, status: 'Aberta' } : t
        ));
      }
      setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    }
  };

  const toggleSelectTask = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleLongPress = (taskId) => {
    setIsMultiSelect(true);
    toggleSelectTask(taskId);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.shape.background, padding: 20 }}>
      {/* Header */}
      <Text style={{ fontSize: 30, color: theme.text.primary, textAlign: 'center', marginBottom: 20 }}>
        Lista de Tarefas
      </Text>

      {/* New Task Form */}
      <View style={{ marginBottom: 20, opacity: isDeleting ? 0.5 : 1, pointerEvents: isDeleting ? 'none' : 'auto' }}>
        <TextInput
          style={{
            backgroundColor: theme.shape.surface,
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
            borderColor: theme.details.shadow,
            borderWidth: 1,
            color: theme.text.primary,
          }}
          placeholder="Título da tarefa"
          placeholderTextColor={theme.text.secondary}
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={{
            backgroundColor: theme.shape.surface,
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
            borderColor: theme.details.shadow,
            borderWidth: 1,
            color: theme.text.primary,
          }}
          placeholder="Descrição da tarefa"
          placeholderTextColor={theme.text.secondary}
          value={newDescription}
          onChangeText={setNewDescription}
        />
        <TouchableOpacity
          style={{
            backgroundColor: theme.primary.main,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
          }}
          onPress={handleAddTask}
        >
          <Text style={{ color: theme.shape.surface, fontSize: 16 }}>Adicionar Tarefa</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
        {['Pendente', 'Aberta', 'Concluída', 'Todos'].map(status => (
          <TouchableOpacity
            key={status}
            style={{
              backgroundColor: filter === status ? theme.primary.main : theme.details.shadow,
              padding: 10,
              borderRadius: 5,
              opacity: isDeleting ? 0.5 : 1,
              pointerEvents: isDeleting ? 'none' : 'auto',
            }}
            onPress={() => setFilter(status)}
          >
            <Text style={{ color: theme.shape.surface }}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Multi-select Actions */}
      {isMultiSelect && selectedTasks.length > 0 && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: 20,
          opacity: isDeleting ? 0.5 : 1,
          pointerEvents: isDeleting ? 'none' : 'auto',
        }}>
          <TouchableOpacity
            style={{
              backgroundColor: theme.signal.danger,
              padding: 10,
              borderRadius: 5,
              flex: 1,
              marginRight: 10,
              alignItems: 'center',
            }}
            onPress={handleDeleteSelectedTasks}
          >
            <Text style={{ color: theme.shape.surface }}>Excluir Selecionadas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: theme.signal.success,
              padding: 10,
              borderRadius: 5,
              flex: 1,
              alignItems: 'center',
            }}
            onPress={handleCompleteSelectedTasks}
          >
            <Text style={{ color: theme.shape.surface }}>Marcar Concluídas</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Task List */}
      <ScrollView style={{ flex: 1, opacity: isDeleting ? 0.5 : 1 }}>
        {isDeleting && (
          <ActivityIndicator size="large" color={theme.primary.main} style={{ marginVertical: 20 }} />
        )}
        {filteredTasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={{
              backgroundColor: selectedTasks.includes(task.id) ? theme.details.shadow : theme.shape.surface,
              padding: 15,
              marginBottom: 10,
              borderRadius: 5,
              opacity: isDeleting ? 0.5 : 1,
              pointerEvents: isDeleting ? 'none' : 'auto',
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: theme.details.shadow,
              borderWidth: 1,
            }}
            onPress={() => toggleExpandTask(task.id)}
            onLongPress={() => handleLongPress(task.id)}
          >
            {isMultiSelect && (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: theme.text.primary,
                  marginRight: 10,
                  backgroundColor: selectedTasks.includes(task.id) ? theme.signal.success : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {selectedTasks.includes(task.id) && (
                  <Text style={{ color: theme.shape.surface, fontSize: 12 }}>✓</Text>
                )}
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text.primary, fontSize: 18, fontWeight: 'bold' }}>{task.title}</Text>
              <Text style={{ color: theme.text.secondary, fontSize: 14 }}>
                Status: {task.status}
              </Text>
              <Text style={{ color: theme.text.secondary, fontSize: 14 }}>
                Criada em: {new Date(task.createdAt).toLocaleString()}
              </Text>
              {expandedTaskId === task.id && !isMultiSelect && (
                <View style={{ marginTop: 10 }}>
                  <Text style={{ color: theme.text.secondary, fontSize: 14 }}>
                    Descrição: {task.description}
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: theme.signal.danger,
                        padding: 8,
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 5,
                        alignItems: 'center',
                      }}
                      onPress={() => handleDeleteTask(task.id)}
                    >
                      <Text style={{ color: theme.shape.surface }}>Excluir Tarefa</Text>
                    </TouchableOpacity>
                    {task.status !== 'Concluída' && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: theme.signal.success,
                          padding: 8,
                          borderRadius: 5,
                          flex: 1,
                          marginLeft: 5,
                          alignItems: 'center',
                        }}
                        onPress={() => handleCompleteTask(task.id)}
                      >
                        <Text style={{ color: theme.shape.surface }}>Concluir Tarefa</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
