import React from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';

const history = [
  { id: '1', skill: 'Python', status: 'Completed', date: 'April 20, 2025' },
  { id: '2', skill: 'Public Speaking', status: 'In Progress', date: 'May 1, 2025' },
  { id: '3', skill: 'Cooking Basics', status: 'Completed', date: 'March 10, 2025' },
];

export default function LearningHistoryScreen() {
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

      {history.length === 0 ? (
        <Text style={globalStyles.emptyText}>You haven’t completed any lessons yet.</Text>
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
