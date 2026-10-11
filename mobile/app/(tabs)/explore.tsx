import React, { useState, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { SearchBar } from '../../components/ui/SearchBar';
import { EventCard } from '../../components/ui/EventCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAppTheme } from '../../hooks/useTheme';
import { EVENT_CATEGORIES } from '../../constants/categories';
import { router } from 'expo-router';
import { useEvents } from '../../hooks/useEvents';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  
  // Search and Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // Filters
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined);
  const [isFree, setIsFree] = useState<boolean | undefined>(undefined);
  const [sortOption, setSortOption] = useState<'date' | 'popularity' | 'created_at'>('date');

  const categories = useMemo(() => ['All', ...EVENT_CATEGORIES], []);

  // Fetch events via TanStack Query
  const { data: eventsData, isLoading, refetch, isRefetching } = useEvents({
    search: search.trim() || undefined,
    isOnline: isOnline,
    isFree: isFree,
    sort: sortOption,
    limit: 50,
  });

  const rawEvents = eventsData?.data || [];

  // Client-side category matching if needed
  const filteredEvents = useMemo(() => {
    return rawEvents.filter(e => {
      if (selectedCategory === 'All') return true;
      const catName = typeof e.category === 'object' ? e.category?.name : e.category;
      return catName?.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [rawEvents, selectedCategory]);

  const activeFilterCount = (isOnline !== undefined ? 1 : 0) + (isFree !== undefined ? 1 : 0) + (sortOption !== 'date' ? 1 : 0);

  const handleResetFilters = () => {
    setIsOnline(undefined);
    setIsFree(undefined);
    setSortOption('date');
    setSelectedCategory('All');
    setSearch('');
    setFilterModalVisible(false);
  };

  return (
    <ScreenWrapper style={{ padding: 0 }}>
      {/* Search Header */}
      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.xs }}>
        <Text style={[typography.heading2, { color: colors.text, marginBottom: spacing.sm }]}>
          Explore Events
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search events, topics, or venues..."
            />
          </View>
          
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            style={{
              width: 48,
              height: 48,
              borderRadius: borderRadius.md,
              backgroundColor: activeFilterCount > 0 ? colors.accent : colors.secondary,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
            accessibilityLabel="Filter events"
          >
            <Ionicons
              name="options-outline"
              size={22}
              color={activeFilterCount > 0 ? '#000000' : colors.text}
            />
            {activeFilterCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#000000',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.accent, fontSize: 10, fontWeight: 'bold' }}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Pills (Horizontal) */}
      <View style={{ paddingVertical: spacing.sm }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.xs }}
        >
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs + 2,
                  borderRadius: borderRadius.full,
                  backgroundColor: isSelected ? colors.accent : colors.secondary,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.accent : colors.separator,
                }}
              >
                <Text
                  style={[
                    typography.bodySmall,
                    {
                      color: isSelected ? '#000000' : colors.text,
                      fontWeight: isSelected ? 'bold' : 'normal',
                    },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Event Results List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent}
          />
        }
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: spacing.xs }}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event found' : 'events found'}
          </Text>
          {activeFilterCount > 0 && (
            <TouchableOpacity onPress={handleResetFilters}>
              <Text style={[typography.caption, { color: colors.accent }]}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <LoadingSpinner />
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => router.push(`/events/${event.id}`)}
            />
          ))
        ) : (
          <EmptyState
            title="No events found"
            subtitle="Try adjusting your keywords, category, or filter criteria."
            actionLabel="Reset All Filters"
            onAction={handleResetFilters}
          />
        )}
      </ScrollView>

      {/* Advanced Filters Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: colors.secondary,
            borderTopLeftRadius: borderRadius.xl,
            borderTopRightRadius: borderRadius.xl,
            padding: spacing.lg,
            maxHeight: '80%',
          }}>
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
              <Text style={[typography.heading2, { color: colors.text }]}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Attendance Format */}
            <Text style={[typography.heading3, { color: colors.text, marginBottom: spacing.xs }]}>Format</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
              {[
                { label: 'All', val: undefined },
                { label: 'In-Person', val: false },
                { label: 'Online', val: true },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.label}
                  onPress={() => setIsOnline(opt.val)}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.md,
                    backgroundColor: isOnline === opt.val ? colors.accent : colors.primary,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.separator,
                  }}
                >
                  <Text style={{ color: isOnline === opt.val ? '#000' : colors.text, fontWeight: '600' }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Pricing */}
            <Text style={[typography.heading3, { color: colors.text, marginBottom: spacing.xs }]}>Price</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
              {[
                { label: 'All', val: undefined },
                { label: 'Free', val: true },
                { label: 'Paid', val: false },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.label}
                  onPress={() => setIsFree(opt.val)}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.md,
                    backgroundColor: isFree === opt.val ? colors.accent : colors.primary,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.separator,
                  }}
                >
                  <Text style={{ color: isFree === opt.val ? '#000' : colors.text, fontWeight: '600' }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sort Order */}
            <Text style={[typography.heading3, { color: colors.text, marginBottom: spacing.xs }]}>Sort By</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl }}>
              {[
                { label: 'Date', val: 'date' as const },
                { label: 'Popular', val: 'popularity' as const },
                { label: 'Newest', val: 'created_at' as const },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.label}
                  onPress={() => setSortOption(opt.val)}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.md,
                    backgroundColor: sortOption === opt.val ? colors.accent : colors.primary,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.separator,
                  }}
                >
                  <Text style={{ color: sortOption === opt.val ? '#000' : colors.text, fontWeight: '600' }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Actions */}
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Button
                title="Reset All"
                variant="outline"
                onPress={handleResetFilters}
                style={{ flex: 1 }}
              />
              <Button
                title="Apply Filters"
                variant="primary"
                onPress={() => setFilterModalVisible(false)}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}