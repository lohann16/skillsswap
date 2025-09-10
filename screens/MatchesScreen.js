import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image } from 'react-native'; // Import Image component
import { globalStyles } from '../styles/globalStyles';

const sampleMatches = [
  { id: '1', name: 'Alice - Cooking', status: 'online', category: 'Cooking', profilePicture: 'https://placekitten.com/200/200' },
  { id: '2', name: 'Bongani - Python', status: 'offline', category: 'Python', profilePicture: 'https://placekitten.com/200/201' },
  { id: '3', name: 'Fatima - Public Speaking', status: 'online', category: 'Public Speaking', profilePicture: 'https://placekitten.com/200/202' },
];

export default function MatchesScreen() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMatches = sampleMatches.filter((match) =>
    match.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={globalStyles.card}>
      <View style={globalStyles.cardHeader}>
        {/* Use Image component correctly */}
        <Image source={{ uri: item.profilePicture }} style={globalStyles.profileImage} />
        <View style={globalStyles.cardInfo}>
          <Text style={globalStyles.cardText}>{item.name}</Text>
          <Text style={globalStyles.cardSubText}>Category: {item.category}</Text>
        </View>
        <View style={globalStyles.statusIndicator}>
          <Text style={[globalStyles.statusText, item.status === 'online' ? globalStyles.online : globalStyles.offline]}>
            {item.status}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={globalStyles.cardButton}>
        <Text style={globalStyles.cardButtonText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Matched Users</Text>
      <TextInput
        style={globalStyles.searchInput}
        placeholder="Search matches..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={globalStyles.listContainer}
      />
    </View>
  );
}
