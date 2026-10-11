import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useTheme';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, subtitle, icon, actionLabel, onAction }: EmptyStateProps) => {
  const { colors, spacing, typography } = useAppTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
      {icon && <Ionicons name={icon} size={64} color={colors.textDisabled} style={{ marginBottom: spacing.md }} />}
      <Text style={[typography.heading3, { color: colors.text, textAlign: 'center', marginBottom: spacing.sm }]}>{title}</Text>
      {subtitle && <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg }]}>{subtitle}</Text>}
      {actionLabel && onAction && <Button title={actionLabel} onPress={onAction} style={{ marginTop: spacing.md }} />}
    </View>
  );
};