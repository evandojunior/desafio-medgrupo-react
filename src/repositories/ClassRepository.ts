import { Class, CreateClassInput, UpdateClassInput } from '../types';
import { classAdapter } from '../adapters/class.adapter';
import { IClassRepository } from './IClassRepository';

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

export class ClassRepository implements IClassRepository {
  async getBySchool(schoolId: string): Promise<Class[]> {
    const raw = await http<unknown[]>(`/schools/${schoolId}/classes`);
    return raw.map((r) =>
      classAdapter.fromResponse(r as Parameters<typeof classAdapter.fromResponse>[0])
    );
  }

  async create(schoolId: string, data: CreateClassInput): Promise<Class> {
    const raw = await http<unknown>(`/schools/${schoolId}/classes`, {
      method: 'POST',
      body: JSON.stringify(classAdapter.toCreatePayload(data)),
    });
    return classAdapter.fromResponse(raw as Parameters<typeof classAdapter.fromResponse>[0]);
  }

  async update(id: string, data: UpdateClassInput): Promise<Class> {
    const raw = await http<unknown>(`/classes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(classAdapter.toUpdatePayload(data)),
    });
    return classAdapter.fromResponse(raw as Parameters<typeof classAdapter.fromResponse>[0]);
  }

  async delete(id: string): Promise<void> {
    await http<void>(`/classes/${id}`, { method: 'DELETE' });
  }
}

export const classRepository = new ClassRepository();
