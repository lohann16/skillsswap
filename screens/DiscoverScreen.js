import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const trends = [
  { id: '1', title: 'Photography 101' },
  { id: '2', title: 'Emotional Intelligence' },
];

export default function DiscoverScreen() {
  const renderItem = ({ item }) => (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardText}>{item.title}</Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Discover New Skills</Text>
      <FlatList
        data={trends}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}
