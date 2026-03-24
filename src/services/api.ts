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

export const schoolApi = {
  getAll: (): Promise<School[]> => schoolRepository.getAll(),
  getById: (id: string): Promise<School> => schoolRepository.getById(id),
  create: (data: CreateSchoolInput): Promise<School> => schoolRepository.create(data),
  update: (id: string, data: UpdateSchoolInput): Promise<School> =>
    schoolRepository.update(id, data),
  delete: (id: string): Promise<void> => schoolRepository.delete(id),
};

export const classApi = {
  getBySchool: (schoolId: string): Promise<Class[]> => classRepository.getBySchool(schoolId),
  create: (schoolId: string, data: CreateClassInput): Promise<Class> =>
    classRepository.create(schoolId, data),
  update: (id: string, data: UpdateClassInput): Promise<Class> =>
    classRepository.update(id, data),
  delete: (id: string): Promise<void> => classRepository.delete(id),
};
