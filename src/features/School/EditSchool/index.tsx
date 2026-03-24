import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, View, Text, TextInput, Pressable } from 'react-native';
import { goBack } from '@/src/utils/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSchool } from '@/src/hooks/useSchools';
import { useAppStore } from '@/src/store';
import { Spinner } from '@/src/components/ui/spinner';
import { useToast } from '@/src/hooks/useToast';
import { ToastContainer } from '@/src/components/ui/toast';
import { formStyles as styles } from '@/src/styles/form';

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres').max(1000, 'Endereço deve ter no máximo 1000 caracteres'),
});
type FormValues = z.infer<typeof schema>;

interface Props { schoolId: string; }

export function EditSchoolFeature({ schoolId }: Props) {
  const school = useSchool(schoolId);
  const updateSchool = useAppStore((s) => s.updateSchool);
  const { toasts, show: showToast, hide } = useToast();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: school?.name ?? '', address: school?.address ?? '' },
  });

  if (!school) return <View style={styles.loadingContainer}><Spinner size="large" /></View>;

  async function onSubmit(values: FormValues) {
    await updateSchool(schoolId, values);
    showToast('Escola atualizada com sucesso!');
    setTimeout(() => goBack(`/schools/${schoolId}`), 800);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Controller control={control} name="name" render={({ field: { onChange, value, onBlur } }) => (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome da Escola <Text style={styles.required}>*</Text></Text>
              <TextInput style={[styles.input, !!errors.name && styles.inputError]} placeholder="Digite o nome da escola" placeholderTextColor="#555" value={value} onChangeText={onChange} onBlur={onBlur} returnKeyType="next" maxLength={100} />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
            </View>
          )} />
          <Controller control={control} name="address" render={({ field: { onChange, value, onBlur } }) => (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Endereço <Text style={styles.required}>*</Text></Text>
              <TextInput style={[styles.input, styles.inputMultiline, !!errors.address && styles.inputError]} placeholder="Digite o endereço da escola" placeholderTextColor="#555" value={value} onChangeText={onChange} onBlur={onBlur} multiline numberOfLines={2} returnKeyType="done" maxLength={1000} />
              {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
            </View>
          )} />
          <View style={styles.buttonRow}>
            <Pressable style={({ pressed }) => [styles.btnCancel, pressed && styles.btnCancelPressed]} onPress={() => goBack(`/schools/${schoolId}`)}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.btnSubmit, pressed && styles.btnSubmitPressed]} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="small" /> : <Text style={styles.btnSubmitText}>Salvar</Text>}
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <ToastContainer toasts={toasts} onHide={hide} />
    </KeyboardAvoidingView>
  );
}
