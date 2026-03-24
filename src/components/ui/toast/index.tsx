import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

const config: Record<ToastType, { icon: string; bg: string; border: string; iconColor: string; textColor: string }> = {
  success: { icon: 'checkmark-circle', bg: '#052e16', border: '#16a34a', iconColor: '#4ade80', textColor: '#bbf7d0' },
  error:   { icon: 'close-circle',     bg: '#450a0a', border: '#dc2626', iconColor: '#f87171', textColor: '#fecaca' },
  info:    { icon: 'information-circle', bg: '#0c1a35', border: '#2563eb', iconColor: '#60a5fa', textColor: '#bfdbfe' },
};

interface ToastItemProps {
  toast: ToastMessage;
  onHide: (id: number) => void;
}

function ToastItem({ toast, onHide }: ToastItemProps) {
  const c = config[toast.type];
  return (
    <Pressable onPress={() => onHide(toast.id)}>
      <View style={[styles.toast, { backgroundColor: c.bg, borderColor: c.border }]}>
        <Ionicons name={c.icon as any} size={20} color={c.iconColor} />
        <Text style={[styles.text, { color: c.textColor }]}>{toast.message}</Text>
      </View>
    </Pressable>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onHide: (id: number) => void;
}

export function ToastContainer({ toasts, onHide }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onHide={onHide} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
