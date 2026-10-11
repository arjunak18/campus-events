import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../hooks/useTheme';

interface BadgeProps {
  label: string;
  variant?: 'accent' | 'secondary' | 'warning' | 'error';
}

export const Badge = ({ label, variant = 'accent' }: BadgeProps) => {
  const { colors, spacing, borderRadius, typography } = useAppTheme();
  const getBgColor = () => {
    switch(variant) {
      case 'accent': return colors.accent + '33';
      case 'secondary': return colors.secondary;
      case 'warning': return colors.warning + '33';
      case 'error': return colors.error + '33';
    }
  };
  const getTextColor = () => {
    switch(variant) {
      case 'accent': return colors.accent;
      case 'secondary': return colors.text;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
    }
  };
  return (
    <View style={{ backgroundColor: getBgColor(), paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full, alignSelf: 'flex-start' }}>
      <Text style={[typography.caption, { color: getTextColor(), fontWeight: 'bold' }]}>{label}</Text>
    </View>
  );
};