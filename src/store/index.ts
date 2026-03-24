import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  School,
  Class,
  CreateSchoolInput,
  UpdateSchoolInput,
  CreateClassInput,
  UpdateClassInput,
} from '../types';
import { schoolRepository } from '../repositories/SchoolRepository';
import { classRepository } from '../repositories/ClassRepository';

interface SchoolSlice {
  schools: School[];
  schoolsLoading: boolean;
  schoolsError: string | null;

  fetchSchools: () => Promise<void>;
  createSchool: (data: CreateSchoolInput) => Promise<School>;
  updateSchool: (id: string, data: UpdateSchoolInput) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
}

interface ClassSlice {
  classes: Record<string, Class[]>;
  classesLoading: boolean;
  classesError: string | null;

  fetchClasses: (schoolId: string) => Promise<void>;
  createClass: (schoolId: string, data: CreateClassInput) => Promise<Class>;
  updateClass: (schoolId: string, classId: string, data: UpdateClassInput) => Promise<void>;
  deleteClass: (schoolId: string, classId: string) => Promise<void>;
}

type AppState = SchoolSlice & ClassSlice;

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      schools: [],
      schoolsLoading: false,
      schoolsError: null,

      fetchSchools: async () => {
        set({ schoolsLoading: true, schoolsError: null });
        try {
          const schools = await schoolRepository.getAll();
          set({ schools, schoolsLoading: false });
        } catch (err) {
          set({ schoolsError: (err as Error).message, schoolsLoading: false });
        }
      },

      createSchool: async (data) => {
        const school = await schoolRepository.create(data);
        set((s) => ({ schools: [...s.schools, school] }));
        return school;
      },

      updateSchool: async (id, data) => {
        const updated = await schoolRepository.update(id, data);
        set((s) => ({
          schools: s.schools.map((school) => (school.id === id ? updated : school)),
        }));
      },

      deleteSchool: async (id) => {
        await schoolRepository.delete(id);
        set((s) => ({
          schools: s.schools.filter((school) => school.id !== id),
          classes: Object.fromEntries(Object.entries(s.classes).filter(([key]) => key !== id)),
        }));
      },

      classes: {},
      classesLoading: false,
      classesError: null,

      fetchClasses: async (schoolId) => {
        set({ classesLoading: true, classesError: null });
        try {
          const classes = await classRepository.getBySchool(schoolId);
          set((s) => ({
            classes: { ...s.classes, [schoolId]: classes },
            classesLoading: false,
          }));
        } catch (err) {
          set({ classesError: (err as Error).message, classesLoading: false });
        }
      },

      createClass: async (schoolId, data) => {
        const cls = await classRepository.create(schoolId, data);
        set((s) => ({
          classes: {
            ...s.classes,
            [schoolId]: [...(s.classes[schoolId] ?? []), cls],
          },
          schools: s.schools.map((school) =>
            school.id === schoolId
              ? { ...school, classesCount: school.classesCount + 1 }
              : school
          ),
        }));
        return cls;
      },

      updateClass: async (schoolId, classId, data) => {
        const updated = await classRepository.update(classId, data);
        set((s) => ({
          classes: {
            ...s.classes,
            [schoolId]: (s.classes[schoolId] ?? []).map((c) =>
              c.id === classId ? updated : c
            ),
          },
        }));
      },

      deleteClass: async (schoolId, classId) => {
        await classRepository.delete(classId);
        set((s) => ({
          classes: {
            ...s.classes,
            [schoolId]: (s.classes[schoolId] ?? []).filter((c) => c.id !== classId),
          },
          schools: s.schools.map((school) =>
            school.id === schoolId
              ? { ...school, classesCount: Math.max(0, school.classesCount - 1) }
              : school
          ),
        }));
      },
    }),
    {
      name: 'app-storage',
      version: 3,
      migrate: () => ({ schools: [], classes: {} }),
      storage: createJSONStorage(() => AsyncStorage),
      partialize: () => ({}),
    }
  )
);

export const selectSchools = (state: AppState) => state.schools;
export const selectClasses = (schoolId: string) => (state: AppState) =>
  state.classes[schoolId] ?? [];
