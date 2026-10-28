import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { useAppTheme } from '../../hooks/useTheme';
import { useMyRegistrations } from '../../hooks/useRegistrations';
import { useSavedEvents } from '../../hooks/useSavedEvents';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, appUser, signOut } = useAuth();
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  
  const { data: registrations = [] } = useMyRegistrations();
  const { data: savedEvents = [] } = useSavedEvents();

  const displayName = user ? (appUser?.display_name || user?.user_metadata?.display_name || 'Student Member') : 'Guest Student';
  const email = user ? (appUser?.email || user?.email || 'student@campus.edu') : 'guest@campus.edu';
  const collegeName = user ? (appUser?.college?.name || 'Campus Student') : 'National Institute of Technology';
  const department = user ? (appUser?.department ? `${appUser.department}` : 'Engineering & Technology') : 'Browsing as Guest';
  const year = user && appUser?.academic_year ? ` • ${appUser.academic_year}` : '';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of Campus Events?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/auth/login');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Could not sign out.');
            }
          }
        },
      ]
    );
  };

  const menu = [
    { icon: 'school-outline', title: 'My College', route: '/colleges' },
    { icon: 'ticket-outline', title: 'My Registrations', route: '/registrations' },
    { icon: 'notifications-outline', title: 'Notifications', route: '/notifications' },
    { icon: 'settings-outline', title: 'Settings & Preferences', route: '/settings' },
  ];

  return (
    <ScreenWrapper style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxl }}>
        {/* Profile Header */}
        <View style={{ alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.lg }}>
          <Avatar 
            initials={getInitials(displayName)} 
            size="xl" 
            uri={appUser?.avatar_url}
          />
          <Text style={[typography.heading2, { color: colors.text, marginTop: spacing.md, textAlign: 'center' }]}>
            {displayName}
          </Text>
          <Text style={[typography.bodySmall, { color: colors.accent, marginTop: 2 }]}>
            {email}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' }]}>
            {department}{year}
          </Text>
          <Text style={[typography.caption, { color: colors.textDisabled, marginTop: 2, textAlign: 'center' }]}>
            {collegeName}
          </Text>
        </View>

        {/* Stats Row */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: colors.separator,
        }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[typography.heading2, { color: colors.accent }]}>
              {registrations.length}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
              Registered
            </Text>
          </View>

          <View style={{ width: 1, backgroundColor: colors.separator }} />

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[typography.heading2, { color: colors.accentSecondary }]}>
              {savedEvents.length}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
              Saved
            </Text>
          </View>

          <View style={{ width: 1, backgroundColor: colors.separator }} />

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[typography.heading2, { color: colors.text }]}>
              {appUser?.role === 'organizer' || appUser?.role === 'college_admin' ? 'Organizer' : 'Student'}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
              Role
            </Text>
          </View>
        </View>

        {/* Menu Navigation Card */}
        <View style={{
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.lg,
          overflow: 'hidden',
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: colors.separator,
        }}>
          {menu.map((item, i) => (
            <TouchableOpacity
              key={item.title}
              onPress={() => item.route && router.push(item.route as any)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: spacing.md,
                borderBottomWidth: i === menu.length - 1 ? 0 : 1,
                borderBottomColor: colors.separator,
              }}
            >
              <Ionicons name={item.icon as any} size={22} color={colors.accent} style={{ marginRight: spacing.md }} />
              <Text style={[typography.body, { color: colors.text, flex: 1 }]}>
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign In / Sign Out Card */}
        {user ? (
          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.secondary,
              padding: spacing.md,
              borderRadius: borderRadius.lg,
              borderWidth: 1,
              borderColor: colors.error + '44',
            }}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.error} style={{ marginRight: spacing.sm }} />
            <Text style={[typography.body, { color: colors.error, fontWeight: 'bold' }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.accent,
              padding: spacing.md,
              borderRadius: borderRadius.lg,
            }}
          >
            <Ionicons name="log-in-outline" size={22} color="#000000" style={{ marginRight: spacing.sm }} />
            <Text style={[typography.body, { color: '#000000', fontWeight: 'bold' }]}>
              Sign In with Gmail
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}