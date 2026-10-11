import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const darkColors = {
  primary: '#000000',
  secondary: '#222222',
  accent: '#1DCD9F',
  accentSecondary: '#169976',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textDisabled: '#777777',
  separator: '#383838',
  error: '#FF4444',
  warning: '#FFB800',
  success: '#1DCD9F',
};

export const lightColors = {
  primary: '#F9FAFB',
  secondary: '#FFFFFF',
  accent: '#1DCD9F',
  accentSecondary: '#169976',
  text: '#111827',
  textSecondary: '#4B5563',
  textDisabled: '#9CA3AF',
  separator: '#E5E7EB',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#1DCD9F',
};

export const typography = {
  heading1: { fontSize: 32, fontWeight: 'bold' as const },
  heading2: { fontSize: 24, fontWeight: 'bold' as const },
  heading3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: 'normal' as const },
  bodySmall: { fontSize: 14, fontWeight: 'normal' as const },
  caption: { fontSize: 12, fontWeight: 'normal' as const },
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const borderRadius = {
  sm: 4, md: 8, lg: 12, xl: 16, xxl: 24, full: 9999,
};

type ThemeContextType = {
  isDark: boolean;
  colors: typeof darkColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  colors: darkColors,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  useEffect(() => {
    setIsDark(systemScheme === 'dark');
  }, [systemScheme]);

  const toggleTheme = () => setIsDark(!isDark);
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  return {
    isDark: context.isDark,
    colors: context.colors,
    toggleTheme: context.toggleTheme,
    typography,
    spacing,
    borderRadius,
  };
};
