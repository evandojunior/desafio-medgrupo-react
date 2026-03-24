import React from 'react';
import { View, Text, ViewProps, TextProps } from 'react-native';

// ─── FormControl ──────────────────────────────────────────────────────────────

interface FormControlProps extends ViewProps {
  className?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  children?: React.ReactNode;
}

const FormControlContext = React.createContext<{
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
}>({});

const FormControl = React.forwardRef<View, FormControlProps>(
  ({ className, isInvalid, isRequired, isDisabled, children, ...props }, ref) => (
    <FormControlContext.Provider value={{ isInvalid, isRequired, isDisabled }}>
      <View ref={ref} className={`gap-1.5 ${className ?? ''}`} {...props}>
        {children}
      </View>
    </FormControlContext.Provider>
  )
);

FormControl.displayName = 'FormControl';

// ─── FormControlLabel ─────────────────────────────────────────────────────────

interface FormControlLabelProps {
  className?: string;
  children?: React.ReactNode;
}

function FormControlLabel({ className, children }: FormControlLabelProps) {
  return (
    <View className={`flex-row ${className ?? ''}`}>
      {children}
    </View>
  );
}

// ─── FormControlLabelText ─────────────────────────────────────────────────────

interface FormControlLabelTextProps extends TextProps {
  className?: string;
}

function FormControlLabelText({ className, ...props }: FormControlLabelTextProps) {
  React.useContext(FormControlContext);
  return (
    <Text
      className={`text-sm font-medium text-typography-700 ${className ?? ''}`}
      {...props}
    />
  );
}

// ─── FormControlError ─────────────────────────────────────────────────────────

interface FormControlErrorProps {
  className?: string;
  children?: React.ReactNode;
}

function FormControlError({ className, children }: FormControlErrorProps) {
  const { isInvalid } = React.useContext(FormControlContext);
  if (!isInvalid) return null;
  return (
    <View className={`flex-row items-center gap-1 ${className ?? ''}`}>
      {children}
    </View>
  );
}

// ─── FormControlErrorText ─────────────────────────────────────────────────────

interface FormControlErrorTextProps extends TextProps {
  className?: string;
}

function FormControlErrorText({ className, ...props }: FormControlErrorTextProps) {
  return (
    <Text className={`text-xs text-error-500 ${className ?? ''}`} {...props} />
  );
}

// ─── FormControlHelper ────────────────────────────────────────────────────────

interface FormControlHelperProps {
  className?: string;
  children?: React.ReactNode;
}

function FormControlHelper({ className, children }: FormControlHelperProps) {
  return (
    <View className={`flex-row ${className ?? ''}`}>{children}</View>
  );
}

// ─── FormControlHelperText ────────────────────────────────────────────────────

function FormControlHelperText({ className, ...props }: TextProps & { className?: string }) {
  return (
    <Text className={`text-xs text-typography-500 ${className ?? ''}`} {...props} />
  );
}

export {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
};
