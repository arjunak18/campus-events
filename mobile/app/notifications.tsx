import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAppTheme } from '../hooks/useTheme';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { formatDate } from '../utils/date';

export default function NotificationsScreen() {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const { data: notifications = [], isLoading, refetch, isRefetching } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const handleNotificationPress = (item: any) => {
    if (!item.is_read) {
      markReadMutation.mutate(item.id);
    }
    if (item.event_id) {
      router.push(`/events/${item.event_id}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'event_reminder':
        return { name: 'alarm-outline', color: colors.accent };
      case 'event_update':
        return { name: 'create-outline', color: colors.warning };
      case 'event_cancelled':
        return { name: 'close-circle-outline', color: colors.error };
      case 'registration_confirmed':
        return { name: 'checkmark-circle-outline', color: colors.accent };
      default:
        return { name: 'notifications-outline', color: colors.accentSecondary };
    }
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
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.separator,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[typography.heading3, { color: colors.text }]}>Notifications</Text>

        {notifications.some(n => !n.is_read) ? (
          <TouchableOpacity onPress={() => markAllReadMutation.mutate()}>
            <Text style={[typography.caption, { color: colors.accent, fontWeight: 'bold' }]}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />
        }
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : notifications.length > 0 ? (
          notifications.map(item => {
            const icon = getIcon(item.type);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleNotificationPress(item)}
                style={{
                  flexDirection: 'row',
                  padding: spacing.md,
                  backgroundColor: item.is_read ? colors.secondary : '#1DCD9F11',
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.sm,
                  borderWidth: 1,
                  borderColor: item.is_read ? colors.separator : colors.accent + '44',
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.md,
                }}>
                  <Ionicons name={icon.name as any} size={20} color={icon.color} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[typography.body, { color: colors.text, fontWeight: item.is_read ? '500' : 'bold' }]}>
                      {item.title}
                    </Text>
                    {!item.is_read && (
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent }} />
                    )}
                  </View>

                  {item.body ? (
                    <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>
                      {item.body}
                    </Text>
                  ) : null}

                  <Text style={[typography.caption, { color: colors.textDisabled, marginTop: 4 }]}>
                    {formatDate(item.created_at)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <EmptyState
            title="No notifications"
            subtitle="You're all caught up! Event reminders and updates will appear here."
          />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}