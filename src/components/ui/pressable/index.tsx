import React from 'react';
import { Pressable as RNPressable, PressableProps, View } from 'react-native';

interface GluestackPressableProps extends PressableProps {
  className?: string;
}

const Pressable = React.forwardRef<View, GluestackPressableProps>(
  ({ className, ...props }, ref) => (
    <RNPressable
      ref={ref}
      className={`active:opacity-70 ${className ?? ''}`}
      {...props}
    />
  )
);

Pressable.displayName = 'Pressable';

export { Pressable };
