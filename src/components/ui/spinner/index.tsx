import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

interface SpinnerProps extends ActivityIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  className?: string;
}

function Spinner({ size = 'small', color = '#1976D2', className: _className, ...props }: SpinnerProps) {
  return <ActivityIndicator size={size} color={color} {...props} />;
}

export { Spinner };
