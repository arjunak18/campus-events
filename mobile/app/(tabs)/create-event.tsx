import React, { useState } from 'react';
import { ScrollView, View, Text, Alert, TouchableOpacity, Switch, Image } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAppTheme } from '../../hooks/useTheme';
import { useCreateEvent } from '../../hooks/useEvents';
import { useColleges } from '../../hooks/useColleges';
import { useOrganizations } from '../../hooks/useOrganizations';
import { EVENT_CATEGORIES } from '../../constants/categories';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function CreateEventScreen() {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const createMutation = useCreateEvent();
  const { data: colleges = [] } = useColleges();
  const { data: organizations = [] } = useOrganizations();

  // Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [category, setCategory] = useState<string>(EVENT_CATEGORIES[0]);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('12:00 PM');
  
  // Venue / Online
  const [isOnline, setIsOnline] = useState(false);
  const [venue, setVenue] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  
  // College & Organization
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | undefined>(undefined);
  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(undefined);

  // Pricing & Registration
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');
  const [registrationType, setRegistrationType] = useState<'internal' | 'external' | 'none'>('internal');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [eligibility, setEligibility] = useState('All College Students');
  
  // Contact
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Visibility
  const [visibility, setVisibility] = useState<'public' | 'college_only'>('public');

  // Validation Error
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPosterUrl(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Notice', 'Unable to pick image. You can also paste an image URL directly.');
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Event title is required';
    if (!description.trim()) errs.description = 'Description is required';
    if (!startDate.trim()) errs.startDate = 'Start date (YYYY-MM-DD) is required';
    if (!isOnline && !venue.trim()) errs.venue = 'Venue is required for in-person events';
    if (isOnline && !meetingUrl.trim() && registrationType === 'none') {
      errs.meetingUrl = 'Meeting link is required';
    }
    if (registrationType === 'external' && !registrationUrl.trim()) {
      errs.registrationUrl = 'Registration URL is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublish = async () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please check the required fields highlighted in red.');
      return;
    }

    try {
      const payload: any = {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        summary: summary || title,
        description,
        poster_url: posterUrl || undefined,
        category,
        start_date: startDate,
        start_time: startTime,
        end_date: endDate || startDate,
        end_time: endTime,
        timezone: 'Asia/Kolkata',
        is_all_day: false,
        is_online: isOnline,
        venue: isOnline ? undefined : venue,
        meeting_url: isOnline ? meetingUrl : undefined,
        college_id: selectedCollegeId || colleges[0]?.id,
        organization_id: selectedOrgId || undefined,
        registration_type: registrationType,
        registration_url: registrationType === 'external' ? registrationUrl : undefined,
        max_attendees: maxAttendees ? parseInt(maxAttendees, 10) : undefined,
        eligibility: eligibility ? [eligibility] : undefined,
        is_free: isFree,
        price: !isFree && price ? parseFloat(price) : undefined,
        price_currency: 'INR',
        contact_email: contactEmail || undefined,
        contact_phone: contactPhone || undefined,
        visibility,
        status: 'published',
      };

      await createMutation.mutateAsync(payload);
      Alert.alert('Event Published! 🎉', 'Your event is now live on the campus calendar.', [
        {
          text: 'View Events',
          onPress: () => router.push('/(tabs)/explore'),
        },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to create event. Please ensure your backend is running.');
    }
  };

  return (
    <ScreenWrapper style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxl }}>
        <Text style={[typography.heading2, { color: colors.text, marginBottom: spacing.xs, textAlign: 'center' }]}>
          Publish Campus Event
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: spacing.lg, textAlign: 'center' }]}>
          Share activities, workshops, competitions, and seminars
        </Text>

        {/* Poster Picker */}
        <TouchableOpacity
          onPress={handlePickImage}
          style={{
            height: 160,
            borderRadius: borderRadius.lg,
            backgroundColor: colors.secondary,
            borderWidth: 1,
            borderColor: colors.separator,
            borderStyle: posterUrl ? 'solid' : 'dashed',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            marginBottom: spacing.md,
          }}
        >
          {posterUrl ? (
            <Image source={{ uri: posterUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="image-outline" size={36} color={colors.accent} />
              <Text style={[typography.bodySmall, { color: colors.text, marginTop: spacing.xs }]}>
                Tap to Select Event Poster
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                Recommended: 16:9 banner
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Basic Info */}
        <View style={{ marginBottom: spacing.md }}>
          <Input
            label="Event Title *"
            placeholder="e.g. Annual Hackathon 2026"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />
          <Input
            label="Short Summary"
            placeholder="One-line highlight of the event"
            value={summary}
            onChangeText={setSummary}
          />
          <Input
            label="Detailed Description *"
            placeholder="Outline agenda, speakers, prerequisites, and rules..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ height: 100 }}
            error={errors.description}
          />
        </View>

        {/* Category Picker */}
        <Text style={[typography.bodySmall, { color: colors.text, fontWeight: 'bold', marginBottom: spacing.xs }]}>
          Category *
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }} contentContainerStyle={{ gap: spacing.xs }}>
          {EVENT_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: borderRadius.full,
                backgroundColor: category === cat ? colors.accent : colors.secondary,
                borderWidth: 1,
                borderColor: colors.separator,
              }}
            >
              <Text style={{ color: category === cat ? '#000000' : colors.text, fontWeight: '600', fontSize: 12 }}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Date & Time */}
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs }}>
          <View style={{ flex: 1 }}>
            <Input
              label="Date (YYYY-MM-DD) *"
              placeholder="2026-10-15"
              value={startDate}
              onChangeText={setStartDate}
              error={errors.startDate}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Start Time"
              placeholder="10:00 AM"
              value={startTime}
              onChangeText={setStartTime}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Input
              label="End Date"
              placeholder="Optional"
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="End Time"
              placeholder="12:00 PM"
              value={endTime}
              onChangeText={setEndTime}
            />
          </View>
        </View>

        {/* Venue / Online Format */}
        <View style={{ 
          backgroundColor: colors.secondary, 
          padding: spacing.md, 
          borderRadius: borderRadius.md, 
          marginBottom: spacing.md 
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
            <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]}>Online Event</Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: colors.separator, true: colors.accent }}
              thumbColor={colors.primary}
            />
          </View>

          {isOnline ? (
            <Input
              label="Meeting URL"
              placeholder="https://zoom.us/j/... or Google Meet"
              value={meetingUrl}
              onChangeText={setMeetingUrl}
              error={errors.meetingUrl}
            />
          ) : (
            <Input
              label="Campus Venue *"
              placeholder="e.g. Auditorium Hall B, 3rd Floor"
              value={venue}
              onChangeText={setVenue}
              error={errors.venue}
            />
          )}
        </View>

        {/* Registration Options */}
        <View style={{ 
          backgroundColor: colors.secondary, 
          padding: spacing.md, 
          borderRadius: borderRadius.md, 
          marginBottom: spacing.md 
        }}>
          <Text style={[typography.body, { color: colors.text, fontWeight: 'bold', marginBottom: spacing.sm }]}>
            Registration Mode
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md }}>
            {[
              { type: 'internal', label: 'In-App' },
              { type: 'external', label: 'External URL' },
              { type: 'none', label: 'Walk-in / Open' },
            ].map(item => (
              <TouchableOpacity
                key={item.type}
                onPress={() => setRegistrationType(item.type as any)}
                style={{
                  flex: 1,
                  paddingVertical: spacing.xs + 2,
                  borderRadius: borderRadius.sm,
                  backgroundColor: registrationType === item.type ? colors.accent : colors.primary,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: registrationType === item.type ? '#000' : colors.text, fontWeight: '600', fontSize: 12 }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {registrationType === 'external' && (
            <Input
              label="Registration Link *"
              placeholder="https://eventbrite.com/..."
              value={registrationUrl}
              onChangeText={setRegistrationUrl}
              error={errors.registrationUrl}
            />
          )}

          {registrationType === 'internal' && (
            <Input
              label="Seat Capacity (Max Attendees)"
              placeholder="e.g. 100 (leave blank for unlimited)"
              keyboardType="numeric"
              value={maxAttendees}
              onChangeText={setMaxAttendees}
            />
          )}

          {/* Pricing */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs, paddingTop: spacing.xs, borderTopWidth: 1, borderColor: colors.separator }}>
            <Text style={[typography.body, { color: colors.text }]}>Free Admission</Text>
            <Switch
              value={isFree}
              onValueChange={setIsFree}
              trackColor={{ false: colors.separator, true: colors.accent }}
              thumbColor={colors.primary}
            />
          </View>

          {!isFree && (
            <Input
              label="Ticket Price (INR)"
              placeholder="e.g. 150"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
              style={{ marginTop: spacing.sm }}
            />
          )}
        </View>

        {/* Eligibility & Contact */}
        <Input
          label="Eligibility Requirements"
          placeholder="e.g. Open to all branches / CSE 2nd Year"
          value={eligibility}
          onChangeText={setEligibility}
        />

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Input
              label="Contact Email"
              placeholder="organizer@college.edu"
              value={contactEmail}
              onChangeText={setContactEmail}
              keyboardType="email-address"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Contact Phone"
              placeholder="+91 9876543210"
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Visibility */}
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl }}>
          <TouchableOpacity
            onPress={() => setVisibility('public')}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              borderRadius: borderRadius.md,
              backgroundColor: visibility === 'public' ? colors.accent : colors.secondary,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: visibility === 'public' ? '#000' : colors.text, fontWeight: 'bold' }}>
              Public (All Colleges)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVisibility('college_only')}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              borderRadius: borderRadius.md,
              backgroundColor: visibility === 'college_only' ? colors.accent : colors.secondary,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: visibility === 'college_only' ? '#000' : colors.text, fontWeight: 'bold' }}>
              Campus Only
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <Button
          title="Publish Event"
          variant="primary"
          onPress={handlePublish}
          isLoading={createMutation.isPending}
          style={{ marginBottom: spacing.lg }}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}