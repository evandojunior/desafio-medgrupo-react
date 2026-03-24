import React from 'react';
import { View, ViewProps } from 'react-native';

interface BoxProps extends ViewProps {
  className?: string;
}

const Box = React.forwardRef<View, BoxProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={className} {...props} />
));

Box.displayName = 'Box';

export { Box };
