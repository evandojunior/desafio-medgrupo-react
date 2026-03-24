import React, { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View, Text as RNText } from 'react-native';
import { shadow } from '@/src/utils/shadow';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSchools } from '@/src/hooks/useSchools';
import { SchoolCard } from '@/src/components/SchoolCard';
import { SearchBar } from '@/src/components/SearchBar';
import { EmptyState } from '@/src/components/EmptyState';
import { Spinner } from '@/src/components/ui/spinner';
import { Text } from '@/src/components/ui/text';

export default function SchoolsScreen() {
  const [search, setSearch] = useState('');
  const { schools, isLoading, error, refetch, deleteSchool } = useSchools(search);

  if (isLoading && schools.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={schools}
        keyExtractor={(item, index) => item?.id || String(index)}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#3B82F6" />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.headerTop}>
              <RNText style={styles.counterText}>
                {schools.length} {schools.length === 1 ? 'escola' : 'escolas'}
              </RNText>
            </View>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar escola por nome ou endereço..."
            />
            {error && (
              <Text size="sm" className="text-error-500 text-center mt-2">
                {error}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <SchoolCard school={item} onDelete={deleteSchool} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="school-outline"
            title={search ? 'Nenhuma escola encontrada' : 'Nenhuma escola cadastrada'}
            description={
              search
                ? `Não encontramos escolas para "${search}"`
                : 'Toque no botão + para adicionar sua primeira escola'
            }
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      />

      <Pressable
        onPress={() => router.push('/schools/new')}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F0F0F',
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 8,
    gap: 14,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cardWrapper: {
    paddingHorizontal: 16,
  },
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
  fabPressed: {
    backgroundColor: '#1D4ED8',
  },
});
