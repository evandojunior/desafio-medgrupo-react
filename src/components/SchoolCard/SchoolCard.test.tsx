import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { SchoolCard } from './index';
import { School } from '@/src/types';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: ({ name }: { name: string }) => <Text testID={`icon-${name}`}>{name}</Text>,
  };
});

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('../ui/alert-dialog', () => {
  const { View } = require('react-native');
  return {
    AlertDialog: ({ isOpen, children }: any) => (isOpen ? <View>{children}</View> : null),
    AlertDialogContent: ({ children }: any) => <View>{children}</View>,
    AlertDialogHeader: ({ children }: any) => <View>{children}</View>,
    AlertDialogBody: ({ children }: any) => <View>{children}</View>,
    AlertDialogFooter: ({ children }: any) => <View>{children}</View>,
  };
});

jest.mock('../ui/heading', () => {
  const { Text } = require('react-native');
  return { Heading: ({ children }: any) => <Text>{children}</Text> };
});

jest.mock('../ui/text', () => {
  const { Text } = require('react-native');
  return { Text: ({ children }: any) => <Text>{children}</Text> };
});

// ─── Dados de teste ───────────────────────────────────────────────────────────

const mockSchool: School = {
  id: 's1',
  name: 'Escola Alfa',
  address: 'Rua das Flores, 123 - São Paulo',
  classesCount: 3,
  createdAt: '2024-01-01T00:00:00.000Z',
};

// ─── Testes ──────────────────────────────────────────────────────────────────

describe('SchoolCard – renderização visual', () => {
  const onDelete = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('exibe o nome da escola', () => {
    render(<SchoolCard school={mockSchool} onDelete={onDelete} />);
    expect(screen.getByText('Escola Alfa')).toBeTruthy();
  });

  it('exibe o endereço da escola', () => {
    render(<SchoolCard school={mockSchool} onDelete={onDelete} />);
    expect(screen.getByText('Rua das Flores, 123 - São Paulo')).toBeTruthy();
  });

  it('exibe o contador de turmas no plural', () => {
    render(<SchoolCard school={mockSchool} onDelete={onDelete} />);
    expect(screen.getByText('3 turmas')).toBeTruthy();
  });

  it('exibe "1 turma" no singular quando classesCount é 1', () => {
    const singleClass = { ...mockSchool, classesCount: 1 };
    render(<SchoolCard school={singleClass} onDelete={onDelete} />);
    expect(screen.getByText('1 turma')).toBeTruthy();
  });

  it('exibe "0 turmas" quando classesCount é zero', () => {
    const zero = { ...mockSchool, classesCount: 0 };
    render(<SchoolCard school={zero} onDelete={onDelete} />);
    expect(screen.getByText('0 turmas')).toBeTruthy();
  });

  it('exibe o ícone de escola', () => {
    render(<SchoolCard school={mockSchool} onDelete={onDelete} />);
    expect(screen.getByTestId('icon-school')).toBeTruthy();
  });

  it('exibe o ícone de localização', () => {
    render(<SchoolCard school={mockSchool} onDelete={onDelete} />);
    expect(screen.getByTestId('icon-location-outline')).toBeTruthy();
  });

  it('exibe os botões de editar e deletar', () => {
    render(<SchoolCard school={mockSchool} onDelete={onDelete} />);
    expect(screen.getByTestId('icon-pencil')).toBeTruthy();
    expect(screen.getByTestId('icon-trash-outline')).toBeTruthy();
  });
});

describe('SchoolCard – diálogo de exclusão', () => {
  const onDelete = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('não mostra o diálogo de exclusão inicialmente', () => {
    render(<SchoolCard school={mockSchool} onDelete={onDelete} />);
    expect(screen.queryByText('Excluir Escola')).toBeNull();
  });

  it('abre o diálogo ao clicar no ícone de lixeira', () => {
    render(<SchoolCard school={mockSchool} onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('icon-trash-outline'));
    expect(screen.getByText('Excluir Escola')).toBeTruthy();
    // nome aparece no card E no diálogo — confirma que o diálogo está aberto
    expect(screen.getAllByText('Escola Alfa').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Cancelar')).toBeTruthy();
    expect(screen.getByText('Excluir')).toBeTruthy();
  });

  it('fecha o diálogo ao clicar em Cancelar', () => {
    render(<SchoolCard school={mockSchool} onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('icon-trash-outline'));
    fireEvent.press(screen.getByText('Cancelar'));
    expect(screen.queryByText('Excluir Escola')).toBeNull();
  });

  it('chama onDelete com o id correto ao confirmar exclusão', async () => {
    onDelete.mockResolvedValue(undefined);
    render(<SchoolCard school={mockSchool} onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('icon-trash-outline'));
    await act(async () => {
      fireEvent.press(screen.getByText('Excluir'));
    });
    expect(onDelete).toHaveBeenCalledWith('s1');
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('não chama onDelete ao cancelar', () => {
    render(<SchoolCard school={mockSchool} onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('icon-trash-outline'));
    fireEvent.press(screen.getByText('Cancelar'));
    expect(onDelete).not.toHaveBeenCalled();
  });
});

describe('SchoolCard – navegação', () => {
  const { router } = require('expo-router');

  beforeEach(() => jest.clearAllMocks());

  it('navega para a página da escola ao pressionar o card', () => {
    render(<SchoolCard school={mockSchool} onDelete={jest.fn()} />);
    // O Pressable raiz envolve nome + endereço
    fireEvent.press(screen.getByText('Escola Alfa'));
    expect(router.push).toHaveBeenCalledWith('/schools/s1');
  });

  it('navega para a página de edição ao clicar no ícone de editar', () => {
    render(<SchoolCard school={mockSchool} onDelete={jest.fn()} />);
    fireEvent.press(screen.getByTestId('icon-pencil'));
    expect(router.push).toHaveBeenCalledWith('/schools/s1/edit');
  });
});
