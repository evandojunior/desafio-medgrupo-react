import { classApi } from '@/src/services/api';
import { classRepository } from '@/src/repositories/ClassRepository';

jest.mock('@/src/repositories/ClassRepository', () => ({
  classRepository: {
    getBySchool: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockClass = {
  id: 'c1',
  schoolId: 's1',
  name: 'Turma A',
  shift: 'Manhã' as const,
  academicYear: 2024,
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('classApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getBySchool delega para classRepository.getBySchool', async () => {
    (classRepository.getBySchool as jest.Mock).mockResolvedValue([mockClass]);
    const result = await classApi.getBySchool('s1');
    expect(classRepository.getBySchool).toHaveBeenCalledWith('s1');
    expect(result).toEqual([mockClass]);
  });

  it('create delega para classRepository.create', async () => {
    (classRepository.create as jest.Mock).mockResolvedValue(mockClass);
    const input = { name: 'Turma A', shift: 'Manhã' as const, academicYear: 2024 };
    const result = await classApi.create('s1', input);
    expect(classRepository.create).toHaveBeenCalledWith('s1', input);
    expect(result).toEqual(mockClass);
  });

  it('update delega para classRepository.update', async () => {
    const updated = { ...mockClass, name: 'Turma B' };
    (classRepository.update as jest.Mock).mockResolvedValue(updated);
    const result = await classApi.update('c1', { name: 'Turma B' });
    expect(classRepository.update).toHaveBeenCalledWith('c1', { name: 'Turma B' });
    expect(result).toEqual(updated);
  });

  it('delete delega para classRepository.delete', async () => {
    (classRepository.delete as jest.Mock).mockResolvedValue(undefined);
    await classApi.delete('c1');
    expect(classRepository.delete).toHaveBeenCalledWith('c1');
  });
});
