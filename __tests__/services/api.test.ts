import { schoolApi } from '@/src/services/api';
import { schoolRepository } from '@/src/repositories/SchoolRepository';

jest.mock('@/src/repositories/SchoolRepository', () => ({
  schoolRepository: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockSchool = {
  id: 's1',
  name: 'Escola Alfa',
  address: 'Rua A, 1',
  classesCount: 2,
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('schoolApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll delega para schoolRepository.getAll', async () => {
    (schoolRepository.getAll as jest.Mock).mockResolvedValue([mockSchool]);
    const result = await schoolApi.getAll();
    expect(schoolRepository.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mockSchool]);
  });

  it('getById delega para schoolRepository.getById', async () => {
    (schoolRepository.getById as jest.Mock).mockResolvedValue(mockSchool);
    const result = await schoolApi.getById('s1');
    expect(schoolRepository.getById).toHaveBeenCalledWith('s1');
    expect(result).toEqual(mockSchool);
  });

  it('create delega para schoolRepository.create', async () => {
    (schoolRepository.create as jest.Mock).mockResolvedValue(mockSchool);
    const input = { name: 'Escola Alfa', address: 'Rua A, 1' };
    const result = await schoolApi.create(input);
    expect(schoolRepository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockSchool);
  });

  it('update delega para schoolRepository.update', async () => {
    const updated = { ...mockSchool, name: 'Escola Beta' };
    (schoolRepository.update as jest.Mock).mockResolvedValue(updated);
    const result = await schoolApi.update('s1', { name: 'Escola Beta' });
    expect(schoolRepository.update).toHaveBeenCalledWith('s1', { name: 'Escola Beta' });
    expect(result).toEqual(updated);
  });

  it('delete delega para schoolRepository.delete', async () => {
    (schoolRepository.delete as jest.Mock).mockResolvedValue(undefined);
    await schoolApi.delete('s1');
    expect(schoolRepository.delete).toHaveBeenCalledWith('s1');
  });
});
