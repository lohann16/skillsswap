import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { globalStyles } from '../styles/globalStyles';

export default function SkillTeachInputScreen({ navigation }) {
  const [skill, setSkill] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setError('');

    if (!skill.trim()) {
      setError('Tell us at least one thing you can teach.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError('You need to be logged in to continue.');
      return;
    }

    setLoading(true);
    try {
      await set(ref(db, `user_skills_teach/${user.uid}`), {
        skill: skill.trim(),
        updatedAt: Date.now(),
      });
      navigation.navigate('SkillLearnInput');
    } catch (err) {
      setError('Could not save that right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>What Can You Teach?</Text>

      {error ? (
        <Text style={{ color: '#c0392b', marginBottom: 12, textAlign: 'center' }}>{error}</Text>
      ) : null}

      <TextInput
        style={globalStyles.input}
        placeholder="e.g., Cooking, Coding, Painting"
        value={skill}
        onChangeText={setSkill}
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