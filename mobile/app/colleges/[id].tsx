import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { EventCard } from '../../components/ui/EventCard';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAppTheme } from '../../hooks/useTheme';
import { useCollege } from '../../hooks/useColleges';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useEvents } from '../../hooks/useEvents';
import { collegesService } from '../../services/colleges.service';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CollegeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  
  const { data: college, isLoading: loadingCollege } = useCollege(id as string);
  const { data: organizations = [], isLoading: loadingOrgs } = useOrganizations(id as string);
  const { data: eventsData, isLoading: loadingEvents } = useEvents({ college_id: id as string });

  const [isFollowing, setIsFollowing] = useState(false);
  const events = eventsData?.data || [];

  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        setIsFollowing(false);
        await collegesService.unfollowCollege(id as string);
      } else {
        setIsFollowing(true);
        await collegesService.followCollege(id as string);
        Alert.alert('Following Campus', `You will receive updates for ${college?.name || 'this college'}.`);
      }
    } catch {
      // ignore
    }
  };

  if (loadingCollege) {
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
          {college?.name || 'College'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxl }}>
        {/* College Info Card */}
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
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.accent + '22',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.md,
          }}>
            <Ionicons name="school" size={32} color={colors.accent} />
          </View>

          <Text style={[typography.heading2, { color: colors.text, textAlign: 'center' }]}>
            {college?.name}
          </Text>

          {college?.location ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={[typography.bodySmall, { color: colors.textSecondary, marginLeft: 4 }]}>
                {college.location}
              </Text>
            </View>
          ) : null}

          {college?.description ? (
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md, lineHeight: 20 }]}>
              {college.description}
            </Text>
          ) : null}

          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg, width: '100%' }}>
            <Button
              title={isFollowing ? 'Following Campus' : 'Follow Campus'}
              variant={isFollowing ? 'outline' : 'primary'}
              onPress={handleToggleFollow}
              style={{ flex: 1 }}
            />
            {college?.website && (
              <Button
                title="Website"
                variant="secondary"
                onPress={() => Linking.openURL(college.website!)}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </View>

        {/* Organizations Section */}
        <Text style={[typography.heading3, { color: colors.text, marginBottom: spacing.sm }]}>
          Clubs & Organizations ({organizations.length})
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }} contentContainerStyle={{ gap: spacing.sm }}>
          {organizations.map(org => (
            <TouchableOpacity
              key={org.id}
              onPress={() => router.push(`/organizations/${org.id}`)}
              style={{
                width: 140,
                backgroundColor: colors.secondary,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.separator,
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent + '22', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xs }}>
                <Ionicons name="people" size={20} color={colors.accent} />
              </View>
              <Text style={[typography.bodySmall, { color: colors.text, fontWeight: 'bold', textAlign: 'center' }]} numberOfLines={2}>
                {org.name}
              </Text>
              {org.is_verified && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.accent} />
                  <Text style={{ color: colors.accent, fontSize: 10, marginLeft: 2, fontWeight: 'bold' }}>VERIFIED</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* College Events */}
        <Text style={[typography.heading3, { color: colors.text, marginBottom: spacing.sm }]}>
          Campus Events ({events.length})
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
            title="No events scheduled"
            subtitle="There are currently no upcoming events posted for this campus."
          />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}