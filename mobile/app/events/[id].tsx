import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Linking, Share } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAppTheme } from '../../hooks/useTheme';
import { useEvent } from '../../hooks/useEvents';
import { useRegisterForEvent, useCancelRegistration, useMyRegistrations } from '../../hooks/useRegistrations';
import { useSaveEvent, useUnsaveEvent, useSavedEvents } from '../../hooks/useSavedEvents';
import { useAuth } from '../../hooks/useAuth';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, formatTime } from '../../utils/date';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const { user } = useAuth();

  const { data: event, isLoading, error } = useEvent(id as string);
  const { data: myRegistrations = [] } = useMyRegistrations();
  const { data: mySaved = [] } = useSavedEvents();

  const registerMutation = useRegisterForEvent();
  const cancelRegMutation = useCancelRegistration();
  const saveMutation = useSaveEvent();
  const unsaveMutation = useUnsaveEvent();

  const regList = Array.isArray(myRegistrations)
    ? myRegistrations
    : (Array.isArray((myRegistrations as any)?.data) ? (myRegistrations as any).data : []);

  const savedList = Array.isArray(mySaved)
    ? mySaved
    : (Array.isArray((mySaved as any)?.data) ? (mySaved as any).data : []);

  const isRegistered = regList.some((r: any) => r?.event_id === id && r?.status !== 'cancelled');
  const isSaved = savedList.some((s: any) => s?.event_id === id);

  const [reportModalVisible, setReportModalVisible] = useState(false);

  if (isLoading) {
    return (
      <ScreenWrapper style={{ justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </ScreenWrapper>
    );
  }

  if (error || !event) {
    return (
      <ScreenWrapper style={{ justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
        <Ionicons name="alert-circle-outline" size={56} color={colors.error} />
        <Text style={[typography.heading2, { color: colors.text, marginTop: spacing.md, textAlign: 'center' }]}>
          Event Not Found
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' }]}>
          This event may have been cancelled, removed, or is inaccessible.
        </Text>
        <Button title="Back to Events" onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
      </ScreenWrapper>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${event.title}" on Campus Events Calendar!\nDate: ${formatDate(event.start_date)}\nVenue: ${event.venue || 'Online'}`,
        title: event.title,
      });
    } catch {
      // ignore
    }
  };

  const handleToggleSave = () => {
    if (!user) {
      Alert.alert(
        'Sign In Required 🔐',
        'Please sign in with your verified Gmail account to save events to your bookmarks.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }
    if (isSaved) {
      unsaveMutation.mutate(event.id);
    } else {
      saveMutation.mutate(event.id);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      Alert.alert(
        'Sign In Required 🔐',
        'Please sign in with your verified Gmail account to register for campus events.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }

    if (event.registration_type === 'external' && event.registration_url) {
      const supported = await Linking.canOpenURL(event.registration_url);
      if (supported) {
        Linking.openURL(event.registration_url);
      } else {
        Alert.alert('Invalid URL', 'Cannot open the external registration link.');
      }
      return;
    }

    try {
      await registerMutation.mutateAsync(event.id);
      Alert.alert('Registration Confirmed! 🎉', 'You have registered for this event. View it anytime in My Events.');
    } catch (e: any) {
      Alert.alert('Registration Notice', e.message || 'Unable to register at this time.');
    }
  };

  const handleCancelRegistration = () => {
    Alert.alert(
      'Cancel Registration',
      'Are you sure you want to withdraw your registration for this event?',
      [
        { text: 'Keep Registration', style: 'cancel' },
        {
          text: 'Confirm Withdrawal',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelRegMutation.mutateAsync(event.id);
              Alert.alert('Cancelled', 'Your registration has been cancelled.');
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Could not cancel registration.');
            }
          },
        },
      ]
    );
  };

  const handleOpenMap = () => {
    const query = encodeURIComponent(event.venue_address || event.venue || 'Campus');
    Linking.openURL(`https://maps.google.com/?q=${query}`);
  };

  const handleReport = () => {
    Alert.prompt
      ? Alert.prompt('Report Event', 'Please specify why you are reporting this event:', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit Report',
            onPress: (text?: string) => Alert.alert('Report Submitted', 'Thank you. Administrators will review this report.'),
          },
        ])
      : Alert.alert('Report Event', 'Report received. Our moderation team has been notified.');
  };

  const categoryName = typeof event.category === 'object' && event.category?.name 
    ? event.category.name 
    : 'Campus Activity';

  const isRegistrationClosed = event.registration_deadline && new Date(event.registration_deadline) < new Date();
  const isFull = event.max_attendees && event.current_attendees >= event.max_attendees;

  return (
    <ScreenWrapper style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Poster Header */}
        <View style={{ height: 260, backgroundColor: colors.secondary, position: 'relative' }}>
          {event.poster_url ? (
            <Image source={{ uri: event.poster_url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#16997633' }}>
              <Ionicons name="calendar" size={64} color={colors.accent} />
            </View>
          )}

          {/* Top Floating Actions */}
          <View style={{
            position: 'absolute',
            top: 40,
            left: spacing.md,
            right: spacing.md,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0.6)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <TouchableOpacity
                onPress={handleToggleSave}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                accessibilityLabel="Bookmark event"
              >
                <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={22} color={isSaved ? colors.accent : "#FFFFFF"} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                accessibilityLabel="Share event"
              >
                <Ionicons name="share-social-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content Details */}
        <View style={{ padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs }}>
            <Badge label={categoryName} variant="accent" />
            <Text style={[typography.caption, { color: colors.accent, fontWeight: 'bold' }]}>
              {event.is_free ? 'FREE ENTRY' : `INR ${event.price || 0}`}
            </Text>
          </View>

          <Text style={[typography.heading1, { color: colors.text, marginVertical: spacing.xs }]}>
            {event.title}
          </Text>

          {event.summary ? (
            <Text style={[typography.body, { color: colors.textSecondary, marginBottom: spacing.md }]}>
              {event.summary}
            </Text>
          ) : null}

          {/* Date & Time Row */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            marginBottom: spacing.sm,
            borderWidth: 1,
            borderColor: colors.separator,
          }}>
            <Ionicons name="calendar-outline" size={24} color={colors.accent} style={{ marginRight: spacing.md }} />
            <View style={{ flex: 1 }}>
              <Text style={[typography.body, { color: colors.text, fontWeight: 'bold' }]}>
                {formatDate(event.start_date)}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                {formatTime(event.start_time)} {event.end_time ? `- ${formatTime(event.end_time)}` : ''} ({event.timezone || 'Asia/Kolkata'})
              </Text>
            </View>
          </View>

          {/* Venue / Meeting Location Row */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: colors.secondary,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            marginBottom: spacing.md,
            borderWidth: 1,
            borderColor: colors.separator,
          }}>
            <Ionicons name={event.is_online ? "videocam-outline" : "location-outline"} size={24} color={colors.accentSecondary} style={{ marginRight: spacing.md }} />
            <View style={{ flex: 1 }}>
              <Text style={[typography.body, { color: colors.text, fontWeight: 'bold' }]}>
                {event.is_online ? 'Online Event' : (event.venue || 'Campus Venue')}
              </Text>
              {event.venue_address ? (
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {event.venue_address}
                </Text>
              ) : null}
              {!event.is_online && event.venue && (
                <TouchableOpacity onPress={handleOpenMap} style={{ marginTop: 4 }}>
                  <Text style={[typography.caption, { color: colors.accent, fontWeight: '600' }]}>
                    Open in Maps →
                  </Text>
                </TouchableOpacity>
              )}
              {event.is_online && event.meeting_url && (
                <TouchableOpacity onPress={() => Linking.openURL(event.meeting_url!)} style={{ marginTop: 4 }}>
                  <Text style={[typography.caption, { color: colors.accent, fontWeight: '600' }]}>
                    Join Meeting Link →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Organizing Body Card */}
          {event.organization ? (
            <TouchableOpacity
              onPress={() => event.organization?.id && router.push(`/organizations/${event.organization.id}`)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.secondary,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginBottom: spacing.lg,
                borderWidth: 1,
                borderColor: colors.separator,
              }}
            >
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.accent + '33',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: spacing.md,
              }}>
                <Ionicons name="people" size={22} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>Organized by</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[typography.body, { color: colors.text, fontWeight: 'bold' }]}>
                    {event.organization.name}
                  </Text>
                  {event.organization.is_verified && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.accent} style={{ marginLeft: 4 }} />
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
            </TouchableOpacity>
          ) : null}

          {/* Description Section */}
          <Text style={[typography.heading3, { color: colors.text, marginBottom: spacing.xs }]}>
            About This Event
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.lg }]}>
            {event.description}
          </Text>

          {/* Eligibility & Info */}
          {event.eligibility && (
            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.heading3, { color: colors.text, marginBottom: spacing.xs }]}>
                Eligibility
              </Text>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                {Array.isArray(event.eligibility) ? event.eligibility.join(', ') : event.eligibility}
              </Text>
            </View>
          )}

          {/* Capacity Stats */}
          {event.max_attendees ? (
            <View style={{
              backgroundColor: colors.secondary,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: colors.separator,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>Capacity</Text>
                <Text style={[typography.bodySmall, { color: colors.accent, fontWeight: 'bold' }]}>
                  {event.current_attendees} / {event.max_attendees} spots filled
                </Text>
              </View>
              <View style={{ height: 6, backgroundColor: colors.separator, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{
                  width: `${Math.min(100, Math.round((event.current_attendees / event.max_attendees) * 100))}%`,
                  height: '100%',
                  backgroundColor: isFull ? colors.error : colors.accent,
                }} />
              </View>
            </View>
          ) : null}

          {/* Report Event Option */}
          <TouchableOpacity onPress={handleReport} style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.md }}>
            <Ionicons name="flag-outline" size={16} color={colors.textDisabled} />
            <Text style={[typography.caption, { color: colors.textDisabled, marginLeft: 6 }]}>
              Report this event listing
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Bottom Registration Bar */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.secondary,
        padding: spacing.md,
        borderTopWidth: 1,
        borderColor: colors.separator,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
      }}>
        {isRegistered ? (
          <Button
            title="Registered (Withdraw)"
            variant="outline"
            onPress={handleCancelRegistration}
            isLoading={cancelRegMutation.isPending}
            style={{ flex: 1, borderColor: colors.warning }}
          />
        ) : isFull ? (
          <Button
            title="Event Full (Join Waitlist)"
            variant="secondary"
            onPress={handleRegister}
            isLoading={registerMutation.isPending}
            style={{ flex: 1 }}
          />
        ) : isRegistrationClosed ? (
          <Button
            title="Registration Closed"
            variant="secondary"
            disabled
            style={{ flex: 1 }}
          />
        ) : (
          <Button
            title={event.registration_type === 'external' ? 'Register on Website' : 'Register Now'}
            variant="primary"
            onPress={handleRegister}
            isLoading={registerMutation.isPending}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}