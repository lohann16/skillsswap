import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,ActivityIndicator,StyleSheet,Keyboard,} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { ref, update } from 'firebase/database';
import { auth, db } from '../firebase/config';

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey;

export default function LocationAvailabilityScreen({ navigation }) {
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFindMatches = async () => {
    setError('');

    if (!location.trim() || !availability.trim()) {
      setError('Fill in both your location and availability.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError('You need to be logged in to continue.');
      return;
    }

    setLoading(true);
    try {
      // update() merges these fields onto the existing users/{uid} record
      // instead of overwriting the name/email/createdAt saved at registration.
      await update(ref(db, `users/${user.uid}`), {
        location: location.trim(),
        availability: availability.trim(),
      });
      navigation.navigate('MainApp');
    } catch (err) {
      setError('Could not save that right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup Your Preferences</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Location — Google Places autocomplete */}
      <View style={styles.field}>
        <Text style={styles.label}>Location</Text>

        <View style={styles.autocompleteWrapper}>
          <GooglePlacesAutocomplete
            placeholder="Enter your location"
            fetchDetails={false}
            onPress={(data) => {
              // data.description is the full formatted address/place name —
              // that's all we store, so we don't need fetchDetails (lat/lng).
              setLocation(data.description);
              Keyboard.dismiss();
            }}
            onFail={() => setError('Could not load location suggestions. Check your connection.')}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: 'en',
            }}
            textInputProps={{
              value: location,
              onChangeText: setLocation,
              placeholderTextColor: '#94A3B8',
            }}
            enablePoweredByContainer={false}
            debounce={300}
            styles={{
              container: styles.gpaContainer,
              textInputContainer: styles.gpaInputContainer,
              textInput: styles.gpaTextInput,
              listView: styles.gpaListView,
              row: styles.gpaRow,
              description: styles.gpaDescription,
              separator: styles.gpaSeparator,
            }}
            renderLeftButton={() => (
              <Ionicons
                name="location-outline"
                size={20}
                color="#4F46E5"
                style={styles.gpaLeftIcon}
              />
            )}
          />
        </View>
      </View>

      {/* Availability */}
      <View style={styles.field}>
        <Text style={styles.label}>Availability</Text>
        <View style={styles.inputGroup}>
          <Ionicons name="calendar-outline" size={20} color="#4F46E5" />
          <TextInput
            style={styles.input}
            placeholder="e.g., Mon-Fri 10am-2pm"
            placeholderTextColor="#94A3B8"
            value={availability}
            onChangeText={setAvailability}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
        onPress={handleFindMatches}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Find Matches</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#172554',
    marginBottom: 24,
    textAlign: 'center',
  },

  errorText: {
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },

  field: {
    marginBottom: 18,
    // GooglePlacesAutocomplete's suggestion dropdown is absolutely
    // positioned, so it needs to render above whatever comes after it.
    zIndex: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },

  // =====================================================
  // GOOGLE PLACES AUTOCOMPLETE
  // =====================================================

  autocompleteWrapper: {
    zIndex: 10,
  },

  gpaContainer: {
    flex: 0,
  },

  gpaInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3F0',
    borderRadius: 14,
    paddingHorizontal: 12,
  },

  gpaLeftIcon: {
    marginRight: 8,
  },

  gpaTextInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#172554',
    backgroundColor: 'transparent',
  },

  gpaListView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E4E7F2',
    overflow: 'hidden',

    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  gpaRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },

  gpaDescription: {
    fontSize: 14,
    color: '#334155',
  },

  gpaSeparator: {
    height: 1,
    backgroundColor: '#EEF2F7',
  },

  // =====================================================
  // AVAILABILITY INPUT
  // =====================================================

  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3F0',
    borderRadius: 14,
    paddingHorizontal: 12,
  },

  input: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontSize: 16,
    color: '#172554',
  },

  // =====================================================
  // BUTTON
  // =====================================================

  primaryButton: {
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
});