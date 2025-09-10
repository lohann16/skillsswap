import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();

  const user = {
    name: 'Lohann Daniel',
    skillsToTeach: ['Python', 'Cooking'],
    skillsToLearn: ['Public Speaking'],
    availability: 'Weekdays, 10am–2pm',
    location: 'Johannesburg',
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Text style={globalStyles.title}>Profile</Text>

      <View style={globalStyles.profileCard}>
        <View style={globalStyles.profileRow}>
          <Ionicons name="person-circle-outline" size={24} color="#4a90e2" />
          <Text style={globalStyles.profileLabel}>Name:</Text>
          <Text style={globalStyles.profileValue}>{user.name}</Text>
        </View>

        <View style={globalStyles.profileRow}>
          <Ionicons name="location-outline" size={24} color="#4a90e2" />
          <Text style={globalStyles.profileLabel}>Location:</Text>
          <Text style={globalStyles.profileValue}>{user.location}</Text>
        </View>

        <View style={globalStyles.profileRow}>
          <Ionicons name="calendar-outline" size={24} color="#4a90e2" />
          <Text style={globalStyles.profileLabel}>Availability:</Text>
          <Text style={globalStyles.profileValue}>{user.availability}</Text>
        </View>

        <View style={globalStyles.profileRow}>
          <Ionicons name="school-outline" size={24} color="#4a90e2" />
          <Text style={globalStyles.profileLabel}>Can Teach:</Text>
          <Text style={globalStyles.profileValue}>{user.skillsToTeach.join(', ')}</Text>
        </View>

        <View style={globalStyles.profileRow}>
          <Ionicons name="bulb-outline" size={24} color="#4a90e2" />
          <Text style={globalStyles.profileLabel}>Wants to Learn:</Text>
          <Text style={globalStyles.profileValue}>{user.skillsToLearn.join(', ')}</Text>
        </View>
      </View>

      <TouchableOpacity style={globalStyles.primaryButton}>
        <Text style={globalStyles.primaryButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.secondaryButton}
        onPress={() => navigation.navigate('Testimonials')}
      >
        <Text style={globalStyles.secondaryButtonText}>View Testimonials</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.secondaryButton}
        onPress={() => navigation.navigate('CommunityRules')}
      >
        <Text style={globalStyles.secondaryButtonText}>Community Rules</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
