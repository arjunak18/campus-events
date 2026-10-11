import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useTheme';
import { Card } from './Card';
import { Badge } from './Badge';
import { Event } from '../../types';
import { formatFullDateTime } from '../../utils/date';
import { useSaveEvent, useUnsaveEvent } from '../../hooks/useSavedEvents';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  isSaved?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress, isSaved: externalIsSaved }) => {
  const { colors, spacing, typography, borderRadius } = useAppTheme();
  const [saved, setSaved] = React.useState(externalIsSaved ?? event.is_saved ?? false);
  const saveMutation = useSaveEvent();
  const unsaveMutation = useUnsaveEvent();

  const handleToggleSave = () => {
    if (saved) {
      setSaved(false);
      unsaveMutation.mutate(event.id);
    } else {
      setSaved(true);
      saveMutation.mutate(event.id);
    }
  };

  const categoryName = typeof event.category === 'object' && event.category?.name 
    ? event.category.name 
    : typeof event.category === 'string'
      ? event.category
      : 'General';

  const venueText = event.is_online 
    ? (event.venue ? `Online (${event.venue})` : 'Online Event') 
    : (event.venue || 'Campus Venue');

  return (
    <Card 
      onPress={onPress} 
      style={{ 
        padding: 0, 
        overflow: 'hidden', 
        marginBottom: spacing.md, 
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.lg,
      }}
    >
      {event.poster_url ? (
        <Image 
          source={{ uri: event.poster_url }} 
          style={{ width: '100%', height: 160, backgroundColor: colors.separator }} 
          resizeMode="cover"
        />
      ) : (
        <View 
          style={{ 
            width: '100%', 
            height: 100, 
            backgroundColor: '#16997622', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}
        >
          <Ionicons name="calendar" size={40} color={colors.accent} />
        </View>
      )}

      <View style={{ padding: spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
          <Badge label={categoryName} variant="accent" />
          <TouchableOpacity 
            onPress={handleToggleSave} 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={saved ? "Remove bookmark" : "Bookmark event"}
          >
            <Ionicons 
              name={saved ? "bookmark" : "bookmark-outline"} 
              size={22} 
              color={saved ? colors.accent : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        <Text 
          style={[typography.heading3, { color: colors.text, marginBottom: spacing.xs }]} 
          numberOfLines={2}
        >
          {event.title}
        </Text>

        {event.summary ? (
          <Text 
            style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: spacing.sm }]} 
            numberOfLines={2}
          >
            {event.summary}
          </Text>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
          <Ionicons name="time-outline" size={15} color={colors.accent} />
          <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: spacing.xs, flex: 1 }]}>
            {formatFullDateTime(event.start_date, event.start_time)}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
          <Ionicons name="location-outline" size={15} color={colors.accentSecondary} />
          <Text 
            style={[typography.caption, { color: colors.textSecondary, marginLeft: spacing.xs, flex: 1 }]} 
            numberOfLines={1}
          >
            {venueText}
          </Text>
        </View>

        {event.organization?.name ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs }}>
            <Ionicons name="people-outline" size={14} color={colors.textDisabled} />
            <Text style={[typography.caption, { color: colors.textDisabled, marginLeft: spacing.xs }]} numberOfLines={1}>
              {event.organization.name}
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
};