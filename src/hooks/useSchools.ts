import { useEffect } from 'react';
import { useAppStore } from '../store';

export function useSchools(searchQuery = '') {
  const { schools, schoolsLoading, schoolsError, fetchSchools, createSchool, updateSchool, deleteSchool } =
    useAppStore();

  useEffect(() => {
    fetchSchools();
  }, []);

  const filtered = schools.filter((s) => {
    const nameMatch = (s?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const addrMatch = (s?.address || '').toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || addrMatch;
  });

  return {
    schools: filtered,
    allSchools: schools,
    isLoading: schoolsLoading,
    error: schoolsError,
    refetch: fetchSchools,
    createSchool,
    updateSchool,
    deleteSchool,
  };
}

export function useSchool(id: string) {
  const { schools, fetchSchools } = useAppStore();
  const school = schools.find((s) => s.id === id);

  useEffect(() => {
    if (!school) fetchSchools();
  }, [id]);

  return school;
}
