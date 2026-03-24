import { School, CreateSchoolInput, UpdateSchoolInput } from '../types';

export interface ISchoolRepository {
  getAll(): Promise<School[]>;
  getById(id: string): Promise<School>;
  create(data: CreateSchoolInput): Promise<School>;
  update(id: string, data: UpdateSchoolInput): Promise<School>;
  delete(id: string): Promise<void>;
}
