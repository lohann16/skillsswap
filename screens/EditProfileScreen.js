// screens/EditProfileScreen.js

import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,ScrollView,StyleSheet,ActivityIndicator,Alert,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ref, get, update, set } from 'firebase/database';
import { auth, db } from '../firebase/config';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // ProfileScreen can pass the current values in as a param so the form
  // renders instantly; we still refetch below in case they're stale.
  const initial = route.params?.profile;

  const [name, setName] = useState(initial?.name || '');
  const [location, setLocation] = useState(
    initial?.location && initial.location !== 'Not set yet' ? initial.location : ''
  );
  const [availability, setAvailability] = useState(
    initial?.availability && initial.availability !== 'Not set yet' ? initial.availability : ''
  );
  const [skillToTeach, setSkillToTeach] = useState(initial?.skillsToTeach?.[0] || '');
  const [skillToLearn, setSkillToLearn] = useState(initial?.skillsToLearn?.[0] || '');

  const [loading, setLoading] = useState(!initial);
  const [saving, setSaving] = useState(false);

  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    if (!currentUid) return;

    // If we already had params, this just quietly syncs in the background.
    // If we didn't, this is the only source of data and loading stays true
    // until it resolves.
    const loadData = async () => {
      try {
        const [userSnap, teachSnap, learnSnap] = await Promise.all([
          get(ref(db, `users/${currentUid}`)),
          get(ref(db, `user_skills_teach/${currentUid}`)),
          get(ref(db, `user_skills_learn/${currentUid}`)),
        ]);

        const userData = userSnap.val() || {};
        const teachData = teachSnap.val();
        const learnData = learnSnap.val();

        if (!initial) {
          setName(userData.name || auth.currentUser?.displayName || '');
          setLocation(userData.location || '');
          setAvailability(userData.availability || '');
          setSkillToTeach(teachData?.skill || '');
          setSkillToLearn(learnData?.skill || '');
        }
      } catch (err) {
        Alert.alert('Error', 'Could not load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUid]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter your name.');
      return;
    }

    if (!currentUid) {
      Alert.alert('Not signed in', 'Please log in again and retry.');
      return;
    }

    setSaving(true);
    try {
      await update(ref(db, `users/${currentUid}`), {
        name: name.trim(),
        location: location.trim(),
        availability: availability.trim(),
      });

      // Single-skill model for now, matching how ProfileScreen reads it.
      await set(
        ref(db, `user_skills_teach/${currentUid}`),
        skillToTeach.trim() ? { skill: skillToTeach.trim() } : null
      );

      await set(
        ref(db, `user_skills_learn/${currentUid}`),
        skillToLearn.trim() ? { skill: skillToLearn.trim() } : null
      );

      navigation.goBack();
    } catch (err) {
      Alert.alert('Save failed', 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator color="#4F46E5" size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#172554" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Edit Profile</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Basic info */}
        <Text style={styles.sectionTitle}>Basic info</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Johannesburg, ZA"
            placeholderTextColor="#94A3B8"
            value={location}
            onChangeText={setLocation}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Availability</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Weekday evenings"
            placeholderTextColor="#94A3B8"
            value={availability}
            onChangeText={setAvailability}
            autoCapitalize="sentences"
          />
        </View>

        {/* Skills */}
        <Text style={styles.sectionTitle}>Skills</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Skill you can teach</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Photography"
            placeholderTextColor="#94A3B8"
            value={skillToTeach}
            onChangeText={setSkillToTeach}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Skill you want to learn</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Spanish"
            placeholderTextColor="#94A3B8"
            value={skillToLearn}
            onChangeText={setSkillToLearn}
            autoCapitalize="words"
          />
        </View>

        {/* Save */}
        <TouchableOpacity
          style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Save changes</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },

  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // =====================================================
  // HEADER
  // =====================================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 20,
    paddingBottom: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
  },

  pageTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#172554',
  },

  headerSpacer: {
    width: 40,
  },

  // =====================================================
  // FORM
  // =====================================================

  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#172554',
    marginTop: 16,
    marginBottom: 12,
  },

  field: {
    width: '100%',
    marginBottom: 16,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },

  // =====================================================
  // SAVE BUTTON
  // =====================================================

  primaryButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,

    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  bottomSpace: {
    height: 20,
  },
});