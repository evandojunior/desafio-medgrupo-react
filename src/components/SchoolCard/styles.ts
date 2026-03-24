import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    backgroundColor: '#222222',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  schoolName: {
    color: '#F9FAFB',
    fontSize: 15,
    fontWeight: '700',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    color: '#6B7280',
    fontSize: 12,
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#3B82F6',
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPressed: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  actionBtnDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  actionBtnDangerPressed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  dialogBtn: {
    height: 38,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  dialogBtnCancel: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },
  dialogBtnCancelPressed: {
    backgroundColor: '#F3F4F6',
  },
  dialogBtnCancelText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  dialogBtnDelete: {
    backgroundColor: '#DC2626',
  },
  dialogBtnDeletePressed: {
    backgroundColor: '#B91C1C',
  },
  dialogBtnDeleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
