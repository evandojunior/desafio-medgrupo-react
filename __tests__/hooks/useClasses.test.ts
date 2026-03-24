import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useClasses } from '@/src/hooks/useClasses';
import { useAppStore } from '@/src/store';
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
  classesCount: 2,
  createdAt: '2024-01-01T00:00:00.000Z',
};

const mockClassManha = {
  id: 'c1',
  schoolId: 's1',
  name: 'Turma Manhã',
  shift: 'Manhã' as const,
  academicYear: 2024,
  createdAt: '2024-01-01T00:00:00.000Z',
};

const mockClassNoite = {
  id: 'c2',
  schoolId: 's1',
  name: 'Turma Noite',
  shift: 'Noite' as const,
  academicYear: 2024,
  createdAt: '2024-01-01T00:00:00.000Z',
};

// Garante que qualquer atualização de estado assíncrona pendente
// (ex: Zustand set() em microtask) seja esgotada dentro de act()
afterEach(async () => {
  await act(async () => {
    await Promise.resolve();
  });
});

describe('useClasses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppStore.setState({
      schools: [mockSchool],
      schoolsLoading: false,
      schoolsError: null,
      classes: {},
      classesLoading: false,
      classesError: null,
    });
  });

  it('busca turmas ao montar quando escola existe no store', async () => {
    (classRepository.getBySchool as jest.Mock).mockResolvedValue([mockClassManha, mockClassNoite]);
    const { result } = renderHook(() => useClasses('s1'));
    await waitFor(() => expect(result.current.classes).toHaveLength(2));
    expect(classRepository.getBySchool).toHaveBeenCalledWith('s1');
    expect(result.current.allClasses).toHaveLength(2);
  });

  it('filtra classes por searchQuery no name', async () => {
    (classRepository.getBySchool as jest.Mock).mockResolvedValue([mockClassManha, mockClassNoite]);
    const { result } = renderHook(() => useClasses('s1', 'Manhã'));
    await waitFor(() => expect(result.current.allClasses).toHaveLength(2));
    expect(result.current.classes).toHaveLength(1);
    expect(result.current.classes[0].name).toBe('Turma Manhã');
  });

  it('filtra classes por searchQuery no shift', async () => {
    (classRepository.getBySchool as jest.Mock).mockResolvedValue([mockClassManha, mockClassNoite]);
    const { result } = renderHook(() => useClasses('s1', 'Noite'));
    await waitFor(() => expect(result.current.allClasses).toHaveLength(2));
    expect(result.current.classes).toHaveLength(1);
    expect(result.current.classes[0].shift).toBe('Noite');
  });

  it('retorna array vazio quando escola não existe no store e fetchSchools não encontra', async () => {
    useAppStore.setState({ schools: [], schoolsLoading: false, schoolsError: null });
    (schoolRepository.getAll as jest.Mock).mockResolvedValue([]);
    (classRepository.getBySchool as jest.Mock).mockResolvedValue([]);
    const { result } = renderHook(() => useClasses('s-nao-existe'));
    // aguarda fetchSchools() ser chamado (disparado pelo useEffect) e completar
    await waitFor(() => expect(schoolRepository.getAll).toHaveBeenCalled());
    expect(result.current.classes).toHaveLength(0);
  });

  it('expõe isLoading e error do store', async () => {
    (classRepository.getBySchool as jest.Mock).mockRejectedValue(new Error('Falha classes'));
    const { result } = renderHook(() => useClasses('s1'));
    await waitFor(() => expect(result.current.error).toBe('Falha classes'));
  });
});
