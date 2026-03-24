import React from 'react';
import { Modal, View, Pressable } from 'react-native';

// ─── AlertDialog ──────────────────────────────────────────────────────────────

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

function AlertDialog({ isOpen, onClose, children }: AlertDialogProps) {
  return (
    <Modal transparent visible={isOpen} animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 bg-black/60 items-center justify-center px-4"
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── AlertDialogBackdrop ──────────────────────────────────────────────────────

function AlertDialogBackdrop({ className: _className }: { className?: string }) {
  return null; // handled by modal backdrop
}

// ─── AlertDialogContent ───────────────────────────────────────────────────────

interface AlertDialogContentProps {
  className?: string;
  children?: React.ReactNode;
}

function AlertDialogContent({ className, children }: AlertDialogContentProps) {
  return (
    <View
      className={`bg-white rounded-2xl w-full max-w-sm p-6 gap-4 ${className ?? ''}`}
    >
      {children}
    </View>
  );
}

// ─── AlertDialogHeader ────────────────────────────────────────────────────────

function AlertDialogHeader({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <View className={`gap-1 ${className ?? ''}`}>{children}</View>
  );
}

// ─── AlertDialogBody ─────────────────────────────────────────────────────────

function AlertDialogBody({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <View className={className ?? ''}>{children}</View>
  );
}

// ─── AlertDialogFooter ────────────────────────────────────────────────────────

function AlertDialogFooter({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <View className={`flex-row justify-end gap-3 ${className ?? ''}`}>{children}</View>
  );
}

// ─── AlertDialogCloseButton ───────────────────────────────────────────────────

function AlertDialogCloseButton({ children }: { children?: React.ReactNode }) {
  return <View>{children}</View>;
}

export {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
};
