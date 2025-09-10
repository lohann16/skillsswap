// navigation/SkillSetupStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import SkillTeachInputScreen from '../screens/SkillTeachInputScreen';
import SkillLearnInputScreen from '../screens/SkillLearnInputScreen';
import LocationAvailabilityScreen from '../screens/LocationAvailabilityScreen';

const Stack = createNativeStackNavigator();

export default function SkillSetupStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
      <Stack.Screen name="SkillTeachInput" component={SkillTeachInputScreen} />
      <Stack.Screen name="SkillLearnInput" component={SkillLearnInputScreen} />
      <Stack.Screen name="LocationAvailability" component={LocationAvailabilityScreen} />
    </Stack.Navigator>
  );
}
