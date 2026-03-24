import { StyleSheet } from 'react-native';
import { shadow } from '@/src/utils/shadow';

export const schoolListStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F0F0F' },
  listHeader: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 8, gap: 14 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  counterText: { color: '#6B7280', fontSize: 13, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  cardWrapper: { paddingHorizontal: 16 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#2563EB', borderRadius: 28, width: 56, height: 56,
    alignItems: 'center', justifyContent: 'center',
    ...shadow('#3B82F6', 4, 12, 0.5, 8),
  },
  fabPressed: { backgroundColor: '#1D4ED8' },
});
