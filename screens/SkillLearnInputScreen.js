import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function SkillLearnInputScreen({ navigation }) {
  const [learningGoal, setLearningGoal] = useState('');

  const handleNext = () => {
    // Optional: validate input or store data
    navigation.navigate('LocationAvailability');
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>What Do You Want to Learn?</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="e.g., Public Speaking, JavaScript, Guitar"
        value={learningGoal}
        onChangeText={setLearningGoal}
      />

      <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleNext}>
        <Text style={globalStyles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
