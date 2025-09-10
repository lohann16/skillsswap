import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function SkillTeachInputScreen({ navigation }) {
  const [skill, setSkill] = useState('');

  const handleNext = () => {
    // Save or validate the skill if needed
    navigation.navigate('SkillLearnInput');
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>What Can You Teach?</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="e.g., Cooking, Coding, Painting"
        value={skill}
        onChangeText={setSkill}
      />

      <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleNext}>
        <Text style={globalStyles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
