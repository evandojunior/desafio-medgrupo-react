import { ClassRepository } from '@/src/repositories/ClassRepository';

const mockFetch = jest.fn();
global.fetch = mockFetch as any;

const makeResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: jest.fn().mockResolvedValue(body),
});

const rawClass = {
  id: 'c1',
  schoolId: 's1',
  name: 'Turma A',
  shift: 'Manhã',
  academicYear: 2024,
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('ClassRepository', () => {
  let repo: ClassRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new ClassRepository();
  });

  it('getBySchool faz GET /api/schools/:schoolId/classes', async () => {
    mockFetch.mockResolvedValue(makeResponse([rawClass]));
    const result = await repo.getBySchool('s1');
    expect(mockFetch).toHaveBeenCalledWith('/api/schools/s1/classes', expect.objectContaining({}));
    expect(result[0]).toMatchObject({ id: 'c1', name: 'Turma A', shift: 'Manhã' });
  });

  it('create faz POST /api/schools/:schoolId/classes', async () => {
    mockFetch.mockResolvedValue(makeResponse(rawClass));
    const result = await repo.create('s1', { name: 'Turma A', shift: 'Manhã', academicYear: 2024 });
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/schools/s1/classes',
      expect.objectContaining({ method: 'POST' })
    );
    expect(result.id).toBe('c1');
  });

  it('update faz PATCH /api/classes/:id', async () => {
    const updated = { ...rawClass, name: 'Turma B' };
    mockFetch.mockResolvedValue(makeResponse(updated));
    const result = await repo.update('c1', { name: 'Turma B' });
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/classes/c1',
      expect.objectContaining({ method: 'PATCH' })
    );
    expect(result.name).toBe('Turma B');
  });

  it('delete faz DELETE /api/classes/:id (204)', async () => {
    mockFetch.mockResolvedValue(makeResponse(null, 204));
    await expect(repo.delete('c1')).resolves.toBeUndefined();
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/classes/c1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('lança erro quando resposta não é ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({ message: 'Server error' }),
    });
    await expect(repo.getBySchool('s1')).rejects.toThrow('Server error');
  });
});
