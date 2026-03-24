import React, { useState, useEffect } from 'react';
import { FlatList, Pressable, RefreshControl, View, Text } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSchool } from '@/src/hooks/useSchools';
import { useClasses } from '@/src/hooks/useClasses';
import { ClassCard } from '@/src/components/ClassCard';
import { SearchBar } from '@/src/components/SearchBar';
import { EmptyState } from '@/src/components/EmptyState';
import { Spinner } from '@/src/components/ui/spinner';
import { useToast } from '@/src/hooks/useToast';
import { ToastContainer } from '@/src/components/ui/toast';
import { schoolDetailStyles as styles } from './style';

interface Props { schoolId: string; }

export function SchoolDetailFeature({ schoolId }: Props) {
  const navigation = useNavigation();
  const school = useSchool(schoolId);
  const [search, setSearch] = useState('');
  const { toasts, show: showToast, hide } = useToast();
  const { classes, isLoading, refetch, deleteClass } = useClasses(schoolId, search);

  useEffect(() => {
    if (school) {
      navigation.setOptions({
        title: school.name,
        headerLeft: () => (
          <Pressable onPress={() => router.replace('/')} style={{ paddingHorizontal: 8, paddingVertical: 4, marginLeft: 4 }} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
        ),
      });
    }
  }, [school?.name]);

  if (isLoading) return <View style={styles.loadingContainer}><Spinner size="large" /></View>;
  if (!school) { router.replace('/'); return null; }

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#3B82F6" />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.schoolCard}>
              <View style={styles.schoolCardRow}>
                <View style={styles.schoolIconContainer}><Ionicons name="school" size={20} color="#3B82F6" /></View>
                <View style={styles.schoolInfo}>
                  <Text style={styles.schoolName} numberOfLines={1}>{school.name}</Text>
                  <View style={styles.addressRow}>
                    <Ionicons name="location-outline" size={12} color="#6B7280" />
                    <Text style={styles.addressText} numberOfLines={2}>{school.address}</Text>
                  </View>
                </View>
                <View style={styles.schoolBadge}>
                  <Text style={styles.schoolBadgeText}>{school.classesCount}</Text>
                  <Text style={styles.schoolBadgeLabel}>{school.classesCount === 1 ? 'turma' : 'turmas'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Turmas</Text></View>
            <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar turma ou turno..." />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ClassCard classItem={item} schoolId={schoolId} onDelete={async (id) => { await deleteClass(id); showToast('Turma excluída com sucesso'); }} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState icon="people-outline"
            title={search ? 'Nenhuma turma encontrada' : 'Nenhuma turma cadastrada'}
            description={search ? `Nenhum resultado para "${search}"` : 'Toque no + para cadastrar a primeira turma desta escola'}
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      />
      <Pressable onPress={() => router.push(`/schools/${schoolId}/classes/new`)} style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
      <ToastContainer toasts={toasts} onHide={hide} />
    </View>
  );
}
