export interface School {
  id: string;
  name: string;
  address: string;
  classesCount: number;
  createdAt: string;
}

export type CreateSchoolInput = Pick<School, 'name' | 'address'>;
export type UpdateSchoolInput = Partial<CreateSchoolInput>;

export type ClassShift = 'Manhã' | 'Tarde' | 'Noite';

export const CLASS_SHIFTS: ClassShift[] = ['Manhã', 'Tarde', 'Noite'];

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  shift: ClassShift;
  academicYear: number;
  createdAt: string;
}

export type CreateClassInput = Pick<Class, 'name' | 'shift' | 'academicYear'>;
export type UpdateClassInput = Partial<CreateClassInput>;

export interface ApiError {
  message: string;
  status: number;
}
