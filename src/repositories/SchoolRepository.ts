import { School, CreateSchoolInput, UpdateSchoolInput } from '../types';
import { schoolAdapter } from '../adapters/school.adapter';
import { ISchoolRepository } from './ISchoolRepository';

const BASE_URL = '/api';

async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export class SchoolRepository implements ISchoolRepository {
  async getAll(): Promise<School[]> {
    const raw = await http<unknown[]>('/schools');
    return raw.map((r) => schoolAdapter.fromResponse(r as Parameters<typeof schoolAdapter.fromResponse>[0]));
  }

  async getById(id: string): Promise<School> {
    const raw = await http<unknown>(`/schools/${id}`);
    return schoolAdapter.fromResponse(raw as Parameters<typeof schoolAdapter.fromResponse>[0]);
  }

  async create(data: CreateSchoolInput): Promise<School> {
    const raw = await http<unknown>('/schools', {
      method: 'POST',
      body: JSON.stringify(schoolAdapter.toCreatePayload(data)),
    });
    return schoolAdapter.fromResponse(raw as Parameters<typeof schoolAdapter.fromResponse>[0]);
  }

  async update(id: string, data: UpdateSchoolInput): Promise<School> {
    const raw = await http<unknown>(`/schools/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(schoolAdapter.toUpdatePayload(data)),
    });
    return schoolAdapter.fromResponse(raw as Parameters<typeof schoolAdapter.fromResponse>[0]);
  }

  async delete(id: string): Promise<void> {
    await http<void>(`/schools/${id}`, { method: 'DELETE' });
  }
}

export const schoolRepository = new SchoolRepository();
