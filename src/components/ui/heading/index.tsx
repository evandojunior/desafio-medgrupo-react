import React from 'react';
import { Text, TextProps } from 'react-native';

interface HeadingProps extends TextProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const sizeMap: Record<NonNullable<HeadingProps['size']>, string> = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
  '2xl': 'text-3xl',
  '3xl': 'text-4xl',
  '4xl': 'text-5xl',
  '5xl': 'text-6xl',
};

const Heading = React.forwardRef<Text, HeadingProps>(
  ({ className, size = 'lg', ...props }, ref) => (
    <Text
      ref={ref}
      className={`text-typography-900 font-bold ${sizeMap[size]} ${className ?? ''}`}
      {...props}
    />
  )
);

Heading.displayName = 'Heading';

export { Heading };
