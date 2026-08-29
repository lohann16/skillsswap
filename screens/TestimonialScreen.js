import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, get } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { globalStyles } from '../styles/globalStyles';

export default function TestimonialsScreen() {
  const navigation = useNavigation();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      setLoading(false);
      return;
    }

    const testimonialsRef = ref(db, 'testimonials');

    const unsubscribe = onValue(testimonialsRef, async (snapshot) => {
      const data = snapshot.val() || {};

      // Testimonials written about the current user (they were the ratee)
      const myTestimonialEntries = Object.entries(data).filter(
        ([, testimonial]) => testimonial.rateeId === currentUid
      );

      const resolved = await Promise.all(
        myTestimonialEntries.map(async ([testimonialId, testimonial]) => {
          let raterName = 'A SkillSwap user';
          try {
            const raterSnap = await get(ref(db, `users/${testimonial.raterId}`));
            if (raterSnap.exists()) {
              raterName = raterSnap.val().name || raterName;
            }
          } catch (e) {
            // Keep the fallback name if the lookup fails
          }

          return {
            id: testimonialId,
            user: raterName,
            message: testimonial.comment || '',
          };
        })
      );

      setTestimonials(resolved);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }) => (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardText}>{item.user}</Text>
      <Text style={globalStyles.cardSubText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <TouchableOpacity
        style={globalStyles.backButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="arrow-back" size={24} color="#4a90e2" />
        <Text style={globalStyles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>

      <Text style={globalStyles.title}>Testimonials</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 30 }} color="#4a90e2" />
      ) : testimonials.length === 0 ? (
        <Text style={globalStyles.emptyText}>
          No testimonials yet. They'll appear here once someone you've worked with leaves one.
        </Text>
      ) : (
        <FlatList
          data={testimonials}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={globalStyles.listContainer}
        />
      )}
    </View>
  );
}