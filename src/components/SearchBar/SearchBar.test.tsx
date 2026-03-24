import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SearchBar } from './index';

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: (props: any) => <Text>{props.name}</Text>,
  };
});

describe('SearchBar component', () => {
  it('renders correctly and displays placeholder', () => {
    const onChangeTextMock = jest.fn();
    
    render(
      <SearchBar 
        value="" 
        onChangeText={onChangeTextMock} 
        placeholder="Search for stores..." 
      />
    );

    expect(screen.getByPlaceholderText('Search for stores...')).toBeTruthy();
  });

  it('triggers onChangeText when typing', () => {
    const onChangeTextMock = jest.fn();
    
    render(
      <SearchBar 
        value="" 
        onChangeText={onChangeTextMock} 
        placeholder="Search..." 
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.changeText(input, 'New query');

    expect(onChangeTextMock).toHaveBeenCalledWith('New query');
  });

  it('shows clear button when value is not empty and calls onChangeText to clear', () => {
    const onChangeTextMock = jest.fn();
    
    render(
      <SearchBar 
        value="shoes" 
        onChangeText={onChangeTextMock} 
      />
    );

    // The mock renders <Text>close-circle</Text>
    const closeIcon = screen.getByText('close-circle');
    expect(closeIcon).toBeTruthy();
    
    fireEvent.press(closeIcon);
    
    expect(onChangeTextMock).toHaveBeenCalledWith('');
  });

  it('does not show clear button when value is empty', () => {
    const onChangeTextMock = jest.fn();
    
    render(
      <SearchBar 
        value="" 
        onChangeText={onChangeTextMock} 
      />
    );

    const closeIcon = screen.queryByText('close-circle');
    expect(closeIcon).toBeNull();
  });
});

