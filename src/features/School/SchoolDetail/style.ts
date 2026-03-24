import { StyleSheet } from 'react-native';
import { shadow } from '@/src/utils/shadow';

export const schoolDetailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F0F0F' },
  listHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 },
  schoolCard: { backgroundColor: '#1A1A1A', borderRadius: 16, borderWidth: 1, borderColor: '#2A2A2A', padding: 14 },
  schoolCardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  schoolIconContainer: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', alignItems: 'center', justifyContent: 'center' },
  schoolInfo: { flex: 1, gap: 4 },
  schoolName: { color: '#F9FAFB', fontSize: 16, fontWeight: '700' },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  addressText: { color: '#6B7280', fontSize: 12, flex: 1 },
  schoolBadge: { alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  schoolBadgeText: { color: '#3B82F6', fontSize: 18, fontWeight: '700' },
  schoolBadgeLabel: { color: '#3B82F6', fontSize: 10, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { color: '#F9FAFB', fontSize: 16, fontWeight: '700' },
  cardWrapper: { paddingHorizontal: 16 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#2563EB', borderRadius: 28, width: 56, height: 56,
    alignItems: 'center', justifyContent: 'center',
    ...shadow('#3B82F6', 4, 12, 0.5, 8),
  },
  fabPressed: { backgroundColor: '#1D4ED8' },
});
