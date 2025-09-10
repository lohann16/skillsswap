// screens/RegistrationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation hook
import { globalStyles } from '../styles/globalStyles';

const RegistrationScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigation = useNavigation();  // Initialize the navigation hook

  // Handle form submission
  const handleSubmit = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Assuming successful registration (you can connect to an API here)
    Alert.alert('Success', 'Registration successful!');

    // After successful registration, navigate to the Dashboard
    navigation.navigate('LanguageSelect');  // Navigate to the Dashboard

    // Clear the form fields
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Register</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={globalStyles.primaryButton} onPress={handleSubmit}>
        <Text style={globalStyles.primaryButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistrationScreen;
