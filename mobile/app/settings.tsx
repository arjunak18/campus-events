import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { useAppTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { colors, typography, spacing, borderRadius, isDark, toggleTheme } = useAppTheme();
  const { appUser, updateProfile } = useAuth();

  const [reminders, setReminders] = useState(appUser?.notification_preferences?.event_reminders ?? true);
  const [updates, setUpdates] = useState(appUser?.notification_preferences?.event_updates ?? true);
  const [newEvents, setNewEvents] = useState(appUser?.notification_preferences?.new_events ?? true);

  const handleToggleReminder = async (val: boolean) => {
    setReminders(val);
    await updateProfile({
      notification_preferences: {
        event_reminders: val,
        event_updates: updates,
        new_events: newEvents,
        registration_updates: true,
      },
    }).catch(() => {});
  };

  const handleToggleUpdates = async (val: boolean) => {
    setUpdates(val);
    await updateProfile({
      notification_preferences: {
        event_reminders: reminders,
        event_updates: val,
        new_events: newEvents,
        registration_updates: true,
      },
    }).catch(() => {});
  };

  const handleToggleNewEvents = async (val: boolean) => {
    setNewEvents(val);
    await updateProfile({
      notification_preferences: {
        event_reminders: reminders,
        event_updates: updates,
        new_events: val,
        registration_updates: true,
      },
    }).catch(() => {});
  };

  return (
    <ScreenWrapper style={{ padding: 0 }}>
      {/* Header */}
      <View style={{
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.heading3, { color: colors.text, marginLeft: spacing.md }]}>
          Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxl }}>
        {/* Appearance */}
        <Text style={[typography.caption, { color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing.xs }]}>
          Appearance
        </Text>
        <View style={{
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          marginBottom: spacing.lg,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View>
            <Text style={[typography.body, { color: colors.text, fontWeight: 'bold' }]}>Dark Theme</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>Optimized teal dark color hunt palette</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.separator, true: colors.accent }}
            thumbColor={colors.primary}
          />
        </View>

        {/* Notifications */}
        <Text style={[typography.caption, { color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing.xs }]}>
          Notification Preferences
        </Text>
        <View style={{
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.md,
          marginBottom: spacing.lg,
          overflow: 'hidden',
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.separator }}>
            <View style={{ flex: 1, marginRight: spacing.md }}>
              <Text style={[typography.body, { color: colors.text }]}>Event Reminders</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Alerts 1 hour before bookmarked and registered events</Text>
            </View>
            <Switch
              value={reminders}
              onValueChange={handleToggleReminder}
              trackColor={{ false: colors.separator, true: colors.accent }}
              thumbColor={colors.primary}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.separator }}>
            <View style={{ flex: 1, marginRight: spacing.md }}>
              <Text style={[typography.body, { color: colors.text }]}>Schedule Changes</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Updates regarding time, date, or venue revisions</Text>
            </View>
            <Switch
              value={updates}
              onValueChange={handleToggleUpdates}
              trackColor={{ false: colors.separator, true: colors.accent }}
              thumbColor={colors.primary}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md }}>
            <View style={{ flex: 1, marginRight: spacing.md }}>
              <Text style={[typography.body, { color: colors.text }]}>New Campus Announcements</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>New major events published by verified organizations</Text>
            </View>
            <Switch
              value={newEvents}
              onValueChange={handleToggleNewEvents}
              trackColor={{ false: colors.separator, true: colors.accent }}
              thumbColor={colors.primary}
            />
          </View>
        </View>

        {/* Campus & Community */}
        <Text style={[typography.caption, { color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing.xs }]}>
          Campus
        </Text>
        <View style={{
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.md,
          marginBottom: spacing.lg,
          overflow: 'hidden',
        }}>
          <TouchableOpacity
            onPress={() => router.push('/colleges')}
            style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.separator }}
          >
            <Ionicons name="school-outline" size={20} color={colors.accent} style={{ marginRight: spacing.md }} />
            <Text style={[typography.body, { color: colors.text, flex: 1 }]}>Browse Other Colleges</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/onboarding/interests')}
            style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md }}
          >
            <Ionicons name="sparkles-outline" size={20} color={colors.accent} style={{ marginRight: spacing.md }} />
            <Text style={[typography.body, { color: colors.text, flex: 1 }]}>Manage Event Interests</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
          </TouchableOpacity>
        </View>

        {/* About & Legal */}
        <Text style={[typography.caption, { color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing.xs }]}>
          About
        </Text>
        <View style={{
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.md,
          marginBottom: spacing.xl,
          overflow: 'hidden',
        }}>
          <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.separator }}>
            <Text style={[typography.body, { color: colors.text }]}>Campus Events Calendar</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>Version 1.0.0 (Production Build)</Text>
          </View>

          <TouchableOpacity
            onPress={() => Alert.alert('Privacy Policy', 'Campus Events respects your personal data. Only registration information is shared with authorized event organizers.')}
            style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.separator }}
          >
            <Text style={[typography.body, { color: colors.text, flex: 1 }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Terms of Service', 'By using Campus Events Calendar, you agree to student conduct guidelines.')}
            style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md }}
          >
            <Text style={[typography.body, { color: colors.text, flex: 1 }]}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}