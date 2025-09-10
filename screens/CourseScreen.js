import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';

const sampleCourses = [
  { id: '1', title: 'Cooking Basics', day: 'Monday', time: '10:00 AM', status: 'Ongoing' },
  { id: '2', title: 'Intro to Python', day: 'Wednesday', time: '2:00 PM', status: 'Completed' },
  { id: '3', title: 'Public Speaking', day: 'Friday', time: '4:30 PM', status: 'Ongoing' },
];

export default function CourseScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(sampleCourses);
  const navigation = useNavigation();

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = sampleCourses.filter(course =>
      course.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const renderItem = ({ item }) => (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardText}>{item.title}</Text>
      <Text style={globalStyles.cardSubText}>
        {item.day} at {item.time}
      </Text>
      <Text style={globalStyles.cardStatus}>{item.status}</Text>
      <TouchableOpacity style={globalStyles.cardButton}>
        <Text style={globalStyles.cardButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Text style={globalStyles.title}>Your Course Plan</Text>

      {/* Search Bar */}
      <TextInput
        style={globalStyles.searchInput}
        placeholder="Search courses..."
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {/* Courses List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={globalStyles.listContainer}
      />

      {/* History Button */}
      <TouchableOpacity
        style={[globalStyles.primaryButton, { marginTop: 20 }]}
        onPress={() => navigation.navigate('LearningHistory')}
      >
        <Text style={globalStyles.primaryButtonText}>View Learning History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
