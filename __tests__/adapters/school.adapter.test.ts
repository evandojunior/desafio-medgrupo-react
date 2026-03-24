import { schoolAdapter } from '@/src/adapters/school.adapter';

describe('schoolAdapter', () => {
  describe('fromResponse', () => {
    it('mapeia os campos camelCase corretamente', () => {
      const raw = {
        id: '1',
        name: 'Escola Alfa',
        address: 'Rua A, 1',
        classesCount: 3,
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      const result = schoolAdapter.fromResponse(raw);
      expect(result).toEqual({
        id: '1',
        name: 'Escola Alfa',
        address: 'Rua A, 1',
        classesCount: 3,
        createdAt: '2024-01-01T00:00:00.000Z',
      });
    });

    it('mapeia snake_case como fallback', () => {
      const raw = {
        id: '2',
        name: 'Escola Beta',
        address: 'Rua B, 2',
        classes_count: 5,
        created_at: '2024-02-01T00:00:00.000Z',
      };
      const result = schoolAdapter.fromResponse(raw as any);
      expect(result.classesCount).toBe(5);
      expect(result.createdAt).toBe('2024-02-01T00:00:00.000Z');
    });

    it('usa 0 para classesCount quando ausente', () => {
      const raw = { id: '3', name: 'X', address: 'Y' };
      const result = schoolAdapter.fromResponse(raw as any);
      expect(result.classesCount).toBe(0);
    });

    it('usa data atual para createdAt quando ausente', () => {
      const before = Date.now();
      const raw = { id: '4', name: 'X', address: 'Y' };
      const result = schoolAdapter.fromResponse(raw as any);
      const after = Date.now();
      expect(new Date(result.createdAt).getTime()).toBeGreaterThanOrEqual(before);
      expect(new Date(result.createdAt).getTime()).toBeLessThanOrEqual(after);
    });
  });

  describe('toCreatePayload', () => {
    it('retorna name e address trimados', () => {
      const result = schoolAdapter.toCreatePayload({ name: '  Escola  ', address: '  Rua A  ' });
      expect(result).toEqual({ name: 'Escola', address: 'Rua A' });
    });
  });

  describe('toUpdatePayload', () => {
    it('inclui apenas os campos definidos', () => {
      expect(schoolAdapter.toUpdatePayload({ name: ' Nova ' })).toEqual({ name: 'Nova' });
      expect(schoolAdapter.toUpdatePayload({ address: ' Rua B ' })).toEqual({ address: 'Rua B' });
      expect(schoolAdapter.toUpdatePayload({})).toEqual({});
    });
  });
});
