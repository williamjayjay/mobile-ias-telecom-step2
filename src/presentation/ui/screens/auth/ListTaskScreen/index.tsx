// src/presentation/ui/screens/TaskList/TaskListScreen.tsx
import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { SafeAreaContainer } from '@/presentation/ui/components/SafeAreaContainer';
import { TextCustom } from '@/presentation/ui/components/TextCustom';
import { CircleCheckBig, Trash2 } from 'lucide-react-native';
import { theme } from '@/presentation/ui/styles/colorsTheme';
import { ITask } from '@/core/interfaces/tasks';
import { styles } from './style';
import { useTaskListScreenHook } from './hooks';
import { TaskItem } from './components/TaskItem';
import { TaskStatus } from '@/core/enums/task';

export const TaskListScreen = () => {
  const {
    user,
    selectedTasks,
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
  } = useTaskListScreenHook();

  const renderFilterButton = (filterType: TaskStatus.Aberta | TaskStatus.Pendente | TaskStatus.Concluida | TaskStatus.Todas) => (
    <TouchableOpacity
      key={filterType}
      style={[styles.filterButton, filter === filterType && styles.filterButtonActive]}
      onPress={() => {
        setFilter(filterType);
        if (filterType === TaskStatus.Todas) {
          fetchTasks(TaskStatus.Todas);
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
              {[TaskStatus.Todas, TaskStatus.Pendente, TaskStatus.Aberta, TaskStatus.Concluida].map(filterType =>
                renderFilterButton(filterType)
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
