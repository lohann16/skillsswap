import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../firebase/config';

export default function LearningHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      setLoading(false);
      return;
    }

    // Progress is keyed directly under the user's uid (progress/{uid}/{entryId})
    // for a cheap, direct per-user query rather than filtering a global table.
    const progressRef = ref(db, `progress/${currentUid}`);

    const unsubscribe = onValue(progressRef, (snapshot) => {
      const data = snapshot.val() || {};

      const entries = Object.entries(data).map(([entryId, entry]) => ({
        id: entryId,
        skill: entry.skill || 'Unknown skill',
        status: entry.status || 'In Progress',
        date: entry.date || '',
      }));

      setHistory(entries);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }) => (
    <View style={globalStyles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="checkmark-circle-outline" size={24} color="#4a90e2" />
        <Text style={[globalStyles.cardText, { marginLeft: 10 }]}>{item.skill}</Text>
      </View>
      <Text style={globalStyles.cardSubText}>Status: {item.status}</Text>
      <Text style={globalStyles.cardSubText}>Date: {item.date}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Text style={globalStyles.title}>Your Learning History</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 30 }} color="#4a90e2" />
      ) : history.length === 0 ? (
        <Text style={globalStyles.emptyText}>You haven't completed any lessons yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </ScrollView>
  );
}