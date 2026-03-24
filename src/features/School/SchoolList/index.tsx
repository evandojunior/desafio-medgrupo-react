import React, { useState } from 'react';
import { FlatList, Pressable, RefreshControl, View, Text as RNText } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSchools } from '@/src/hooks/useSchools';
import { SchoolCard } from '@/src/components/SchoolCard';
import { SearchBar } from '@/src/components/SearchBar';
import { EmptyState } from '@/src/components/EmptyState';
import { Spinner } from '@/src/components/ui/spinner';
import { Text } from '@/src/components/ui/text';
import { useToast } from '@/src/hooks/useToast';
import { ToastContainer } from '@/src/components/ui/toast';
import { schoolListStyles as styles } from './style';

export function SchoolList() {
  const [search, setSearch] = useState('');
  const { schools, isLoading, error, refetch, deleteSchool } = useSchools(search);
  const { toasts, show: showToast, hide } = useToast();

  if (isLoading && schools.length === 0) {
    return <View style={styles.loadingContainer}><Spinner size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={schools}
        keyExtractor={(item, index) => item?.id || String(index)}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#3B82F6" />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.headerTop}>
              <RNText style={styles.counterText}>
                {schools.length} {schools.length === 1 ? 'escola' : 'escolas'}
              </RNText>
            </View>
            <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar escola por nome ou endereço..." />
            {error && <Text size="sm" className="text-error-500 text-center mt-2">{error}</Text>}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <SchoolCard school={item} onDelete={async (id) => { await deleteSchool(id); showToast('Escola excluída com sucesso'); }} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState icon="school-outline"
            title={search ? 'Nenhuma escola encontrada' : 'Nenhuma escola cadastrada'}
            description={search ? `Não encontramos escolas para "${search}"` : 'Toque no botão + para adicionar sua primeira escola'}
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      />
      <Pressable onPress={() => router.push('/schools/new')} style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
      <ToastContainer toasts={toasts} onHide={hide} />
    </View>
  );
}
