import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { ScreenWrapper } from '../components/ui/ScreenWrapper';
import { Button } from '../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useTheme';

export default function AuthCallbackScreen() {
  const url = Linking.useURL();
  const { colors, typography, spacing } = useAppTheme();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (url) {
      handleUrl(url);
    }
  }, [url]);

  const handleUrl = async (incomingUrl: string) => {
    try {
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      let code: string | null = null;

      try {
        const parsed = new URL(incomingUrl);
        code = parsed.searchParams.get('code');
        if (parsed.hash) {
          const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ''));
          accessToken = hashParams.get('access_token');
          refreshToken = hashParams.get('refresh_token');
        }
      } catch {
        const tokenMatch = incomingUrl.match(/[?&#]access_token=([^&#]+)/);
        if (tokenMatch) accessToken = decodeURIComponent(tokenMatch[1]);
        const refreshMatch = incomingUrl.match(/[?&#]refresh_token=([^&#]+)/);
        if (refreshMatch) refreshToken = decodeURIComponent(refreshMatch[1]);
        const codeMatch = incomingUrl.match(/[?&]code=([^&#]+)/);
        if (codeMatch) code = decodeURIComponent(codeMatch[1]);
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
        setStatus('success');
        setMessage('Your email has been verified! Welcome to Campus Events.');
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 1500);
        return;
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) throw error;
        setStatus('success');
        setMessage('Your email has been verified! Welcome to Campus Events.');
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 1500);
        return;
      }

      // If no tokens in the callback, the email is already verified by Supabase
      setStatus('success');
      setMessage('Your email is verified! Please sign in with your password.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Could not verify email token.');
    }
  };

  return (
    <ScreenWrapper style={{ padding: spacing.lg, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ alignItems: 'center', maxWidth: 320 }}>
        {status === 'verifying' && (
          <>
            <ActivityIndicator size="large" color={colors.accent} style={{ marginBottom: spacing.lg }} />
            <Text style={[typography.heading2, { color: colors.text, textAlign: 'center' }]}>
              Verifying Email...
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }]}>
              Please wait while we confirm your account.
            </Text>
          </>
        )}

        {status === 'success' && (
          <>
            <View style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: colors.success + '22',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.lg,
            }}>
              <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            </View>
            <Text style={[typography.heading2, { color: colors.text, textAlign: 'center' }]}>
              Email Confirmed! 🎉
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl }]}>
              {message}
            </Text>
            <Button
              title="Go to Sign In"
              variant="primary"
              onPress={() => router.replace('/auth/login')}
              style={{ width: '100%' }}
            />
          </>
        )}

        {status === 'error' && (
          <>
            <View style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: colors.error + '22',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.lg,
            }}>
              <Ionicons name="alert-circle" size={48} color={colors.error} />
            </View>
            <Text style={[typography.heading2, { color: colors.text, textAlign: 'center' }]}>
              Verification Failed
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl }]}>
              {message}
            </Text>
            <Button
              title="Back to Sign In"
              variant="primary"
              onPress={() => router.replace('/auth/login')}
              style={{ width: '100%' }}
            />
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}
