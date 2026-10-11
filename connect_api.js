const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'mobile');

const exploreContent = `import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { SearchBar } from '../../components/ui/SearchBar';
import { EventCard } from '../../components/ui/EventCard';
import { useAppTheme } from '../../hooks/useTheme';
import { EVENT_CATEGORIES } from '../../constants/categories';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../../services/api';

export default function ExploreScreen() {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', ...EVENT_CATEGORIES];
  
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetcher('/events')
  });
  
  const filteredEvents = events?.filter((e: any) => 
    (activeTab === 'All' || e.category === activeTab) && 
    (e.title?.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  return (
    <ScreenWrapper>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
        <Text style={[typography.heading2, { color: colors.text, flex: 1, textAlign: 'center' }]}>Events</Text>
      </View>
      <View style={{ marginBottom: spacing.md }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search events..." />
      </View>
      <View style={{ marginBottom: spacing.md }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
          {tabs.map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: activeTab === tab ? colors.accent : colors.secondary }}>
              <Text style={[typography.bodySmall, { color: activeTab === tab ? '#000' : colors.text, fontWeight: 'bold' }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 20 }} /> : null}
        {filteredEvents.map((event: any) => (
          <EventCard 
            key={event.id} 
            onPress={() => router.push(\`/events/\${event.id}\`)} 
            event={{ ...event, start_time: event.time || '10:00 AM' }} 
          />
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}`;

const createEventContent = `import React, { useState } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAppTheme } from '../../hooks/useTheme';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../../services/api';
import { router } from 'expo-router';

export default function CreateEventScreen() {
  const { colors, typography, spacing } = useAppTheme();
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', location: '', category: ''
  });

  const mutation = useMutation({
    mutationFn: async (newEvent: any) => {
      const res = await fetch(\`\${API_URL}/events\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      if (!res.ok) throw new Error('Failed to create event');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      Alert.alert('Success', 'Event created!');
      router.push('/(tabs)/explore');
    }
  });

  const handleSubmit = () => {
    mutation.mutate(form);
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[typography.heading2, { color: colors.text, marginBottom: spacing.lg, textAlign: 'center' }]}>Create New Event</Text>
        <View style={{ marginBottom: spacing.xl }}>
          <Input label="Event Title" placeholder="Enter event title" value={form.title} onChangeText={t => setForm({...form, title: t})} />
          <Input label="Description" placeholder="Enter event description" multiline numberOfLines={3} style={{ height: 80 }} value={form.description} onChangeText={t => setForm({...form, description: t})} />
          <Input label="Date" placeholder="YYYY-MM-DD" value={form.date} onChangeText={t => setForm({...form, date: t})} />
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Input label="Start Time" placeholder="e.g. 10:00 AM" style={{ flex: 1 }} value={form.time} onChangeText={t => setForm({...form, time: t})} />
          </View>
          <Input label="Venue" placeholder="Enter venue or online link" value={form.location} onChangeText={t => setForm({...form, location: t})} />
          <Input label="Category" placeholder="e.g. Technology" value={form.category} onChangeText={t => setForm({...form, category: t})} />
        </View>
        <Button title="Create Event" variant="primary" onPress={handleSubmit} isLoading={mutation.isPending} style={{ marginBottom: spacing.xl }} />
      </ScrollView>
    </ScreenWrapper>
  );
}`;

fs.writeFileSync(path.join(rootDir, 'app/(tabs)/explore.tsx'), exploreContent);
fs.writeFileSync(path.join(rootDir, 'app/(tabs)/create-event.tsx'), createEventContent);

console.log('App successfully connected to the backend API!');`;
