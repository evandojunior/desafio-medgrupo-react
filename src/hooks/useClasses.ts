import { useEffect } from 'react';
import { useAppStore } from '../store';

export function useClasses(schoolId: string, searchQuery = '') {
  const {
    schools,
    schoolsLoading,
    fetchSchools,
    classes: allClasses,
    classesLoading,
    classesError,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
  } = useAppStore();

  const classes = allClasses[schoolId] ?? [];

  useEffect(() => {
    async function load() {
      let currentSchools = schools;
      if (currentSchools.length === 0 && !schoolsLoading) {
        await fetchSchools();
        currentSchools = useAppStore.getState().schools;
      }
      const schoolExists = currentSchools.some((s) => s.id === schoolId);
      if (schoolExists) {
        await fetchClasses(schoolId);
      }
    }
    load();
  }, [schoolId, schools.length]);

  const filtered = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shift.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    classes: filtered,
    allClasses: classes,
    isLoading: classesLoading,
    error: classesError,
    refetch: () => fetchClasses(schoolId),
    createClass: (data: Parameters<typeof createClass>[1]) => createClass(schoolId, data),
    updateClass: (classId: string, data: Parameters<typeof updateClass>[2]) =>
      updateClass(schoolId, classId, data),
    deleteClass: (classId: string) => deleteClass(schoolId, classId),
  };
}
