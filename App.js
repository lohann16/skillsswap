import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingStack from './stacks/OnboardingStack';
import SkillSetupStack from './stacks/SkillSetupStack';
import MainAppStack from './stacks/MainAppStack';

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Onboarding">
        <RootStack.Screen name="Onboarding" component={OnboardingStack} options={{ headerShown: false }} />
        <RootStack.Screen name="SkillSetup" component={SkillSetupStack} options={{ headerShown: false }} />
        <RootStack.Screen name="MainApp" component={MainAppStack} options={{ headerShown: false }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
