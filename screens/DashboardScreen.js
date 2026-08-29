import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { globalStyles } from '../styles/globalStyles';

export default function DashboardScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fall back to the email's first part if no display name was set
        setDisplayName(user.displayName || user.email?.split('@')[0] || 'there');
      } else {
        setDisplayName('there');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      {/* Header */}
      <View style={globalStyles.dashboardHeader}>
        <Text style={globalStyles.title}>Welcome back, {displayName}!</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={28} color="#4a90e2" />
        </TouchableOpacity>
      </View>

      {/* Today’s Match */}
      <Text style={globalStyles.sectionTitle}>Today’s Match</Text>
      <View style={globalStyles.card}>
        <Text style={globalStyles.cardText}>Fatima – Public Speaking</Text>
        <Text style={globalStyles.cardSubText}>Available today at 2PM</Text>
        <TouchableOpacity
          style={globalStyles.cardButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={globalStyles.cardButtonText}>Chat Now</Text>
        </TouchableOpacity>
      </View>

      {/* Discover Skills */}
      <Text style={globalStyles.sectionTitle}>Discover New Skills</Text>
      <TouchableOpacity
        style={globalStyles.primaryButton}
        onPress={() => navigation.navigate('Discover')}
      >
        <Text style={globalStyles.primaryButtonText}>Explore Skills</Text>
      </TouchableOpacity>

      {/* Community Tips */}
      <Text style={globalStyles.sectionTitle}>Tip of the Day</Text>
      <View style={globalStyles.tipBox}>
        <Text style={globalStyles.text}>
          Give specific, encouraging feedback when teaching — it builds confidence!
        </Text>
      </View>
    </ScrollView>
  );
}