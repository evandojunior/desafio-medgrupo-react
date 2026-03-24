import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Context ──────────────────────────────────────────────────────────────────

interface SelectContextType {
  value: string;
  onValueChange: (val: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  placeholder?: string;
}

const SelectContext = React.createContext<SelectContextType>({
  value: '',
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps {
  selectedValue?: string;
  onValueChange: (val: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  isInvalid?: boolean;
  isDisabled?: boolean;
}

function Select({ selectedValue = '', onValueChange, placeholder, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value: selectedValue, onValueChange, isOpen, setIsOpen, placeholder }}>
      {children}
    </SelectContext.Provider>
  );
}

// ─── SelectTrigger ────────────────────────────────────────────────────────────

interface SelectTriggerProps {
  className?: string;
  isInvalid?: boolean;
  children?: React.ReactNode;
}

function SelectTrigger({ className, isInvalid, children }: SelectTriggerProps) {
  const { setIsOpen } = React.useContext(SelectContext);
  return (
    <Pressable
      onPress={() => setIsOpen(true)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 46,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isInvalid ? '#EF4444' : '#333333',
        backgroundColor: '#1A1A1A',
      }}
    >
      {children}
    </Pressable>
  );
}

// ─── SelectInput ─────────────────────────────────────────────────────────────

function SelectInput({ placeholder, className }: { placeholder?: string; className?: string }) {
  const { value } = React.useContext(SelectContext);
  return (
    <Text
      style={{
        flex: 1,
        fontSize: 14,
        color: value ? '#F9FAFB' : '#555555',
      }}
    >
      {value || placeholder || 'Selecione...'}
    </Text>
  );
}

// ─── SelectIcon ──────────────────────────────────────────────────────────────

function SelectIcon({ as: Icon }: { as?: React.ComponentType<{ size: number; color: string }> }) {
  const { isOpen } = React.useContext(SelectContext);
  if (Icon) return <Icon size={20} color="#6B7280" />;
  return <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#6B7280" />;
}

// ─── SelectPortal / SelectContent / SelectItem ───────────────────────────────

interface SelectPortalProps {
  children?: React.ReactNode;
}

function SelectPortal({ children }: SelectPortalProps) {
  return <>{children}</>;
}

interface SelectContentProps {
  className?: string;
  children?: React.ReactNode;
}

function SelectContent({ className, children }: SelectContentProps) {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <Modal transparent visible={isOpen} animationType="fade" onRequestClose={() => setIsOpen(false)}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setIsOpen(false)}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={{ backgroundColor: '#1A1A1A', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 16, maxHeight: 320 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#444', alignSelf: 'center', marginTop: 12, marginBottom: 8 }} />
            <FlatList
              data={[]}
              renderItem={null}
              ListHeaderComponent={<>{children}</>}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface SelectItemProps {
  label: string;
  value: string;
}

function SelectItemComponent({ label, value }: SelectItemProps) {
  const { value: selectedValue, onValueChange, setIsOpen } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <TouchableOpacity
      onPress={() => {
        onValueChange(value);
        setIsOpen(false);
      }}
      style={{
        paddingHorizontal: 20,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      }}
    >
      <Text style={{ fontSize: 14, color: isSelected ? '#3B82F6' : '#F9FAFB', fontWeight: isSelected ? '600' : '400' }}>
        {label}
      </Text>
      {isSelected && <Ionicons name="checkmark" size={18} color="#3B82F6" />}
    </TouchableOpacity>
  );
}

export {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectItemComponent as SelectItem,
};
