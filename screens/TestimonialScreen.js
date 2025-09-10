import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';

const testimonials = [
  { id: '1', user: 'Alice', message: 'Loved learning with you!' },
  { id: '2', user: 'Bongani', message: 'Super helpful and friendly.' },
  { id: '3', user: 'Zanele', message: 'Great teacher, highly recommend!' },
  { id: '4', user: 'John', message: 'Always on time and well-prepared.' },
];

export default function TestimonialsScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardText}>{item.user}</Text>
      <Text style={globalStyles.cardSubText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={globalStyles.backButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="arrow-back" size={24} color="#4a90e2" />
        <Text style={globalStyles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>

      <Text style={globalStyles.title}>Testimonials</Text>

      <FlatList
        data={testimonials}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={globalStyles.listContainer}
      />
    </View>
  );
}
