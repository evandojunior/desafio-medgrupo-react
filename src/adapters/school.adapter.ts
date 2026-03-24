import { School, CreateSchoolInput, UpdateSchoolInput } from '../types';

interface RawSchoolResponse {
  id: string;
  name: string;
  address: string;
  classesCount?: number;
  classes_count?: number;
  createdAt?: string;
  created_at?: string;
}

export const schoolAdapter = {
  fromResponse(raw: RawSchoolResponse): School {
    return {
      id: raw.id,
      name: raw.name,
      address: raw.address,
      classesCount: raw.classesCount ?? raw.classes_count ?? 0,
      createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    };
  },

  toCreatePayload(data: CreateSchoolInput): Record<string, unknown> {
    return {
      name: data.name.trim(),
      address: data.address.trim(),
    };
  },

  toUpdatePayload(data: UpdateSchoolInput): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.address !== undefined) payload.address = data.address.trim();
    return payload;
  },
};
