import React from 'react';
import { View, ViewProps } from 'react-native';

interface VStackProps extends ViewProps {
  className?: string;
  space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const spaceMap: Record<NonNullable<VStackProps['space']>, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-5',
  '2xl': 'gap-6',
  '3xl': 'gap-8',
  '4xl': 'gap-10',
};

const VStack = React.forwardRef<View, VStackProps>(
  ({ className, space, ...props }, ref) => (
    <View
      ref={ref}
      className={`flex-col ${space ? spaceMap[space] : ''} ${className ?? ''}`}
      {...props}
    />
  )
);

VStack.displayName = 'VStack';

export { VStack };
