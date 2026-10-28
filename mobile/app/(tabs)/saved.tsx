import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { EventCard } from '../../components/ui/EventCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAppTheme } from '../../hooks/useTheme';
import { useSavedEvents } from '../../hooks/useSavedEvents';
import { useMyRegistrations } from '../../hooks/useRegistrations';
import { useAuth } from '../../hooks/useAuth';
import { router } from 'expo-router';

export default function SavedScreen() {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'Saved' | 'Registered' | 'Past'>('Saved');

  const { data: savedEvents = [], isLoading: loadingSaved, refetch: refetchSaved, isRefetching: refetchingSaved } = useSavedEvents();
  const { data: registrations = [], isLoading: loadingReg, refetch: refetchReg, isRefetching: refetchingReg } = useMyRegistrations();

  const isRefreshing = refetchingSaved || refetchingReg;
  const onRefresh = () => {
    refetchSaved();
    refetchReg();
  };

  const today = new Date().toISOString().split('T')[0];

  // Past events from registrations or saved
  const pastEvents = React.useMemo(() => {
    const list: any[] = [];
    registrations.forEach(r => {
      if (r.event && r.event.start_date && r.event.start_date < today) {
        list.push(r.event);
      }
    });
    savedEvents.forEach(s => {
      if (s.event && s.event.start_date && s.event.start_date < today) {
        if (!list.some(e => e.id === s.event?.id)) {
          list.push(s.event);
        }
      }
    });
    return list;
  }, [registrations, savedEvents, today]);

  return (
    <ScreenWrapper style={{ padding: 0 }}>
      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm }}>
        <Text style={[typography.heading2, { color: colors.text, textAlign: 'center', marginBottom: spacing.md }]}>
          My Events
        </Text>

        {/* Segmented Control */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.full,
          padding: 3,
        }}>
          {(['Saved', 'Registered', 'Past'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                paddingVertical: spacing.xs + 2,
                borderRadius: borderRadius.full,
                backgroundColor: activeTab === tab ? colors.accent : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text style={[
                typography.bodySmall,
                { color: activeTab === tab ? '#000000' : colors.text, fontWeight: 'bold' }
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {!user && (
          <View style={{
            backgroundColor: colors.accent + '15',
            borderColor: colors.accent,
            borderWidth: 1,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            marginBottom: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 13 }}>Guest Mode Active 👤</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                Sign in with your Gmail to sync your registered events and bookmarks across devices.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/auth/login')}
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: spacing.sm + 4,
                paddingVertical: 7,
                borderRadius: borderRadius.sm,
              }}
            >
              <Text style={{ color: '#000', fontWeight: '700', fontSize: 12 }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* SAVED TAB */}
        {activeTab === 'Saved' && (
          loadingSaved ? (
            <LoadingSpinner />
          ) : savedEvents.length > 0 ? (
            savedEvents.map(item => item.event ? (
              <EventCard
                key={item.id}
                event={item.event}
                isSaved={true}
                onPress={() => router.push(`/events/${item.event?.id}`)}
              />
            ) : null)
          ) : (
            <EmptyState
              title="No saved events"
              subtitle="Bookmark events you're interested in by tapping the bookmark icon on any event card."
              actionLabel="Discover Events"
              onAction={() => router.push('/(tabs)/explore')}
            />
          )
        )}

        {/* REGISTERED TAB */}
        {activeTab === 'Registered' && (
          loadingReg ? (
            <LoadingSpinner />
          ) : registrations.length > 0 ? (
            registrations.map(reg => reg.event ? (
              <View key={reg.id} style={{ position: 'relative' }}>
                <EventCard
                  event={reg.event}
                  onPress={() => router.push(`/events/${reg.event?.id}`)}
                />
                <View style={{
                  position: 'absolute',
                  top: spacing.md,
                  right: spacing.md,
                  backgroundColor: reg.status === 'registered' ? colors.accent : colors.warning,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 2,
                  borderRadius: borderRadius.full,
                }}>
                  <Text style={{ color: '#000000', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {reg.status}
                  </Text>
                </View>
              </View>
            ) : null)
          ) : (
            <EmptyState
              title="No registrations yet"
              subtitle="Register for activities, workshops, and competitions to see them here."
              actionLabel="Find Events to Join"
              onAction={() => router.push('/(tabs)/explore')}
            />
          )
        )}

        {/* PAST TAB */}
        {activeTab === 'Past' && (
          pastEvents.length > 0 ? (
            pastEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push(`/events/${event.id}`)}
              />
            ))
          ) : (
            <EmptyState
              title="No past events"
              subtitle="Events you have attended or saved will appear here once they conclude."
            />
          )
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}