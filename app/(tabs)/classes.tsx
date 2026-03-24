import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useToast } from '@/src/hooks/useToast';
import { ToastContainer } from '@/src/components/ui/toast';
import { useAppStore } from '@/src/store';
import { ClassCard } from '@/src/components/ClassCard';
import { SearchBar } from '@/src/components/SearchBar';
import { EmptyState } from '@/src/components/EmptyState';
import { Spinner } from '@/src/components/ui/spinner';
import { Class } from '@/src/types';

type ClassWithSchool = Class & { schoolName: string };

const SHIFTS = ['Manhã', 'Tarde', 'Noite'] as const;
type Shift = typeof SHIFTS[number];

const shiftColors: Record<Shift, { bg: string; text: string }> = {
  Manhã: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' },
  Tarde: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' },
  Noite: { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366F1' },
};

export default function AllClassesScreen() {
  const {
    schools,
    classes: allClasses,
    fetchSchools,
    fetchClasses,
    deleteClass,
    schoolsLoading,
    classesLoading,
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toasts, show: showToast, hide } = useToast();

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    await fetchSchools();
    const currentSchools = useAppStore.getState().schools;
    await Promise.all(currentSchools.map((s) => fetchClasses(s.id)));
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  }

  const classesWithSchool = useMemo<ClassWithSchool[]>(() => {
    const result: ClassWithSchool[] = [];
    for (const school of schools) {
      const schoolClasses = allClasses[school.id] ?? [];
      for (const c of schoolClasses) {
        result.push({ ...c, schoolName: school.name });
      }
    }
    return result;
  }, [schools, allClasses]);

  const filtered = useMemo(() => {
    return classesWithSchool.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.schoolName.toLowerCase().includes(search.toLowerCase()) ||
        c.shift.toLowerCase().includes(search.toLowerCase());
      const matchesShift = selectedShift ? c.shift === selectedShift : true;
      return matchesSearch && matchesShift;
    });
  }, [classesWithSchool, search, selectedShift]);

  const isLoading = schoolsLoading || classesLoading;

  if (isLoading && classesWithSchool.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => item?.id || String(index)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#3B82F6" />
        }
        ListHeaderComponent={
          <>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar turma, escola ou turno..."
            />
            {/* Filtro por turno */}
            <View style={styles.filterRow}>
              <Pressable
                onPress={() => setSelectedShift(null)}
                style={[styles.filterChip, !selectedShift && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, !selectedShift && styles.filterChipTextActive]}>
                  Todos
                </Text>
              </Pressable>
              {SHIFTS.map((shift) => {
                const active = selectedShift === shift;
                const color = shiftColors[shift];
                return (
                  <Pressable
                    key={shift}
                    onPress={() => setSelectedShift(active ? null : shift)}
                    style={[
                      styles.filterChip,
                      active && { backgroundColor: color.bg, borderColor: color.text },
                    ]}
                  >
                    <Text style={[styles.filterChipText, active && { color: color.text }]}>
                      {shift}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {/* Contador */}
            <Text style={styles.counter}>
              {filtered.length} turma{filtered.length !== 1 ? 's' : ''}
              {selectedShift ? ` · ${selectedShift}` : ''}
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <ClassCard
              classItem={item}
              schoolId={item.schoolId}
              schoolName={item.schoolName}
              onDelete={async (classId) => {
                await deleteClass(item.schoolId, classId);
                showToast('Turma excluída com sucesso');
              }}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="Nenhuma turma encontrada"
            description={
              search || selectedShift
                ? 'Tente ajustar os filtros.'
                : 'Acesse uma escola e cadastre turmas.'
            }
          />
        }
        contentContainerStyle={filtered.length === 0 ? styles.emptyContent : styles.listContent}
      />
      <ToastContainer toasts={toasts} onHide={hide} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  listContent: { padding: 16, paddingBottom: 32 },
  emptyContent: { flex: 1, padding: 16 },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
    paddingVertical: 4,
    justifyContent: 'center',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#333',
  },
  filterChipActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#3B82F6',
  },
  counter: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  itemWrapper: {
    marginBottom: 8,
  },
});
