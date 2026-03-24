import React from 'react';
import {
  Pressable,
  PressableProps,
  Text,
  TextProps,
  View,
  ActivityIndicator,
} from 'react-native';

// ─── Variants ─────────────────────────────────────────────────────────────────

type ButtonAction = 'primary' | 'secondary' | 'positive' | 'negative' | 'default';
type ButtonVariant = 'solid' | 'outline' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends PressableProps {
  className?: string;
  action?: ButtonAction;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
}

const actionSolid: Record<ButtonAction, string> = {
  primary: 'bg-primary-500 active:bg-primary-600',
  secondary: 'bg-secondary-500 active:bg-secondary-600',
  positive: 'bg-success-500 active:bg-success-600',
  negative: 'bg-error-500 active:bg-error-600',
  default: 'bg-background-100 active:bg-background-200',
};

const actionOutline: Record<ButtonAction, string> = {
  primary: 'border border-primary-500 bg-transparent active:bg-primary-50',
  secondary: 'border border-secondary-500 bg-transparent active:bg-secondary-50',
  positive: 'border border-success-500 bg-transparent active:bg-success-50',
  negative: 'border border-error-500 bg-transparent active:bg-error-50',
  default: 'border border-outline-300 bg-transparent active:bg-background-50',
};

const sizeMap: Record<ButtonSize, string> = {
  xs: 'h-8 px-3',
  sm: 'h-9 px-4',
  md: 'h-11 px-5',
  lg: 'h-12 px-6',
  xl: 'h-14 px-7',
};

const Button = React.forwardRef<View, ButtonProps>(
  (
    {
      className,
      action = 'primary',
      variant = 'solid',
      size = 'md',
      isLoading,
      isDisabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyle =
      variant === 'solid'
        ? actionSolid[action]
        : variant === 'outline'
          ? actionOutline[action]
          : 'bg-transparent';

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled || isLoading}
        className={`flex-row items-center justify-center rounded-lg gap-2 ${sizeMap[size]} ${variantStyle} ${isDisabled || isLoading ? 'opacity-50' : ''} ${className ?? ''}`}
        {...props}
      >
        {isLoading ? <ActivityIndicator size="small" color="#fff" /> : children}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

// ─── ButtonText ───────────────────────────────────────────────────────────────

interface ButtonTextProps extends TextProps {
  className?: string;
  action?: ButtonAction;
  variant?: ButtonVariant;
}

const textColorMap: Record<ButtonAction, Record<'solid' | 'outline' | 'link', string>> = {
  primary: { solid: 'text-white', outline: 'text-primary-500', link: 'text-primary-500' },
  secondary: { solid: 'text-white', outline: 'text-secondary-500', link: 'text-secondary-500' },
  positive: { solid: 'text-white', outline: 'text-success-500', link: 'text-success-500' },
  negative: { solid: 'text-white', outline: 'text-error-500', link: 'text-error-500' },
  default: { solid: 'text-typography-900', outline: 'text-typography-900', link: 'text-typography-900' },
};

const ButtonText = React.forwardRef<Text, ButtonTextProps>(
  ({ className, action = 'primary', variant = 'solid', ...props }, ref) => (
    <Text
      ref={ref}
      className={`font-semibold text-sm ${textColorMap[action][variant]} ${className ?? ''}`}
      {...props}
    />
  )
);

ButtonText.displayName = 'ButtonText';

// ─── ButtonIcon ───────────────────────────────────────────────────────────────

interface ButtonIconProps {
  as: React.ComponentType<{ size?: number; color?: string; name?: string }>;
  size?: number;
  color?: string;
  className?: string;
}

function ButtonIcon({ as: Icon, size = 18, color = '#fff', ...props }: ButtonIconProps) {
  return <Icon size={size} color={color} {...props} />;
}

export { Button, ButtonText, ButtonIcon };
