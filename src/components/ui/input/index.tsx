import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

interface InputProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  children?: React.ReactNode;
}

const sizeMap = {
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-12',
};

const Input = React.forwardRef<View, InputProps>(
  ({ className, size = 'md', isInvalid, isDisabled, children, ...props }, ref) => (
    <View
      ref={ref}
      className={`flex-row items-center border rounded-lg overflow-hidden ${sizeMap[size]} ${
        isInvalid ? 'border-error-500' : 'border-outline-300'
      } ${isDisabled ? 'opacity-50 bg-background-100' : 'bg-background-0'} ${className ?? ''}`}
      {...props}
    >
      {children}
    </View>
  )
);

Input.displayName = 'Input';

// ─── InputField ───────────────────────────────────────────────────────────────

interface InputFieldProps extends TextInputProps {
  className?: string;
}

const InputField = React.forwardRef<TextInput, InputFieldProps>(
  ({ className, ...props }, ref) => (
    <TextInput
      ref={ref}
      className={`flex-1 px-4 text-base text-typography-900 ${className ?? ''}`}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  )
);

InputField.displayName = 'InputField';

// ─── InputSlot ────────────────────────────────────────────────────────────────

interface InputSlotProps {
  className?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

function InputSlot({ className, children, onPress }: InputSlotProps) {
  return (
    <View
      className={`items-center justify-center px-3 ${className ?? ''}`}
      onTouchEnd={onPress}
    >
      {children}
    </View>
  );
}

export { Input, InputField, InputSlot };
