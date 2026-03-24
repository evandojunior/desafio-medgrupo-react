import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useSchools, useSchool } from '@/src/hooks/useSchools';
import { useAppStore } from '@/src/store';
import { schoolRepository } from '@/src/repositories/SchoolRepository';

jest.mock('@/src/repositories/SchoolRepository', () => ({
  schoolRepository: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockSchool1 = {
  id: 's1',
  name: 'Escola Alfa',
  address: 'Rua A, 1',
  classesCount: 1,
  createdAt: '2024-01-01T00:00:00.000Z',
};
const mockSchool2 = {
  id: 's2',
  name: 'Escola Beta',
  address: 'Rua B, SP',
  classesCount: 0,
  createdAt: '2024-02-01T00:00:00.000Z',
};

// Garante que qualquer atualização de estado assíncrona pendente
// (ex: Zustand set() em microtask) seja esgotada dentro de act()
afterEach(async () => {
  await act(async () => {
    await Promise.resolve();
  });
});

describe('useSchools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppStore.setState({
      schools: [],
      schoolsLoading: false,
      schoolsError: null,
      classes: {},
      classesLoading: false,
      classesError: null,
    });
  });

  it('chama fetchSchools ao montar e popula schools', async () => {
    (schoolRepository.getAll as jest.Mock).mockResolvedValue([mockSchool1, mockSchool2]);
    const { result } = renderHook(() => useSchools());
    await waitFor(() => expect(result.current.schools).toHaveLength(2));
    expect(result.current.allSchools).toHaveLength(2);
  });

  it('filtra schools por searchQuery no name', async () => {
    (schoolRepository.getAll as jest.Mock).mockResolvedValue([mockSchool1, mockSchool2]);
    const { result } = renderHook(() => useSchools('Beta'));
    await waitFor(() => expect(result.current.schools).toHaveLength(1));
    expect(result.current.schools[0].name).toBe('Escola Beta');
  });

  it('filtra schools por searchQuery no address', async () => {
    (schoolRepository.getAll as jest.Mock).mockResolvedValue([mockSchool1, mockSchool2]);
    const { result } = renderHook(() => useSchools('SP'));
    await waitFor(() => expect(result.current.schools).toHaveLength(1));
    expect(result.current.schools[0].address).toContain('SP');
  });

  it('retorna array vazio para busca sem resultados', async () => {
    (schoolRepository.getAll as jest.Mock).mockResolvedValue([mockSchool1, mockSchool2]);
    const { result } = renderHook(() => useSchools('xyznotfound'));
    await waitFor(() => expect(result.current.allSchools).toHaveLength(2));
    expect(result.current.schools).toHaveLength(0);
  });

  it('expõe isLoading e error do store', async () => {
    (schoolRepository.getAll as jest.Mock).mockRejectedValue(new Error('Erro de rede'));
    const { result } = renderHook(() => useSchools());
    await waitFor(() => expect(result.current.error).toBe('Erro de rede'));
  });
});

describe('useSchool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppStore.setState({
      schools: [mockSchool1],
      schoolsLoading: false,
      schoolsError: null,
      classes: {},
      classesLoading: false,
      classesError: null,
    });
  });

  it('retorna a escola pelo id quando já está no store', async () => {
    // escola existe → fetchSchools() NÃO será chamado
    (schoolRepository.getAll as jest.Mock).mockResolvedValue([mockSchool1]);
    const { result } = renderHook(() => useSchool('s1'));
    // resultado síncrono; waitFor apenas aguarda o efeito montar
    await waitFor(() => expect(result.current).toEqual(mockSchool1));
  });

  it('retorna undefined para id inexistente', async () => {
    // escola não existe → fetchSchools() SERÁ chamado como efeito colateral
    (schoolRepository.getAll as jest.Mock).mockResolvedValue([]);
    const { result } = renderHook(() => useSchool('nao-existe'));
    // aguarda o fetch disparado pelo useEffect completar dentro do act
    await waitFor(() => expect(schoolRepository.getAll).toHaveBeenCalled());
    expect(result.current).toBeUndefined();
  });
});
