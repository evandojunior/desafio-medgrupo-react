import { useAppStore, selectSchools, selectClasses } from '@/src/store';
import { schoolRepository } from '@/src/repositories/SchoolRepository';
import { classRepository } from '@/src/repositories/ClassRepository';

jest.mock('@/src/repositories/SchoolRepository', () => ({
  schoolRepository: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/src/repositories/ClassRepository', () => ({
  classRepository: {
    getBySchool: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockSchool = {
  id: 's1',
  name: 'Escola Alfa',
  address: 'Rua A, 1',
  classesCount: 1,
  createdAt: '2024-01-01T00:00:00.000Z',
};

const mockClass = {
  id: 'c1',
  schoolId: 's1',
  name: 'Turma A',
  shift: 'Manhã' as const,
  academicYear: 2024,
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('useAppStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reseta o store para o estado inicial antes de cada teste
    useAppStore.setState({
      schools: [],
      schoolsLoading: false,
      schoolsError: null,
      classes: {},
      classesLoading: false,
      classesError: null,
    });
  });

  // ─── Schools ────────────────────────────────────────────────────────────────

  it('fetchSchools popula schools no estado', async () => {
    (schoolRepository.getAll as jest.Mock).mockResolvedValue([mockSchool]);
    await useAppStore.getState().fetchSchools();
    expect(useAppStore.getState().schools).toEqual([mockSchool]);
    expect(useAppStore.getState().schoolsLoading).toBe(false);
  });

  it('fetchSchools define schoolsError em caso de falha', async () => {
    (schoolRepository.getAll as jest.Mock).mockRejectedValue(new Error('Falha de rede'));
    await useAppStore.getState().fetchSchools();
    expect(useAppStore.getState().schoolsError).toBe('Falha de rede');
    expect(useAppStore.getState().schoolsLoading).toBe(false);
  });

  it('createSchool adiciona escola à lista', async () => {
    (schoolRepository.create as jest.Mock).mockResolvedValue(mockSchool);
    const result = await useAppStore.getState().createSchool({ name: 'Escola Alfa', address: 'Rua A, 1' });
    expect(result).toEqual(mockSchool);
    expect(useAppStore.getState().schools).toContainEqual(mockSchool);
  });

  it('updateSchool atualiza escola existente', async () => {
    useAppStore.setState({ schools: [mockSchool] });
    const updated = { ...mockSchool, name: 'Escola Beta' };
    (schoolRepository.update as jest.Mock).mockResolvedValue(updated);
    await useAppStore.getState().updateSchool('s1', { name: 'Escola Beta' });
    expect(useAppStore.getState().schools[0].name).toBe('Escola Beta');
  });

  it('deleteSchool remove escola e suas turmas do estado', async () => {
    useAppStore.setState({ schools: [mockSchool], classes: { s1: [mockClass] } });
    (schoolRepository.delete as jest.Mock).mockResolvedValue(undefined);
    await useAppStore.getState().deleteSchool('s1');
    expect(useAppStore.getState().schools).toHaveLength(0);
    expect(useAppStore.getState().classes['s1']).toBeUndefined();
  });

  // ─── Classes ─────────────────────────────────────────────────────────────────

  it('fetchClasses popula classes para a escola no estado', async () => {
    (classRepository.getBySchool as jest.Mock).mockResolvedValue([mockClass]);
    await useAppStore.getState().fetchClasses('s1');
    expect(useAppStore.getState().classes['s1']).toEqual([mockClass]);
    expect(useAppStore.getState().classesLoading).toBe(false);
  });

  it('fetchClasses define classesError em caso de falha', async () => {
    (classRepository.getBySchool as jest.Mock).mockRejectedValue(new Error('Erro turmas'));
    await useAppStore.getState().fetchClasses('s1');
    expect(useAppStore.getState().classesError).toBe('Erro turmas');
  });

  it('createClass adiciona turma e incrementa classesCount', async () => {
    useAppStore.setState({ schools: [mockSchool], classes: { s1: [] } });
    (classRepository.create as jest.Mock).mockResolvedValue(mockClass);
    const result = await useAppStore.getState().createClass('s1', {
      name: 'Turma A',
      shift: 'Manhã',
      academicYear: 2024,
    });
    expect(result).toEqual(mockClass);
    expect(useAppStore.getState().classes['s1']).toContainEqual(mockClass);
    expect(useAppStore.getState().schools[0].classesCount).toBe(2);
  });

  it('updateClass atualiza turma existente', async () => {
    useAppStore.setState({ schools: [mockSchool], classes: { s1: [mockClass] } });
    const updated = { ...mockClass, name: 'Turma B' };
    (classRepository.update as jest.Mock).mockResolvedValue(updated);
    await useAppStore.getState().updateClass('s1', 'c1', { name: 'Turma B' });
    expect(useAppStore.getState().classes['s1'][0].name).toBe('Turma B');
  });

  it('deleteClass remove turma e decrementa classesCount', async () => {
    useAppStore.setState({ schools: [mockSchool], classes: { s1: [mockClass] } });
    (classRepository.delete as jest.Mock).mockResolvedValue(undefined);
    await useAppStore.getState().deleteClass('s1', 'c1');
    expect(useAppStore.getState().classes['s1']).toHaveLength(0);
    expect(useAppStore.getState().schools[0].classesCount).toBe(0);
  });

  // ─── Selectors ───────────────────────────────────────────────────────────────

  it('selectSchools retorna lista de schools', () => {
    useAppStore.setState({ schools: [mockSchool] } as any);
    const state = useAppStore.getState() as any;
    expect(selectSchools(state)).toEqual([mockSchool]);
  });

  it('selectClasses retorna turmas da escola ou array vazio', () => {
    useAppStore.setState({ classes: { s1: [mockClass] } } as any);
    const state = useAppStore.getState() as any;
    expect(selectClasses('s1')(state)).toEqual([mockClass]);
    expect(selectClasses('xxx')(state)).toEqual([]);
  });
});
