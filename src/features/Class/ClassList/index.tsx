import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { useToast } from '@/src/hooks/useToast';
import { ToastContainer } from '@/src/components/ui/toast';
import { useAppStore } from '@/src/store';
import { ClassCard } from '@/src/components/ClassCard';
import { SearchBar } from '@/src/components/SearchBar';
import { EmptyState } from '@/src/components/EmptyState';
import { Spinner } from '@/src/components/ui/spinner';
import { Class } from '@/src/types';
import { styles } from './style';

type ClassWithSchool = Class & { schoolName: string };
const SHIFTS = ['Manhã', 'Tarde', 'Noite'] as const;
type Shift = typeof SHIFTS[number];
const shiftColors: Record<Shift, { bg: string; text: string }> = {
  Manhã: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' },
  Tarde: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' },
  Noite: { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366F1' },
};

export function ClassList() {
  const { schools, classes: allClasses, fetchSchools, fetchClasses, deleteClass, schoolsLoading, classesLoading } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toasts, show: showToast, hide } = useToast();

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    await fetchSchools();
    const s = useAppStore.getState().schools;
    await Promise.all(s.map((sc) => fetchClasses(sc.id)));
  }

  async function handleRefresh() { setRefreshing(true); await loadAll(); setRefreshing(false); }

  const classesWithSchool = useMemo<ClassWithSchool[]>(() => {
    const result: ClassWithSchool[] = [];
    for (const school of schools)
      for (const c of allClasses[school.id] ?? [])
        result.push({ ...c, schoolName: school.name });
    return result;
  }, [schools, allClasses]);

  const filtered = useMemo(() => classesWithSchool.filter((c) => {
    const ok = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.schoolName.toLowerCase().includes(search.toLowerCase()) ||
      c.shift.toLowerCase().includes(search.toLowerCase());
    return ok && (selectedShift ? c.shift === selectedShift : true);
  }), [classesWithSchool, search, selectedShift]);

  const isLoading = schoolsLoading || classesLoading;
  if (isLoading && classesWithSchool.length === 0) return <View style={styles.loadingContainer}><Spinner size="large" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => item?.id || String(index)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#3B82F6" />}
        ListHeaderComponent={
          <>
            <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar turma, escola ou turno..." />
            <View style={styles.filterRow}>
              <Pressable onPress={() => setSelectedShift(null)} style={[styles.filterChip, !selectedShift && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, !selectedShift && styles.filterChipTextActive]}>Todos</Text>
              </Pressable>
              {SHIFTS.map((shift) => {
                const active = selectedShift === shift;
                const color = shiftColors[shift];
                return (
                  <Pressable key={shift} onPress={() => setSelectedShift(active ? null : shift)} style={[styles.filterChip, active && { backgroundColor: color.bg, borderColor: color.text }]}>
                    <Text style={[styles.filterChipText, active && { color: color.text }]}>{shift}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.counter}>{filtered.length} turma{filtered.length !== 1 ? 's' : ''}{selectedShift ? ` · ${selectedShift}` : ''}</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <ClassCard classItem={item} schoolId={item.schoolId} schoolName={item.schoolName}
              onDelete={async (classId) => { await deleteClass(item.schoolId, classId); showToast('Turma excluída com sucesso'); }}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState icon="people-outline" title="Nenhuma turma encontrada"
            description={search || selectedShift ? 'Tente ajustar os filtros.' : 'Acesse uma escola e cadastre turmas.'}
          />
        }
        contentContainerStyle={filtered.length === 0 ? styles.emptyContent : styles.listContent}
      />
      <ToastContainer toasts={toasts} onHide={hide} />
    </View>
  );
}
