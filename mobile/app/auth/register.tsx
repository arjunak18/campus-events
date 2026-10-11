import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useColleges } from '../../hooks/useColleges';
import { useAppTheme } from '../../hooks/useTheme';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const { signUp } = useAuth();
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

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in your name, email, and password.');
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
      await signUp(email.trim(), password, displayName.trim());
      Alert.alert(
        'Account Created! 🎓',
        'Welcome to Campus Events. Let us set your event interests.',
        [
          {
            text: 'Choose Interests',
            onPress: () => router.replace('/onboarding/interests'),
          },
        ]
      );
    } catch (e: any) {
      setErrorMsg(e.message || 'Unable to register account.');
    } finally {
      setLoading(false);
    }
  };

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
          label="College Email *"
          placeholder="alex@college.edu"
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