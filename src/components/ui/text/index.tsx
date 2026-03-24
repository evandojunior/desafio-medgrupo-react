import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

interface GluestackTextProps extends TextProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  bold?: boolean;
  isTruncated?: boolean;
}

const sizeMap: Record<NonNullable<GluestackTextProps['size']>, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

const Text = React.forwardRef<RNText, GluestackTextProps>(
  ({ className, size = 'md', bold, isTruncated, ...props }, ref) => (
    <RNText
      ref={ref}
      numberOfLines={isTruncated ? 1 : undefined}
      className={`text-typography-900 ${sizeMap[size]} ${bold ? 'font-semibold' : 'font-normal'} ${className ?? ''}`}
      {...props}
    />
  )
);

Text.displayName = 'Text';

export { Text };
