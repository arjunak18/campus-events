import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Alert, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../../components/ui/ScreenWrapper';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useAppTheme } from '../../../hooks/useTheme';
import { useEvent, useUpdateEvent, useDeleteEvent } from '../../../hooks/useEvents';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, typography, spacing } = useAppTheme();

  const { data: event, isLoading } = useEvent(id as string);
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [venue, setVenue] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setStartDate(event.start_date || '');
      setStartTime(event.start_time || '');
      setVenue(event.venue || '');
    }
  }, [event]);

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Notice', 'Title and description cannot be empty.');
      return;
    }
    try {
      await updateMutation.mutateAsync({
        id: id as string,
        data: {
          title,
          description,
          start_date: startDate,
          start_time: startTime,
          venue,
        },
      });
      Alert.alert('Success', 'Event details updated successfully.');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Unable to update event.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Cancel & Delete Event',
      'Are you sure you want to cancel this event? This action will notify all registered attendees.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Cancellation',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(id as string);
              Alert.alert('Cancelled', 'Event has been cancelled.');
              router.replace('/(tabs)/home');
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Unable to delete event.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
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
        <Text style={[typography.heading3, { color: colors.text, marginLeft: spacing.md, flex: 1 }]}>
          Edit Event
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxl }}>
        <Input label="Event Title" value={title} onChangeText={setTitle} />
        <Input label="Description" value={description} onChangeText={setDescription} multiline numberOfLines={4} style={{ height: 100 }} />
        <Input label="Date (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} />
        <Input label="Start Time" value={startTime} onChangeText={setStartTime} />
        <Input label="Venue" value={venue} onChangeText={setVenue} />

        <Button
          title="Save Changes"
          variant="primary"
          onPress={handleUpdate}
          isLoading={updateMutation.isPending}
          style={{ marginTop: spacing.md, marginBottom: spacing.md }}
        />

        <Button
          title="Cancel & Delete Event"
          variant="outline"
          onPress={handleDelete}
          isLoading={deleteMutation.isPending}
          style={{ borderColor: colors.error }}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}