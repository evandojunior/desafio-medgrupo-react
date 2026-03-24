import React from 'react';
import { View, ViewProps } from 'react-native';

interface HStackProps extends ViewProps {
  className?: string;
  space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  reversed?: boolean;
}

const spaceMap: Record<NonNullable<HStackProps['space']>, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-5',
  '2xl': 'gap-6',
};

const HStack = React.forwardRef<View, HStackProps>(
  ({ className, space, reversed, ...props }, ref) => (
    <View
      ref={ref}
      className={`${reversed ? 'flex-row-reverse' : 'flex-row'} items-center ${space ? spaceMap[space] : ''} ${className ?? ''}`}
      {...props}
    />
  )
);

HStack.displayName = 'HStack';

export { HStack };
