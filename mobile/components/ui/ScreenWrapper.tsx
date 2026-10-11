import React from 'react';
import { View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../hooks/useTheme';

export const ScreenWrapper = ({ children, style, ...props }: ViewProps) => {
  const { colors, spacing } = useAppTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }} edges={['top', 'left', 'right']}>
      <View style={[{ flex: 1, backgroundColor: colors.primary, padding: spacing.md }, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
};