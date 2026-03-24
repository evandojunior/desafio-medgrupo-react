import React from 'react';
import { View, Text, ViewProps } from 'react-native';

type BadgeAction = 'error' | 'warning' | 'success' | 'info' | 'muted';
type BadgeVariant = 'solid' | 'outline';

interface BadgeProps extends ViewProps {
  className?: string;
  action?: BadgeAction;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const actionSolid: Record<BadgeAction, string> = {
  error: 'bg-error-100',
  warning: 'bg-warning-100',
  success: 'bg-success-100',
  info: 'bg-primary-100',
  muted: 'bg-background-200',
};

const sizeMap = {
  sm: 'px-2 py-0.5',
  md: 'px-2.5 py-1',
  lg: 'px-3 py-1.5',
};

const Badge = React.forwardRef<View, BadgeProps>(
  ({ className, action = 'muted', size = 'md', children, ...props }, ref) => (
    <View
      ref={ref}
      className={`flex-row items-center rounded-full self-start ${actionSolid[action]} ${sizeMap[size]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </View>
  )
);

Badge.displayName = 'Badge';

// ─── BadgeText ────────────────────────────────────────────────────────────────

const textColor: Record<BadgeAction, string> = {
  error: 'text-error-700',
  warning: 'text-warning-700',
  success: 'text-success-700',
  info: 'text-primary-700',
  muted: 'text-typography-600',
};

interface BadgeTextProps {
  className?: string;
  action?: BadgeAction;
  children?: React.ReactNode;
}

function BadgeText({ className, action = 'muted', children }: BadgeTextProps) {
  return (
    <Text className={`text-xs font-semibold ${textColor[action]} ${className ?? ''}`}>
      {children}
    </Text>
  );
}

export { Badge, BadgeText };
