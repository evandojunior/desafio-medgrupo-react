import React, { useState, useEffect } from 'react';
import { FlatList, Pressable, RefreshControl, View, Text, StyleSheet } from 'react-native';
import { shadow } from '@/src/utils/shadow';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSchool } from '@/src/hooks/useSchools';
import { useClasses } from '@/src/hooks/useClasses';
import { ClassCard } from '@/src/components/ClassCard';
import { SearchBar } from '@/src/components/SearchBar';
import { EmptyState } from '@/src/components/EmptyState';
import { Spinner } from '@/src/components/ui/spinner';
import { useToast } from '@/src/hooks/useToast';
import { ToastContainer } from '@/src/components/ui/toast';

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const school = useSchool(id);
  const [search, setSearch] = useState('');
  const { toasts, show: showToast, hide } = useToast();

  const { classes, isLoading, refetch, deleteClass } = useClasses(id, search);

  async function handleDeleteClass(classId: string) {
    await deleteClass(classId);
    showToast('Turma excluída com sucesso');
  }

  useEffect(() => {
    if (school) {
      navigation.setOptions({
        title: school.name,
        headerLeft: () => (
          <Pressable
            onPress={() => router.replace('/')}
            style={{ paddingHorizontal: 8, paddingVertical: 4, marginLeft: 4 }}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
        ),
      });
    }
  }, [school?.name]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    );
  }

  if (!school) {
    router.replace('/');
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#3B82F6" />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.schoolCard}>
              <View style={styles.schoolCardRow}>
                <View style={styles.schoolIconContainer}>
                  <Ionicons name="school" size={20} color="#3B82F6" />
                </View>
                <View style={styles.schoolInfo}>
                  <Text style={styles.schoolName} numberOfLines={1}>
                    {school.name}
                  </Text>
                  <View style={styles.addressRow}>
                    <Ionicons name="location-outline" size={12} color="#6B7280" />
                    <Text style={styles.addressText} numberOfLines={2}>
                      {school.address}
                    </Text>
                  </View>
                </View>
                <View style={styles.schoolBadge}>
                  <Text style={styles.schoolBadgeText}>{school.classesCount}</Text>
                  <Text style={styles.schoolBadgeLabel}>
                    {school.classesCount === 1 ? 'turma' : 'turmas'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Turmas</Text>
            </View>

            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar turma ou turno..."
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ClassCard classItem={item} schoolId={id} onDelete={handleDeleteClass} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title={search ? 'Nenhuma turma encontrada' : 'Nenhuma turma cadastrada'}
            description={
              search
                ? `Nenhum resultado para "${search}"`
                : 'Toque no + para cadastrar a primeira turma desta escola'
            }
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      />

      <Pressable
        onPress={() => router.push(`/schools/${id}/classes/new`)}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
      <ToastContainer toasts={toasts} onHide={hide} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F0F0F',
  },
  listHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 },
  schoolCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 14,
  },
  schoolCardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  schoolIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolInfo: { flex: 1, gap: 4 },
  schoolName: { color: '#F9FAFB', fontSize: 16, fontWeight: '700' },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  addressText: { color: '#6B7280', fontSize: 12, flex: 1 },
  schoolBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  schoolBadgeText: { color: '#3B82F6', fontSize: 18, fontWeight: '700' },
  schoolBadgeLabel: { color: '#3B82F6', fontSize: 10, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { color: '#F9FAFB', fontSize: 16, fontWeight: '700' },
  cardWrapper: { paddingHorizontal: 16 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2563EB',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow('#3B82F6', 4, 12, 0.5, 8),
  },
  fabPressed: { backgroundColor: '#1D4ED8' },
});
