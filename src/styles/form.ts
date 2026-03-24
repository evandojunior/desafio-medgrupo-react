import { StyleSheet } from 'react-native';
import { shadow } from '@/src/utils/shadow';

export const formStyles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: '#0F0F0F' },
  scrollContent: { flexGrow: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F0F0F',
  },
  formContainer: { flex: 1, padding: 16, gap: 20 },
  fieldGroup: { gap: 6 },
  label: { color: '#D1D5DB', fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
  required: { color: '#EF4444' },
  input: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F9FAFB',
    fontSize: 14,
  },
  inputMultiline: { minHeight: 72, textAlignVertical: 'top', paddingTop: 12 },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 2 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 'auto', paddingTop: 16 },
  btnCancel: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1, borderColor: '#333333', alignItems: 'center',
  },
  btnCancelPressed: { backgroundColor: '#1A1A1A' },
  btnCancelText: { color: '#9CA3AF', fontSize: 15, fontWeight: '600' },
  btnSubmit: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#2563EB', alignItems: 'center',
    ...shadow('#2563EB', 4, 8, 0.4, 6),
  },
  btnSubmitPressed: { backgroundColor: '#1D4ED8' },
  btnSubmitText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
