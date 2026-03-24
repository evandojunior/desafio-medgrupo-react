import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  listContent: { padding: 16, paddingBottom: 32 },
  emptyContent: { flex: 1, padding: 16 },
  filterRow: { flexDirection: 'row', gap: 10, marginTop: 12, marginBottom: 16, flexWrap: 'wrap', paddingVertical: 4, justifyContent: 'center' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#1C1C1C', borderWidth: 1, borderColor: '#333' },
  filterChipActive: { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F6' },
  filterChipText: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
  filterChipTextActive: { color: '#3B82F6' },
  counter: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  itemWrapper: { marginBottom: 8 },
});
