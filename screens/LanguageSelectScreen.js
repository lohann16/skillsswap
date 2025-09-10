import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { globalStyles } from '../styles/globalStyles';

export default function LanguageSelectScreen({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleNext = () => {
    // Store or use selectedLanguage if needed
    navigation.navigate('SkillTeachInput');
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Select Your Language</Text>

      <View style={globalStyles.pickerContainer}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          style={globalStyles.picker}
        >
          <Picker.Item label="English" value="English" />
          <Picker.Item label="French" value="French" />
          <Picker.Item label="Spanish" value="Spanish" />
          <Picker.Item label="Zulu" value="Zulu" />
          <Picker.Item label="Swahili" value="Swahili" />
          {/* Add more languages as needed */}
        </Picker>
      </View>

      <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleNext}>
        <Text style={globalStyles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
