// OnboardingStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import SkillTeachInputScreen from '../screens/SkillTeachInputScreen';
import SkillLearnInputScreen from '../screens/SkillLearnInputScreen';
import LocationAvailabilityScreen from '../screens/LocationAvailabilityScreen';
import MainAppStack from './MainAppStack';
import Registration from '../screens/Registration';// Import the RegistrationScreen     

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
      <Stack.Screen name="SkillTeachInput" component={SkillTeachInputScreen} />
      <Stack.Screen name="SkillLearnInput" component={SkillLearnInputScreen} />
      <Stack.Screen name="LocationAvailability" component= {LocationAvailabilityScreen} />
      
      <Stack.Screen name="MainApp" component={MainAppStack} />
    </Stack.Navigator>
  );
}
