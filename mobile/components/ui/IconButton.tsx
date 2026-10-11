import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface IconButtonProps extends TouchableOpacityProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}

export const IconButton = ({ icon, size = 24, color = theme.colors.text, style, ...props }: IconButtonProps) => (
  <TouchableOpacity style={[styles.btn, style]} {...props}>
    <Ionicons name={icon} size={size} color={color} />
  </TouchableOpacity>
);
const styles = StyleSheet.create({ btn: { padding: theme.spacing.sm } });