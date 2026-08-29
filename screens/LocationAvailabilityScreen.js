import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { ref, update } from 'firebase/database';
import { auth, db } from '../firebase/config';

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
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Setup Your Preferences</Text>

      {error ? (
        <Text style={{ color: '#c0392b', marginBottom: 12, textAlign: 'center' }}>{error}</Text>
      ) : null}

      <View style={globalStyles.inputGroup}>
        <Ionicons name="location-outline" size={20} color="#4a90e2" />
        <TextInput
          style={globalStyles.input}
          placeholder="Enter your location"
          placeholderTextColor="#aaa"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View style={globalStyles.inputGroup}>
        <Ionicons name="calendar-outline" size={20} color="#4a90e2" />
        <TextInput
          style={globalStyles.input}
          placeholder="Your availability (e.g., Mon-Fri 10am-2pm)"
          placeholderTextColor="#aaa"
          value={availability}
          onChangeText={setAvailability}
        />
      </View>

      <TouchableOpacity
        style={[globalStyles.primaryButton, loading && { opacity: 0.6 }]}
        onPress={handleFindMatches}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={globalStyles.primaryButtonText}>Find Matches</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}