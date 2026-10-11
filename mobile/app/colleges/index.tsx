import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { SearchBar } from '../../components/ui/SearchBar';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAppTheme } from '../../hooks/useTheme';
import { useColleges } from '../../hooks/useColleges';
import { useAuth } from '../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CollegesIndexScreen() {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const { data: colleges = [], isLoading, refetch, isRefetching } = useColleges();
  const { updateProfile, appUser } = useAuth();
  const [search, setSearch] = useState('');

  const filteredColleges = colleges.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCollege = async (college: any) => {
    try {
      await updateProfile({ college_id: college.id });
    } catch {
      // ignore
    }
    router.push(`/colleges/${college.id}`);
  };

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
        <Text style={[typography.heading3, { color: colors.text, marginLeft: spacing.md }]}>
          Campus Colleges
        </Text>
      </View>

      <View style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search by college name or city..."
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredColleges.length > 0 ? (
          filteredColleges.map(c => {
            const isCurrent = appUser?.college_id === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => handleSelectCollege(c)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing.md,
                  backgroundColor: colors.secondary,
                  marginBottom: spacing.sm,
                  borderRadius: borderRadius.md,
                  borderWidth: 1,
                  borderColor: isCurrent ? colors.accent : colors.separator,
                }}
              >
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.accent + '22',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.md,
                }}>
                  <Ionicons name="school" size={22} color={colors.accent} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[typography.body, { color: colors.text, fontWeight: 'bold', flex: 1 }]}>
                      {c.name}
                    </Text>
                    {isCurrent && (
                      <View style={{ backgroundColor: colors.accent, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 4 }}>
                        <Text style={{ color: '#000', fontSize: 10, fontWeight: 'bold' }}>MY CAMPUS</Text>
                      </View>
                    )}
                  </View>
                  {c.location ? (
                    <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                      {c.location}
                    </Text>
                  ) : null}
                </View>

                <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} style={{ marginLeft: spacing.xs }} />
              </TouchableOpacity>
            );
          })
        ) : (
          <EmptyState
            title="No colleges found"
            subtitle="Try a different college name or location query."
          />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}