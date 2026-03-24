import React, { useEffect } from 'react';
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
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectItem,
} from '@/src/components/ui/select';

const schema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  shift: z.string().min(1, 'Selecione um turno') as z.ZodType<ClassShift>,
  academicYear: z
    .string()
    .min(1, 'Informe o ano letivo')
    .refine((v) => /^\d{4}$/.test(v) && Number(v) >= 2000 && Number(v) <= 2100, {
      message: 'Ano letivo inválido (ex: 2025)',
    }),
});

type FormValues = z.infer<typeof schema>;

export default function EditClassScreen() {
  const { id: schoolId, classId } = useLocalSearchParams<{ id: string; classId: string }>();
  const { classes: allClasses, updateClass } = useAppStore();
  const { toasts, show: showToast, hide } = useToast();
  const classItem = (allClasses[schoolId] ?? []).find((c) => c.id === classId);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => goBack(`/schools/${schoolId}`)}
          style={{ paddingHorizontal: 8, paddingVertical: 4, marginLeft: 4 }}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
      ),
    });
  }, [schoolId]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: classItem?.name ?? '',
      shift: classItem?.shift ?? ('' as ClassShift),
      academicYear: classItem ? String(classItem.academicYear) : String(new Date().getFullYear()),
    },
  });

  if (!classItem) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    );
  }

  async function onSubmit(values: FormValues) {
    await updateClass(schoolId, classId, {
      name: values.name,
      shift: values.shift,
      academicYear: Number(values.academicYear),
    });
    showToast('Turma atualizada com sucesso!');
    setTimeout(() => goBack(`/schools/${schoolId}`), 800);
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
                  Nome da Turma <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, !!errors.name && styles.inputError]}
                  placeholder="Digite o nome da turma"
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
            name="shift"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Turno <Text style={styles.required}>*</Text>
                </Text>
                <Select selectedValue={value} onValueChange={onChange} isInvalid={!!errors.shift}>
                  <SelectTrigger isInvalid={!!errors.shift}>
                    <SelectInput placeholder="Selecione o turno" />
                    <SelectIcon />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      {CLASS_SHIFTS.map((shift) => (
                        <SelectItem key={shift} label={shift} value={shift} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
                {errors.shift && <Text style={styles.errorText}>{errors.shift.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="academicYear"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Ano Letivo <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, !!errors.academicYear && styles.inputError]}
                  placeholder="Digite o ano letivo (ex: 2026)"
                  placeholderTextColor="#555"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  returnKeyType="done"
                  maxLength={4}
                />
                {errors.academicYear && (
                  <Text style={styles.errorText}>{errors.academicYear.message}</Text>
                )}
              </View>
            )}
          />

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [styles.btnCancel, pressed && styles.btnCancelPressed]}
              onPress={() => goBack(`/schools/${schoolId}`)}
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
