import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'elevated' | 'outline' | 'ghost' | 'filled';
  children?: React.ReactNode;
}

const sizeMap = {
  sm: 'rounded-lg p-3',
  md: 'rounded-xl p-4',
  lg: 'rounded-2xl p-5',
};

const variantMap = {
  elevated: 'bg-background-0 shadow-sm shadow-background-400',
  outline: 'bg-background-0 border border-outline-200',
  ghost: 'bg-transparent',
  filled: 'bg-background-50',
};

const Card = React.forwardRef<View, CardProps>(
  ({ className, size = 'md', variant = 'elevated', children, ...props }, ref) => (
    <View
      ref={ref}
      className={`${sizeMap[size]} ${variantMap[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </View>
  )
);

Card.displayName = 'Card';

export { Card };
