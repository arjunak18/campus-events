import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, TouchableOpacityProps } from 'react-native';
import { useAppTheme } from '../../hooks/useTheme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({ title, variant = 'primary', size = 'md', isLoading, disabled, style, ...props }: ButtonProps) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const getBgColor = () => {
    if (disabled) return colors.separator;
    switch (variant) {
      case 'primary': return colors.accent;
      case 'secondary': return colors.secondary;
      case 'danger': return colors.error;
      case 'outline':
      case 'ghost': return 'transparent';
      default: return colors.accent;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textDisabled;
    switch (variant) {
      case 'primary': return '#000000';
      case 'outline':
      case 'ghost': return colors.accent;
      case 'danger': return colors.text;
      default: return colors.text;
    }
  };

  return (
    <TouchableOpacity 
      disabled={disabled || isLoading}
      style={[
        { borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
        { backgroundColor: getBgColor() },
        variant === 'outline' && { borderWidth: 1, borderColor: colors.accent },
        size === 'sm' && { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
        size === 'md' && { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
        size === 'lg' && { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
        style
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[typography.body, { color: getTextColor(), fontWeight: 'bold' }, size === 'sm' && typography.bodySmall]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};