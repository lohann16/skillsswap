import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={globalStyles.container}>
      {/* App Icon or Illustration */}
      

      <Text style={globalStyles.onboardingTitle}>Welcome to SkillSwap!</Text>
      <Text style={globalStyles.onboardingSubtitle}>
        Learn and teach skills through meaningful exchanges with your community.
      </Text>

      {/* CTA Buttons */}
      <TouchableOpacity
        style={globalStyles.primaryButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={globalStyles.primaryButtonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.secondaryButton}
        onPress={() => navigation.navigate('CommunityRules')}
      >
        <Text style={globalStyles.secondaryButtonText}>Learn More</Text>
      </TouchableOpacity>
    </View>
  );
}
