import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { EventCard } from '../../components/ui/EventCard';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAppTheme } from '../../hooks/useTheme';
import { useOrganization, useFollowOrganization, useUnfollowOrganization } from '../../hooks/useOrganizations';
import { useEvents } from '../../hooks/useEvents';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OrganizationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const { data: organization, isLoading: loadingOrg } = useOrganization(id as string);
  const { data: eventsData, isLoading: loadingEvents } = useEvents({ organizationId: id as string });
  const followMutation = useFollowOrganization();
  const unfollowMutation = useUnfollowOrganization();

  const [isFollowing, setIsFollowing] = useState(false);
  const events = eventsData?.data || [];

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      unfollowMutation.mutate(id as string);
    } else {
      setIsFollowing(true);
      followMutation.mutate(id as string);
      Alert.alert('Following Organization', `You will receive alerts when ${organization?.name || 'this club'} publishes events.`);
    }
  };

  if (loadingOrg) {
    return (
      <ScreenWrapper style={{ justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </ScreenWrapper>
    );
  }

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
        <Text style={[typography.heading3, { color: colors.text, marginLeft: spacing.md, flex: 1 }]} numberOfLines={1}>
          {organization?.name || 'Organization'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxl }}>
        {/* Org Banner Card */}
        <View style={{
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: colors.separator,
          alignItems: 'center',
        }}>
          <View style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: colors.accent + '22',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.md,
          }}>
            <Ionicons name="people" size={36} color={colors.accent} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[typography.heading2, { color: colors.text, textAlign: 'center' }]}>
              {organization?.name}
            </Text>
            {organization?.is_verified && (
              <Ionicons name="checkmark-circle" size={20} color={colors.accent} style={{ marginLeft: 6 }} />
            )}
          </View>

          {organization?.college?.name ? (
            <Text style={[typography.bodySmall, { color: colors.accent, marginTop: 4 }]}>
              {organization.college.name}
            </Text>
          ) : null}

          {organization?.description ? (
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md, lineHeight: 20 }]}>
              {organization.description}
            </Text>
          ) : null}

          {/* Followers and actions */}
          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg, width: '100%' }}>
            <Button
              title={isFollowing ? 'Following Club' : 'Follow Club'}
              variant={isFollowing ? 'outline' : 'primary'}
              onPress={handleToggleFollow}
              style={{ flex: 1 }}
            />
            {organization?.website && (
              <Button
                title="Club Link"
                variant="secondary"
                onPress={() => Linking.openURL(organization.website!)}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </View>

        {/* Events Published by Organization */}
        <Text style={[typography.heading3, { color: colors.text, marginBottom: spacing.sm }]}>
          Events by this Organization ({events.length})
        </Text>
        {loadingEvents ? (
          <LoadingSpinner />
        ) : events.length > 0 ? (
          events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => router.push(`/events/${event.id}`)}
            />
          ))
        ) : (
          <EmptyState
            title="No events yet"
            subtitle="This organization currently has no scheduled activities."
          />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}