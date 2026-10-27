import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useColleges } from '../../hooks/useColleges';
import { useAppTheme } from '../../hooks/useTheme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { validateGmailAddress } from '../../utils/validators';

export default function RegisterScreen() {
  const { signUp, resendVerificationEmail } = useAuth();
  const { data: colleges = [] } = useColleges();
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [academicYear, setAcademicYear] = useState('3rd Year');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleRegister = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = displayName.trim();

    if (!trimmedName || !trimmedEmail || !password.trim()) {
      setErrorMsg('Please fill in your full name, Gmail address, and password.');
      return;
    }

    // Enforce strict Google Gmail account naming rules
    const gmailValidation = validateGmailAddress(trimmedEmail);
    if (!gmailValidation.isValid) {
      setErrorMsg(gmailValidation.error || 'Only registered @gmail.com accounts are permitted.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    try {
      const result = await signUp(trimmedEmail, password, trimmedName, {
        department: department.trim() || undefined,
        academic_year: academicYear,
        college_id: selectedCollegeId || (colleges.length > 0 ? colleges[0]?.id : undefined),
      });

      if (result?.emailConfirmationRequired) {
        setPendingVerificationEmail(trimmedEmail);
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Unable to register account.');
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerificationEmail) {
    return (
      <ScreenWrapper style={{ padding: spacing.xl, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.accent + '22',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}>
          <Ionicons name="mail-unread-outline" size={44} color={colors.accent} />
        </View>

        <Text style={[typography.heading1, { color: colors.text, textAlign: 'center', marginBottom: spacing.xs }]}>
          Check Your Gmail! 📬
        </Text>

        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xs }]}>
          We have sent a verification email to:
        </Text>
        <Text style={[typography.body, { color: colors.accent, fontWeight: '700', textAlign: 'center', marginBottom: spacing.md }]}>
          {pendingVerificationEmail}
        </Text>

        <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 20 }]}>
          Please open your Gmail and tap the confirmation link to activate your student account. Once clicked, you can sign in below.
        </Text>

        <Button
          title="Open Email App"
          variant="primary"
          onPress={() => Linking.openURL('mailto:' + pendingVerificationEmail)}
          style={{ width: '100%', marginBottom: spacing.md }}
        />

        <Button
          title="I've Confirmed, Go to Sign In"
          variant="secondary"
          onPress={() => router.replace('/auth/login')}
          style={{ width: '100%', marginBottom: spacing.md }}
        />

        <TouchableOpacity
          disabled={resending}
          onPress={async () => {
            setResending(true);
            try {
              await resendVerificationEmail(pendingVerificationEmail);
              setResendSuccess(true);
              Alert.alert('Link Resent! 📬', 'A fresh confirmation link has been sent to your Gmail.');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Could not resend email.');
            } finally {
              setResending(false);
            }
          }}
          style={{ paddingVertical: spacing.sm, alignItems: 'center' }}
        >
          <Text style={[typography.bodySmall, { color: colors.accent, fontWeight: '600' }]}>
            {resending ? 'Resending...' : resendSuccess ? '✓ Link Resent (Tap to send again)' : "Didn't receive email? Resend link"}
          </Text>
        </TouchableOpacity>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[typography.heading1, { color: colors.text, marginBottom: spacing.xs }]}>
          Create Account
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginBottom: spacing.lg }]}>
          Join thousands of students discovering campus life
        </Text>

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

        <Input
          label="Full Name *"
          placeholder="e.g. Alex Johnson"
          value={displayName}
          onChangeText={setDisplayName}
        />

        <Input
          label="Gmail Address *"
          placeholder="yourname@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="Password *"
          placeholder="Min 6 characters"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Input
          label="Confirm Password *"
          placeholder="Re-enter password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Input
          label="Department / Major"
          placeholder="e.g. Computer Science & Engineering"
          value={department}
          onChangeText={setDepartment}
        />

        {/* Academic Year Selection */}
        <Text style={[typography.bodySmall, { color: colors.text, fontWeight: '600', marginBottom: spacing.xs }]}>
          Academic Year
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md }}>
          {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgrad'].map(yr => (
            <TouchableOpacity
              key={yr}
              onPress={() => setAcademicYear(yr)}
              style={{
                flex: 1,
                paddingVertical: spacing.xs + 2,
                borderRadius: borderRadius.sm,
                backgroundColor: academicYear === yr ? colors.accent : colors.secondary,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: academicYear === yr ? '#000' : colors.text, fontSize: 11, fontWeight: 'bold' }}>
                {yr}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Select Campus College */}
        {colleges.length > 0 && (
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={[typography.bodySmall, { color: colors.text, fontWeight: '600', marginBottom: spacing.xs }]}>
              Affiliated College
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.xs }}>
              {colleges.map(c => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setSelectedCollegeId(c.id)}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.full,
                    backgroundColor: selectedCollegeId === c.id ? colors.accent : colors.secondary,
                    borderWidth: 1,
                    borderColor: colors.separator,
                  }}
                >
                  <Text style={{ color: selectedCollegeId === c.id ? '#000' : colors.text, fontSize: 12, fontWeight: '500' }}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <Button
          title="Complete Registration"
          variant="primary"
          onPress={handleRegister}
          isLoading={loading}
          style={{ marginVertical: spacing.md }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            Already registered?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={[typography.bodySmall, { color: colors.accent, fontWeight: 'bold' }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}