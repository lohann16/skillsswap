import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const contacts = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Alice Brown' },
];

export default function ContactsScreen({ navigation }) {
  const handleContactPress = (contact) => {
    navigation.navigate('Chat', { contact });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleContactPress(item)}>
      <View style={globalStyles.contactCard}>
        <Text style={globalStyles.contactText}>{item.name}</Text>
        <TouchableOpacity style={globalStyles.contactButton}>
          <Text style={globalStyles.contactButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
