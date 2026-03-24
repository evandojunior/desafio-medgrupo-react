import { SchoolRepository } from '@/src/repositories/SchoolRepository';
import { schoolAdapter } from '@/src/adapters/school.adapter';

// Moca fetch globalmente
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

const makeResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: jest.fn().mockResolvedValue(body),
});

const rawSchool = {
  id: 's1',
  name: 'Escola Alfa',
  address: 'Rua A, 1',
  classesCount: 2,
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('SchoolRepository', () => {
  let repo: SchoolRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new SchoolRepository();
  });

  it('getAll faz GET /api/schools e adapta a resposta', async () => {
    mockFetch.mockResolvedValue(makeResponse([rawSchool]));
    const result = await repo.getAll();
    expect(mockFetch).toHaveBeenCalledWith('/api/schools', expect.objectContaining({}));
    expect(result[0]).toMatchObject({ id: 's1', name: 'Escola Alfa' });
  });

  it('getById faz GET /api/schools/:id', async () => {
    mockFetch.mockResolvedValue(makeResponse(rawSchool));
    const result = await repo.getById('s1');
    expect(mockFetch).toHaveBeenCalledWith('/api/schools/s1', expect.objectContaining({}));
    expect(result.id).toBe('s1');
  });

  it('create faz POST /api/schools', async () => {
    mockFetch.mockResolvedValue(makeResponse(rawSchool));
    const result = await repo.create({ name: 'Escola Alfa', address: 'Rua A, 1' });
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/schools',
      expect.objectContaining({ method: 'POST' })
    );
    expect(result.id).toBe('s1');
  });

  it('update faz PATCH /api/schools/:id', async () => {
    const updated = { ...rawSchool, name: 'Escola Beta' };
    mockFetch.mockResolvedValue(makeResponse(updated));
    const result = await repo.update('s1', { name: 'Escola Beta' });
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/schools/s1',
      expect.objectContaining({ method: 'PATCH' })
    );
    expect(result.name).toBe('Escola Beta');
  });

  it('delete faz DELETE /api/schools/:id (204)', async () => {
    mockFetch.mockResolvedValue(makeResponse(null, 204));
    await expect(repo.delete('s1')).resolves.toBeUndefined();
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/schools/s1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('lança erro quando resposta não é ok', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404, json: jest.fn().mockResolvedValue({ message: 'Not found' }) });
    await expect(repo.getById('xxx')).rejects.toThrow('Not found');
  });
});
