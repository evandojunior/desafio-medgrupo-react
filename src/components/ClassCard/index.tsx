import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Class, ClassShift } from '@/src/types';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '../ui/alert-dialog';
import { Heading } from '../ui/heading';
import { Text as GText } from '../ui/text';
import { styles } from './styles';

interface ClassCardProps {
  classItem: Class;
  schoolId: string;
  schoolName?: string;
  onDelete: (classId: string) => Promise<void>;
}

const shiftColors: Record<ClassShift, { bg: string; text: string }> = {
  Manhã: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' },
  Tarde: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' },
  Noite: { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366F1' },
};

export function ClassCard({ classItem, schoolId, schoolName, onDelete }: ClassCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(classItem.id);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  const shiftStyle = shiftColors[classItem.shift] ?? { bg: 'rgba(107, 114, 128, 0.15)', text: '#9CA3AF' };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Ionicons name="people-outline" size={20} color="#3B82F6" />
          </View>

          <View style={styles.info}>
            <Text style={styles.className} numberOfLines={1}>
              {classItem.name}
            </Text>
            {schoolName && (
              <Pressable
                onPress={() => router.push(`/schools/${schoolId}`)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}
              >
                <Ionicons name="school-outline" size={11} color="#6B7280" />
                <Text style={{ fontSize: 11, color: '#6B7280' }} numberOfLines={1}>{schoolName}</Text>
              </Pressable>
            )}
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: shiftStyle.bg }]}>
                <Text style={[styles.badgeText, { color: shiftStyle.text }]}>
                  {classItem.shift}
                </Text>
              </View>
              <View style={styles.yearBadge}>
                <Ionicons name="calendar-outline" size={10} color="#6B7280" />
                <Text style={styles.yearText}>{classItem.academicYear}</Text>
              </View>
            </View>
          </View>

          <View style={styles.right}>
            <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  router.push(`/schools/${schoolId}/classes/${classItem.id}/edit`)
                }
                style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
                hitSlop={8}
              >
                <Ionicons name="pencil" size={15} color="#3B82F6" />
              </Pressable>
              <Pressable
                onPress={() => setShowDeleteDialog(true)}
                style={({ pressed }) => [
                  styles.actionBtn,
                  styles.actionBtnDanger,
                  pressed && styles.actionBtnDangerPressed,
                ]}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={15} color="#EF4444" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <AlertDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md">Excluir Turma</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <GText size="sm" className="text-typography-600">
              Tem certeza que deseja excluir a turma{' '}
              <GText size="sm" bold>
                {classItem.name}
              </GText>
              ?
            </GText>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Pressable
              onPress={() => setShowDeleteDialog(false)}
              style={({ pressed }) => [
                styles.dialogBtn,
                styles.dialogBtnCancel,
                pressed && styles.dialogBtnCancelPressed,
              ]}
            >
              <Text style={styles.dialogBtnCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={handleDelete}
              disabled={deleting}
              style={({ pressed }) => [
                styles.dialogBtn,
                styles.dialogBtnDelete,
                pressed && styles.dialogBtnDeletePressed,
                deleting && { opacity: 0.6 },
              ]}
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.dialogBtnDeleteText}>Excluir</Text>
              )}
            </Pressable>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
