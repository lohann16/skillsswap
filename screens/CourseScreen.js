import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, get } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { globalStyles } from '../styles/globalStyles';

export default function CourseScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      setLoading(false);
      return;
    }

    let unsubscribeCourses = () => {};

    // Courses are keyed by matchId, not directly by user, so first find
    // which matches the current user is part of.
    get(ref(db, 'matches')).then((matchesSnap) => {
      const matchesData = matchesSnap.val() || {};
      const myMatchIds = Object.entries(matchesData)
        .filter(([, match]) => match.userA_id === currentUid || match.userB_id === currentUid)
        .map(([matchId]) => matchId);

      const coursesRef = ref(db, 'courses');
      unsubscribeCourses = onValue(coursesRef, (snapshot) => {
        const data = snapshot.val() || {};

        const myCourses = Object.entries(data)
          .filter(([, course]) => myMatchIds.includes(course.matchId))
          .map(([courseId, course]) => ({
            id: courseId,
            title: course.title || 'Untitled course',
            day: course.day || '',
            time: course.time || '',
            status: course.status || 'Ongoing',
          }));

        setCourses(myCourses);
        setLoading(false);
      });
    }).catch(() => setLoading(false));

    return () => unsubscribeCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <TextInput
        style={globalStyles.searchInput}
        placeholder="Search courses..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 30 }} color="#4a90e2" />
      ) : filteredCourses.length === 0 ? (
        <Text style={globalStyles.emptyText}>
          No courses yet. A course plan is created once you accept a match.
        </Text>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={globalStyles.listContainer}
          scrollEnabled={false}
        />
      )}

      <TouchableOpacity
        style={[globalStyles.primaryButton, { marginTop: 20 }]}
        onPress={() => navigation.navigate('LearningHistory')}
      >
        <Text style={globalStyles.primaryButtonText}>View Learning History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}