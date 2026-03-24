import { Class, CreateClassInput, UpdateClassInput } from '../types';

export interface IClassRepository {
  getBySchool(schoolId: string): Promise<Class[]>;
  create(schoolId: string, data: CreateClassInput): Promise<Class>;
  update(id: string, data: UpdateClassInput): Promise<Class>;
  delete(id: string): Promise<void>;
}
