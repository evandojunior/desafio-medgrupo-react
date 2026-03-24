import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { ClassCard } from './index';
import { Class } from '@/src/types';

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

// Gluestack AlertDialog simplificado para testes
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

const classItem: Class = {
  id: 'c1',
  schoolId: 's1',
  name: 'Turma 3A',
  shift: 'Manhã',
  academicYear: 2024,
  createdAt: '2024-01-01T00:00:00.000Z',
};

// ─── Testes ──────────────────────────────────────────────────────────────────

describe('ClassCard – renderização visual', () => {
  const onDelete = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('exibe o nome da turma', () => {
    render(<ClassCard classItem={classItem} schoolId="s1" onDelete={onDelete} />);
    expect(screen.getByText('Turma 3A')).toBeTruthy();
  });

  it('exibe o turno (shift) da turma', () => {
    render(<ClassCard classItem={classItem} schoolId="s1" onDelete={onDelete} />);
    expect(screen.getByText('Manhã')).toBeTruthy();
  });

  it('exibe o ano letivo', () => {
    render(<ClassCard classItem={classItem} schoolId="s1" onDelete={onDelete} />);
    expect(screen.getByText('2024')).toBeTruthy();
  });

  it('exibe o ícone de pessoas', () => {
    render(<ClassCard classItem={classItem} schoolId="s1" onDelete={onDelete} />);
    expect(screen.getByTestId('icon-people-outline')).toBeTruthy();
  });

  it('exibe os botões de editar e deletar', () => {
    render(<ClassCard classItem={classItem} schoolId="s1" onDelete={onDelete} />);
    expect(screen.getByTestId('icon-pencil')).toBeTruthy();
    expect(screen.getByTestId('icon-trash-outline')).toBeTruthy();
  });

  it('exibe o nome da escola quando schoolName é fornecido', () => {
    render(
      <ClassCard classItem={classItem} schoolId="s1" schoolName="Escola Alfa" onDelete={onDelete} />
    );
    expect(screen.getByText('Escola Alfa')).toBeTruthy();
    expect(screen.getByTestId('icon-school-outline')).toBeTruthy();
  });

  it('não exibe o nome da escola quando schoolName não é fornecido', () => {
    render(<ClassCard classItem={classItem} schoolId="s1" onDelete={onDelete} />);
    expect(screen.queryByTestId('icon-school-outline')).toBeNull();
  });

  it('renderiza turno Tarde com badge correto', () => {
    const tarde = { ...classItem, shift: 'Tarde' as const };
    render(<ClassCard classItem={tarde} schoolId="s1" onDelete={onDelete} />);
    expect(screen.getByText('Tarde')).toBeTruthy();
  });

  it('renderiza turno Noite com badge correto', () => {
    const noite = { ...classItem, shift: 'Noite' as const };
    render(<ClassCard classItem={noite} schoolId="s1" onDelete={onDelete} />);
    expect(screen.getByText('Noite')).toBeTruthy();
  });
});

describe('ClassCard – diálogo de exclusão', () => {
  const onDelete = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('não mostra o diálogo de exclusão inicialmente', () => {
    render(<ClassCard classItem={classItem} schoolId="s1" onDelete={onDelete} />);
    expect(screen.queryByText('Excluir Turma')).toBeNull();
  });

  it('abre o diálogo ao clicar no botão de deletar', () => {
    render(<ClassCard classItem={classItem} schoolId="s1" onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('icon-trash-outline'));
    expect(screen.getByText('Excluir Turma')).toBeTruthy();
    // nome aparece no card E no diálogo — confirma que o diálogo está aberto
    expect(screen.getAllByText('Turma 3A').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Cancelar')).toBeTruthy();
    expect(screen.getByText('Excluir')).toBeTruthy();
  });

  it('fecha o diálogo ao clicar em Cancelar', () => {
    render(<ClassCard classItem={classItem} schoolId="s1" onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('icon-trash-outline'));
    expect(screen.getByText('Excluir Turma')).toBeTruthy();
    fireEvent.press(screen.getByText('Cancelar'));
    expect(screen.queryByText('Excluir Turma')).toBeNull();
  });

  it('chama onDelete com o id correto ao confirmar exclusão', async () => {
    onDelete.mockResolvedValue(undefined);
    render(<ClassCard classItem={classItem} schoolId="s1" onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('icon-trash-outline'));
    await act(async () => {
      fireEvent.press(screen.getByText('Excluir'));
    });
    expect(onDelete).toHaveBeenCalledWith('c1');
  });
});

describe('ClassCard – navegação', () => {
  const { router } = require('expo-router');

  beforeEach(() => jest.clearAllMocks());

  it('navega para a página de edição ao clicar no ícone de editar', () => {
    render(<ClassCard classItem={classItem} schoolId="s1" onDelete={jest.fn()} />);
    fireEvent.press(screen.getByTestId('icon-pencil'));
    expect(router.push).toHaveBeenCalledWith('/schools/s1/classes/c1/edit');
  });

  it('navega para a escola ao clicar no nome da escola', () => {
    render(
      <ClassCard classItem={classItem} schoolId="s1" schoolName="Escola Alfa" onDelete={jest.fn()} />
    );
    fireEvent.press(screen.getByText('Escola Alfa'));
    expect(router.push).toHaveBeenCalledWith('/schools/s1');
  });
});
