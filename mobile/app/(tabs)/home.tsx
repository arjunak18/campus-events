import React, { useState, useMemo } from 'react';
import { ScrollView, Text, View, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { EventCard } from '../../components/ui/EventCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAppTheme } from '../../hooks/useTheme';
import { getGreeting } from '../../utils/greeting';
import { Calendar, DateData } from 'react-native-calendars';
import { useAuth } from '../../hooks/useAuth';
import { useEvents, usePopularEvents, useUpcomingEvents } from '../../hooks/useEvents';
import { useUnreadNotificationCount } from '../../hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user, appUser } = useAuth();
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const { data: allEventsData, isLoading: loadingAll, refetch: refetchAll, isRefetching } = useEvents({ limit: 100 });
  const { data: popularEvents, isLoading: loadingPopular } = usePopularEvents(5);
  const { data: upcomingEvents, isLoading: loadingUpcoming } = useUpcomingEvents(6);
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  const allEvents = allEventsData?.data || [];

  // Filter events on the selected date
  const eventsOnSelectedDate = useMemo(() => {
    return allEvents.filter(e => e.start_date === selectedDate);
  }, [allEvents, selectedDate]);

  // Build calendar marks
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    allEvents.forEach(e => {
      if (e.start_date) {
        marks[e.start_date] = {
          marked: true,
          dotColor: colors.accent,
        };
      }
    });

    // Mark selected date
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: colors.accent,
      selectedTextColor: '#000000',
    };

    return marks;
  }, [allEvents, selectedDate, colors.accent]);

  const userName = appUser?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Student';
  const collegeName = appUser?.college?.name || 'All Campuses';

  return (
    <ScreenWrapper style={{ padding: 0 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetchAll}
            tintColor={colors.accent}
          />
        }
      >
        {/* Header Bar */}
        <View style={{ 
          paddingHorizontal: spacing.md, 
          paddingTop: spacing.md, 
          paddingBottom: spacing.sm, 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <View style={{ flex: 1, marginRight: spacing.md }}>
            <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
              {getGreeting(userName)}
            </Text>
            <Text style={[typography.heading2, { color: colors.text }]}>
              {userName}
            </Text>
            
            {/* Selected College Pill */}
            <TouchableOpacity 
              onPress={() => router.push('/colleges')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.secondary,
                alignSelf: 'flex-start',
                paddingHorizontal: spacing.sm,
                paddingVertical: 4,
                borderRadius: borderRadius.full,
                marginTop: spacing.xs,
              }}
            >
              <Ionicons name="school-outline" size={13} color={colors.accent} />
              <Text style={[typography.caption, { color: colors.text, marginLeft: 4, fontWeight: '600' }]} numberOfLines={1}>
                {collegeName}
              </Text>
              <Ionicons name="chevron-down" size={12} color={colors.textSecondary} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>

          {/* Action Icons */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/explore')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.secondary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              accessibilityLabel="Search events"
            >
              <Ionicons name="search" size={20} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.secondary,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
              accessibilityLabel="Notifications"
            >
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
              {unreadCount > 0 && (
                <View style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.accent,
                }} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* View Switcher: Calendar vs List */}
        <View style={{
          flexDirection: 'row',
          marginHorizontal: spacing.md,
          marginVertical: spacing.sm,
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.md,
          padding: 3,
        }}>
          <TouchableOpacity
            onPress={() => setViewMode('calendar')}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.sm,
              backgroundColor: viewMode === 'calendar' ? colors.accent : 'transparent',
            }}
          >
            <Ionicons name="calendar" size={16} color={viewMode === 'calendar' ? '#000000' : colors.textSecondary} />
            <Text style={[typography.bodySmall, {
              marginLeft: 6,
              fontWeight: 'bold',
              color: viewMode === 'calendar' ? '#000000' : colors.textSecondary,
            }]}>
              Calendar View
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewMode('list')}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.sm,
              backgroundColor: viewMode === 'list' ? colors.accent : 'transparent',
            }}
          >
            <Ionicons name="list" size={16} color={viewMode === 'list' ? '#000000' : colors.textSecondary} />
            <Text style={[typography.bodySmall, {
              marginLeft: 6,
              fontWeight: 'bold',
              color: viewMode === 'list' ? '#000000' : colors.textSecondary,
            }]}>
              Event List View
            </Text>
          </TouchableOpacity>
        </View>

        {/* CALENDAR VIEW */}
        {viewMode === 'calendar' ? (
          <>
            {/* Interactive Monthly Calendar */}
            <View style={{
              marginHorizontal: spacing.md,
              marginTop: spacing.xs,
              marginBottom: spacing.md,
              borderRadius: borderRadius.lg,
              overflow: 'hidden',
              backgroundColor: colors.secondary,
              borderWidth: 1,
              borderColor: colors.separator,
            }}>
              <Calendar
                current={selectedDate}
                onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
                theme={{
                  backgroundColor: colors.secondary,
                  calendarBackground: colors.secondary,
                  textSectionTitleColor: colors.textSecondary,
                  selectedDayBackgroundColor: colors.accent,
                  selectedDayTextColor: '#000000',
                  todayTextColor: colors.accent,
                  dayTextColor: colors.text,
                  textDisabledColor: colors.textDisabled,
                  dotColor: colors.accent,
                  selectedDotColor: '#000000',
                  arrowColor: colors.accent,
                  monthTextColor: colors.text,
                  indicatorColor: colors.accent,
                  textDayFontWeight: '500',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '600',
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 12,
                }}
              />
            </View>

            {/* Events for Selected Date */}
            <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <Text style={[typography.heading3, { color: colors.text }]}>
                  {selectedDate === todayStr ? "Today's Events" : `Events on ${selectedDate}`}
                </Text>
                <Text style={[typography.caption, { color: colors.accent }]}>
                  {eventsOnSelectedDate.length} {eventsOnSelectedDate.length === 1 ? 'event' : 'events'}
                </Text>
              </View>

              {loadingAll ? (
                <LoadingSpinner />
              ) : eventsOnSelectedDate.length > 0 ? (
                eventsOnSelectedDate.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onPress={() => router.push(`/events/${event.id}`)}
                  />
                ))
              ) : (
                <EmptyState
                  title="No events scheduled"
                  subtitle={`There are no campus activities scheduled for ${selectedDate}.`}
                  actionLabel="Discover other events"
                  onAction={() => router.push('/(tabs)/explore')}
                />
              )}
            </View>
          </>
        ) : (
          /* EVENT LIST VIEW */
          <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.sm }}>
            <Text style={[typography.heading3, { color: colors.text, marginBottom: spacing.md }]}>
              All Scheduled Events
            </Text>
            {loadingAll ? (
              <LoadingSpinner />
            ) : allEvents.length > 0 ? (
              allEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => router.push(`/events/${event.id}`)}
                />
              ))
            ) : (
              <EmptyState
                title="No events yet"
                subtitle="There are currently no events published on campus."
                actionLabel="Create an event"
                onAction={() => router.push('/(tabs)/create-event')}
              />
            )}
          </View>
        )}

        {/* Popular / Featured Events Section */}
        {popularEvents && popularEvents.length > 0 && (
          <View style={{ marginBottom: spacing.xl }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: spacing.md,
              marginBottom: spacing.sm,
            }}>
              <Text style={[typography.heading3, { color: colors.text }]}>
                Trending & Popular
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
                <Text style={[typography.bodySmall, { color: colors.accent }]}>View All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: spacing.md, gap: spacing.md }}>
              {popularEvents.map(event => (
                <View key={event.id} style={{ width: Dimensions.get('window').width * 0.75 }}>
                  <EventCard
                    event={event}
                    onPress={() => router.push(`/events/${event.id}`)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recently Published Section */}
        {upcomingEvents && upcomingEvents.length > 0 && (
          <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.xxl }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.sm,
            }}>
              <Text style={[typography.heading3, { color: colors.text }]}>
                Upcoming Highlights
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
                <Text style={[typography.bodySmall, { color: colors.accent }]}>Explore</Text>
              </TouchableOpacity>
            </View>

            {upcomingEvents.slice(0, 4).map(event => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push(`/events/${event.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}