import React from 'react';
import { View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';

export default function LocationAvailabilityScreen({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Setup Your Preferences</Text>

      <View style={globalStyles.inputGroup}>
        <Ionicons name="location-outline" size={20} color="#4a90e2" />
        <TextInput
          style={globalStyles.input}
          placeholder="Enter your location"
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={globalStyles.inputGroup}>
        <Ionicons name="calendar-outline" size={20} color="#4a90e2" />
        <TextInput
          style={globalStyles.input}
          placeholder="Your availability (e.g., Mon-Fri 10am-2pm)"
          placeholderTextColor="#aaa"
        />
      </View>

      <TouchableOpacity style={globalStyles.primaryButton} onPress={() => navigation.navigate('MainApp')}>
        <Text style={globalStyles.primaryButtonText}>Find Matches</Text>
      </TouchableOpacity>
    </View>
  );
}
