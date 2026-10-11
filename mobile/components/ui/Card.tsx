import React from 'react';
import { View, ViewProps, Pressable } from 'react-native';
import { useAppTheme } from '../../hooks/useTheme';

interface CardProps extends ViewProps {
  onPress?: () => void;
}

export const Card = ({ onPress, style, children, ...props }: CardProps) => {
  const { colors, spacing, borderRadius } = useAppTheme();
  const Component = onPress ? Pressable : View;
  return (
    <Component style={[{ backgroundColor: colors.secondary, borderRadius: borderRadius.lg, padding: spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 1.0, elevation: 1 }, style]} onPress={onPress} {...props as any}>
      {children}
    </Component>
  );
};