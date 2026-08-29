// LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/config';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.navigate('LanguageSelect');
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          setError('That email address looks invalid.');
          break;
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
          setError('No account matches that email and password.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        default:
          setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>S</Text>
            </View>

            <Text style={styles.title}>Welcome back</Text>

            <Text style={styles.subtitle}>
              Sign in to continue to your account
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email address</Text>

              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <View style={styles.field}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>

                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Alternative Login */}
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>
              Continue with another method
            </Text>
          </TouchableOpacity>

          {/* Register */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Registration')}
            >
              <Text style={styles.registerLink}> Create one</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footerText}>
            Your information is secure and protected.
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({

  // =====================================================
  // SCREEN
  // =====================================================

  screen: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  container: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },

  // =====================================================
  // HEADER
  // =====================================================

  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 34,
  },

  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#172554',
    letterSpacing: -0.6,
    marginBottom: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748B',
    textAlign: 'center',
  },

  // =====================================================
  // FORM
  // =====================================================

  form: {
    width: '100%',
  },

  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    textAlign: 'center',
  },

  field: {
    width: '100%',
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#172554',

    shadowColor: '#312E81',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },

  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  forgotPassword: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 8,
  },

  // =====================================================
  // PRIMARY BUTTON
  // =====================================================

  primaryButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // =====================================================
  // DIVIDER
  // =====================================================

  dividerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },

  dividerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginHorizontal: 14,
  },

  // =====================================================
  // SECONDARY BUTTON
  // =====================================================

  secondaryButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#4338CA',
    fontSize: 15,
    fontWeight: '700',
  },

  // =====================================================
  // REGISTER
  // =====================================================

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  registerText: {
    fontSize: 14,
    color: '#64748B',
  },

  registerLink: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '700',
  },

  // =====================================================
  // FOOTER
  // =====================================================

  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 30,
    textAlign: 'center',
  },
});

export default LoginScreen;