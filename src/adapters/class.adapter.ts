import { Class, ClassShift, CreateClassInput, UpdateClassInput } from '../types';

interface RawClassResponse {
  id: string;
  schoolId?: string;
  school_id?: string;
  name: string;
  shift: string;
  academicYear?: number;
  academic_year?: number;
  createdAt?: string;
  created_at?: string;
}

export const classAdapter = {
  fromResponse(raw: RawClassResponse): Class {
    const schoolId = raw.schoolId ?? raw.school_id ?? '';
    return {
      id: raw.id,
      schoolId,
      name: raw.name,
      shift: raw.shift as ClassShift,
      academicYear: raw.academicYear ?? raw.academic_year ?? new Date().getFullYear(),
      createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    };
  },

  toCreatePayload(data: CreateClassInput): Record<string, unknown> {
    return {
      name: data.name.trim(),
      shift: data.shift,
      academicYear: Number(data.academicYear),
    };
  },

  toUpdatePayload(data: UpdateClassInput): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.shift !== undefined) payload.shift = data.shift;
    if (data.academicYear !== undefined) payload.academicYear = Number(data.academicYear);
    return payload;
  },
};
