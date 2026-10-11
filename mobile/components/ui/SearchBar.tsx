import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { IconButton } from './IconButton';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChangeText, placeholder = 'Search...' }: SearchBarProps) => (
  <View style={styles.container}>
    <Ionicons name="search" size={20} color={theme.colors.textDisabled} style={styles.icon} />
    <TextInput 
      style={styles.input} 
      value={value} 
      onChangeText={onChangeText} 
      placeholder={placeholder} 
      placeholderTextColor={theme.colors.textDisabled}
    />
    {value.length > 0 && (
      <IconButton icon="close-circle" size={20} color={theme.colors.textDisabled} onPress={() => onChangeText('')} />
    )}
  </View>
);
const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.secondary, borderRadius: theme.borderRadius.full, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs },
  icon: { marginRight: theme.spacing.sm },
  input: { flex: 1, color: theme.colors.text, ...theme.typography.body, paddingVertical: theme.spacing.sm }
});