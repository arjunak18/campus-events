import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  isPassword?: boolean;
}

export const Input = ({ label, error, helper, isPassword, style, secureTextEntry, ...props }: InputProps) => {
  const { colors, spacing, borderRadius, typography } = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);

  const isSecure = isPassword ? !showPassword : secureTextEntry;

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label && <Text style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: spacing.sm }]}>{label}</Text>}
      <View style={{ position: 'relative', justifyContent: 'center' }}>
        <TextInput 
          style={[{ 
            backgroundColor: colors.secondary, 
            borderRadius: borderRadius.md, 
            padding: spacing.md, 
            paddingRight: isPassword ? 48 : spacing.md,
            color: colors.text, 
            borderWidth: 1, 
            borderColor: error ? colors.error : colors.separator 
          }, style]}
          placeholderTextColor={colors.textDisabled}
          secureTextEntry={isSecure}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 12,
              padding: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          >
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[typography.caption, { color: colors.error, marginTop: spacing.xs }]}>{error}</Text>}
      {!error && helper && <Text style={[typography.caption, { color: colors.textDisabled, marginTop: spacing.xs }]}>{helper}</Text>}
    </View>
  );
};
