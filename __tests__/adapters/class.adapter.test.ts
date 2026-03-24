import { classAdapter } from '@/src/adapters/class.adapter';

describe('classAdapter', () => {
  describe('fromResponse', () => {
    it('mapeia os campos camelCase corretamente', () => {
      const raw = {
        id: 'c1',
        schoolId: 's1',
        name: 'Turma A',
        shift: 'Manhã',
        academicYear: 2024,
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      const result = classAdapter.fromResponse(raw);
      expect(result).toEqual({
        id: 'c1',
        schoolId: 's1',
        name: 'Turma A',
        shift: 'Manhã',
        academicYear: 2024,
        createdAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('mapeia snake_case como fallback', () => {
      const raw = {
        id: 'c2',
        school_id: 's2',
        name: 'Turma B',
        shift: 'Tarde',
        academic_year: 2025,
        created_at: '2025-01-01T00:00:00.000Z',
      };
      const result = classAdapter.fromResponse(raw as any);
      expect(result.schoolId).toBe('s2');
      expect(result.academicYear).toBe(2025);
      expect(result.createdAt).toBe('2025-01-01T00:00:00.000Z');
    });

    it('usa string vazia para schoolId quando ausente', () => {
      const raw = { id: 'c3', name: 'T', shift: 'Noite', academicYear: 2024 };
      const result = classAdapter.fromResponse(raw as any);
      expect(result.schoolId).toBe('');
    });

    it('usa ano atual para academicYear quando ausente', () => {
      const raw = { id: 'c4', name: 'T', shift: 'Manhã' };
      const result = classAdapter.fromResponse(raw as any);
      expect(result.academicYear).toBe(new Date().getFullYear());
    });
  });

  describe('toCreatePayload', () => {
    it('retorna name trimado, shift e academicYear como número', () => {
      const result = classAdapter.toCreatePayload({
        name: '  Turma C  ',
        shift: 'Noite',
        academicYear: 2024,
      });
      expect(result).toEqual({ name: 'Turma C', shift: 'Noite', academicYear: 2024 });
    });
  });

  describe('toUpdatePayload', () => {
    it('inclui apenas os campos definidos', () => {
      expect(classAdapter.toUpdatePayload({ name: ' Nova ' })).toEqual({ name: 'Nova' });
      expect(classAdapter.toUpdatePayload({ shift: 'Tarde' })).toEqual({ shift: 'Tarde' });
      expect(classAdapter.toUpdatePayload({ academicYear: 2025 })).toEqual({ academicYear: 2025 });
      expect(classAdapter.toUpdatePayload({})).toEqual({});
    });
  });
});
