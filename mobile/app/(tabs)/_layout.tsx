import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useTheme';

export default function TabLayout() {
  const { colors } = useAppTheme();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.primary, borderTopColor: colors.separator },
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.textDisabled,
    }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Search', tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} /> }} />
      <Tabs.Screen name="create-event" options={{ title: 'Create', tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={32} color={colors.accent} style={{ marginTop: -4 }} /> }} />
      <Tabs.Screen name="saved" options={{ title: 'My Events', tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}