import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { useAppTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { EVENT_CATEGORIES } from '../../constants/categories';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function InterestsScreen() {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const { updateProfile } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Technology', 'Workshops']);
  const [saving, setSaving] = useState(false);

  const toggleInterest = (category: string) => {
    if (selectedInterests.includes(category)) {
      setSelectedInterests(selectedInterests.filter(c => c !== category));
    } else {
      setSelectedInterests([...selectedInterests, category]);
    }
  };

  const handleContinue = async () => {
    setSaving(true);
    try {
      await updateProfile({ interests: selectedInterests });
    } catch {
      // Non-blocking if offline/local
    } finally {
      setSaving(false);
      router.replace('/(tabs)/home');
    }
  };

  return (
    <ScreenWrapper style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <View style={{ alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.xl }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent + '22', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md }}>
            <Ionicons name="sparkles" size={28} color={colors.accent} />
          </View>
          <Text style={[typography.heading1, { color: colors.text, textAlign: 'center' }]}>
            Your Interests
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>
            Select the categories of campus events you care about most.
          </Text>
        </View>

        {/* Interests Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
          {EVENT_CATEGORIES.map(category => {
            const isSelected = selectedInterests.includes(category);
            return (
              <TouchableOpacity
                key={category}
                onPress={() => toggleInterest(category)}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: borderRadius.full,
                  backgroundColor: isSelected ? colors.accent : colors.secondary,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.accent : colors.separator,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color="#000000" style={{ marginRight: 4 }} />
                )}
                <Text style={{
                  color: isSelected ? '#000000' : colors.text,
                  fontWeight: isSelected ? 'bold' : 'normal',
                  fontSize: 13,
                }}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          title={`Continue (${selectedInterests.length} selected)`}
          variant="primary"
          onPress={handleContinue}
          isLoading={saving}
          style={{ marginBottom: spacing.md }}
        />

        <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={{ alignSelf: 'center', padding: spacing.sm }}>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}