import { theme } from '@/presentation/ui/styles/colorsTheme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: theme.primary.main,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text.primary,
  },
  filterButtonTextActive: {
    color: '#fff',
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
});
