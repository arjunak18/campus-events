import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAppTheme } from '../../hooks/useTheme';
import { useMyRegistrations, useCancelRegistration } from '../../hooks/useRegistrations';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, formatTime } from '../../utils/date';

export default function RegistrationsScreen() {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const { data: registrations = [], isLoading, refetch, isRefetching } = useMyRegistrations();
  const cancelMutation = useCancelRegistration();

  const handleCancel = (eventId: string, title: string) => {
    Alert.alert(
      'Withdraw Registration',
      `Are you sure you want to cancel your registration for "${title}"?`,
      [
        { text: 'Keep Spot', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelMutation.mutateAsync(eventId);
              Alert.alert('Registration Cancelled', 'Your reservation has been withdrawn.');
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Unable to cancel registration.');
            }
          },
        },
      ]
    );
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
          My Event Tickets
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : registrations.length > 0 ? (
          registrations.map(reg => {
            const event = reg.event;
            const isConfirmed = reg.status === 'registered';
            return (
              <View
                key={reg.id}
                style={{
                  backgroundColor: colors.secondary,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                  marginBottom: spacing.md,
                  borderWidth: 1,
                  borderColor: isConfirmed ? colors.accent + '44' : colors.warning + '44',
                }}
              >
                {/* Status Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs }}>
                  <View style={{
                    backgroundColor: isConfirmed ? colors.accent + '22' : colors.warning + '22',
                    paddingHorizontal: spacing.sm,
                    paddingVertical: 2,
                    borderRadius: borderRadius.full,
                  }}>
                    <Text style={{
                      color: isConfirmed ? colors.accent : colors.warning,
                      fontSize: 11,
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}>
                      {reg.status}
                    </Text>
                  </View>
                  <Text style={[typography.caption, { color: colors.textDisabled }]}>
                    Reg: {formatDate(reg.registered_at)}
                  </Text>
                </View>

                {/* Event Details */}
                <Text style={[typography.heading3, { color: colors.text, marginVertical: 4 }]}>
                  {event?.title || 'Campus Event'}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                  <Ionicons name="calendar-outline" size={14} color={colors.accent} />
                  <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 6 }]}>
                    {formatDate(event?.start_date)} • {formatTime(event?.start_time)}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                  <Ionicons name="location-outline" size={14} color={colors.accentSecondary} />
                  <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 6 }]}>
                    {event?.is_online ? 'Online Platform' : (event?.venue || 'Campus')}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderColor: colors.separator }}>
                  <TouchableOpacity
                    onPress={() => event?.id && router.push(`/events/${event.id}`)}
                    style={{
                      flex: 1,
                      paddingVertical: spacing.xs + 2,
                      backgroundColor: colors.accent,
                      borderRadius: borderRadius.sm,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 13 }}>View Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => event?.id && handleCancel(event.id, event.title)}
                    style={{
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.xs + 2,
                      backgroundColor: 'transparent',
                      borderWidth: 1,
                      borderColor: colors.error,
                      borderRadius: borderRadius.sm,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: colors.error, fontWeight: '600', fontSize: 13 }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <EmptyState
            title="No active registrations"
            subtitle="Register for campus activities and workshops to view your admission passes here."
            actionLabel="Discover Events"
            onAction={() => router.push('/(tabs)/explore')}
          />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}