import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export const LoadingSpinner = () => (
  <View style={styles.center}>
    <ActivityIndicator size="large" color={theme.colors.accent} />
  </View>
);
const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });