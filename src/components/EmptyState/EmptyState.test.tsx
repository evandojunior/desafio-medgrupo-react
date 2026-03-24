import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { EmptyState } from './index';

// Mocking the Ionicons vector icons
jest.mock('@expo/vector-icons', () => {
  return {
    Ionicons: 'Ionicons',
  };
});

describe('EmptyState component', () => {
  it('renders correctly with given title and description', () => {
    const title = 'List is empty';
    const description = 'Please add some items to the list.';

    render(<EmptyState title={title} description={description} />);

    // Check if title is present
    expect(screen.getByText(title)).toBeTruthy();
    
    // Check if description is present
    expect(screen.getByText(description)).toBeTruthy();
  });

  it('renders correctly without a description', () => {
    const title = 'List is empty';

    render(<EmptyState title={title} />);

    expect(screen.getByText(title)).toBeTruthy();
    
    // Querying for any generic string that shouldn't be there
    expect(screen.queryByText('Please add')).toBeNull();
  });

  it('renders custom action node', () => {
    const actionMock = React.createElement('Text', { testID: 'custom-action' }, 'Click me');
    
    render(<EmptyState title="Title" action={actionMock} />);

    expect(screen.getByTestId('custom-action')).toBeTruthy();
  });
});
