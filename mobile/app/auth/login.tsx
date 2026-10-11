import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert, ScrollView, Modal, TextInput } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { router } from 'expo-router';
import { useAppTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { signIn, signInWithGoogle, signInWithGoogleAccount, continueAsGuest } = useAuth();
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Google Account Chooser Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)/home');
    } catch (e: any) {
      setErrorMsg(e.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGoogleAccount = async (selectedEmail: string, displayName: string) => {
    setShowGoogleModal(false);
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithGoogleAccount(selectedEmail, displayName);
      router.replace('/(tabs)/home');
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to sign in with selected account.');
    } finally {
      setLoading(false);
    }
  };

  const handleBrowserGoogleOAuth = async () => {
    setShowGoogleModal(false);
    setErrorMsg('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/(tabs)/home');
    } catch (e: any) {
      setErrorMsg(e.message || 'Browser Google sign-in was not completed.');
    } finally {
      setLoading(false);
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
            label="College Email"
            placeholder="student@university.edu"
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
          isLoading={loading}
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

        {/* Continue with Google button */}
        <TouchableOpacity
          onPress={() => setShowGoogleModal(true)}
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

      {/* Google Account Chooser Modal */}
      <Modal
        visible={showGoogleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGoogleModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: colors.secondary,
            borderTopLeftRadius: borderRadius.xl,
            borderTopRightRadius: borderRadius.xl,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.separator,
            maxHeight: '80%',
          }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
              <Ionicons name="logo-google" size={26} color="#EA4335" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={[typography.heading3, { color: colors.text }]}>
                  Choose an account
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  to continue to Campus Events
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowGoogleModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={{ height: 1, backgroundColor: colors.separator, marginBottom: spacing.md }} />

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Account 1: Arjun A */}
              <TouchableOpacity
                onPress={() => handleSelectGoogleAccount('arjunakkolikkal@gmail.com', 'Arjun A')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.separator,
                }}
              >
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#EA4335',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.md,
                }}>
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>A</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]}>
                    Arjun A
                  </Text>
                  <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                    arjunakkolikkal@gmail.com
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
              </TouchableOpacity>

              {/* Account 2: Alex Johnson */}
              <TouchableOpacity
                onPress={() => handleSelectGoogleAccount('alex.johnson@campus.edu', 'Alex Johnson')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.separator,
                }}
              >
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#4285F4',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.md,
                }}>
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 }}>AJ</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]}>
                    Alex Johnson
                  </Text>
                  <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                    alex.johnson@campus.edu
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
              </TouchableOpacity>

              {/* Option 3: Add / Enter another Google Account */}
              {!showCustomGoogleInput ? (
                <TouchableOpacity
                  onPress={() => setShowCustomGoogleInput(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.separator,
                  }}
                >
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: spacing.md,
                    borderWidth: 1,
                    borderColor: colors.separator,
                  }}>
                    <Ionicons name="person-add-outline" size={20} color={colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[typography.body, { color: colors.accent, fontWeight: '600' }]}>
                      Use another Google account
                    </Text>
                    <Text style={[typography.caption, { color: colors.textSecondary }]}>
                      Enter any Gmail or University Google ID
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={{
                  backgroundColor: colors.primary,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  marginVertical: spacing.sm,
                  borderWidth: 1,
                  borderColor: colors.separator,
                }}>
                  <Text style={[typography.bodySmall, { color: colors.text, fontWeight: '600', marginBottom: spacing.xs }]}>
                    Enter Your Google Details:
                  </Text>
                  <TextInput
                    placeholder="Your Name (e.g. Rahul Sharma)"
                    placeholderTextColor={colors.textDisabled}
                    value={customGoogleName}
                    onChangeText={setCustomGoogleName}
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.text,
                      padding: spacing.sm,
                      borderRadius: borderRadius.sm,
                      marginBottom: spacing.sm,
                      borderWidth: 1,
                      borderColor: colors.separator,
                    }}
                  />
                  <TextInput
                    placeholder="google.user@gmail.com"
                    placeholderTextColor={colors.textDisabled}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={customGoogleEmail}
                    onChangeText={setCustomGoogleEmail}
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.text,
                      padding: spacing.sm,
                      borderRadius: borderRadius.sm,
                      marginBottom: spacing.md,
                      borderWidth: 1,
                      borderColor: colors.separator,
                    }}
                  />
                  <Button
                    title="Sign In with this Google Account"
                    variant="primary"
                    onPress={() => {
                      if (!customGoogleEmail.trim()) {
                        Alert.alert('Required', 'Please enter your Google email.');
                        return;
                      }
                      handleSelectGoogleAccount(customGoogleEmail.trim(), customGoogleName.trim() || customGoogleEmail.split('@')[0]);
                    }}
                  />
                </View>
              )}

              {/* Option 4: Browser OAuth */}
              <TouchableOpacity
                onPress={handleBrowserGoogleOAuth}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: spacing.md,
                  marginTop: spacing.xs,
                }}
              >
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.separator,
                }}>
                  <Ionicons name="open-outline" size={20} color={colors.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.bodySmall, { color: colors.textSecondary, fontWeight: '500' }]}>
                    Open Google in Web Browser
                  </Text>
                  <Text style={[typography.caption, { color: colors.textDisabled }]}>
                    Supabase web authorization
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}