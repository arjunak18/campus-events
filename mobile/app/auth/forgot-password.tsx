import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useAppTheme } from '../../hooks/useTheme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const { colors, typography, spacing } = useAppTheme();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Notice', 'Please enter your registered email address.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Unable to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={{ padding: spacing.lg, justifyContent: 'center' }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xl }}
      >
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </TouchableOpacity>

      <Text style={[typography.heading1, { color: colors.text, marginBottom: spacing.xs }]}>
        Reset Password
      </Text>
      <Text style={[typography.body, { color: colors.textSecondary, marginBottom: spacing.xl }]}>
        Enter your university email address to receive password reset instructions.
      </Text>

      {sent ? (
        <View style={{ backgroundColor: colors.accent + '22', padding: spacing.lg, borderRadius: 12, marginBottom: spacing.lg }}>
          <Ionicons name="mail-unread-outline" size={36} color={colors.accent} style={{ alignSelf: 'center', marginBottom: spacing.sm }} />
          <Text style={[typography.body, { color: colors.text, textAlign: 'center', fontWeight: 'bold' }]}>
            Check your inbox
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>
            We've sent a password reset link to {email}. Follow the instructions in the email.
          </Text>
          <Button
            title="Back to Sign In"
            variant="primary"
            onPress={() => router.replace('/auth/login')}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      ) : (
        <>
          <Input
            label="College Email"
            placeholder="student@university.edu"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Button
            title="Send Reset Instructions"
            variant="primary"
            onPress={handleReset}
            isLoading={loading}
            style={{ marginTop: spacing.md }}
          />
        </>
      )}
    </ScreenWrapper>
  );
}