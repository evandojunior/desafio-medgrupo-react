import React, { useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, View, Text, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { goBack } from '@/src/utils/navigation';
import { useToast } from '@/src/hooks/useToast';
import { ToastContainer } from '@/src/components/ui/toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CLASS_SHIFTS, ClassShift } from '@/src/types';
import { useAppStore } from '@/src/store';
import { Spinner } from '@/src/components/ui/spinner';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectContent, SelectItem } from '@/src/components/ui/select';
import { formStyles as styles } from '@/src/styles/form';

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  shift: z.string().min(1, 'Selecione um turno') as z.ZodType<ClassShift>,
  academicYear: z.string().min(1, 'Informe o ano letivo').refine(
    (v) => /^\d{4}$/.test(v) && Number(v) >= 2000 && Number(v) <= 2100,
    { message: 'Ano letivo inválido (ex: 2025)' }
  ),
});
type FormValues = z.infer<typeof schema>;

interface Props { schoolId: string; classId: string; }

export function EditClassFeature({ schoolId, classId }: Props) {
  const { classes: allClasses, updateClass } = useAppStore();
  const { toasts, show: showToast, hide } = useToast();
  const classItem = (allClasses[schoolId] ?? []).find((c) => c.id === classId);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => goBack(`/schools/${schoolId}`)} style={{ paddingHorizontal: 8, paddingVertical: 4, marginLeft: 4 }} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
      ),
    });
  }, [schoolId]);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: classItem?.name ?? '',
      shift: classItem?.shift ?? ('' as ClassShift),
      academicYear: classItem ? String(classItem.academicYear) : String(new Date().getFullYear()),
    },
  });

  if (!classItem) return <View style={styles.loadingContainer}><Spinner size="large" /></View>;

  async function onSubmit(values: FormValues) {
    await updateClass(schoolId, classId, { name: values.name, shift: values.shift, academicYear: Number(values.academicYear) });
    showToast('Turma atualizada com sucesso!');
    setTimeout(() => goBack(`/schools/${schoolId}`), 800);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Controller control={control} name="name" render={({ field: { onChange, value, onBlur } }) => (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome da Turma <Text style={styles.required}>*</Text></Text>
              <TextInput style={[styles.input, !!errors.name && styles.inputError]} placeholder="Digite o nome da turma" placeholderTextColor="#555" value={value} onChangeText={onChange} onBlur={onBlur} returnKeyType="next" maxLength={100} />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
            </View>
          )} />
          <Controller control={control} name="shift" render={({ field: { onChange, value } }) => (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Turno <Text style={styles.required}>*</Text></Text>
              <Select selectedValue={value} onValueChange={onChange} isInvalid={!!errors.shift}>
                <SelectTrigger isInvalid={!!errors.shift}><SelectInput placeholder="Selecione o turno" /><SelectIcon /></SelectTrigger>
                <SelectPortal><SelectContent>{CLASS_SHIFTS.map((s) => <SelectItem key={s} label={s} value={s} />)}</SelectContent></SelectPortal>
              </Select>
              {errors.shift && <Text style={styles.errorText}>{errors.shift.message}</Text>}
            </View>
          )} />
          <Controller control={control} name="academicYear" render={({ field: { onChange, value, onBlur } }) => (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Ano Letivo <Text style={styles.required}>*</Text></Text>
              <TextInput style={[styles.input, !!errors.academicYear && styles.inputError]} placeholder="Digite o ano letivo (ex: 2026)" placeholderTextColor="#555" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="numeric" returnKeyType="done" maxLength={4} />
              {errors.academicYear && <Text style={styles.errorText}>{errors.academicYear.message}</Text>}
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
