import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { useAppTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'calendar',
    title: 'Discover Campus Events',
    description: 'Explore hackathons, workshops, cultural fests, sports, and seminars happening across universities.',
  },
  {
    icon: 'alarm',
    title: 'Never Miss Out',
    description: 'Track activities on a monthly calendar, receive real-time updates, and hold verified admission tickets.',
  },
  {
    icon: 'people',
    title: 'Connect with Student Life',
    description: 'Follow campus clubs, verified student councils, and connect with academic societies.',
  },
];

export default function OnboardingScreen() {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/auth/login');
    }
  };

  return (
    <ScreenWrapper style={{ padding: 0 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={{ flex: 1 }}
      >
        {slides.map((slide, index) => (
          <View
            key={index}
            style={{
              width,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: spacing.xl,
            }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: colors.accent + '22',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.xxl,
              }}
            >
              <Ionicons name={slide.icon as any} size={64} color={colors.accent} />
            </View>

            <Text style={[typography.heading1, { color: colors.text, textAlign: 'center', marginBottom: spacing.md }]}>
              {slide.title}
            </Text>

            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', lineHeight: 24 }]}>
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer with Dots & Buttons */}
      <View style={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        {/* Pagination Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl, gap: spacing.xs }}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={{
                width: currentIndex === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentIndex === i ? colors.accent : colors.separator,
              }}
            />
          ))}
        </View>

        <Button
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          variant="primary"
          onPress={handleNext}
          style={{ marginBottom: spacing.md }}
        />

        <TouchableOpacity onPress={() => router.replace('/auth/login')} style={{ alignSelf: 'center', padding: spacing.xs }}>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}