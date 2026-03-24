import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { shadow } from '@/src/utils/shadow';
import { useLocalSearchParams } from 'expo-router';
import { goBack } from '@/src/utils/navigation';
import { useToast } from '@/src/hooks/useToast';
import { ToastContainer } from '@/src/components/ui/toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSchool } from '@/src/hooks/useSchools';
import { useAppStore } from '@/src/store';
import { Spinner } from '@/src/components/ui/spinner';

const schema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  address: z
    .string()
    .min(5, 'Endereço deve ter pelo menos 5 caracteres')
    .max(1000, 'Endereço deve ter no máximo 1000 caracteres'),
});

type FormValues = z.infer<typeof schema>;

export default function EditSchoolScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const school = useSchool(id);
  const updateSchool = useAppStore((s) => s.updateSchool);
  const { toasts, show: showToast, hide } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: school?.name ?? '',
      address: school?.address ?? '',
    },
  });

  if (!school) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    );
  }

  async function onSubmit(values: FormValues) {
    await updateSchool(id, values);
    showToast('Escola atualizada com sucesso!');
    setTimeout(() => goBack(`/schools/${id}`), 800);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Nome da Escola <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, !!errors.name && styles.inputError]}
                  placeholder="Digite o nome da escola"
                  placeholderTextColor="#555"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                  maxLength={100}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Endereço <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline, !!errors.address && styles.inputError]}
                  placeholder="Digite o endereço da escola"
                  placeholderTextColor="#555"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={2}
                  returnKeyType="done"
                  maxLength={1000}
                />
                {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
              </View>
            )}
          />

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [styles.btnCancel, pressed && styles.btnCancelPressed]}
              onPress={() => goBack(`/schools/${id}`)}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.btnSubmit, pressed && styles.btnSubmitPressed]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="small" /> : <Text style={styles.btnSubmitText}>Salvar</Text>}
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <ToastContainer toasts={toasts} onHide={hide} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  btnCancelPressed: { backgroundColor: '#1A1A1A' },
  btnCancelText: { color: '#9CA3AF', fontSize: 15, fontWeight: '600' },
  btnSubmit: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    ...shadow('#2563EB', 4, 8, 0.4, 6),
  },
  btnSubmitPressed: { backgroundColor: '#1D4ED8' },
  btnSubmitText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
