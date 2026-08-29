import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { globalStyles } from '../styles/globalStyles';

export default function SkillLearnInputScreen({ navigation }) {
  const [learningGoal, setLearningGoal] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setError('');

    if (!learningGoal.trim()) {
      setError('Tell us at least one thing you want to learn.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError('You need to be logged in to continue.');
      return;
    }

    setLoading(true);
    try {
      await set(ref(db, `user_skills_learn/${user.uid}`), {
        skill: learningGoal.trim(),
        updatedAt: Date.now(),
      });
      navigation.navigate('LocationAvailability');
    } catch (err) {
      setError('Could not save that right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>What Do You Want to Learn?</Text>

      {error ? (
        <Text style={{ color: '#c0392b', marginBottom: 12, textAlign: 'center' }}>{error}</Text>
      ) : null}

      <TextInput
        style={globalStyles.input}
        placeholder="e.g., Public Speaking, JavaScript, Guitar"
        value={learningGoal}
        onChangeText={setLearningGoal}
      />

      <TouchableOpacity
        style={[globalStyles.buttonPrimary, loading && { opacity: 0.6 }]}
        onPress={handleNext}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={globalStyles.buttonText}>Next</Text>}
      </TouchableOpacity>
    </View>
  );
}