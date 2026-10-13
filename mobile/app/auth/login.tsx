import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { router } from 'expo-router';
import { useAppTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { signIn, signInWithGoogle, continueAsGuest, isLoading } = useAuth();
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    try {
      await signIn(cleanEmail, password);
      router.replace('/(tabs)/home');
    } catch (e: any) {
      setErrorMsg(e.message || 'Invalid email or password.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    try {
      await signInWithGoogle();
      router.replace('/(tabs)/home');
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to complete Google authentication.');
    }
  };

  const handleGuestAccess = () => {
    continueAsGuest();
    router.replace('/(tabs)/home');
  };

  return (
    <ScreenWrapper style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing.lg }}>
        {/* App Branding */}
        <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.accent + '22',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.md,
          }}>
            <Ionicons name="calendar" size={36} color={colors.accent} />
          </View>
          <Text style={[typography.heading1, { color: colors.text, textAlign: 'center' }]}>
            Campus Events
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>
            Discover activities across universities & colleges
          </Text>
        </View>

        {/* Error Feedback */}
        {errorMsg ? (
          <View style={{
            backgroundColor: colors.error + '22',
            borderWidth: 1,
            borderColor: colors.error,
            padding: spacing.md,
            borderRadius: borderRadius.md,
            marginBottom: spacing.md,
          }}>
            <Text style={{ color: colors.error, fontSize: 13, fontWeight: '500' }}>
              {errorMsg}
            </Text>
          </View>
        ) : null}

        {/* Form Inputs */}
        <View style={{ marginBottom: spacing.md }}>
          <Input
            label="Email / Gmail"
            placeholder="yourname@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => router.push('/auth/forgot-password')}
            style={{ alignSelf: 'flex-end', marginTop: 2, marginBottom: spacing.sm }}
          >
            <Text style={[typography.caption, { color: colors.accent }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Sign In with Email"
          variant="primary"
          onPress={handleLogin}
          isLoading={isLoading}
          style={{ marginBottom: spacing.md }}
        />

        {/* Separator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.separator }} />
          <Text style={[typography.caption, { color: colors.textDisabled, marginHorizontal: spacing.md }]}>
            OR
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.separator }} />
        </View>

        {/* Native Google OAuth Button */}
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          disabled={isLoading}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: spacing.md,
            borderRadius: borderRadius.md,
            backgroundColor: colors.secondary,
            marginBottom: spacing.md,
            borderWidth: 1,
            borderColor: colors.separator,
          }}
        >
          <Ionicons name="logo-google" size={20} color="#EA4335" style={{ marginRight: 10 }} />
          <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Guest Access Option */}
        <TouchableOpacity
          onPress={handleGuestAccess}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: spacing.md,
            borderRadius: borderRadius.md,
            backgroundColor: colors.secondary,
            marginBottom: spacing.xl,
            borderWidth: 1,
            borderColor: colors.separator,
          }}
        >
          <Ionicons name="compass-outline" size={18} color={colors.accent} style={{ marginRight: 8 }} />
          <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]}>
            Browse Events as Guest
          </Text>
        </TouchableOpacity>

        {/* Register Navigation */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text style={[typography.bodySmall, { color: colors.accent, fontWeight: 'bold' }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}