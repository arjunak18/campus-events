import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { useAppTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = ({ label, error, helper, style, ...props }: InputProps) => {
  const { colors, spacing, borderRadius, typography } = useAppTheme();
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label && <Text style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: spacing.sm }]}>{label}</Text>}
      <TextInput 
        style={[{ backgroundColor: colors.secondary, borderRadius: borderRadius.md, padding: spacing.md, color: colors.text, borderWidth: 1, borderColor: error ? colors.error : colors.separator }, style]}
        placeholderTextColor={colors.textDisabled}
        {...props}
      />
      {error && <Text style={[typography.caption, { color: colors.error, marginTop: spacing.xs }]}>{error}</Text>}
      {!error && helper && <Text style={[typography.caption, { color: colors.textDisabled, marginTop: spacing.xs }]}>{helper}</Text>}
    </View>
  );
};