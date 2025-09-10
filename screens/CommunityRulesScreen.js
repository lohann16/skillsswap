import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';

export default function CommunityRulesScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={globalStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#4a90e2" />
        <Text style={globalStyles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={globalStyles.title}>Community Guidelines</Text>

      <View style={{ marginTop: 10 }}>
        <Text style={globalStyles.text}>1. Be respectful and inclusive.</Text>
        <Text style={globalStyles.text}>2. No hate speech or discrimination.</Text>
        <Text style={globalStyles.text}>3. Respect availability and time slots.</Text>
        <Text style={globalStyles.text}>4. Report inappropriate behavior.</Text>
        <Text style={globalStyles.text}>5. Give constructive feedback during sessions.</Text>
        <Text style={globalStyles.text}>6. Protect your and others' privacy.</Text>
      </View>
    </ScrollView>
  );
}
